import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function DemoSection() {
  return (
    <section id="demo" className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all duration-300 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Sample Investigation
            </div>
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"See what "}
            <span className="text-primary">{"AI-powered investigation"}</span>
            {" looks like"}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              "Professional investigation research delivered in minutes. Here's what a real Vicaran investigation contains."
            }
          </p>
        </div>

        {/* Report Preview */}
        <div className="bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-700/50 mb-12">
          {/* Report Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Investigation Report: Tech Company Layoffs 2024
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Completed in 8 minutes • 24 sources analyzed • 15 claims verified
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">24</div>
              <div className="text-slate-600 dark:text-slate-400">
                Sources Analyzed
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-green-500 mb-2">15</div>
              <div className="text-slate-600 dark:text-slate-400">
                Claims Verified
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-amber-500 mb-2">3</div>
              <div className="text-slate-600 dark:text-slate-400">
                Gaps Identified
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white dark:bg-primary/5 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              Investigation Summary
            </h4>
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              Verified Claims
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Verified: 12,000+ layoffs confirmed
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-5/6"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Verified: Q3 earnings missed projections
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Unverified: CEO departure rumors
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
            {"Get your investigation report in "}
            <span className="text-primary">minutes</span>
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {
              "This is just a preview. Your full investigation includes verified claims, credibility-scored sources, timeline visualization, bias analysis, and exportable reports."
            }
          </p>
          <Button
            size="default"
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Link href="/auth/login">
              Start Your Investigation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
