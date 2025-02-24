"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import axios from "axios";
import "@/app/stylesheet/hikerInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface DecodedToken {
  hiker_id: string;
  username: string;
}

interface HikerInfoProps {
  onCloseHikerInfo: () => void;
}

const HikerInfo: React.FC<HikerInfoProps> = ({ onCloseHikerInfo }) => {
  const [hikerId, setHikerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<DecodedToken | null>(null);
  const [trekPlace, setTrekPlace] = useState("");
  const [onDate, setOnDate] = useState("");
  const [onTime, setOnTime] = useState("");
  const [allMembers, setAllmembers] = useState<number | null>(null);
  const token = Cookies.get("access_token");

  async function fetchProfile() {
    try {
      const response = await axiosInstance.get<DecodedToken>("/user-profile");
      setProfile(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch profile:", error.response?.data?.error);
      } else {
        console.error("An unknown error occurred:", error);
      }
      setProfile(null);
    }
  }

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.hiker_id) {
        setHikerId(decoded.hiker_id);
      }
    } catch (error) {
      console.log("Some error ocurred while decoding: ", error);
    }
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !hikerId ||
      !profile?.username ||
      !trekPlace ||
      !onDate ||
      !onTime ||
      allMembers === null
    ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await axiosInstance.post("/avl-price-req", {
        hiker_id: hikerId,
        hiker_username: profile?.username,
        trek_place: trekPlace,
        hiking_members: allMembers,
        trek_date: onDate,
        trek_time: onTime,
      });
      if (res.status === 200) {
        toast.success(
          "Your request and information has been sent to the respective Guide!"
        );
      } else {
        toast.error("Unable to proceed the request.");
      }
    } catch (error) {
      console.log("Some error occured: ", error);
    }
  };

  return (
    <div className="pr-av">
      <div className="pr-av-content">
        <div className="pr-av-close-btn">
          <button className="pr-av-close" onClick={onCloseHikerInfo}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="pr-av-main">
          <form onSubmit={handleSubmit}>
            <div className="pr-av-ip-main">
              <div className="pr-av-ip">
                <label htmlFor="Hiker Id">Your ID</label>
                <input
                  type="text"
                  name="hiker_id"
                  value={hikerId || ""}
                  onChange={(e) => {
                    setHikerId(e.target.value);
                  }}
                  style={{ backgroundColor: "#ccc", cursor: "not-allowed" }}
                  contentEditable={false}
                />
              </div>
              <div className="pr-av-ip">
                <label htmlFor="Username">Your Username</label>
                <input
                  type="text"
                  name="hiker_username"
                  value={profile ? profile.username : ""}
                  onChange={(e) => {
                    setHikerId(e.target.value);
                  }}
                  style={{ backgroundColor: "#ccc", cursor: "not-allowed" }}
                  contentEditable={false}
                />
              </div>
            </div>

            <div className="pr-av-ip-main">
              <div className="pr-av-ip">
                <label htmlFor="Trek Place">Trek Place</label>
                <input
                  type="text"
                  name="trek_place"
                  value={trekPlace}
                  onChange={(e) => {
                    e.preventDefault();
                    setTrekPlace(e.target.value);
                  }}
                />
              </div>
              <div className="pr-av-ip">
                <label htmlFor="Members">Members</label>
                <input
                  type="number"
                  name="hiking_members"
                  value={allMembers || 0}
                  onChange={(e) => {
                    e.preventDefault();
                    setAllmembers(Number(e.target.value) || 0);
                  }}
                />
              </div>
            </div>
            <div className="pr-av-ip-main">
              <div className="pr-av-ip">
                <label htmlFor="Trekking Date">Trekking Date</label>
                <input
                  type="date"
                  name="trek_date"
                  value={onDate}
                  onChange={(e) => {
                    e.preventDefault();
                    setOnDate(e.target.value);
                  }}
                />
              </div>
              <div className="pr-av-ip">
                <label htmlFor="Trekking Time">Trekking Time</label>
                <input
                  type="time"
                  name="trek_time"
                  value={onTime}
                  onChange={(e) => {
                    e.preventDefault();
                    setOnTime(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="pr-av-btn">
              <button type="submit">Request Price & Availability</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HikerInfo;
