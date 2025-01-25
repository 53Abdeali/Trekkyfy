"use client"
import { useEffect, useState } from "react";

interface Data {message : string}

export default function TrekYatra() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async() => {
        const response = await fetch("http://127.0.0.1:5000");
        const result: Data = await response.json();
        setData(result)
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Api Test</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
}
