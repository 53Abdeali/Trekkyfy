"use client";

import Footer from "@/app/hike-components/footer";
import Navbar from "@/app/hike-components/navbar";
import GuideHero from "./guideHero";
import GuideProfile from "./guideProfile";

export default function Guide() {
  return (
    <div>
      <Navbar />
      <GuideHero/>
      <GuideProfile/>
      <Footer />
    </div>
  );
}
