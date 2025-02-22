"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/hike-components/navbar";
import "@/app/stylesheet/explore.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import Footer from "@/app/hike-components/footer";
import Image from "next/image";
import explore from "@/app/Images/exp-flower.png";

interface Trail {
  id: number;
  name: string;
  state: string;
  nearest_city: string;
  difficulty_level: string;
  duration_days: number;
  best_time_to_visit: string;
  guide_availability: boolean;
  Links: string;
}

export default function Explore() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [filters, setFilters] = useState({
    state: "",
    difficulty: "",
    max_duration: "",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchTrails = useCallback(async (isNewFilter: boolean) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/explore", {
        params: {
          ...filters,
          page: isNewFilter ? 1 : page,
          limit: 10,
        },
      });

      const newTrails = response.data;
      setTrails((prevTrails) =>
        isNewFilter ? newTrails : [...prevTrails, ...newTrails]
      );
      setPage((prevPage) => (isNewFilter ? 2 : prevPage + 1));
      setHasMore(newTrails.length > 0);
    } catch (error) {
      console.error("Error fetching trails:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrails(true);
    }
  }, [filters, isAuthenticated, fetchTrails]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if (!isLoading && hasMore) {
          fetchTrails(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, fetchTrails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      {isAuthenticated && (
        <div className="explore">
          <Navbar />
          <div className="explore-cont">
            <div className="explore-image">
              <Image className="explore-img" src={explore} alt="Explore" />
            </div>
            <div className="exp-heads">
              <h1 className="explore-head">Explore Trails & Treks</h1>
              <p className="exp-para">
                Explore treks and click on the play button to see how your
                adventure would be!
              </p>
            </div>

            <div className="explore-inputs">
              <div className="exp-inp-main">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={filters.state}
                  onChange={handleInputChange}
                  className="exp-inp"
                />
                <select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleInputChange}
                  className="explore-select"
                >
                  <option value="">Difficulty Level</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                </select>
                <input
                  type="number"
                  name="max_duration"
                  placeholder="Max Duration (days)"
                  value={filters.max_duration}
                  onChange={handleInputChange}
                  className="exp-inp"
                />
              </div>
            </div>

            <div className="exp-cards-main">
              {trails.length > 0 &&
                trails.map((trail, index) => (
                  <div key={`${trail.id}-${index}`} className="exp-cards">
                    <h2 className="exp-cards-head">{trail.name}</h2>
                    <p className="exp-cards-para">State: {trail.state}</p>
                    <p className="exp-cards-para">
                      Nearest City: {trail.nearest_city}
                    </p>
                    <p className="exp-cards-para">
                      Difficulty: {trail.difficulty_level}
                    </p>
                    <p className="exp-cards-para">
                      Duration: {trail.duration_days} days
                    </p>
                    <p className="exp-cards-para">
                      Best Time to Visit: {trail.best_time_to_visit}
                    </p>
                    <p className="exp-cards-para">
                      Guide Available: {trail.guide_availability ? "Yes" : "No"}
                    </p>
                    {trail.Links ? (
                      <Link
                        href={trail.Links}
                        target="_blank"
                        className="exp-cards-link"
                      >
                        <FontAwesomeIcon icon={faPlay} className="text-xl" />
                      </Link>
                    ) : (
                      <span className="exp-cards-span">N/A</span>
                    )}
                  </div>
                ))}
            </div>
            <div className="explore-circ">
              {isLoading && <div className="explore-load"></div>}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
