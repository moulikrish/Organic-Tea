import React from "react";
import aboutImage from "../assets/green-tea.jpg"; // Add an image in your assets folder

const About = () => {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700 mb-4 font-Outfit">
            About Organic Tea
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We are passionate about bringing you the finest organic teas from
            across the world. Our teas are handpicked and crafted with care to
            deliver a refreshing and healthy experience in every cup.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="w-full h-full">
            <img
              src={aboutImage}
              alt="Organic Tea"
              className="rounded-xl shadow-lg w-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-green-800">
              Our Mission
            </h3>
            <p className="text-gray-700">
              To promote a healthier lifestyle by providing premium organic
              teas that are ethically sourced and sustainably grown.
            </p>

            <h3 className="text-2xl font-semibold text-green-800">
              Why Choose Us?
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>100% Organic and Natural Ingredients</li>
              <li>Ethically Sourced from Trusted Farmers</li>
              <li>Handpicked and Carefully Processed</li>
              <li>Wide Range of Flavors & Varieties</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
