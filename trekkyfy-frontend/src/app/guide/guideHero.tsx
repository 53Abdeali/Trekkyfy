import Image from "next/image";
import guide from "@/app/Images/guide.jpg";
import "./guideHero.css"

export default function GuideHero() {
  return (
    <div className="guide-hero">
      <div className="guide-hero-image">
        <Image className="guide-hero-img" src={guide} alt="Guide" priority />
      </div>
      <div className="guide-hero-content">
        <div className="guide-hero-heads">
          <h1>Find Your Guide!</h1>
          <p>Your adventure, their expertise - craft the perfect journey!</p>
        </div>
        <div className="guide-hero-para">
          <p>
            At Trekkyfy, we believe that the perfect adventure begins with the
            perfect guide. Our mission is to connect you with expert guides who
            are passionate about sharing their local knowledge, hidden gems, and
            unforgettable experiences. Whether you're exploring new terrains or
            seeking a unique perspective on well-trodden paths, we're committed
            to providing you with the best guide tailored to your adventure. Let
            us help you unlock the beauty of your journey with a guide you can
            trust.
          </p>
        </div>
      </div>
    </div>
  );
}
