'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function FAQSection() {
  return (
    <section id="faq" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        <FAQItem 
          question="Can I use my own domain with Minispace?"
          answer="Yes, Pro tier users can connect their own custom domain to their Minispace site. See the Domain Setup Guide for instructions."
          linkHref="#domain-setup"
          linkText="Domain Setup Guide"
        />
        
        <FAQItem 
          question="How do I customize my subdomain?"
          answer="You can customize your subdomain in your dashboard settings. Go to Dashboard → Settings → Domain and enter your desired subdomain."
        />
        
        <FAQItem 
          question="How long does it take for DNS changes to take effect?"
          answer="DNS changes can take up to 48 hours to propagate across the internet, though they often take effect much sooner."
        />
      </div>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  linkHref?: string;
  linkText?: string;
}

function FAQItem({ question, answer, linkHref, linkText }: FAQItemProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button className="w-full text-left px-4 py-3 bg-muted font-medium flex justify-between items-center">
        <span>{question}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="p-4 text-sm">
        <p>
          {answer}
          {linkHref && linkText && (
            <> See the <a href={linkHref} className="text-primary hover:underline">{linkText}</a> for instructions.</>
          )}
        </p>
      </div>
    </div>
  );
}
