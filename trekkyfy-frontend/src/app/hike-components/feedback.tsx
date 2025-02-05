import "@/app/stylesheet/feedback.css";
import "@/app/stylesheet/animate.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visited, setVisited] = useState("");
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://trekkyfy.onrender.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, visited, message, number }),
      });
      if (response.ok) {
        toast.success("Feedback Submitted Successfully");
      } else {
        toast.custom("Please try again later!");
      }
    } catch (err) {
      console.error("Something went wrong!",err);
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
    <div className="feed-main">
      <div className="feed-back animate"></div>
      <div className="feed-sec">
        <div className="feed-left">
          <h1 className="animate">Your Voice Is Crucial !</h1>
          <h2 className="animate">
            Embark on your journey with the perfect plan and let us know how
            we&apos;re doing. Your valuable feedback guides us toward excellence!
          </h2>
        </div>
        <div className="feed-right">
          <div className="feed-head animate">
            <h1 className="animate">Your Feedback</h1>
            <h2 className="animate">Please provide your feedback here, so that we can improve.</h2>
          </div>
          <div className="feed-form">
            <form onSubmit={handleFeedback}>
              <input
                type="text"
                value={name}
                className="feed-input animate animate"
                placeholder="Your Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                type="email"
                value={email}
                className="feed-input animate"
                placeholder="Your Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="text"
                value={visited}
                className="feed-input animate"
                placeholder="Visited Place"
                onChange={(e) => {
                  setVisited(e.target.value);
                }}
              />
              <input
                type="text"
                value={number}
                className="feed-input animate"
                placeholder="Phone number"
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
              />
              <textarea
                value={message}
                cols={5}
                rows={5}
                className="feed-input animate"
                placeholder="Your Feedback"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button type="submit" className="feed-btn animate">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="feed-line"></div> */}
    </div>
  );
}
