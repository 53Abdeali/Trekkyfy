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
          "Axios error confirming booking:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "Error confirming booking");
      } else {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: "2rem",
        borderRadius: "8px",
        width: { xs: "95%", sm: 600 },
        mx: "auto",
        fontFamily: "Montserrat, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: "1rem",
          color: "#212b43",
          fontSize: { xs: "1.8rem", sm: "2rem" },
        }}
      >
        Confirm & Book
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: "1rem",
          color: "#212b43",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        Please review your booking details below:
      </Typography>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          p: "1rem",
          mb: "1rem",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ mb: "0.5rem", color: "#212b43", fontWeight: 600 }}
        >
          Hiker Details:
        </Typography>
        <Typography variant="body2" sx={{ color: "#212b43" }}>
          Name: {hikerDetails.hiker_username}
          <br />
          Phone: {hikerDetails.phone}
          <br />
          Email: {hikerDetails.email}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mt: "1rem", mb: "0.5rem", color: "#212b43", fontWeight: 600 }}
        >
          Trek Details:
        </Typography>
        <Typography variant="body2" sx={{ color: "#212b43" }}>
          Trek Name: {trekDetails.name}
          <br />
          State: {trekDetails.state}
          <br />
          Duration: {trekDetails.duration_days} days
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mt: "1rem", mb: "0.5rem", color: "#212b43", fontWeight: 600 }}
        >
          Guide Details:
        </Typography>
        <Typography variant="body2" sx={{ color: "#212b43" }}>
          Guide: {guideDetails.username || "N/A"}
          <br />
          Contact: {guideDetails.guide_phone}
        </Typography>
      </Box>

      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{ mb: "1rem", textAlign: "center" }}
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
        sx={{
          color: "#212b43",
          fontSize: { xs: "0.8rem", sm: "1rem" },
          mb: "1rem",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-evenly",
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!termsAccepted || bookingLoading}
          onClick={handleConfirmBooking}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {bookingLoading ? "Confirming..." : "Confirm & Book"}
        </Button>
      </Box>
    </Paper>
  );
};

export default Step4;
