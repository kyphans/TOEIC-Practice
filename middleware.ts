import { NextRequest, NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoutes = createRouteMatcher(["/", "/login", "/signup"])
const isAuthApiRoute = createRouteMatcher(["/api/auth"])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // if the route is /api/auth, don't redirect to sign-in
  if (isAuthApiRoute(req)) {
    if (!userId) {
      console.log('[MIDDLEWARE] Chặn ở /api/auth: chưa đăng nhập', { url: req.url });
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    console.log('[MIDDLEWARE] Cho phép /api/auth', { url: req.url });
    return NextResponse.next()
  }

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    console.log('[MIDDLEWARE] Chặn ở /admin: không phải admin', { userId, url: req.url, role: (await auth()).sessionClaims?.metadata?.role });
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    console.log('[MIDDLEWARE] Cho phép /onboarding', { userId, url: req.url });
    return NextResponse.next()
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoutes(req)) {
    console.log('[MIDDLEWARE] Chặn: chưa đăng nhập vào route riêng tư', { url: req.url });
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    console.log('[MIDDLEWARE] Chặn: chưa hoàn thành onboarding', { userId, url: req.url });
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoutes(req)) {
    console.log('[MIDDLEWARE] Cho phép truy cập route riêng tư', { userId, url: req.url });
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
