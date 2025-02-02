"use client";
import Navbar from "@/app/hike-components/navbar";
import Footer from "@/app/hike-components/footer";
import Hero from "@/app/hike-components/hero";
import About from "@/app/hike-components/about";
import Feature from "@/app/hike-components/feature";
import Work from "@/app/hike-components/work";
import Testimonials from "@/app/hike-components/testimonial";
import Discount from "@/app/hike-components/discount";
import Feedback from "@/app/hike-components/feedback";

export default function Trekkyfy() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Discount />
      <Feature />
      <Testimonials />
      <Feedback />
      <Footer />
    </div>
  );
}
