import "@/app/stylesheet/feature.css";
import "@/app/stylesheet/animate.css";
import {
  faHiking,
  faShuttleVan,
  faMapMarkedAlt,
  faCloudSun,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function Feature() {
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

  const feature = [
    {
      icon: <FontAwesomeIcon className="feature-icon" icon={faHiking} />,
      title: "Expert Local guides",
      description:
        "Get personalized recommendations from experienced local experts.",
    },
    {
      icon: <FontAwesomeIcon className="feature-icon" icon={faShuttleVan} />,
      title: "Seamless Shuttle Services",
      description: "Hassle-free transport to and from your adventure spots.",
    },
    {
      icon: <FontAwesomeIcon className="feature-icon" icon={faMapMarkedAlt} />,
      title: "Custom Hiking Experiences",
      description:
        "Tailored trails based on your preferences and fitness levels.",
    },
    {
      icon: <FontAwesomeIcon className="feature-icon" icon={faCloudSun} />,
      title: "Real-Time Weather Updates",
      description:
        "Stay informed with real-time weather conditions and alerts.",
    },
    {
      icon: <FontAwesomeIcon className="feature-icon" icon={faLeaf} />,
      title: "Eco-Friendly Practices",
      description:
        "Committed to sustainable tourism and environmental conservation.",
    },
  ];

  const [flippedIndex, setFlippedIndex] = useState<number>(0);
  const handleFlip = (index: number) => {
    setFlippedIndex(flippedIndex === index ? 0 : index);
  };
  return (
    <div className="feature-main">
      <div className="feature-heads">
        <h1 className="animate">Why Choose Us?</h1>
        <p className="animate">
          Explore the features that make us the ideal choice for your hiking and
          backpacking adventures.
        </p>
      </div>
      <div className="feat-cards animate">
        {feature.map((feature, index) => (
          <div key={index} onClick={() => handleFlip(index)}>
            <div
              className={`card-rotate ${
                flippedIndex === index ? "card-rotation" : ""
              }`}
            >
              <div className="feature-icon animate">
                <h1>{feature.icon}</h1>
                <h2>{feature.title}</h2>
              </div>
              <div className="card-back animate">
                <p>{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="feature-line"></div>
    </div>
  );
}
