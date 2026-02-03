import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Mail, Newspaper } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white py-16 px-4 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                Vicaran
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto md:mx-0">
              AI-powered investigation assistant for journalists. Investigate
              stories faster with source credibility scoring and fact-checking.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <SocialIcon
                url="https://twitter.com"
                className="h-9 w-9 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="white"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                url="https://linkedin.com"
                className="p-0 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="white"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                url="https://github.com"
                className="h-9 w-9 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="white"
                style={{ height: 40, width: 40 }}
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center md:text-left">
            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white text-lg mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#demo"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white text-lg mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="mailto:support@vicaran.ai"
                    className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    Email Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © 2026 Vicaran. All rights reserved.
            </p>
            <Badge className="bg-primary/10 hover:bg-primary/10 border-primary/20 text-primary text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Gemini 3 Global Hackathon
              </div>
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
