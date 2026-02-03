import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavbarThemeSwitcher } from "@/components/NavbarThemeSwitcher";
import Logo from "@/components/Logo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-3 md:grid md:grid-cols-3">
          <div className="flex items-center justify-self-start">
            <Logo className="text-2xl" />
          </div>

          <div className="hidden md:flex items-center justify-center space-x-8 justify-self-center">
            <a
              href="#features"
              className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-300"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 justify-self-end">
            <NavbarThemeSwitcher />
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 hover:bg-gray-50 dark:hover:bg-gray-800 w-full rounded-xl"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full rounded-xl"
            >
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
