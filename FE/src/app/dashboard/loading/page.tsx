"use client"; // This is a client component 👈🏽
import { useState, useEffect, use } from "react";
import Spinner from "react-spinners/SyncLoader";
import "./loading.css";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store/types";
import { useRouter } from "next/navigation";

export default function Loading() {
  const keywords = useSelector((state: AppState) => state.keywords.value);
  const queryId = useSelector((state: AppState) => state.queryId.value);
  const [isPainting, setIsPainting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

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
    }, 1000);

    return () => clearInterval(interval);
  }, [isPainting, keywords.length]);

  useEffect(() => {
    const pollStatus = async () => {
      while (true) {
        try {
          const response = await fetch(`http://localhost:3000/status`);
          if (response.status === 200) {
            console.log("Status 200 received!");
            break; // Exit the loop on successful response
          } else {
            console.log(`Status ${response.status} - Retrying in 2 seconds...`);
          }
        } catch (error) {
          console.error("Error fetching status:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      }
    };

    pollStatus();
    console.log("done");
    // Clean-up function (optional)
    return () => {
      // Optionally, you can clean up any resources or timers here
    };
  }, []); // Empty dependency array means this effect runs only once

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
