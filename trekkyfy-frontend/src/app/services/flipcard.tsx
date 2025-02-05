"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/app/stylesheet/services.css"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ServiceCardProps {
  heading: string;
  description: string;
  icon: IconDefinition;
}

export default function Flipcard({
  heading,
  description,
  icon,
}: ServiceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <FontAwesomeIcon className="card-icon" icon={icon} />
          <h3>{heading}</h3>
        </div>

        <div className="flip-card-back">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
