import React from "react";

function FAQSection() {
  const faqs = [
    {
      question:
        "How do I start online consultation with pharmacist on Pharmind?",
      answer:
        "To start a consultation, simply navigate to our dedicated portal and select an available professional to begin your session.",
    },
    {
      question: "Are your online pharmacist qualified?",
      answer:
        "Yes, every pharmacist on our platform is fully licensed and undergoes a rigorous verification process.",
    },
    {
      question: "Can payments be made by debit or credit?",
      answer:
        "We accept all major debit and credit cards, ensuring a secure and seamless checkout experience for all your healthcare needs.",
    },
  ];

  return (
    <section className="faq-section">
      <div className="container">
        {/* FAQ Header */}
        <div className="faq-header">
          <h2 className="faq-title">
            We’ve answered all <span className="text-red big-span">Your Question</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="accordion-container">
          {faqs.map((faq, index) => (
            <details className="faq-item" key={index}>
              <summary>
                {faq.question}
                <span className="faq-arrow">
                  <svg
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.21042 1.21045L8.47292 8.47295L15.7354 1.21045"
                      stroke="currentColor"
                      strokeWidth="2.42083"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="faq-content">
                <div className="faq-content-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
