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
// import Dashboard from "@/app/hike-components/dashboard";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

export default function Trekkyfy() {
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = Cookies.get("access_token");
  //   setAuthenticated(!!token);
  // },[]);

  return (
    <div>
      <Navbar />
      <Hero />
      {/* {authenticated ? <Dashboard /> : ""} */}
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
