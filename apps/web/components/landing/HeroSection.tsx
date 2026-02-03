import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Search, FileCheck } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-2 sm:px-4 sm:py-2 mb-4 sm:mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Investigation Assistant</span>
          </div>

          {/* Main headline */}
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 md:mb-6 leading-tight animate-fade-in-delay-1"
          >
            AI-Powered Investigation{" "}
            <br className="hidden sm:block" />
            Assistant for{" "}
            <span className="text-primary">
              Journalists
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed animate-fade-in-delay-2 px-2 sm:px-0">
            Investigate stories{" "}
            <span className="font-semibold text-primary">2x faster</span>{" "}
            with recursive gap-driven search, source credibility scoring, and atomic fact-checking.
          </p>

          {/* Feature highlights */}
          <div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400 animate-fade-in-delay-2"
            role="list"
            aria-label="Key features"
          >
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              role="listitem"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" aria-hidden="true" />
              <span>Complete investigations in minutes</span>
            </div>
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              role="listitem"
            >
              <FileCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" aria-hidden="true" />
              <span>Verify claims with evidence</span>
            </div>
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              role="listitem"
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" aria-hidden="true" />
              <span>Find gaps you&apos;d miss manually</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 animate-fade-in-delay-3 px-4 sm:px-0">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 group w-full sm:w-auto rounded-xl focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2"
                aria-describedby="cta-description"
              >
                Get Started - Free
                <ArrowRight className="!w-5 !h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" strokeWidth={2.5} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-xl"
            >
              <Link href="#features" className="flex items-center justify-center">
                Learn More
              </Link>
            </Button>
          </div>
          <div id="cta-description" className="sr-only">
            Sign up to start investigating with AI-powered research and fact-checking
          </div>
        </div>
      </div>
    </section>
  );
}