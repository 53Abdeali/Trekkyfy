"use client";
import { useState, useEffect } from "react";
import Navbar from "../hike-components/navbar";
import "@/app/stylesheet/explore.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import Footer from "@/app/hike-components/footer";

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrails(true);
    }
  }, [filters, isAuthenticated]);

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
  }, [isLoading, hasMore]);

  const fetchTrails = async (isNewFilter: boolean) => {
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
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      {isAuthenticated && (
        <div>
          <Navbar />
          <div className="explore-cont container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-6">Explore Trails & Treks</h1>
            <p className="exp-para text-m font-bold mb-6">
              Explore treks and click on the play button to see how your
              adventure could be!
            </p>


            <div className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={filters.state}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                <select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full explore-select"
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
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.length > 0 ? (
                trails.map((trail, index) => (
                  <div
                    key={`${trail.id}-${index}`}
                    className="relative border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <h2 className="text-2xl font-bold mb-2 text-[#212b43]">
                      {trail.name}
                    </h2>
                    <p className="text-[#212b43]-600">State: {trail.state}</p>
                    <p className="text-[#212b43]-600">
                      Nearest City: {trail.nearest_city}
                    </p>
                    <p className="text-[#212b43]-600">
                      Difficulty: {trail.difficulty_level}
                    </p>
                    <p className="text-[#212b43]-600">
                      Duration: {trail.duration_days} days
                    </p>
                    <p className="text-[#212b43]-600">
                      Best Time to Visit: {trail.best_time_to_visit}
                    </p>
                    <p className="text-[#212b43]-600">
                      Guide Available: {trail.guide_availability ? "Yes" : "No"}
                    </p>
                    {trail.Links ? (
                      <Link
                        href={trail.Links}
                        target="_blank"
                        className="absolute bottom-4 right-3 flex items-center justify-center w-10 h-10 bg-[#212b43] text-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#212b43] shadow-md"
                      >
                        <FontAwesomeIcon icon={faPlay} className="text-xl" />
                      </Link>
                    ) : (
                      <span className="absolute bottom-4 right-3 flex items-center justify-center w-12 h-12 bg-gray-400 text-white rounded-full shadow-md">
                        N/A
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[#212b43]-600">
                  No trails found. Try adjusting the filters.
                </p>
              )}
            </div>
            <div className="explore-circ">
              {isLoading && (
                <div className="explore-load text-center mt-4"></div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
