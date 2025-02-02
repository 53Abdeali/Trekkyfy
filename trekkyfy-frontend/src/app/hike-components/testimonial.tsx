import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import person from "@/app/Images/person.png";
import "@/app/stylesheet/testimonial.css";
import "@/app/stylesheet/animate.css";
import sketch from "@/app/Images/sketch.jpg";
import { useEffect } from "react";

const testimonials = [
  {
    name: "Aarav Sharma",
    story:
      "The Himalayas trek was a life-changing experience! The guide was amazing, and the views were breathtaking.",
    rating: 5,
    img: person,
  },
  {
    name: "Priya Patel",
    story:
      "Loved my solo backpacking trip! The platform made it so easy to find a local guide and hidden trails.",
    rating: 4,
    img: person,
  },
  {
    name: "Vikram Singh",
    story:
      "Camping under the stars was surreal! The whole experience was seamless and unforgettable.",
    rating: 5,
    img: person,
  },
  {
    name: "Aarav Sharma",
    story:
      "The Himalayas trek was a life-changing experience! The guide was amazing, and the views were breathtaking.",
    rating: 5,
    img: person,
  },
  {
    name: "Priya Patel",
    story:
      "Loved my solo backpacking trip! The platform made it so easy to find a local guide and hidden trails.",
    rating: 4,
    img: person,
  },
  {
    name: "Vikram Singh",
    story:
      "Camping under the stars was surreal! The whole experience was seamless and unforgettable.",
    rating: 5,
    img: person,
  },
];
export default function Testimonials() {

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
    <>
      <div className="tst-bck-img animate">
        <Image className="test-image" src={sketch} alt="Sketch" />
      </div>
      <div className="testimonial-section">
        <div className="testimonial-head">
          <h1 className="animate">Adventure Stories</h1>
          <p className="animate">Real Experience from our hiking commmunity!</p>
        </div>
        <div className="testimonial-slider animate">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            pagination={false}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide className="testimonial-cards" key={index}>
                <div className="testimonial-card">
                  <div className="testimonial-foot">
                    <Image
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="testimonial-image"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="testimonial-story">
                    <p className="story animate">{testimonial.story}</p>
                  </div>
                  <h4 className="test-name animate">{testimonial.name}</h4>
                  <div className="stars animate">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        key={index}
                        className="star"
                      />
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="testimonial-line"></div>
      </div>
    </>
  );
}
