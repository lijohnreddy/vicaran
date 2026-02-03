import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the fact-checking?",
    answer:
      "Vicaran uses multiple source verification to cross-check claims. Each fact is verified against multiple independent sources with credibility scoring. While no system is perfect, our verification process typically catches issues that manual research would miss and provides evidence links for everything.",
  },
  {
    question: "How is this different from doing Google research myself?",
    answer:
      "Vicaran processes dozens of sources simultaneously, extracts claims automatically, and verifies each one against multiple sources. What would take you days of manual research, we deliver in minutes with structured evidence and credibility scores for every source.",
  },
  {
    question: "What types of investigations work best?",
    answer:
      "Vicaran works great for breaking news verification, company investigations, person profiles, event timelines, and any topic requiring multiple source verification. It's designed for journalists who need verified facts fast.",
  },
  {
    question: "Is my investigation kept confidential?",
    answer:
      "Absolutely. Your investigations, topics, and results are completely private. We never share your data with third parties and use enterprise-grade security to protect your information.",
  },
  {
    question: "Can I export my investigation?",
    answer:
      "Yes! Export your complete investigation to Markdown or PDF with full citation chains, source credibility scores, and methodology documentation. Perfect for publication or sharing with editors.",
  },
  {
    question: "What makes up the source credibility score?",
    answer:
      "Our 5-star credibility scoring considers domain reputation, publication history, journalistic standards, and cross-reference verification. Higher scores indicate more reliable sources you can cite with confidence.",
  },
  {
    question: "How does gap-driven search work?",
    answer:
      "Our AI identifies information gaps and unanswered questions in your investigation, then automatically searches for additional sources to fill those gaps. This ensures comprehensive coverage you'd miss with manual research.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative"
    >
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
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"Frequently "}
            <span className="text-primary">{"asked questions"}</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              "Got questions? We've got answers. Here are the most common questions from journalists and researchers."
            }
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6 mb-20">
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-1 hover:border-primary dark:hover:border-primary transition-all duration-300"
              >
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="text-left group-hover:text-primary text-base md:text-lg font-bold text-slate-800 dark:text-white hover:text-primary transition-colors duration-300 py-4 hover:no-underline items-center">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed text-base pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {"Still have questions? "}
            <a
              href="mailto:support@vicaran.ai"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </a>
            {" - we'll get back to you within 24 hours."}
          </p>
        </div>
      </div>
    </section>
  );
}
