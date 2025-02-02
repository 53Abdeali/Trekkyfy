import "@/app/stylesheet/hero.css";
import Slider from "react-slick";
import desert from "@/app/Images/desert.jpg";
import mountain_trek from "@/app/Images/mountain-trek.jpg";
import misty from "@/app/Images/misty-fog.jpg";
import laketrail from "@/app/Images/laketrail.webp";
import mountain from "@/app/Images/mountain.webp";
import Link from "next/link";
import { useEffect } from "react";

export default function Hero() {
  const images = [
    {
      back: desert,
      text: "The Thar desert landscape at sunset.",
    },
    {
      back: mountain,
      text: "The Grand Beauty of Himalayas from Jammu and Kashmir to Arunachal Pradesh.",
    },
    {
      back: misty,
      text: "The Attraction of Western Ghats from Gujarat to Tamil Nadu.",
    },
    {
      back: laketrail,
      text: "The amazing and various lakes of Srinagar, Udaipur and Bhopal.",
    },
    {
      back: mountain_trek,
      text: "The snowy peaks of Himalayas in Jammu and Uttarakhand.",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slideToShow: 1,
    slideToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
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
    <div className="hero-main">
      <div className="hero animate">
        <Slider {...settings}>
          {images.map((item, index) => (
            <div key={index}>
              <div
                className="hero-banner"
                style={{
                  backgroundImage: `url(${item.back.src})`,
                  backgroundSize: "cover",
                  height: "100vh",
                  width: "100%",
                }}
              >
                <div className="hero-overlay animate">
                  <div className="con-para">
                    <p className="hero-text animate">{item.text}</p>
                  </div>
                  <div className="hero-link-para animate">
                    <p>
                      <Link className="hero-trail-link animate" href="/trails">
                        Explore Trails
                      </Link>
                    </p>
                    <p>
                      <Link className="hero-reg-link" href="/register">
                        Register / Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
