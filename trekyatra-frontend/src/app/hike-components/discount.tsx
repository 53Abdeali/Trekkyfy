import "@/app/stylesheet/discount.css";
import "@/app/stylesheet/animate.css";
import Link from "next/link";
import { useEffect } from "react";


export default function Discount() {
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
    <div className="discount-main animate">
      <div className="discount-content">
        <div className="disc-heads">
          <p className="animate">Exclusive Offer</p>
          <h1 className="animate">Get 20% Off On Your First Trip</h1>
          <h2 className="animate">
            Get registered as a hiker and get 20% off on your first trip! Join
            us now
          </h2>
        </div>
        <div className="disc-link animate">
          <Link className="disc-offer-link" href="/offers">
            Explore Offers
          </Link>
        </div>
      </div>
    </div>
  );
}
