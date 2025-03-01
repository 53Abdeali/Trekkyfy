"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/utils/axiosConfig";
import GuideCard from "@/app/guide/guideCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

interface Guide {
  id: string;
  guide_id: string;
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

interface Hiker {
  hiker_id: string;
  hiker_username: string;
}

interface Step3Props {
  trek_place: string;
  trek_state: string;
  hiker_state: string;
  hiker: Hiker | null;
  handleNext: (data: Guide) => void;
  handleBack: () => void;
}

const Step3: React.FC<Step3Props> = ({
  trek_place,
  trek_state,
  hiker_state,
  hiker,
  handleNext,
  handleBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [guideProfiles, setGuideProfiles] = useState<Guide[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const token = Cookies.get("access_token");

  useEffect(() => {
    const fetchGuideAvailability = async () => {
      try {
        const response = await axiosInstance.get("/checkGuideAvailability", {
          params: { trek_place, trek_state, hiker_state },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGuideProfiles(response.data.guides);
        setError("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Axios error fetching trek details or weather data:",
            err.response?.data || err.message
          );
        } else {
          console.error("Unexpected error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuideAvailability();
  }, [trek_place, trek_state, hiker_state, token]);

  const handleProceed = () => {
    if (guideProfiles && guideProfiles.length > 0) {
      handleNext(guideProfiles[0]);
    } else {
      toast.error("No guide available, please select a different trek.");
      router.push("/trek-trails");
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: "#fff",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
          }}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="3x"
            spin
            color="#212b43"
          />
          <Typography variant="h6" mt={2} color="#212b43">
            Finding the Guide...
          </Typography>
        </Box>
      ) : (
        <Box>
          {guideProfiles && guideProfiles.length > 0 ? (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#212b43", textAlign: "center", mb: 2 }}
              >
                Guide(s) Found:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                {guideProfiles.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} hiker={hiker} />
                ))}
              </Box>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  sx={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProceed}
                  sx={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Proceed
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                color="error"
                gutterBottom
                sx={{ textAlign: "center", mb: 2 }}
              >
                {error || "No guide available, please select a different trek."}
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  sx={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push("/trek-trails")}
                  sx={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Select Different Trek
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Step3;
