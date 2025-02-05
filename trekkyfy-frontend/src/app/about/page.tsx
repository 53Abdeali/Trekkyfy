"use client";

import "@/app/stylesheet/about-main.css";
import aboutMount from "@/app/Images/about-mount.webp";
import person from "@/app/Images/person.png";
import trek from "@/app/Images/trek-goa.jpg";
import trekker1 from "@/app/Images/trekker-1.jpg";
import trekker2 from "@/app/Images/trekker-2.jpg";
import trekker3 from "@/app/Images/trekker-3.jpg";
import Navbar from "@/app/hike-components/navbar";
import Footer from "@/app/hike-components/footer";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCalendar,
  faPaperPlane,
  faPlus,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  faInstagram,
  faLinkedinIn,
  faMeta,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function About() {
  const teams = [
    {
      name: "Developer Team",
      slogan: "Building the future, one line at a time.",
      members: [
        {
          image: person,
          name: "Abdeali Kota Wala",
          designation: "Founder and CEO",
        },
        {
          image: person,
          name: "Aaryan Gupta",
          designation: "Lead Backend Developer ",
        },
        {
          image: person,
          name: "Aarohi Balde",
          designation: "Lead Frontend Developer ",
        },
      ],
    },

    {
      name: "Guiding Team",
      slogan: "Leading every step of your adventure.",
      members: [
        {
          image: person,
          name: "Rahul Sharma",
          designation: "Chief Trek Guide",
        },
        {
          image: person,
          name: "Priya Verma",
          designation: "Mountain Guide",
        },
        {
          image: person,
          name: "Amit Singh",
          designation: "Adventure Specialist",
        },
      ],
    },

    {
      name: "Investors",
      slogan: "Fueling dreams, shaping tomorrow.",
      members: [
        {
          image: person,
          name: "Elena Gomez",
          designation: "Lead Investor",
        },
        {
          image: person,
          name: "Michael Lee",
          designation: "Angel Investor",
        },
        {
          image: person,
          name: "Sophia Wang",
          designation: "Strategic Partner",
        },
      ],
    },
    {
      name: "Marketing Team",
      slogan: "Spreading the word, crafting the brand.",
      members: [
        {
          image: person,
          name: "Ananya Kapoor",
          designation: "Marketing Head",
        },
        {
          image: person,
          name: "Mohit Verma",
          designation: "Social Media Strategist",
        },
        {
          image: person,
          name: "Sonia Dutta",
          designation: "Content Creator",
        },
      ],
    },
    {
      name: "Operations Team",
      slogan: "Ensuring smooth trails, every step of the way.",
      members: [
        {
          image: person,
          name: "Rohan Malhotra",
          designation: "Operations Manager",
        },
        {
          image: person,
          name: "Sneha Desai",
          designation: "Logistics Coordinator",
        },
        {
          image: person,
          name: "Aryan Gupta",
          designation: "Customer Support Lead",
        },
      ],
    },
    {
      name: "Safety & Medical Team",
      slogan: "Your safety, our top priority.",
      members: [
        {
          image: person,
          name: "Dr. Priya Sen",
          designation: "Medical Advisor",
        },
        {
          image: person,
          name: "Karan Bhatia",
          designation: "Emergency Response Leader",
        },
        {
          image: person,
          name: "Alisha Roy",
          designation: "First Aid Specialist",
        },
      ],
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };
  return (
    <div>
      <Navbar />
      <div className="about-image">
        <Image className="about-img" src={aboutMount} alt="About Us" />
        <h1>About Us</h1>
      </div>

      <div className="about-top">
        <div className="about-left">
          <Image
            className="about-left-image"
            src={aboutMount}
            alt="About Mountain"
          />
        </div>
        <div className="about-right">
          <div className="about-right-text">
            <h6>About Us</h6>
            <h1>
              Adventure Awaits - Your Journey, Our Expertise, Unforgettable
              Experiences!
            </h1>
            <p>
              Trekkyfy makes trekking effortless and exciting. We connect you
              with expert guides, curated trails, and hassle-free travel
              services for a seamless adventure. Explore, experience, and
              embrace the wild with us! 🌍⛰️
            </p>
          </div>
          <div className="about-right-content">
            <div className="about-right-ti">
              <div className="airs">
                <FontAwesomeIcon className="air" icon={faBullseye} />
              </div>
              <h2>Our Mission</h2>
              <p>
                Connecting trekkers with expert guides for seamless,
                unforgettable adventures worldwide.
              </p>
            </div>
            <div className="about-right-ti">
              <div className="airs">
                <FontAwesomeIcon className="air" icon={faPaperPlane} />
              </div>
              <h2>Our Vission</h2>
              <p>
                Empowering adventurers to explore new horizons and unforgettable
                experiences.
              </p>
            </div>
          </div>
          <div className="about-right-li">
            <Link className="about-right-link" href="/explore">
              Book Now <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
        </div>
      </div>

      <div className="about-middle">
        <Image className="about-img" src={trek} alt="About Us" />
        <div className="mid-heads">
          <h3>Uncover Hidden Wilderness Together!</h3>
          <p>
            Often celebrated as a harmonious union of physical activity and
            natural exploration become an enriching journey for both body and
            mind.
          </p>
          <div className="about-right-li">
            <Link className="about-right-link" href="/explore">
              Book Now <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
        </div>
      </div>

      <div className="about-blog">
        <div className="blog-head">
          <p>Blog & Article</p>
          <h2>Trekkyfy Chronicles - Stories, Guides & Adventures</h2>
        </div>
        <div className="about-blogs">
          <div className="about-blog-main">
            <div className="about-blog-image">
              <Image className="trek-img" src={trekker1} alt="Trekker-1" />
            </div>
            <div className="about-calendar">
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faCalendar} />
                February 02, 2025
              </span>
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faUserGroup} />
                Admin
              </span>
            </div>
            <div className="about-para">
              <p>
                From Peaks to Paths: Exploring Nature&apos;s Best-Kept Secrets in
                Assam, Meghalaya
              </p>
            </div>
            <div className="about-blog-li">
              <Link className="about-blog-link" href="/explore">
                Read More <FontAwesomeIcon icon={faPlus} />
              </Link>
            </div>
          </div>
          <div className="about-blog-main">
            <div className="about-blog-image">
              <Image className="trek-img" src={trekker2} alt="Trekker-1" />
            </div>
            <div className="about-calendar">
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faCalendar} />
                February 02, 2025
              </span>
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faUserGroup} />
                Admin
              </span>
            </div>
            <div className="about-para">
              <p>
                The Ultimate Trekking Guide: Tips, Gear & Hidden Treks and
                Trails of Madhya Pradesh
              </p>
            </div>
            <div className="about-blog-li">
              <Link className="about-blog-link" href="/explore">
                Read More <FontAwesomeIcon icon={faPlus} />
              </Link>
            </div>
          </div>
          <div className="about-blog-main">
            <div className="about-blog-image">
              <Image className="trek-img" src={trekker3} alt="Trekker-1" />
            </div>
            <div className="about-calendar">
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faCalendar} />
                February 02, 2025
              </span>
              <span>
                <FontAwesomeIcon className="abt-cal-icon" icon={faUserGroup} />
                Admin
              </span>
            </div>
            <div className="about-para">
              <p>
                Trailblazing Tales: Unforgettable Trekking Experiences from
                Jharkhand
              </p>
            </div>
            <div className="about-blog-li">
              <Link className="about-blog-link" href="/explore">
                Read More <FontAwesomeIcon icon={faPlus} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="about-teams">
        <div className="about-teams-head">
          <p>Our Teams</p>
          <h2>Passionate Explorers, Guiding Your Journey</h2>
        </div>
        <div className="about-slider">
          <Slider {...settings} className="abt-slides">
            {teams.map((team, index) => (
              <div className="about-slide-main" key={index}>
                <div className="about-team">
                  <p>{team.name}</p>
                  <h1>{team.slogan}</h1>
                </div>
                <div className="about-team-members">
                  {team.members.map((member, index) => (
                    <div key={index}>
                      <div className="team-member-image">
                        <Image
                          className="team-member-img"
                          src={member.image}
                          alt={member.name}
                        />
                        <div className="about-social-icons">
                          <FontAwesomeIcon
                            className="about-social-icon"
                            icon={faMeta}
                          />
                          <FontAwesomeIcon
                            className="about-social-icon"
                            icon={faInstagram}
                          />
                          <FontAwesomeIcon
                            className="about-social-icon"
                            icon={faLinkedinIn}
                          />
                          <FontAwesomeIcon
                            className="about-social-icon"
                            icon={faXTwitter}
                          />
                        </div>
                      </div>
                      <div className="about-member-details">
                        <p>{member.name}</p>
                        <p>{member.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <Footer />
    </div>
  );
}
