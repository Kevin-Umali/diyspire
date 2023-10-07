"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { faqs } from "@/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQLinkData } from "@/interfaces";

export default function FAQPage() {
  const [accordionDefaultValue, setAccordionDefaultValue] = useState<string>(`item-0`);

  const parseAnswer = (answer: string | undefined, links?: { [key: string]: FAQLinkData }) => {
    if (!answer) return;

    return answer.split(/\{(.+?)\}/g).map((segment, index) =>
      index % 2 === 0 ? (
        segment
      ) : (
        <Link key={segment} href={links?.[segment]?.href ?? "#"}>
          {links?.[segment]?.text ?? segment}
        </Link>
      ),
    );
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const hashValue = hash.split("#").filter(Boolean)[0];
    const index = faqs.findIndex((faq) => faq.id == hashValue);
    if (index !== -1) {
      setAccordionDefaultValue(`item-${index}`);
    }
  }, []);

  return (
    <>
      <div className="container mx-auto py-5 px-4 sm:py-10">
        <div className="text-center mb-10">
          <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">Frequently Asked Questions</h1>
        </div>

        <Accordion value={accordionDefaultValue} onValueChange={setAccordionDefaultValue} type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.links ? parseAnswer(faq.answer, faq.links) : faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
