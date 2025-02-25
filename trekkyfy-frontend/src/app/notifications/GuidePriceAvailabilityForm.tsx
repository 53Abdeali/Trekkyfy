"use client";
import React, { useEffect, useState } from "react";
import { PriavlRequest } from "@/app/hike-components/PriceAvailabilityPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faClose,
  faIndianRupee,
} from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/GuideAvailablityForm.css";
import axiosInstance from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface GuidePriceAvailabilityFormProps {
  request: PriavlRequest & {
    trek_place: string;
    trek_date: string;
    trek_time: string;
    hiking_members: number;
    hiker_username: string;
    hiker_id: string;
  };
  onClose: () => void;
}

interface DecodedToken{
  guide_id?:string;
}

const GuidePriceAvailabilityForm: React.FC<GuidePriceAvailabilityFormProps> = ({
  request,
  onClose,
}) => {
  const {
    hiker_username,
    hiker_id,
    trek_place,
    trek_date,
    trek_time,
    hiking_members,
  } = request || {};

  // Form fields state
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("Available");
  const [partialTime, setPartialTime] = useState("");
  const [unavailableOption, setUnavailableOption] = useState("");
  const [unavailabilityReason, setUnavailabilityReason] = useState("");
  const [guideId, setGuideID] = useState<string | null>(null);
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.guide_id) {
        setGuideID(decoded.guide_id);
      }
    } catch (error) {
      console.log("Some error ocurred while decoding: ", error);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/priavl-guide-res", {
        guide_id: guideId,
        hiker_id: hiker_id,
        price: price,
        availability: availability,
        partialTime: partialTime,
        unavailableOption: unavailableOption,
        unavailabilityReason: unavailabilityReason,
      });
      if (res.status === 200) {
        toast.success("Response has been generated successfully!");
      } else {
        toast.error("Unable to proceed the request.");
      }
    } catch (err) {
      console.log("Some Error Occured!", err);
    }
    console.log({
      price,
      availability,
      partialTime,
      unavailableOption,
      unavailabilityReason,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-close-btn">
          <button className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="modal-content">
          <p>
            {`Hey, I ${hiker_username} - ${hiker_id} with my ${hiking_members} members wants to know about the pricing and availability for the ${trek_place} on ${trek_date} from ${trek_time} to whole day (12 hours).`}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-main-guide">
              <div className="form-group">
                <label>Price for one day</label>
                <div className="price-ip">
                  <FontAwesomeIcon
                    className="price-icon"
                    icon={faIndianRupee}
                  />
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter your price"
                    name="price"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Availability:</label>
                <div className="guide-radio">
                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="Available"
                      checked={availability === "Available"}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    Available
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="Unavailable"
                      checked={availability === "Unavailable"}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    Unavailable
                  </label>
                </div>
              </div>
            </div>
            {availability === "Unavailable" && (
              <>
                <div className="form-main-guide">
                  <div className="form-group">
                    <label>
                      For what time will you be available (if partially
                      available):
                    </label>
                    <div className="price-ip">
                      <FontAwesomeIcon className="price-icon" icon={faClock} />
                      <input
                        type="text"
                        value={partialTime}
                        onChange={(e) => setPartialTime(e.target.value)}
                        placeholder="e.g., 10:00-14:00"
                        name="partialTime"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>I am unavailable for this:</label>
                    <select
                      value={unavailableOption}
                      onChange={(e) => setUnavailableOption(e.target.value)}
                      name="unavailableOption"
                    >
                      <option value="">Select</option>
                      <option value="time">Time</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                </div>
                {unavailableOption && (
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Reason for unavailability:</label>
                    <textarea
                      value={unavailabilityReason}
                      onChange={(e) => setUnavailabilityReason(e.target.value)}
                      placeholder="Enter your reason"
                      rows={4}
                      cols={5}
                      name="unavailableReason"
                    />
                  </div>
                )}
              </>
            )}
            <div className="guide-btn">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuidePriceAvailabilityForm;
