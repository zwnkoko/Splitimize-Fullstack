import { Github, Linkedin, Zap, Users, Receipt, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl w-full space-y-8">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                Full-Stack Portfolio Project
              </p>
            </div>
            <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Splitimize
            </h1>
            <p className="text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Smart bill splitting made simple. Upload, extract, split, and
              settle up with ease.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button asChild size="lg" className="gap-2">
              <Link href="/upload-receipt">
                <Zap className="w-4 h-4" /> Try Demo
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/zwnkoko/Splitimize-Fullstack"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://www.linkedin.com/in/zwnkoko"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Key Features
            </h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to split bills effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Receipt className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Smart OCR Extraction</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Upload a receipt image and let AI automatically extract itemized
                details with high accuracy.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Users className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Flexible Splitting</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Split evenly among people or assign costs by individual items
                for perfect fairness.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Lock className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Secure Authentication</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                OAuth integration with Google and GitHub. No passwords needed,
                just safe and secure login.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Zap className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Demo Mode</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Try all features instantly without signing in.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-lg">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Upload Receipt</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an image of your receipt.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-lg">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  OCR + AI Processing
                </h3>
                <p className="text-muted-foreground">
                  OCR extracts the text, then AI intelligently organizes it into
                  itemized entries.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-lg">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Choose Split Method
                </h3>
                <p className="text-muted-foreground">
                  Split evenly or assign costs by individual items.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-lg">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Get the Breakdown
                </h3>
                <p className="text-muted-foreground">
                  See exactly who owes what. Perfect for settling up later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Tech Stack
            </h2>
            <p className="text-muted-foreground mt-2">
              Built with modern, industry-standard technologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Frontend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Next.js 15
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  React Query
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Shadcn UI
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Backend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Express.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Prisma ORM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Tesseract.js & OCR.space
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Google Gemini API
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Better Auth
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Infrastructure</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Docker
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Digital Ocean & Netlify
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Git & GitHub
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  CI/CD Pipeline
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Responsive Layout
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                REST
              </div>
              <div className="text-sm text-muted-foreground">
                API Architecture
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                OAuth 2.0
              </div>
              <div className="text-sm text-muted-foreground">
                Secure Authentication
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
