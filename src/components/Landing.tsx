import React from "react";
import img1 from "../assets/main-app-preview.png"; // Ensure the path is correct

const Landing = () => {
  return (
    <section className="bg-white min-h-screen flex ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900">
            Get fit and healthy from the comfort of home without gym or trainers.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            BodyBuddy is an AI-powered fitness web platform for people who want to exercise 
            in their own homes or on the go, at their own pace.
          </p>
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-xl font-medium text-lg shadow-md hover:bg-gray-800 transition">
            Download Proposal
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={img1} // Use the imported image
            alt="BodyBuddy App Preview"
            className="w-full max-w-md md:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
