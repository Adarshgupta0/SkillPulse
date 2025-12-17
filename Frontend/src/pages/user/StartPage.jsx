import { BookOpen, Map, Youtube, Zap } from "lucide-react"
import { Link } from "react-router-dom";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-gray-500 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">Student Learning Hub</span>
            </div>
            <Link to="/login" className="inline-flex cursor-pointer text-md  text-blue-700 items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-10 px-4 py-2">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Learn Smarter,
                <span className="text-primary"> Faster, Better</span>
              </h1>
              <p className=" text-muted-foreground text-gray-700 text-pretty max-w-2xl">
                Transform your learning journey with personalized quizzes, expert-crafted roadmaps, and curated
                YouTube Tutorial. Built specifically for students who want to excel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="inline-flex cursor-pointer border hover:bg-white hover:border hover:border-blue-600 hover:text-blue-700 items-center bg-blue-700 text-white justify-center whitespace-nowrap rounded-full text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground  h-12 px-8 py-6">
                  Go Now
                </Link>

              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
                <img
                  src="/student.jpeg"
                  alt="Student learning illustration"
                  className="w-full h-full rounded-2xl object-cover"
                />

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 text-foreground mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground  text-lg max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey in one place
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Daily Quiz */}
            <div className="p-6 text-center transition-shadow rounded-xl bg-card text-card-foreground border border-gray-600">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-blue-700 text-foreground mb-2">Daily Quiz</h3>
              <p className="text-sm text-gray-800 text-muted-foreground">
                Challenge yourself with personalized daily quizzes tailored to your learning goals
              </p>
            </div>

            {/* Roadmap Guidance */}
            <div className="p-6 text-center  transition-shadow rounded-xl bg-card text-card-foreground border border-gray-600">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-blue-700 text-foreground mb-2">Roadmap Guidance</h3>
              <p className="text-sm text-gray-800 text-muted-foreground">
                Follow structured learning paths designed by experts to master any subject
              </p>
            </div>

            {/* Best Free Content */}
            <div className="p-6 text-center  transition-shadow rounded-xl bg-card text-card-foreground border border-gray-600">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Youtube className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-blue-700 text-foreground mb-2">Best Free Content</h3>
              <p className="text-sm text-gray-800 text-muted-foreground">
                Access curated YouTube tutorials and free materials from top educators
              </p>
            </div>

            {/* Smart Learning */}
            <div className="p-6 text-center  transition-shadow rounded-xl bg-card text-card-foreground border border-gray-600">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-blue-700 text-foreground mb-2">Smart Learning</h3>
              <p className="text-sm text-gray-800 text-muted-foreground">
                AI-powered recommendations adapt to your learning style and progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-500 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Student Learning Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
