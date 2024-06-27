"use client"; // This is a client component 👈🏽
import { useState, useEffect, use } from "react";
import Spinner from "react-spinners/SyncLoader";
import "./loading.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/app/store/types";
import { useRouter } from "next/navigation";
import { update as bestPatentsUpdate } from "../../store/bestPatentsSlice";

export default function Loading() {
  const keywords = useSelector((state: AppState) => state.keywords.value);
  const [isPainting, setIsPainting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
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
    const fetchPatents = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/patent/search-best-patents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keywords }),
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          dispatch(bestPatentsUpdate(data));
          router.push("/dashboard/results");
        } else {
          console.log(`Error ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    fetchPatents();
    return () => {};
  }, []); // Empty dependency array means this effect runs only once

  return (
    <div className="loading-container">
      <div>Scanning the web for patents with the following keywords</div>
      <div>please wait patiently...</div>
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
