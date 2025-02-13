"use client";

import "@/app/stylesheet/hero.css";
import Slider from "react-slick";
import desert from "@/app/Images/desert.jpg";
import mountain_trek from "@/app/Images/mountain-trek.jpg";
import misty from "@/app/Images/misty-fog.jpg";
import laketrail from "@/app/Images/laketrail.webp";
import mountain from "@/app/Images/mountain.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";

interface UserProfile {
  username: string;
}

export default function Hero() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      fetchProfile();
    }
  }, []);

  async function fetchProfile() {
    try {
      const response = await axiosInstance.get<UserProfile>("/user-profile");
      setProfile(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch profile:", error.response?.data?.error);
      } else {
        console.error("An unknown error occurred:", error);
      }
      setProfile(null);
    }
  }

  const images = [
    { back: desert, text: "The Thar desert landscape at sunset." },
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
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

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
                    <p className="hero-text animate">
                      {profile
                        ? `Welcome, ${profile.username}! Ready for your next adventure?`
                        : item.text}
                    </p>
                  </div>
                  <div className="hero-link-para animate">
                    {profile && (
                      <p>
                        <Link className="hero-trail-link" href="/trails">
                          Explore Trails
                        </Link>
                      </p>
                    )}

                    {!profile && (
                      <>
                        <p>
                          <Link className="hero-reg-link" href="/login">
                            Login / Register
                          </Link>
                        </p>
                      </>
                    )}
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
