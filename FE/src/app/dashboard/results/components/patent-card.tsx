// PieChart.js
import { AppState, Patent } from "@/app/store/types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function PatentCard({ patent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pdfFormData = useSelector((state: AppState) => state.pdfData.value);
  const [patentState, setPatentState] = useState(patent);
  const [isLoading, setIsLoading] = useState(true);

  pdfFormData?.append(
    "patent_application_number",
    patentState.patentApplicationNumber
  );

  useEffect(() => {
    const enrichPatent = async () => {
      console.log("enrich");
      try {
        const response = await fetch(`http://localhost:8000/patent/compare`, {
          method: "POST",

          body: pdfFormData,
        });
        if (response.status === 200) {
          const data = await response.json();
          setPatentState({ ...patentState, ...data });
          setIsLoading(false);
        } else {
          console.log(`Error ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    enrichPatent();

    return () => {};
  }, []);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">{patentState.title}</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-16">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Similarity Score
            </span>
            <span className="text-sm font-medium text-gray-700">
              {patentState.similarity_score.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${patentState.similarity_score}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
          {isExpanded ? (
            <ChevronUp className="ml-1" />
          ) : (
            <ChevronDown className="ml-1" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <span className="text-sm text-gray-700">
              {patentState.explanation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
