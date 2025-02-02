import "@/app/stylesheet/work.css";
import "@/app/stylesheet/animate.css";
import {
  faSignIn,
  faMapMarkedAlt,
  faUserFriends,
  faCogs,
  faHiking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect } from "react";

export default function Work() {
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
    <div className="work-main">
      <div className="work-header">
        <h1 className="animate">How it Works?</h1>
        <p className="animate">Plan your perfect hiking experience in just a few simple steps.</p>
      </div>
      <div className="work-steps">
        <div className="steps">
          <Link className="work-links animate" href="/login">
            <div className="step animate">
              <FontAwesomeIcon className="step-icon" icon={faSignIn} />
              Login / Register
            </div>
          </Link>
          <div className="step-arrow animate"></div>
          <Link className="work-links animate" href="/explore">
            <div className="step animate">
              <FontAwesomeIcon className="step-icon" icon={faMapMarkedAlt} />{" "}
              Explore Destinations
            </div>
          </Link>
          <div className="step-arrow animate"></div>
          <Link className="work-links animate" href="/guide">
            <div className="step animate">
              <FontAwesomeIcon className="step-icon" icon={faUserFriends} />{" "}
              Connect with Guides
            </div>
          </Link>
          <div className="step-arrow animate"></div>
          <Link className="work-links animate" href="/customize">
            <div className="step animate">
              <FontAwesomeIcon className="step-icon" icon={faCogs} /> Customize
              Your Experience
            </div>
          </Link>
          <div className="step-arrow animate"></div>
          <Link className="work-links animate" href="/trails">
            <div className="step">
              <FontAwesomeIcon className="step-icon" icon={faHiking} /> Seamless
              Adventures
            </div>
          </Link>
        </div>
      </div>
      <div className="work-line"></div>
    </div>
  );
}
