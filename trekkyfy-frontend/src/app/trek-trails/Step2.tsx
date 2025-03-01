"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";
import "@/app/trek-trails/styles/Step1.css";

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

interface Step2Props {
  trail: TrekDetails;
  handleNext: (data: TrekDetails) => void;
  handleBack: () => void;
}

interface WeatherData {
  weather: { description: string }[];
  main: { temp: number; humidity: number };
}

const Step2: React.FC<Step2Props> = ({ trail, handleNext, handleBack }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = trail.nearest_city;
        const API_KEY = "21218d6a5c444d6f238c4a3258f63305";
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        setWeather(weatherResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [trail]);

  if (loading)
    return <Typography variant="body1">Loading trek details...</Typography>;

  const trekData: TrekDetails = trail;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {trekData.name}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {trekData.description}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Guide Availability: {trekData.guide_availability ? "Yes" : "No"}
      </Typography>
      {weather && (
        <Box mt={2}>
          <Typography variant="subtitle1">
            Weather in {trekData.nearest_city}: {weather.weather[0].description}
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
