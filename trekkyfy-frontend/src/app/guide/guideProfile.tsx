"use client";
import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import GuideSearch, { FilterCriteria } from "./guideSearch";
import GuideCard from "./guideCard";
import axiosInstance from "@/utils/axiosConfig";

interface Guide {
  id: string;
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

interface TokenPayload {
  guide_id?: string;
}

const getGuideIdFromToken = (): string => {
  const token = Cookies.get("access_token");
  if (!token) {
    console.error("No token found in cookies.");
    return "";
  }
  try {
    const decoded: TokenPayload = jwtDecode(token);
    if (!decoded.guide_id) {
      console.error("guide_id not found in token payload.");
      return "";
    }
    return decoded.guide_id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
};

const GuideProfile: React.FC = () => {
  const [filters, setFilters] = useState<FilterCriteria>({
    state: "",
    city: "",
  });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const guideId = getGuideIdFromToken();

  const fetchGuides = useCallback(
    async (filters: FilterCriteria) => {
      if (!guideId) {
        console.error("No valid guide_id found.");
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("guide_id", guideId);
        if (filters.state) params.append("state", filters.state);
        if (filters.city) params.append("city", filters.city);

        const res = await axiosInstance.get(`/guide?${params.toString()}`);
        console.log("API Response:", res.data);
        const guidesData = res.data.guides ? res.data.guides : [res.data];
        setGuides(guidesData);
      } catch (error) {
        console.error("Error fetching guides:", error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    },
    [guideId]
  );

  useEffect(() => {
    fetchGuides(filters);
  }, [filters, fetchGuides]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Find Your Guide</h1>
      <GuideSearch onFilterChange={setFilters} />
      {loading ? (
        <p>Loading guides...</p>
      ) : (
        <div className="guides-list">
          {guides.length > 0 ? (
            guides.map((guide) => <GuideCard key={guide.id} guide={guide} />)
          ) : (
            <p>No guides found with the selected filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideProfile;
