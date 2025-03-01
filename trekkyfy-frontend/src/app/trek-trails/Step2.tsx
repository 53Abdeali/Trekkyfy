// frontend/components/steps/Step2.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";
import "@/app/trek-trails/styles/Step1.css";

interface TrekDetails {
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

interface Step2Props {
  trail: TrekDetails;
  handleNext: (data: TrekDetails) => void;
  handleBack: () => void;
}

interface WeatherData {
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
    humidity: number;
  };
}

const Step2: React.FC<Step2Props> = ({ trail, handleNext, handleBack }) => {
  const [trekDetails, setTrekDetails] = useState<TrekDetails | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrekDetails = async () => {
      try {
        const response = await axiosInstance.get("/explore", {
          params: { limit: 1 },
        });
        if (response.data.length > 0) {
          const trail: TrekDetails = response.data[0];
          setTrekDetails(trail);
          const city = trail.nearest_city;
          const API_KEY = "21218d6a5c444d6f238c4a3258f63305";
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
          );
          setWeather(weatherResponse.data);
        }
      } catch (error) {
        console.error("Error fetching trek details or weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrekDetails();
  }, []);

  if (loading)
    return <Typography variant="body1">Loading trek details...</Typography>;

  const trekData: TrekDetails = trekDetails || trail;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {trail?.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {trail?.description}
      </Typography>

      {weather && (
        <Box mt={2}>
          <Typography variant="subtitle1">
            Weather in {trail?.nearest_city}: {weather.weather[0].description}
          </Typography>
          <Typography variant="body2">
            Temperature: {weather.main.temp}°C, Humidity:{" "}
            {weather.main.humidity}%
          </Typography>
        </Box>
      )}

      <Box mt={3} display="flex" justifyContent="space-evenly">
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={() => handleNext(trekData)}>
          Guide Allot
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
