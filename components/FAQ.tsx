'use client';

import { useRef, useState } from 'react';
import type { JSX } from 'react';

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: 'What is Applynify?',
    answer: (
      <div className='space-y-2 leading-relaxed'>
        Applynify is a personalized job application service where a dedicated human assistant
        applies to jobs on your behalf based on your preferences, resume, and career goals.
      </div>
    ),
  },
  {
    question: 'How does it work?',
    answer: (
      <p>
        Once you sign up and complete your profile, we assign you a trained application assistant.
        They’ll search for relevant jobs, tailor applications, and submit them for you directly on
        company websites.
      </p>
    ),
  },
  {
    question: 'Who is this service for?',
    answer: (
      <div className='space-y-2 leading-relaxed'>
        Busy professionals, recent grads, job seekers who hate the repetitive application process,
        and anyone looking to increase their job application output without the stress.
      </div>
    ),
  },
  {
    question: 'Do real people apply to jobs for me?',
    answer: (
      <div className='space-y-2 leading-relaxed'>
        Yes! Every application is handled by a real, professionally trained assistant. No bots or
        generic spam, just personalized, high-quality submissions.
      </div>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className='relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10'
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className={`flex-1 text-base-content ${isOpen ? 'text-primary' : ''}`}>
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox='0 0 16 16'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            y='7'
            width='16'
            height='2'
            rx='1'
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && 'rotate-180'
            }`}
          />
          <rect
            y='7'
            width='16'
            height='2'
            rx='1'
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && 'rotate-180 hidden'
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className='pb-5 leading-relaxed'>{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className='bg-base-200' id='faq'>
      <div className='py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12'>
        <div className='flex flex-col text-left basis-1/2'>
          <p className='inline-block font-semibold text-primary mb-4'>FAQ</p>
          <p className='sm:text-4xl text-3xl font-extrabold text-base-content'>
            Frequently Asked Questions
          </p>
        </div>

        <ul className='basis-1/2'>
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
