"use client";

import Navbar from "@/app/hike-components/navbar";
import Footer from "@/app/hike-components/footer";
import "@/app/stylesheet/services.css";
import explore from "@/app/Images/explore.png";
import connect from "@/app/Images/connect.png";
import experience from "@/app/Images/trek-goa.jpg";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  faHiking,
  faMapMarkedAlt,
  faCampground,
  faBus,
  faUserShield,
  faRecycle,
  faUsers,
  faBook,
  faCalendar,
  faUserGroup,
  faPerson,
  faIndianRupeeSign,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Flipcard from "./flipcard";
import sandapkhu from "@/app/Images/sandakphu.png";
import roopkundtrek from "@/app/Images/roopkundtrek.png";
import hamptatrek from "@/app/Images/hamptatrek.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Services() {
  const images = [
    {
      img: explore,
      text: "Explore",
    },
    {
      img: connect,
      text: "Connect",
    },
    {
      img: experience,
      text: "Experience",
    },
  ];

  const services = [
    {
      heading: "Guided Hiking Tours",
      description:
        "We connect you with local experts who know the terrain, the best routes, and the hidden gems. Our guides ensure that your hiking experience is safe, enriching, and memorable.",
      icon: faHiking,
    },
    {
      heading: "Personalized Trip Planning",
      description:
        "Planning a trek can be overwhelming. Share your goals, experience level, and preferences, and we'll help craft a customized hiking itinerary tailored just for you.",
      icon: faMapMarkedAlt,
    },
    {
      heading: "Shuttle & Transportation Services",
      description:
        "Reaching remote trekking destinations can be tricky. Our shuttle services provide hassle-free pick-up and drop-off options, ensuring you start your trek on time.",
      icon: faBus,
    },
    {
      heading: "Equipment Rentals",
      description:
        "We've got you covered for any hiking gear you might need. Rent high-quality trekking equipment, from backpacks to hiking boots, for the duration of your adventure.",
      icon: faCampground,
    },
    {
      heading: "Group Adventures",
      description:
        "Join a group of like-minded explorers. We organize group hikes and trekking trips where you can meet new people, share experiences, and explore the outdoors together.",
      icon: faUsers,
    },
    {
      heading: "Adventure Stories & Community Hub",
      description:
        "Share your trekking experiences, photos, and videos with our hiking community. Read inspiring travel stories, get expert trekking tips, and connect with fellow adventurers.",
      icon: faBook,
    },
    {
      heading: "Emergency & Safety Assistance",
      description:
        "Your safety is our priority. We offer 24/7 emergency support, GPS tracking, and first-aid assistance to ensure you're never alone on the trail.",
      icon: faUserShield,
    },
    {
      heading: "Eco-Trekking & Sustainable Travel",
      description:
        "Protect nature while exploring it! We promote eco-friendly trekking by encouraging sustainable practices such as zero-waste travel, responsible camping, and local community support. ",
      icon: faRecycle,
    },
  ];

  const destinations = [
    {
      name: "Roopkund Trek",
      place: "Kathgodam, Uttarakhand",
      image: roopkundtrek,
      rupee: faIndianRupeeSign,
      cost: "12K",
      famous:
        "Rupkoond or Mystery Lake is known for its mystery lake filled with ancient human skeletons. Stunning views of Trishul & Nanda Ghunti peaks.",
    },
    {
      name: "Hampta Pass Trek",
      place: "Manali, Himachal Pradesh",
      image: hamptatrek,
      rupee: faIndianRupeeSign,
      cost: "10K",
      famous:
        "A crossover trek between lush Kullu Valley and arid Lahaul Valley. Offers green meadows, river crossings, and snow-covered passes.",
    },
    {
      name: "Sandakphu Trek ",
      place: "Darjeeling, West Bengal",
      image: sandapkhu,
      rupee: faIndianRupeeSign,
      cost: "8K",
      famous:
        "A crossover trek between lush Kullu Valley and arid Lahaul Valley. Offers green meadows, river crossings, and snow-covered passes.",
    },
  ];

  const settings = {
    dots: false,
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
      <div className="services">
        <div className="service-main">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="service-img">
                <Image
                  className="service-image"
                  src={image.img}
                  alt={image.text}
                />
                <h3>{image.text}</h3>
              </div>
            ))}
          </Slider>
        </div>

        <div className="services-right">
          <div className="service-head">
            <h6>Our Services</h6>
            <h2>Explore, Connect, Experience</h2>
            <p className="service-para">
              At Trekkyfy, we offer more than just hiking. We connect you with
              experienced local guides, offer personalized itineraries, and
              provide a seamless experience from booking to exploring the great
              outdoors. Whether you are looking for a solo adventure, a group
              trek, or a full guided tour, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      <div className="services-content">
        <div className="service-line">Services Offered</div>
        <div className="service-cards">
          {services.map((service, index) => (
            <Flipcard
              key={index}
              heading={service.heading}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>

      <div className="pop-dest">
        <div className="dest-line">Popular Destinations</div>
        <div className="pop-dest-main">
          {destinations.map((destination, index) => (
            <div key={index} className="pop-dest-cards">
              <div className="pop-dest-card">
                <div className="pop-dest-head">
                  <h3>{destination.name}</h3>
                  <p>{destination.place}</p>
                </div>
                <div className="pop-dest-img">
                  <Image
                    className="pop-dest-image"
                    src={destination.image}
                    alt={destination.name}
                  />
                </div>
                <div className="pop-dest-details">
                  <div className="pop-dest-dur">
                    <FontAwesomeIcon icon={faCalendar} /> 6 Days
                  </div>
                  <div className="pop-dest-pep">
                    <FontAwesomeIcon icon={faUserGroup} /> 6 Heads
                  </div>
                </div>
                <div className="pop-dest-cost">
                  <FontAwesomeIcon icon={destination.rupee} /> 10K Per Individual
                </div>
                <div className="pop-dest-fam">
                  <p>{destination.famous}</p>
                </div>
                <div className="pop-dest-book">
                  <Link className="pop-dest-book-link" href="/explore">
                    Book Now <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
