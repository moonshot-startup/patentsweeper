"use client"; // This is a client component 👈🏽
import { useState, useEffect } from "react";
import "./results.css";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store/types";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { IoMdDownload } from "react-icons/io";

export default function Results() {
  const reduxPatents = useSelector(
    (state: AppState) => state.similarPatents.value
  );
  const pdfFormData = useSelector((state: AppState) => state.pdfData.value);
  const [patents, setPatents] = useState(structuredClone(reduxPatents));
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [_, setToggle] = useState(false);

  const arr = structuredClone(patents);
  const forceUpdate = () => {
    setToggle((prev) => !prev);
  };
  let enriching: boolean = false;

  useEffect(() => {
    const enrichPatents = async () => {
      for (let i = 0; i < patents.length; i++) {
        const patent = patents[i];
        const formData = pdfFormData;
        formData?.append(
          "patent_application_number",
          patent.patentApplicationNumber
        );
        try {
          const response = await fetch(`http://localhost:8000/patent/compare`, {
            method: "POST",
            body: pdfFormData,
          });

          if (response.status === 200) {
            const data = await response.json();
            arr[i] = { ...patents[i], ...data };
            setPatents(arr);
            forceUpdate();
          } else {
            console.log(`Error ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching status:", error);
        }
      }
    };
    if (!enriching) {
      enriching = true;
      enrichPatents();
    }

    return () => {};
  }, []);

  return (
    <div className="container" style={{ height: "unset" }}>
      {patents.map((patent, index) => (
        <div
          key={index}
          style={{ position: "relative" }}
          className="max-w-2xl w-full rounded overflow-hidden shadow-lg p-6 bg-white"
        >
          <h2 className="text-xl font-bold mb-4">{patent.inventionTitle}</h2>
          {!patent.explanation ? (
            <div className="flex justify-center items-center h-16">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="mb-4">
              <a
                style={{ position: "absolute", top: "8px", right: "8px" }}
                href={patent.filelocationURI}
                target="_blank"
              >
                <IoMdDownload />
              </a>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Unique Score
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {(100 - (patent.similarity_score ?? 0)).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={` h-2.5 rounded-full ${
                    patent.similarity_score! <= 33
                      ? "bg-green-400"
                      : patent.similarity_score! <= 66
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                  style={{
                    width: `${(100 - (patent.similarity_score ?? 0)).toFixed(
                      0
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex == index ? -1 : index)
                  }
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  {expandedIndex == index ? "Hide Details" : "Show Details"}
                  {expandedIndex == index ? (
                    <ChevronUp className="ml-1" />
                  ) : (
                    <ChevronDown className="ml-1" />
                  )}
                </button>

                {expandedIndex == index && (
                  <div className="mt-2 p-3 bg-gray-100 rounded">
                    <span className="text-sm text-gray-700">
                      {patent.explanation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
