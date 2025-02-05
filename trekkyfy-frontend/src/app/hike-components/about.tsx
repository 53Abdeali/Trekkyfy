import Image from "next/image";
import "@/app/stylesheet/about.css";
import "@/app/stylesheet/animate.css";
import foreground from "@/app/Images/abt-fore.jpg";
import background from "@/app/Images/abt-moun.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect } from "react";

export default function About() {
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
    <div className="about-main">
      <div className="about-line animate"></div>
      <div className="about-content">
        <div className="abt-head">
          <h1 className="abt-head-title animate">ABOUT US</h1>
          <p className="animate">Wanna know about us, who we are, read this!</p>
        </div>
        <div className="abt-main-sec">
          <div className="abt-img-main">
            <div className="abt-img-back">
              <Image
                className="abt-back animate"
                src={background}
                alt="Backgound Image"
              />
            </div>
            <div className="abt-img-fore animate">
              <Image
                className="abt-fore"
                src={foreground}
                alt="Foregound Image"
              />
            </div>
          </div>

          <div className="abt-content">
            <div className="abt-content-para">
              <p className="animate">
                At Trekkyfy, we believe that every hike is more than just a
                journey—it&apos;s an adventure filled with breathtaking landscapes,
                thrilling challenges, and unforgettable memories. Our platform
                connects passionate hikers with experienced local guides,
                ensuring personalized and safe trekking experiences.
              </p>{" "}
              <p className="animate">
                {" "}
                Whether you&apos;re a beginner looking for an easy trail or an
                experienced adventurer seeking a challenging expedition, we
                provide expert recommendations tailored to your skill level.
                With a strong focus on sustainability and responsible tourism,
                we aim to promote eco-friendly hiking while supporting local
                communities.
              </p>
              <p className="animate">
                Join us and explore the untamed beauty of nature, one trail at a
                time!
              </p>
              <p className="animate">
                <FontAwesomeIcon className="abt-icon" icon={faArrowRight} />
                <Link className="abt-icon-link" href="/login">
                  Start Your Adventure
                </Link>
              </p>
              <p className="animate">
                <FontAwesomeIcon className="abt-icon" icon={faArrowRight} />
                <Link className="abt-icon-link" href="/trail">
                  Find Your Perfect Trail
                </Link>
              </p>
              <p className="animate">
                <FontAwesomeIcon className="abt-icon" icon={faArrowRight} />
                <Link className="abt-icon-link" href="/trek">
                  Discover Hidden Treks
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="about-line"></div>
    </div>
  );
}
