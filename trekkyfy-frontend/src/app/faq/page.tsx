"use client";

import Image from "next/image";
import Navbar from "../hike-components/navbar";
import Footer from "../hike-components/footer";
import faq from "@/app/Images/faq.jpg";
import "@/app/stylesheet/faq.css";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  faPlus,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Faqs() {
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({});
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const faqsPerPage = 6;

  const handleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://trekkyfy.onrender.com/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, email }),
      });
      if (response.ok) {
        toast.success(
          "Question submitted successfully, we will get back to you soon!"
        );
      } else {
        toast.error("Failed to submit question");
      }
    } catch (err) {
      console.error("Something Went Wrong", err);
    }
  };

  const handleShowFaq = (id: number) => {
    setShowAnswer((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNextFAQs = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex + faqsPerPage < faqs.length ? prevIndex + faqsPerPage : 0
    );
  };

  const handlePreviousFAQs = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex - faqsPerPage >= 0
        ? prevIndex - faqsPerPage
        : faqs.length - faqsPerPage
    );
  };

  const faqs = [
    {
      id: 1,
      question: "What is Trekkyfy?",
      answer:
        "Trek Yatra is a platform that connects hikers with experienced local guides, provides curated trekking experiences, and offers shuttle services to trekking destinations.",
    },
    {
      id: 2,
      question: "How do I book a trek?",
      answer:
        "You can browse available treks on our website, choose your preferred destination, and book directly through our platform. You will receive confirmation details via email.",
    },
    {
      id: 3,
      question: "Are the guides experienced?",
      answer:
        "Yes, all our guides are verified, experienced, and knowledgeable about the trekking routes. They ensure safety and provide valuable insights throughout the journey.",
    },
    {
      id: 4,
      question: "What should I pack for a trek?",
      answer:
        "Packing essentials depend on the trek, but generally, you should carry sturdy trekking shoes, weather-appropriate clothing, a backpack, water bottles, snacks, first-aid supplies, and necessary permits.",
    },
    {
      id: 5,
      question: "Is there a cancellation policy?",
      answer:
        "Yes, our cancellation policy varies based on the trek and guide. You can check specific trek details for refund and cancellation terms before booking.",
    },
    {
      id: 6,
      question: "Can beginners join the treks?",
      answer:
        "Absolutely! We offer treks for all experience levels. Some trails are beginner-friendly, while others require prior experience. The difficulty level is mentioned on each trek's details page.",
    },
    {
      id: 7,
      question: "How do I contact my guide?",
      answer:
        "Once you book a trek, guide contact details will be shared with you via email. You can also reach out through our in-app messaging system.",
    },
    {
      id: 8,
      question: "Is transportation provided?",
      answer:
        "Yes, we offer shuttle services to and from major trekking destinations. You can opt for transportation while booking your trek.",
    },
    {
      id: 9,
      question: "Are there group discounts?",
      answer:
        "Yes, we offer discounts for group bookings. You can check our website or contact us for more details on group pricing.",
    },
    {
      id: 10,
      question: "How can I stay updated on upcoming treks?",
      answer:
        "Subscribe to our newsletter to receive updates on new treks, special offers, and adventure stories from our community.",
    },
  ];

  return (
    <div className="faq-page">
      <Navbar />
      <div className="faq-main">
        <div className="faq-content">
          <div className="faq-heads">
            <h1>FREQUENTLY ASKED QUESTIONS</h1>
            <p>
              At Trek Yatra, we aim to make your trekking experience seamless
              and enjoyable. To help you navigate our platform and services,
              we&apos;ve compiled a list of frequently asked questions.
            </p>
          </div>
        </div>
        <div className="faq-img">
          <Image
            className="faq-image"
            src={faq}
            alt="Frequently Asked Questions"
            priority
          />
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-que">
          <div className="faq-que-head">
            <h1>Ask a Question</h1>
          </div>
          <div className="faq-que-form">
            <form className="faq-form" onSubmit={handleQuestion}>
              <input
                type="text"
                placeholder="Enter your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="faq-inp"
              />
              <input
                type="email"
                placeholder="Enter your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="faq-inp"
              />
              <button className="faq-btn" type="submit">
                Submit Question
              </button>
            </form>
          </div>
        </div>

        <div className="faq-map-que">
          {faqs
            .slice(visibleStartIndex, visibleStartIndex + faqsPerPage)
            .map((question) => (
              <div className="faq-map" key={question.id}>
                <div className="faq-map-main">
                  <p className="que-faq" onClick={() => handleShowFaq(question.id)}>
                    {question.question}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      onClick={() => handleShowFaq(question.id)}
                      className="faq-que-icon"
                      icon={faPlus}
                    />
                  </p>
                </div>
                {showAnswer[question.id] && (
                  <p className="faq-ans-para">{question.answer}</p>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="faq-navigation">
        <button onClick={handlePreviousFAQs} className="faq-nav-btn">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button onClick={handleNextFAQs} className="faq-nav-btn">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <Footer />
    </div>
  );
}
