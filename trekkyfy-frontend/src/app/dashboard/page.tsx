"use client"

import axiosInstance from "@/utils/axiosConfig";
import { useState, useEffect } from "react";

export default function Dashboard(){
    const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axiosInstance.get('/user-profile');
        setProfile(response.data);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error.response?.data?.error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>Welcome, {profile.username}!</h2>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}