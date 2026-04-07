"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Play,
  ChevronRight,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: BookOpen,
    title: "Learning Paths",
    description: "Structured courses with topics, quizzes, and progress tracking for every subject.",
  },
  {
    icon: Brain,
    title: "Concept Simplifier",
    description: "AI chatbot that breaks down complex topics into easy-to-understand explanations.",
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description: "Create exam schedules and flashcards to optimize your study sessions.",
  },
  {
    icon: Target,
    title: "Smart Quizzes",
    description: "Test your knowledge and get instant feedback with AI-powered assessments.",
  },
]

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "1000+", label: "Subjects" },
  { value: "95%", label: "Pass Rate" },
  { value: "4.9", label: "User Rating" },
]

const trustedBy = [
  "Stanford University",
  "MIT",
  "Harvard",
  "Oxford",
  "Cambridge",
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Gradify</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-sm">
              <Link href="/auth/login">Student Login</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm">
              <Link href="/auth/faculty/login">Faculty Login</Link>
            </Button>
            <Button asChild className="text-sm">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                Master any subject with{" "}
                <span className="text-primary">intelligent</span>{" "}
                learning
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Personalized learning paths, AI-powered concept explanations, smart study planning, 
                and interactive quizzes - all in one platform designed to help you succeed.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-base" asChild>
                  <Link href="/auth/signup">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base" asChild>
                  <Link href="/auth/faculty/signup">
                    Faculty Sign Up
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Free forever for students</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative mx-auto max-w-5xl rounded-2xl border border-border bg-card p-2 shadow-2xl">
                <div className="rounded-xl bg-secondary/50 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Progress Card */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Weekly Progress</p>
                          <p className="text-xl font-bold text-foreground">87%</p>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div className="h-2 bg-primary rounded-full w-[87%]" />
                      </div>
                    </div>

                    {/* Subject Card */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-chart-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Subjects</p>
                          <p className="text-xl font-bold text-foreground">6</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {["Math", "Physics", "Chemistry"].map((s) => (
                          <span key={s} className="text-xs px-2 py-1 bg-secondary rounded-md text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Achievement Card */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-chart-3" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Achievements</p>
                          <p className="text-xl font-bold text-foreground">24</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">3 new this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-16 px-6 border-t border-border">
          <div className="container mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-8">Trusted by students at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {trustedBy.map((name) => (
                <span key={name} className="text-lg font-semibold text-muted-foreground/60">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 border-t border-border">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything you need to excel
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed to make learning effective, engaging, and personalized to your needs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 px-6 border-t border-border bg-secondary/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Gradify works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes and transform your learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Create Your Profile", desc: "Sign up and tell us about your courses and learning goals." },
                { step: "02", title: "Choose Your Path", desc: "Select subjects and topics you want to master this semester." },
                { step: "03", title: "Learn & Track", desc: "Follow personalized lessons, take quizzes, and watch your progress grow." },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                      <ChevronRight className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlight - Concept Simplifier */}
        <section className="py-20 px-6 border-t border-border">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 text-chart-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4" />
                  Concept Simplifier
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Confused? Ask our AI tutor
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our AI-powered chatbot breaks down complex concepts into simple, 
                  easy-to-understand explanations. Get instant answers, examples, 
                  and step-by-step guidance whenever you need it.
                </p>
                <ul className="space-y-3">
                  {["24/7 instant responses", "Personalized explanations", "Visual diagrams & examples", "Multiple explanation styles"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Try Concept Simplifier
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Chat Preview */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Gradify AI</p>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Can you explain quantum entanglement simply?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        Think of it like having two magic coins. When you flip one and it lands heads, 
                        the other instantly becomes tails - no matter how far apart they are! 
                        Scientists call this &quot;spooky action at a distance.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 border-t border-border">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-16">
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to transform your learning?
                </h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">
                  Join thousands of students who are mastering their subjects with Gradify.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" className="h-14 px-8" asChild>
                    <Link href="/auth/signup">
                      Get Started Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Contact Sales
                  </Button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full translate-x-1/2 translate-y-1/2" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Gradify</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered learning platform helping students master any subject.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                {["Learning Paths", "Study Planner", "Concept Simplifier", "Quizzes"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Cookie Policy"].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2026 Gradify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
