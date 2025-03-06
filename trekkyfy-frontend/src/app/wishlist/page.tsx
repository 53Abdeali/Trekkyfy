"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faEllipsisV,
  faPlay,
  faShareAlt,
  faTimes,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { Trail, DecodedToken } from "@/app/trek-trails/trek_trails";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "@/app/stylesheet/explore.css";
import axiosInstance from "@/utils/axiosConfig";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<Trail[]>([]);
  const [showTools, setShowTools] = useState<number | null>(null);
  const [hikerId, setHikerId] = useState<string | null>(null);
  const [showProfileDown, setShowProfileDown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const showToggleTools = (index: number) => {
    setShowTools(showTools === index ? null : index);
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch(
        `https://trekkyfy.onrender.com/api/wishlist/${hikerId}`
      );
      const data = await response.json();
      if (response.ok) {
        setWishlist(data);
      } else {
        toast.error("Failed to fetch wishlist.");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Something went wrong!");
    }
  };

  const token = Cookies.get("access_token");
  useEffect(() => {
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.hiker_id) {
        setHikerId(decoded.hiker_id);
        fetchWishlist();
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token, fetchWishlist]);

  const removeFromWishlist = async (trailId: number) => {
    try {
      const response = await fetch(
        "https://trekkyfy.onrender.com/api/wishlist/remove",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hiker_id: hikerId, trail_id: trailId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setWishlist((prev) => prev.filter((trail) => trail.id !== trailId));
        toast.success("Removed from wishlist!");
      } else {
        toast.error(data.error || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Something went wrong!");
    }
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

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status === 200) {
        setIsAuthenticated(false);
        Cookies.remove("access_token");
        window.location.href = "/";
        toast.success("Logout Successfully");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <>
      {!isAuthenticated && (
        <div className="wishlist-container">
          <Link className="not-link" href="/">
            <FontAwesomeIcon className="not-icon" icon={faArrowCircleLeft} />
          </Link>
          <h1>My Wishlist</h1>
          <div ref={profileRef} className="profile-container">
            <span
              onClick={() => setShowProfileDown(!showProfileDown)}
              className="profile-icon"
            >
              <FontAwesomeIcon
                className="nav-prof-icon"
                icon={faUserCircle}
                size="lg"
              />
            </span>
            {showProfileDown && (
              <div className="profile-dropdown">
                <Link href="/profile" className="dropdown-item">
                  Profile
                </Link>
                <span
                  onClick={() => {
                    logout();
                    setIsAuthenticated(false);
                  }}
                  className="dropdown-item"
                >
                  Logout
                </span>
              </div>
            )}
          </div>
          {wishlist.length === 0 ? (
            <p>No items in your wishlist.</p>
          ) : (
            <div className="exp-cards-main">
              {wishlist.length > 0 &&
                wishlist.map((trail, index) => (
                  <div key={`${trail.id}-${index}`} className="exp-cards">
                    <div className="ellipsis">
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
                          onClick={() => removeFromWishlist(trail.id)}
                        >
                          <span>
                            <FontAwesomeIcon
                              className="share-add-icon"
                              icon={faTimes}
                            />
                          </span>
                          <span>Remove from wishlist</span>
                        </div>
                      </div>
                    )}
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
          )}
        </div>
      )}
    </>
  );
};

export default WishlistPage;
