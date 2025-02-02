import "@/app/stylesheet/footer.css";
import "@/app/stylesheet/animate.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faMessage,
  faPhone,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faXTwitter,
  faMeta,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success("Successfully subscribed to the newsleter!");
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    });

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="foot-top">
      <div className="foot-main">
        <div className="foot-logo animate">
          <h1>Trekkyfy</h1>
        </div>
        <div className="foot-items">
          <div className="foot-news">
            <div className="foot-news-head">
              <h2 className="animate">Newsletter</h2>
              <h3 className="animate">We promise not to spam!</h3>
            </div>
            <div className="foot-news-form">
              <form onSubmit={handleSubmit}>
                <div className="foot-news-form-main animate">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="foot-inp"
                    placeholder="Your email..."
                    required
                  />
                </div>
                <div className="foot-main-btn animate">
                  <button className="foot-btn" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="foot-contact">
            <div className="foot-para animate">
              <span className="intro-para animate">
                Discover the thrill of the outdoors with Trekkyfy. From serene
                trails to epic peaks, we're here to guide your journey. Let's
                explore together!
              </span>
              <span className="contact-para animate">
                <FontAwesomeIcon
                  className="contact-para-icon"
                  icon={faMessage}
                />{" "}
                Trekkyfyhelp@gmail.com
              </span>
              <span className="contact-para animate">
                <FontAwesomeIcon className="contact-para-icon" icon={faPhone} />
                0731 425 629
              </span>
              <span className="contact-para animate">
                <FontAwesomeIcon
                  className="contact-para-icon"
                  icon={faLocationArrow}
                />
                Indore, India 452002
              </span>
            </div>
          </div>
          <div className="foot-useful animate">
            <h1 className="animate">Useful Links</h1>
            <ul className="foot-ul animate">
              <li>
                <Link className="foot-link animate animate" href="/faq">
                  <FontAwesomeIcon
                    className="foot-link-icon"
                    icon={faArrowRightToBracket}
                  />
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="foot-link animate" href="/catalog">
                  <FontAwesomeIcon
                    className="foot-link-icon"
                    icon={faArrowRightToBracket}
                  />
                  Download Catalog
                </Link>
              </li>
              <li>
                <Link className="foot-link animate" href="/privacy-and-policy">
                  <FontAwesomeIcon
                    className="foot-link-icon"
                    icon={faArrowRightToBracket}
                  />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="foot-link animate" href="/terms-and-conditions">
                  <FontAwesomeIcon
                    className="foot-link-icon"
                    icon={faArrowRightToBracket}
                  />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-social">
          <div className="foot-fit animate">
            <span>
              <FontAwesomeIcon className="foot-social-icon" icon={faMeta} />
            </span>
          </div>
          <div className="foot-fit animate">
            <FontAwesomeIcon className="foot-social-icon" icon={faInstagram} />
          </div>
          <div className="foot-fit animate">
            <FontAwesomeIcon className="foot-social-icon" icon={faXTwitter} />
          </div>
        </div>
        <div className="copyright animate">
          <p>&copy; Copyright 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
