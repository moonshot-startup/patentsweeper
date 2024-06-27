import { useRouter } from "next/navigation";
import React from "react";
import { FaRocket } from "react-icons/fa";
import FaPlay from "react-icons/fa";
import HammerIcon  from '../icons/hammer';

// import './HomePage.css';

const HomePage: React.FC = () => {
  const router = useRouter();

  const getStarted = () => {
    router.push("dashboard/upload");
  };



  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <main className="container mx-auto my-12 px-4 flex-grow">
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8 flex justify-left">
        <HammerIcon  /> 
        <div>
        <h2 className="text-2xl font-semibold mb-4">
        Get Started with Ease  </h2>
          <p>
            Our platform leverages cutting-edge Large Language Models (LLM) to
            provide comprehensive comparisons of your patent against a vast
            database of existing patents. Ensure the originality and uniqueness
            of your intellectual property with unmatched accuracy and speed.
          </p>
          </div> 
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <p>
            With our state-of-the-art LLM technology, you can trust that our
            comparisons are thorough and precise. Our tool is designed to save
            you time and provide peace of mind, knowing that your innovation
            stands out in the competitive landscape.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started with Ease</h2>
          <p>
            Begin your journey towards patent uniqueness by simply uploading
            your patent details. Our user-friendly interface and powerful AI do
            the rest, delivering quick and reliable results that you can trust.
          </p>
        </section>

        <div className="text-center mt-12">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={getStarted}
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
