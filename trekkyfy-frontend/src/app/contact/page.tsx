"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "../hike-components/footer";
import Navbar from "../hike-components/navbar";
import "@/app/stylesheet/contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faMailBulk,
  faMessage,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMeta,
  faPinterest,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (response.ok) {
        toast.success("We have recieved your query!");
      } else {
        toast.error("Please try again later!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went Wrong!");
    }
  };

  const mapRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Update CSS variables on the map container
      mapRef.current.style.setProperty("--x", `${x}%`);
      mapRef.current.style.setProperty("--y", `${y}%`);
    };

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.addEventListener("mousemove", handleMouse);
    }

    return () => {
      if (overlay) {
        overlay.removeEventListener("mousemove", handleMouse);
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="contact-main">
        <div ref={mapRef} className="contact-map">
          <div ref={overlayRef} className="mouse-overlay"></div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d470751.15084134234!2d75.93471079999999!3d22.81197135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1738304436246!5m2!1sen!2sin"
            width="100%"
            height="500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="ctc-map"
          ></iframe>

          <div className="contact-heads">
            <h1>Get in Touch</h1>
            <p> We are here to help you and glad to hear from you</p>
          </div>
        </div>

        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-left-head">
              <h1>Send us a Message</h1>
              <p>
                <FontAwesomeIcon icon={faMessage} />
              </p>
            </div>
            <form onSubmit={handleContact}>
              <div className="contact-inputs">
                <div className="contact-inp">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="contact-inp">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="contact-inputs">
                <div className="contact-inp">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="contact-inp">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="contact-text-area">
                <div className="contact-inp">
                  <label htmlFor="phone">Message</label>
                  <textarea
                    cols={5}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          </div>

          <div className="contact-right">
            <div className="contact-right-head">
              <h1>Contact Information</h1>
            </div>
            <div className="contact-right-content">
              <span>
                <FontAwesomeIcon icon={faBuilding} />
              </span>
              <p>
                123, Vijay Nagar, Nipania Bypass, Indore, Madhya Pradesh 4252002
              </p>
            </div>
            <div className="contact-right-content">
              <span>
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <p>0731 425 629</p>
            </div>
            <div className="contact-right-content">
              <span>
                <FontAwesomeIcon icon={faMailBulk} />
              </span>
              <p>Trekkyfyhelp@gmail.com</p>
            </div>
            <div className="contact-right-icons">
              <div>
                <FontAwesomeIcon icon={faMeta} />
              </div>
              <div>
                <FontAwesomeIcon icon={faXTwitter} />
              </div>
              <div>
                <FontAwesomeIcon icon={faPinterest} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
