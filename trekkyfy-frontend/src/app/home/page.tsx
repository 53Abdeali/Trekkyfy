"use client";

import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "@/app/hike-components/navbar";

interface UserProfile {
  username: string;
  email: string;
}

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axiosInstance.get<UserProfile>("/user-profile");
        setProfile(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to fetch profile:", error.response?.data?.error);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    }
    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <Navbar/>
          <h2>Welcome, {profile.username}!</h2>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
