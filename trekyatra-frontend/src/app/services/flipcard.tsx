"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHiking,
  faMapMarkedAlt,
  faCampground,
  faBus,
  faUserShield,
  faRecycle,
  faUsers,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

import "@/app/stylesheet/services.css"

interface ServiceCardProps {
  heading: string;
  description: string;
  icon: any;
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
