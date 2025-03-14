import { Container } from "@/components/forms/container";
import { Heading } from "@/components/elements/heading";
import { Subheading } from "@/components/elements/subheading";
import { FeatureIconContainer } from "@/components/block-renderer/layout/features/feature-icon-container";
import { IconHelpHexagonFilled } from "@tabler/icons-react";
import { FAQProps } from "@/types";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function FAQ(data: Readonly<FAQProps>) {
  const { heading, sub_heading, faqs } = data;

  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      {/* Header Section */}
      <div className="relative z-20 py-10 md:pt-40 text-center">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconHelpHexagonFilled className="h-10 w-10 text-primary text-slate-200 dark:text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-4 text-primary dark:text-white">
          {heading}
        </Heading>
        <Subheading as="h2" className="mt-2 text-muted-foreground">
          {sub_heading}
        </Subheading>
      </div>

      {/* FAQ Section with 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mt-10">
        {faqs.map((faq, index) => (
          <Accordion key={index} type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border border-border rounded-lg">
           
              <AccordionTrigger className="p-4 text-lg font-semibold transition-all duration-300 
                bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 
                hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary/60 
                dark:hover:from-primary/90 dark:hover:to-primary/70 
                text-gray-900 dark:text-gray-200 
                hover:text-white dark:hover:text-gray-900 
                rounded-lg shadow-md dark:shadow-none 
                no-underline hover:no-underline focus:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="p-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </Container>
  );
}
