"use client";
import React, { useState, useEffect, useCallback } from "react";
import GuideSearch, { FilterCriteria } from "./guideSearch";
import GuideCard from "./guideCard";
import axiosInstance from "@/utils/axiosConfig";
import "@/app/stylesheet/guideProfile.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface Guide {
  id: string;
  guide_id:string;
  guide_city: string;
  guide_district: string;
  guide_state: string;
  guide_phone: string;
  guide_whatsapp: string;
  guide_experience: string;
  guide_languages: string;
  guide_speciality: string;
  guide_photo: string;
  username?: string;
  email?: string;
  last_seen?: string;
}

interface Hiker{
  hiker_id:string;
  hiker_username:string;
}

interface DecodedToken{
  hiker_id:string;
  hiker_username:string;
}

const GuideProfile: React.FC = () => {
  const [filters, setFilters] = useState<FilterCriteria>({
    state: "",
    city: "",
  });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);

  const [hiker, setHiker] = useState<Hiker | null>(null);

  useEffect(() => {
    // ✅ Get token from cookies and decode it
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setHiker({ hiker_id: decoded.hiker_id, hiker_username: decoded.hiker_username });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchGuides = useCallback(async (filters: FilterCriteria) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.state) params.append("state", filters.state);
      if (filters.city) params.append("city", filters.city);

      const res = await axiosInstance.get(
        `/guides-profile?${params.toString()}`
      );
      console.log("API Response:", res.data);
      const guidesData = res.data.guides ? res.data.guides : [res.data];
      setGuides(guidesData);
    } catch (error) {
      console.error("Error fetching guides:", error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides(filters);
  }, [filters, fetchGuides]);

  return (
    <div>
      <GuideSearch onFilterChange={setFilters} />
      {loading ? (
        <p>Loading guides...</p>
      ) : (
        <div className="guides-list">
          {guides.length > 0 ? (
            guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} hiker={hiker} />
            ))
          ) : (
            <p>No guides found with the selected filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideProfile;
