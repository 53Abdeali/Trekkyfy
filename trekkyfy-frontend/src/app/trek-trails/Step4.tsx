// frontend/components/steps/Step4.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";

interface Step4Props {
  hikerDetails: {
    hiker_id: string;
    hiker_username: string;
    phone: string;
    email: string;
  };
  trekDetails: {
    id: number;
    name: string;
    state: string;
    duration_days: number;
  };
  guideDetails: {
    guide_id: string;
    username?: string;
    guide_phone: string;
  };
  handleBack: () => void;
  handleClose: () => void;
}

const Step4: React.FC<Step4Props> = ({
  hikerDetails,
  trekDetails,
  guideDetails,
  handleBack,
  handleClose,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const handleConfirmBooking = async () => {
    if (!termsAccepted) return;
    setBookingLoading(true);
    setError("");

    const bookingData = {
      hiker_id: hikerDetails.hiker_id,
      trek_id: trekDetails.id,
      guide_id: guideDetails.guide_id,
      hiker: hikerDetails,
      trek: trekDetails,
      guide: guideDetails,
    };

    try {
      const response = await axiosInstance.post("/confirmBooking", bookingData);
      alert("Booking confirmed! Your booking id: " + response.data.booking_id);
      handleClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Axios error fetching trek details or weather data:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "Error confirming booking");
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontFamily: "Montserrat, sans-serif",
          marginBottom: "1rem",
          color: "#212b43",
        }}
      >
        Confirm & Book
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: "1rem",
          fontFamily: "Montserrat, sans-serif",
          color: "#212b43",
        }}
      >
        Please review your booking details below:
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            marginBottom: "0.5rem",
            color: "#212b43",
          }}
        >
          Hiker Details:
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Montserrat, sans-serif", color: "#212b43" }}
        >
          Name: {hikerDetails.hiker_username}
          <br />
          Phone: {hikerDetails.phone}
          <br />
          Email: {hikerDetails.email}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#212b43",
          }}
        >
          Trek Details:
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Montserrat, sans-serif", color: "#212b43" }}
        >
          Trek Name: {trekDetails.name}
          <br />
          State: {trekDetails.state}
          <br />
          Duration: {trekDetails.duration_days} days
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#212b43",
          }}
        >
          Guide Details:
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Montserrat, sans-serif", color: "#212b43" }}
        >
          Guide: {guideDetails.username || "N/A"}
          <br />
          Contact: {guideDetails.guide_phone}
        </Typography>
      </Box>

      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{ marginBottom: "1rem", fontFamily: "Montserrat, sans-serif" }}
        >
          {error}
        </Typography>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="I have read and agree to the Terms & Conditions"
        sx={{ fontFamily: "Montserrat, sans-serif", color: "#212b43" }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!termsAccepted || bookingLoading}
          onClick={handleConfirmBooking}
          sx={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {bookingLoading ? "Confirming..." : "Confirm & Book"}
        </Button>
      </Box>
    </Paper>
  );
};

export default Step4;
