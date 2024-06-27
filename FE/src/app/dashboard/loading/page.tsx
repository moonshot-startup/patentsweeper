"use client"; // This is a client component 👈🏽
import { useState, useEffect, use } from "react";
import Spinner from "react-spinners/SyncLoader";
import "./loading.css";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store/types";

export default function Loading() {
  const keywords = useSelector((state: AppState) => state.keywords.value);
  const [isPainting, setIsPainting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= keywords.length) {
          setIsPainting(!isPainting);
          return 0;
        }
        return newIndex;
      });
      setIntervalTime(Math.max(Math.random() * 4000, 1000));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPainting, keywords.length, intervalTime]);

  return (
    <div className="loading-container">
      Scanning keywords, please wait patiently...
      <Spinner className="loader" color="#1976D2" speedMultiplier={0.75} />
      <div className="keywords-container">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="keyword"
            style={{
              backgroundColor: getColor(index, currentIndex, isPainting),
            }}
          >
            {keyword}
          </div>
        ))}
      </div>
    </div>
  );
}

const getColor = (index, currentIndex, isPainting) => {
  if (isPainting) {
    return index <= currentIndex ? "#1976D2" : "white";
  } else {
    return index <= currentIndex ? "white" : "#1976D2";
  }
};
