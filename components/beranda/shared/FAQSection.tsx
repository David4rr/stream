"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FAQItem } from "../types";

export interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full px-4 mb-8 lg:max-w-4xl lg:mx-auto lg:px-0 sm:px-4">
      <div className="flex flex-col justify-center items-center mb-6 py-2 lg:mb-8 lg:px-4">
        <h2 className="font-bold text-gray-900 dark:text-[#cbcbcb] mb-2 text-center text-[15px] sm:text-xl lg:text-2xl xl:text-3xl">
          Pertanyaan yang sering diajukan
        </h2>
        <p className="text-gray-600 dark:text-[#60605e] text-center text-[11px] sm:text-xs lg:text-sm">
          Tidak menemukan jawaban yang Anda cari? Hubungi kami melalui komunitas kami.
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 w-full">
        {faqs.map((faq) => (
          <FAQItemComponent
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface FAQItemComponentProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemComponent({
  faq,
  isOpen,
  onToggle,
}: FAQItemComponentProps) {
  return (
    <Card className="overflow-hidden bg-gray-50 dark:bg-[#20201f] border-2 border-gray-300 dark:border-[#262725] rounded-md lg:border lg:rounded-lg size-sm lg:size-default">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-[#2a2a28] transition-colors p-3 lg:p-5"
      >
        <span className="pr-4 text-gray-700 dark:text-[#929292] text-[9px] lg:text-xs">
          {faq.question}
        </span>
        {isOpen ? (
          <Minus className="text-gray-700 dark:text-[#929292] flex-shrink-0 w-3 h-3 lg:w-4 lg:h-4" />
        ) : (
          <Plus className="text-gray-700 dark:text-[#929292] flex-shrink-0 w-3 h-3 lg:w-4 lg:h-4" />
        )}
      </Button>

      {isOpen && (
        <div className="border-t border-gray-300 dark:border-[#262725] px-3 pb-3 lg:px-5 lg:pb-5">
          <p className="text-gray-600 dark:text-[#808080] leading-relaxed text-[9px] pt-2 lg:text-xs lg:pt-3">
            {faq.answer}
          </p>
        </div>
      )}
    </Card>
  );
}
