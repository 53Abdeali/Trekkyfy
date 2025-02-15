"use client";

import "@/app/stylesheet/complete-guide-profile.css";
import Image from "next/image";
import cgp from "@/app/Images/gcp.png";
import Link from "next/link";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faUpload } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosConfig";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CompleteGuideProfile() {
  const router = useRouter();
  const [guideFields, setGuideFields] = useState({
    guide_city: "",
    guide_district: "",
    guide_state: "",
    guide_phone: "",
    guide_whatsapp: "",
    guide_experience: "",
    guide_languages: "",
    guide_speciality: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGuideFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedFile(null);
  };

  const handleGuideUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let guidePhotoUrl = "";
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(
          "https://trekkyfy.onrender.com/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadData = await uploadResponse.json();
        guidePhotoUrl = uploadData.url;
        console.log(guidePhotoUrl);
      }

      const payload = {
        guide_city: guideFields.guide_city,
        guide_district: guideFields.guide_district,
        guide_state: guideFields.guide_state,
        guide_phone: guideFields.guide_phone,
        guide_whatsapp: guideFields.guide_whatsapp,
        guide_experience: guideFields.guide_experience,
        guide_languages: guideFields.guide_languages,
        guide_speciality: guideFields.guide_speciality,
        guide_photo: guidePhotoUrl,
      };

      const token = Cookies.get("access_token");
      const response = await axiosInstance.post(
        "https://trekkyfy.onrender.com/api/guide",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        router.push("/");
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (err) {
      console.error("Error updating guide profile:", err);
    }
  };

  return (
    <div>
      <div className="gp-head">
        <h1>Trekkyfy</h1>
      </div>
      <div className="gcp-image">
        <Image className="gcp-img" src={cgp} alt="Complete your profile" />
      </div>
      <div className="guide-inputs">
        <form onSubmit={handleGuideUpdate}>
          <div className="guide-input">
            <label htmlFor="guide_city">Your City</label>
            <input
              type="text"
              name="guide_city"
              placeholder="Please enter your City"
              value={guideFields.guide_city}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_state">Your State</label>
            <input
              type="text"
              name="guide_state"
              placeholder="Please enter your State"
              value={guideFields.guide_state}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_district">Your District</label>
            <input
              type="text"
              name="guide_district"
              placeholder="Please enter your District"
              value={guideFields.guide_district}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_phone">Your Phone Number</label>
            <input
              type="text"
              name="guide_phone"
              placeholder="Please enter your Phone Number"
              value={guideFields.guide_phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_whatsapp">Your Whatsapp Number</label>
            <input
              type="text"
              name="guide_whatsapp"
              placeholder="Please enter your Whatsapp Number"
              value={guideFields.guide_whatsapp}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_experience">Your Experience</label>
            <textarea
              name="guide_experience"
              rows={4}
              placeholder="Describe your experience here"
              value={guideFields.guide_experience}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_languages">Your Known Languages</label>
            <textarea
              name="guide_languages"
              rows={4}
              placeholder="Write your known languages"
              value={guideFields.guide_languages}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_speciality">Your Speciality</label>
            <textarea
              name="guide_speciality"
              rows={4}
              placeholder="Describe your Speciality here"
              value={guideFields.guide_speciality}
              onChange={handleInputChange}
            />
          </div>
          <div className="guide-input">
            <label htmlFor="guide_photo">Your Photograph</label>
            <input
              type="file"
              onChange={handleFileChange}
              ref={inputRef}
              style={{ display: "none" }}
            />
            <button
              className="file-btn"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onChooseFile();
              }}
            >
              <span>
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <span>Upload Photograph</span>
            </button>
            {selectedFile && (
              <div className="selected-file">
                <p>{selectedFile.name}</p>
                <button onClick={removeFile}>
                  <FontAwesomeIcon icon={faDeleteLeft} />
                </button>
              </div>
            )}
          </div>
          <div className="guide-check-input">
            <div className="guide-check">
              <input type="checkbox" id="terms" />
              <span>
                I have read the{" "}
                <Link className="guide-link" href="/terms-and-conditions">
                  Terms And Conditions
                </Link>
              </span>
            </div>
            <div className="guide-button">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
