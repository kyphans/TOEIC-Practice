import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoutes = createRouteMatcher(["/", "/login", "/signup"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoutes(req)) await auth.protect()
}
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

//   // Các routes không cần authentication
//   publicRoutes: ["/", "/login", "/signup"],
  
//   afterAuth(auth, req) {
//     if (auth.userId && auth.isPublicRoute) {
//       // Nếu user đã đăng nhập và đang ở public route, chuyển hướng về dashboard
//       const dashboardUrl = new URL("/dashboard", req.url)
//       return NextResponse.redirect(dashboardUrl)
//     }

//     if (!auth.userId && !auth.isPublicRoute) {
//       // Nếu user chưa đăng nhập và không ở public route, chuyển hướng về login
//       const loginUrl = new URL("/login", req.url)
//       return NextResponse.redirect(loginUrl)
//     }

//     if (auth.userId) {
//       // Kiểm tra quyền admin khi truy cập vào admin routes
//       const isAdmin = auth.sessionClaims?.metadata?.role === "admin"
//       if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
//         const dashboardUrl = new URL("/dashboard", req.url)
//         return NextResponse.redirect(dashboardUrl)
//       }
//     }
//   }
// })

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// } 