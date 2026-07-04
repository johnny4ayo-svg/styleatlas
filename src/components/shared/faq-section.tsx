import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqSchema, jsonLdScript } from "@/lib/seo";

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: { faqs: { question: string; answer: string }[]; title?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-charcoal-100 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />
      <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">{title}</h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-serif text-base">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
