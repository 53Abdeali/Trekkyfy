"use client";
import React, { useState } from "react";
import { Box, Modal, Step, StepLabel, Stepper } from "@mui/material";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

const steps = [
  "Hiker Details",
  "Trek Info",
  "Guide Allocation",
  "Confirm & Book",
];

interface Trail {
  id: number;
  name: string;
  state: string;
  nearest_city: string;
  difficulty_level: "Easy" | "Moderate" | "Challenging" | "Difficult";
  duration_days: number;
  best_time_to_visit: string;
  description: string;
  guide_availability: boolean;
  Links: string;
}

interface BookingStepperProps {
  hiker_id: string;
  trail: Trail;
  open: boolean;
  handleClose: () => void;
}

export interface HikerDetails {
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
  memberDetails?: { email: string; whatsapp: string }[];
}

export interface TrekDetails {
  id: number;
  name: string;
  state: string;
  nearest_city: string;
  difficulty_level: "Easy" | "Moderate" | "Challenging" | "Difficult";
  duration_days: number;
  best_time_to_visit: string;
  description: string;
  guide_availability: boolean;
  Links: string;
}

export interface Guide {
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

const BookingStepper: React.FC<BookingStepperProps> = ({
  hiker_id,
  open,
  handleClose,
  trail,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hikerDetails, setHikerDetails] = useState<HikerDetails | null>(null);
  const [trekDetails, setTrekDetails] = useState<TrekDetails | null>(null);
  const [guideDetails, setGuideDetails] = useState<Guide | null>(null);

  const handleNext = (data?: HikerDetails | TrekDetails | Guide) => {
    if (activeStep === 0 && data) {
      setHikerDetails(data as HikerDetails);
    }
    if (activeStep === 1 && data) {
      setTrekDetails(data as TrekDetails);
    }
    if (activeStep === 2 && data) {
      setGuideDetails(data as Guide);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#212b43",
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <Step1
              hiker_id={hiker_id}
              onNext={(data: HikerDetails) => {
                handleNext(data);
              }}
            />
          )}
          {activeStep === 1 && (
            <Step2
              trail={trail}
              handleNext={(data: TrekDetails) => {
                handleNext(data);
              }}
              handleBack={handleBack}
            />
          )}
          {activeStep === 2 && hikerDetails && trekDetails && (
            <Step3
              trek_place={trekDetails.nearest_city}
              trek_state={trekDetails.state}
              hiker_state={hikerDetails.state}
              hiker={hikerDetails}
              handleNext={(data: Guide) => {
                handleNext(data);
              }}
              handleBack={handleBack}
            />
          )}
          {activeStep === 3 && hikerDetails && trekDetails && guideDetails && (
            <Step4
              hikerDetails={hikerDetails}
              trekDetails={trekDetails}
              guideDetails={guideDetails}
              handleBack={handleBack}
              handleClose={handleClose}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingStepper;
