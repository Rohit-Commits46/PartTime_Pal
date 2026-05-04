import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  return (
    <>
      <div className="flex  w-[100%] flex-row justify-between items-center shadow sticky z-50 top-0 bg-white rounded-lg">
        <div className="p-2 pl-5">
          <p className="text-purple-800 text-[20px] font-bold">PartTime-pal</p>
        </div>
        <div className="p-2 flex flex-row gap-25 justify-center ">
          <div>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </div>
          <div>
            <Link to="/" className="hover:underline">
              Find Jobs
            </Link>
          </div>
          <div>
            <Link to="/" className="hover:underline">
              About Us
            </Link>
          </div>
          <div>
            <Link to="/chat" className="hover:underline">
              chat
            </Link>
          </div>
        </div>
        <div className="p-2 flex flex-row gap-3 justify-center">
          <div>
            <Link to="/contact-us">
              <button className="h-10 w-32 border-3 border-purple-400 rounded-md">
                Contact Us
              </button>
            </Link>
          </div>
          <div>
            {/* Open Modal on Click */}
            <button className="h-10 w-32 bg-purple-600 text-white rounded-md hover:bg-purple-800">
              LogOut
            </button>
          </div>
        </div>
      </div>

      {/* Render the Modal
      {isModalOpen && <Initial_Page closeModal={() => setIsModalOpen(false)} />} */}
    </>
  );
};

export default Navbar1;
