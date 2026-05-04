import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/Others/JobCard";
const Findjobs = () => {
  const recommendations = useSelector((state) => state.recommendation);
  console.log(recommendations);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <h1 className="text-center text-3xl font-bold text-gray-800">
        Job Recommendations
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Explore the jobs tailored to your preferences.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12">
        {recommendations ? (
          recommendations.map((job, index) => <JobCard key={index} {...job} />)
        ) : (
          <p className="text-center text-gray-500">
            No recommendations available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Findjobs;
