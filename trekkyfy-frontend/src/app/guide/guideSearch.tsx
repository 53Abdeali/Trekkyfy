"use client";

import { useEffect, useState } from "react";

export interface FilterCriteria {
  state: string;
  city: string;
}

interface GuideSearchProps {
  onFilterChange: (filters: FilterCriteria) => void;
}

const GuideSearch: React.FC<GuideSearchProps> = ({ onFilterChange }) => {
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const filters: FilterCriteria = {
      state: stateFilter,
      city: cityFilter,
    };
    onFilterChange(filters);
  }, [stateFilter, cityFilter, onFilterChange]);

  return (
    <div className="guide-search">
      <input
        type="text"
        placeholder="Filter by state"
        value={stateFilter}
        onChange={(e) => setStateFilter(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <input
        type="text"
        placeholder="Filter by city"
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
        style={{ marginLeft: "10px" }}
      />
    </div>
  );
};

export default GuideSearch;
