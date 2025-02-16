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
export default function Privacy() {
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
      title: "Information We Collect",
      description:
        "We collect personal information such as your name, email, phone number, and payment details. We also gather usage data, including IP addresses, browser types, and browsing behavior. Additionally, we use cookies and tracking technologies to enhance user experience and analyze website traffic.",
    },
    {
      id: 2,
      title: "How We Use Your Information",
      description:
        "We use your data to provide and improve our services, facilitate bookings, personalize user experience, and enhance customer support. Your information also helps us send important updates, marketing communications, and process payments securely.",
    },
    {
      id: 3,
      title: "Information Sharing and Disclosure",
      description:
        "We do not sell or rent your data. However, we may share it with third-party service providers for payment processing, analytics, and customer support. We may also disclose information if required by law or to protect our platform and users.",
    },
    {
      id: 4,
      title: "Data Security",
      description:
        "We implement security measures to protect your personal data from unauthorized access, loss, or misuse. While we strive to ensure the security of your information, no online system is completely secure, and users should take necessary precautions.",
    },
    {
      id: 5,
      title: "Your Rights and Choices",
      description:
        "You have the right to access, update, or delete your personal information. You can opt out of marketing communications and manage cookie preferences through your browser settings.",
    },
    {
      id: 6,
      title: "Third-Party Links",
      description:
        "Our website may contain links to external websites. We are not responsible for their privacy policies and encourage users to review their terms before sharing any information.",
    },
    {
      id: 7,
      title: "Updates to This Policy",
      description:
        "We may update this Privacy Policy periodically. Continued use of our services after any modifications implies acceptance of the updated terms.",
    },
    {
      id: 8,
      title: "Contact Us",
      description:
        "For any questions or concerns regarding your privacy, you can contact us at privacy@Trekkyfy.com.",
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
            <h1>PRIVACY AND POLICY</h1>
            <p>
              Trekkfy values your privacy and is committed to protecting your
              personal data. This policy outlines how we collect, use, and
              safeguard your information when you use our website and services.
            </p>
            <h2>Click below to view the privacy and policy!</h2>
          </div>
          <div className="tc-get-started">
            <span
              onClick={(e) => {
                e.preventDefault();
                handleTerms();
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
                  Close Policy{" "}
                  <FontAwesomeIcon className="tc-get-icon" icon={faArrowUp} />
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="tc-img pp-img">
          <Image
            className="tc-image"
            src={terms}
            alt="Privacy & Policy"
            priority
          />
        </div>
      </div>

      {showConditions &&
        conditions.map((condition) => (
          <div key={condition.id} className="tc-conditions">
            <div className="tc-icon-head">
              <div className="tc-icon">
                <FontAwesomeIcon
                  onClick={(e) => {
                    e.preventDefault();
                    handleCondition(condition.id);
                  }}
                  icon={
                    showDescription[condition.id] ? faArrowDown : faArrowRight
                  }
                />
              </div>
              <div className="tc-head">
                <h1
                  onClick={(e) => {
                    e.preventDefault();
                    handleCondition(condition.id);
                  }}
                >
                  {condition.title}
                </h1>
                {showDescription[condition.id] && (
                  <p>{condition.description}</p>
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
