import React from "react";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto grid grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">PartTime Pal</h4>
            <p className="text-gray-400">Connect. Work. Grow.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 text-center border-t border-gray-700 pt-4">
          <p className="text-gray-400">
            © 2024 PartTime Pal. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
