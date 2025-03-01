"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "@/app/trek-trails/styles/Step1.css";

interface HikerDetails {
  hiker_id: string;
  hiker_username: string;
  phone: string;
  whatsapp: string;
  email: string;
  current_location: string;
  city: string;
  state: string;
  trek_date: string;
  trek_time: string;
  members: number;
  memberDetails?: Array<{ hiker_id: string; email: string; whatsapp: string }>;
}

interface HikerInfoProps {
  hiker_id: string;
  onNext: (data: HikerDetails) => void;
}

interface DecodedToken {
  hiker_id?: string;
  username?: string;
}

const HikerInfoForm: React.FC<HikerInfoProps> = ({ hiker_id, onNext }) => {
  const [hikerId, setHikerId] = useState<string | null>(null);
  const [hikerUsername, setHikerUsername] = useState<string | null>(null);
  const [hikerData, setHikerData] = useState<HikerDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HikerDetails>({
    hiker_id: "",
    hiker_username: "",
    phone: "",
    whatsapp: "",
    email: "",
    current_location: "",
    city: "",
    state: "",
    trek_date: "",
    trek_time: "",
    members: 1,
    memberDetails: [],
  });

  useEffect(() => {
    const token = Cookies.get("access_token");
    console.log("Token from cookies:", token);
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      if (decoded.hiker_id) {
        setHikerId(decoded.hiker_id);
      }
      if (decoded.username) {
        console.log("Setting Username:", decoded.username);
        setHikerUsername(decoded.username);
      } else {
        console.warn("Username not found in decoded token.");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      hiker_id: hikerId || "",
      username: hikerUsername || "",
    }));
  }, [hikerId, hikerUsername]);

  useEffect(() => {
    const fetchHikerData = async () => {
      try {
        const response = await axiosInstance.get(
          `/getHikerDetails/${hiker_id}`
        );
        if (response.data.hikerExists) {
          setHikerData(response.data);
          setFormData((prev) => ({
            ...prev,
            ...response.data.hikerData,
            memberDetails: response.data.memberDetails || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching hiker info:", error);
      } finally {
        setLoading(false);
        getCurrentLocation();
      }
    };
    fetchHikerData();
  }, [hiker_id]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationRes = await axiosInstance.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { withCredentials: false }
            );
            const address = locationRes.data.address;
            const road =
              address.road ||
              address.pedestrian ||
              address.footway ||
              address.suburb ||
              "";
            const city = address.city || address.town || address.village || "";
            const state = address.state || "";
            const fullLocation = [road, city, state].filter(Boolean).join(", ");
            setFormData((prevData) => ({
              ...prevData,
              current_location: fullLocation,
              city: city,
              state: state,
            }));
          } catch (error) {
            console.error("Error fetching location address:", error);
          }
        },
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "members") {
      const membersCount = parseInt(value) || 1;
      setFormData((prev) => {
        let updatedMemberDetails = prev.memberDetails || [];
        const requiredCount = membersCount - 1; // excluding main hiker
        if (updatedMemberDetails.length < requiredCount) {
          updatedMemberDetails = [
            ...updatedMemberDetails,
            ...Array(requiredCount - updatedMemberDetails.length).fill({
              hiker_id: "",
              email: "",
              whatsapp: "",
            }),
          ];
        } else if (updatedMemberDetails.length > requiredCount) {
          updatedMemberDetails = updatedMemberDetails.slice(0, requiredCount);
        }
        return {
          ...prev,
          members: membersCount,
          memberDetails: updatedMemberDetails,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "hiker_id" | "email" | "whatsapp"
  ) => {
    const updatedMembers = [...(formData.memberDetails || [])];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: e.target.value,
    };
    setFormData({ ...formData, memberDetails: updatedMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/saveHikerDetails", { ...formData });
      onNext(formData);
    } catch (error) {
      console.error("Error saving hiker info:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="hiker">
        <h2 className="hiker-head">Hiker Information</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="hiker-form">
          <div className="hiker-inp">
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_id">Your Hiker ID</label>
                <input
                  type="text"
                  name="hiker_id"
                  value={hikerId || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_username">Your Hiker Username</label>
                <input
                  type="text"
                  name="hiker_username"
                  value={hikerUsername || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="hiker-inp">
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_phone">Your Phone No.</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_whatsapp">Your Whatsapp No.</label>
                <input
                  type="text"
                  name="whatsapp"
                  placeholder="WhatsApp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="hiker-inp">
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_email">Your Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!hikerData}
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_location">Your Current Location</label>
                <input
                  type="text"
                  name="current_location"
                  placeholder="Current Location"
                  value={formData.current_location}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="hiker-inp">
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_city">Your City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_state">Your State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="hiker-inp">
            <div className="hk-inp">
              <div>
                <label htmlFor="trek_date">Trek Date</label>
                <input
                  type="date"
                  name="trek_date"
                  value={formData.trek_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="trek_time">Trek Time</label>
                <input
                  type="time"
                  name="trek_time"
                  value={formData.trek_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="hk-inp">
              <div>
                <label htmlFor="hiker_members">Trek Members</label>
                <input
                  type="number"
                  name="members"
                  min="1"
                  value={formData.members}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          {formData.members > 1 &&
            (formData.memberDetails || []).map((member, index) => (
              <div key={index}>
                <div className="hiker-inp member-fields">
                  <div className="hk-inp">
                    <div>
                      <label htmlFor={`hiker_id_${index}`}>
                        Member - {index + 1} Hiker ID
                      </label>
                      <input
                        type="text"
                        name={`hiker_id_${index}`}
                        placeholder={`Member ${index + 1} Hiker ID`}
                        value={member.hiker_id}
                        className="member-fields"
                        onChange={(e) =>
                          handleMemberChange(e, index, "hiker_id")
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="hk-inp">
                    <div>
                      <label htmlFor={`member_email_${index}`}>
                        Member - {index + 1} Email
                      </label>
                      <input
                        type="email"
                        name={`member_email_${index}`}
                        placeholder={`Member ${index + 1} Email`}
                        value={member.email}
                        className="member-fields"
                        onChange={(e) => handleMemberChange(e, index, "email")}
                        required
                      />
                    </div>
                  </div>
                  <div className="hk-inp">
                    <div>
                      <label htmlFor={`member_whatsapp_${index}`}>
                        Member - {index + 1} Whatsapp
                      </label>
                      <input
                        type="text"
                        name={`member_whatsapp_${index}`}
                        placeholder={`Member ${index + 1} WhatsApp`}
                        value={member.whatsapp}
                        className="member-fields"
                        onChange={(e) =>
                          handleMemberChange(e, index, "whatsapp")
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="hiker-btn">
            <button type="submit">Next</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HikerInfoForm;
