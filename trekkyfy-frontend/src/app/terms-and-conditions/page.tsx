"use client";
import Image from "next/image";
import terms from "@/app/Images/terms.jpg";
import Navbar from "@/app/hike-components/navbar";
import Footer from "@/app/hike-components/footer";
import "@/app/stylesheet/terms.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
export default function Terms() {
  const [showConditions, setShowConditions] = useState(false);
  const [showDescription, setShowDescription] = useState<{
    [key: number]: boolean;
  }>({});

  const handleTerms = () => {
    setShowConditions(!showConditions);
  };

  const handleCondition = (id: number) => {
    setShowDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const conditions = [
    {
      id: 1,
      title: "User Account",
      description:
        "To use certain features of the website, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
    },
    {
      id: 2,
      title: "Use of Services",
      description:
        "You agree to use the platform for lawful purposes only and in accordance with the platform's guidelines. You may not use the services for any illegal or unauthorized purposes, including but not limited to:",
      list: [
        "Harassing or harming others",
        "Posting offensive content",
        "Engaging in fraudulent activities",
      ],
    },
    {
      id: 3,
      title: "Booking & Payments",
      description:
        "When you book a service through Trek Yatra, you agree to provide accurate information and make payment in accordance with the platform's policies. All payments are processed securely through our third-party payment providers.",
    },
    {
      id: 4,
      title: "Cancellations and Refunds",
      description:
        "Bookings can be canceled as per the platform's cancellation policy. Refunds, if applicable, will be processed based on the terms outlined during the booking process.",
    },
    {
      id: 5,
      title: "Reviews and Testimonials",
      description:
        "Users may leave reviews and testimonials for guides and services. You agree that your review is truthful and complies with the platform's guidelines for content..",
    },
    {
      id: 6,
      title: "Intellectual Property",
      description:
        "All content, including but not limited to logos, text, images, and software, is the property of Trek Yatra or its licensors and is protected by copyright laws.",
    },
    {
      id: 7,
      title: "Limitation of Liability",
      description:
        "Trek Yatra will not be liable for any indirect, incidental, or consequential damages resulting from the use of our platform or services. We make no guarantees regarding the accuracy of information provided on the platform.",
    },
    {
      id: 8,
      title: "Changes to Terms",
      description:
        "We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page with the updated date.",
    },
    {
      id: 9,
      title: "Governing Law",
      description:
        "These Terms and Conditions are governed by the laws of the jurisdiction in which Trek Yatra operates. Any disputes will be resolved in the competent courts of that jurisdiction.",
    },
    {
      id: 10,
      title: "Contact Information",
      description:
        "If you have any questions or concerns, please contact us at support@Trekkyfy.com.",
    },
  ];
  return (
    <div className="tc">
      <div className="tc-nav">
        <Navbar />
      </div>
      <div className="tc-main">
        <div className="tc-content">
          <div className="tc-heads">
            <h1>TERMS AND CONDITIONS</h1>
            <p>
              Welcome to Trek Yatra! These Terms and Conditions govern your use
              of our website and services. By accessing or using our platform,
              you agree to comply with and be bound by these terms.
            </p>
            <h2>Click below to view the terms and conditions!</h2>
          </div>
          <div className="tc-get-started">
            <span
              onClick={(e) => {
                e.preventDefault(), handleTerms();
              }}
              className="tc-get"
            >
              {!showConditions ? (
                <span>
                  Get Started{" "}
                  <FontAwesomeIcon className="tc-get-icon" icon={faArrowDown} />
                </span>
              ) : (
                <span>
                  Close Terms{" "}
                  <FontAwesomeIcon className="tc-get-icon" icon={faArrowUp} />
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="tc-img">
          <Image className="tc-image" src={terms} alt="Terms & Conditions" />
        </div>
      </div>

      {showConditions &&
        conditions.map((condition) => (
          <div key={condition.id} className="tc-conditions">
            <div className="tc-icon-head">
              <div className="tc-icon">
                <FontAwesomeIcon
                  onClick={(e) => {
                    e.preventDefault(), handleCondition(condition.id);
                  }}
                  icon={
                    showDescription[condition.id] ? faArrowDown : faArrowRight
                  }
                />
              </div>
              <div className="tc-head">
                <h1
                  onClick={(e) => {
                    e.preventDefault(), handleCondition(condition.id);
                  }}
                >
                  {condition.title}
                </h1>
                {showDescription[condition.id] && (
                  <>
                    <p>{condition.description}</p>
                    {condition.list && (
                      <ul className="tc-list">
                        {condition.list.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

      <div className="tc-foot">
        <Footer />
      </div>
    </div>
  );
}
