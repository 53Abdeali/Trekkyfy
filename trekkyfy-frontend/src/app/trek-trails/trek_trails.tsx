"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/hike-components/navbar";
import "@/app/stylesheet/explore.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faEllipsisV,
  faShareAlt,
  faBookmark,
  faTimes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosConfig";
import Footer from "@/app/hike-components/footer";
import Image from "next/image";
import explore from "@/app/Images/exp-flower.png";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import BookingStepper from "./BookingStepper";

export interface Trail {
  id: number;
  name: string;
  state: string;
  nearest_city: string;
  difficulty_level: "Easy" | "Moderate" | "Challenging" | "Difficult";
  duration_days: number;
  best_time_to_visit: string;
  guide_availability: boolean;
  Links: string;
  description: string;
}

export interface DecodedToken {
  hiker_id: string;
}

export default function Trails_Trek() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [recommendedTrails, setRecommendedTrails] = useState<Trail[]>([]);
  const [filters, setFilters] = useState({
    state: "",
    difficulty: "",
    max_duration: "",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showTools, setShowTools] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hikerId, setHikerId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  const showToggleTools = (index: number) => {
    setShowTools(showTools === index ? null : index);
  };

  const token = Cookies.get("access_token");
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.hiker_id) {
        setHikerId(decoded.hiker_id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);

  // Fetch general trails (explore)
  const fetchTrails = useCallback(
    async (isNewFilter: boolean) => {
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
    },
    [filters, page]
  );

  // Fetch ML-based trek recommendations from the Flask API
  const fetchRecommendedTrails = useCallback(async () => {
    if (!hikerId) return;
    try {
      const response = await axiosInstance.get(
        `/recommend_treks?hiker_id=${hikerId}`
      );
      // If ML API returns empty recommendations for a new hiker,
      // fallback to a random selection from the general trails.
      const recs = response.data.recommended_treks || [];
      if (recs.length === 0 && trails.length > 0) {
        const randomTrails = [...trails];
        randomTrails.sort(() => Math.random() - 0.5);
        setRecommendedTrails(randomTrails.slice(0, 3));
      } else {
        setRecommendedTrails(recs);
      }
    } catch (error) {
      console.error("Error fetching ML recommendations:", error);
    }
  }, [hikerId, trails]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrails(true);
      fetchRecommendedTrails();
    }
  }, [filters, isAuthenticated, fetchTrails, fetchRecommendedTrails]);

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

  const shareTrek = async (trail: Trail) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trail.name,
          text: `Check out this amazing trek: ${trail.name} in ${trail.state}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing trek:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const addToWishlist = (trailId: number) => {
    fetch("https://trekkyfy.onrender.com/api/wishlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ hiker_id: hikerId, trail_id: trailId }),
    })
      .then((response) => {
        if (response.ok) {
          setWishlist([...wishlist, trailId]);
          toast.success("Added to wishlist!");
        } else {
          toast.error("Failed to add to wishlist.");
        }
      })
      .catch((error) => {
        console.error("Error adding to wishlist:", error);
        toast.error("Something went wrong!");
      });
  };

  const removeFromWishlist = (trailId: number) => {
    fetch("https://trekkyfy.onrender.com/api/wishlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiker_id: hikerId, trail_id: trailId }),
    })
      .then((response) => {
        if (response.ok) {
          setWishlist(wishlist.filter((id) => id !== trailId));
          toast.success("Removed from wishlist!");
        } else {
          toast.error("Failed to remove from wishlist.");
        }
      })
      .catch((error) => {
        console.error("Error removing from wishlist:", error);
        toast.error("Something went wrong!");
      });
  };

  const isAddedToWishlist = (trailId: number) => wishlist.includes(trailId);

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
              <h1 className="explore-head">
                Book and Enjoy the Trails & Treks
              </h1>
              <p className="exp-para">
                Explore treks and click on the play button to see how your
                adventure would be! Afterwards click on the Book Now Button!
              </p>
            </div>

            {/* Recommended Treks Section */}
            {recommendedTrails.length > 0 && (
              <div className="recommended-section">
                <h2 style={{textAlign:"center", marginTop:"2rem", color:"#212b43" }}>Recommended Treks For You</h2>
                <div className="exp-cards-main">
                  {recommendedTrails.map((trail) => (
                    <div key={`${trail.id}-rec`} className="exp-cards">
                      <h3 className="exp-cards-head">{trail.name}</h3>
                      <p className="exp-cards-para">State: {trail.state}</p>
                      <p className="exp-cards-para">
                        Difficulty: {trail.difficulty_level}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedTrail(trail);
                          setOpen(true);
                        }}
                        className="book-button"
                      >
                        Book Now <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters Section */}
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

            {/* All Trails Section */}
            <div className="exp-cards-main">
              {trails.length > 0 &&
                trails.map((trail, index) => (
                  <div key={`${trail.id}-${index}`} className="exp-cards">
                    <div className="ellipsis">
                      <div
                        className="book-btn"
                        onClick={() => {
                          setSelectedTrail(trail);
                          setOpen(true);
                        }}
                      >
                        <span className="book-button">
                          Book Now <FontAwesomeIcon icon={faPlus} />
                        </span>
                      </div>
                      <div className="show-tools">
                        <FontAwesomeIcon
                          onClick={() => showToggleTools(index)}
                          className="ellipsis-v"
                          icon={faEllipsisV}
                        />
                      </div>
                      {showTools === index && (
                        <div className="tools">
                          <div
                            className="share-add"
                            onClick={() => shareTrek(trail)}
                          >
                            <span>
                              <FontAwesomeIcon
                                className="share-add-icon"
                                icon={faShareAlt}
                              />
                            </span>
                            <span>Share</span>
                          </div>
                          <div
                            className="share-add"
                            onClick={() =>
                              isAddedToWishlist(trail.id)
                                ? removeFromWishlist(trail.id)
                                : addToWishlist(trail.id)
                            }
                          >
                            <span>
                              <FontAwesomeIcon
                                className="share-add-icon"
                                icon={
                                  isAddedToWishlist(trail.id)
                                    ? faTimes
                                    : faBookmark
                                }
                              />
                            </span>
                            <span>
                              {isAddedToWishlist(trail.id)
                                ? "Remove"
                                : "Add to Wishlist"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
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

      {selectedTrail && (
        <BookingStepper
          hiker_id={hikerId || ""}
          trail={selectedTrail}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
