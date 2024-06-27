"use client"; // This is a client component 👈🏽
import { useState, useEffect } from "react";
import "./results.css";
import PieChart from "./components/pie-chart";

export default function Results() {
  const [expandIndex, setExpandIndex] = useState(-1);

  const toggleExpand = (index) => {
    if (expandIndex == index) {
      setExpandIndex(-1);
    } else {
      setExpandIndex(index);
    }
  };
  const patents = [
    {
      title: "Flavor Concert Ticket",
      similarity: 75,
      novelty: 44,
      applicability: 18,
      marketability: 99,
      explanation: "This is a very good idea",
    },
    {
      title: "Flavored Guitar pick",
      similarity: 35,
      novelty: 100,
      applicability: 69,
      marketability: 0,
    },
  ];
  return (
    <div className="container">
      {patents.map((patent, index) => (
        <div className="card" key={index}>
          <div className="title">{patent.title}</div>
          <div className="charts">
            <PieChart percentage={patent.similarity} title="Similarity" />
            <PieChart percentage={patent.novelty} title="Novelty" />
            <PieChart percentage={patent.applicability} title="Applicability" />
            <PieChart percentage={patent.marketability} title="Marketability" />
          </div>
          {expandIndex == index && (
            <div className="details">
              Here is some more detailed content that appears when the card is
              expanded.
            </div>
          )}
          <button onClick={() => toggleExpand(index)}>
            {expandIndex == index ? "Collapse" : "Expand"}
          </button>
        </div>
      ))}
    </div>
  );
}
