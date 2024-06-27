"use client"; // This is a client component 👈🏽
import { useState, useEffect } from "react";
import "./results.css";
import PieChart from "./components/pie-chart";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store/types";
import PatentCard from "./components/patent-card";

export default function Results() {
  const patents = useSelector(
    (state: AppState) => state.similarPatents.value
  ).slice(0, 1);

  return (
    <div className="container">
      {patents.map((patent, index) => (
        <PatentCard patent={patent} key={index} />
      ))}
    </div>
  );
}
