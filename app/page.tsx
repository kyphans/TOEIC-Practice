import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-8 border-black bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-white uppercase">TOEIC Practice</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button className="brutalist-button bg-white text-primary">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="brutalist-button">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="brutalist-header mb-6">
              MASTER <span className="text-primary">TOEIC</span> WITH TIMED PRACTICE
            </h2>
            <p className="text-xl mb-8 font-bold">
              Improve your TOEIC score with our comprehensive practice platform. Take timed tests, track your progress,
              and achieve your target score.
            </p>
            <Link href="/signup">
              <Button className="brutalist-button text-xl py-4 px-8">START PRACTICING NOW</Button>
            </Link>
          </div>
          <div className="brutalist-container">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="TOEIC Practice"
              className="w-full border-4 border-black"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h2 className="brutalist-header text-white text-center mb-12">FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "REALISTIC TESTS",
                description: "Practice with tests that simulate the real TOEIC exam format and timing",
                icon: "📝",
              },
              {
                title: "PROGRESS TRACKING",
                description: "Monitor your scores and see your improvement over time",
                icon: "📈",
              },
              {
                title: "TIMED SESSIONS",
                description: "Practice under time pressure to prepare for the actual test conditions",
                icon: "⏱️",
              },
            ].map((feature, index) => (
              <div key={index} className="brutalist-card bg-white p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-2">{feature.title}</h3>
                <p className="font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold">© {new Date().getFullYear()} TOEIC Practice Platform</p>
        </div>
      </footer>
    </div>
  )
}

