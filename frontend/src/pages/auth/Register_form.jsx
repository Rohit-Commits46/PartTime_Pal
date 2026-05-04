import React from "react";
import Input_field from "../../components/Others/Input_field";
import googleIcon from "../../assets/google-icon (2).svg";
import { Link } from "react-router-dom";
export default function Register_form() {
  return (
    <div className=" mx-[80px]">
      <div className="text-[24px]">Registration form</div>
      <div className="text-[12px] font-light">
        Register to apply for jobs of your choice all over the world
      </div>
      <div className=" mt-[50px] px-[20px] h-[82vh] rounded-md shadow-2xl py-[30px]">
        <div className="flex flex-col gap-[20px] mb-[40px]">
          <div>
            <Input_field
              type="text"
              content={<p>Full Name</p>}
              placetext="Enter Your Full Name"
            />
          </div>
          <div>
            <Input_field
              type="email"
              content={<p>Email ID</p>}
              placetext="Enter email id"
            />
          </div>
          <div>
            <Input_field
              type="text"
              content={<p>Password</p>}
              placetext="(Minimum 6 characters)"
            />
          </div>
          <div>
            <Input_field
              type="text"
              content={<p>Mobile Number</p>}
              placetext="Enter Your mobile number"
            />
          </div>
        </div>
        <div>
          <input type="checkbox" />
          <span className="tracking-wider opacity-50">
            {" "}
            send me important updates and promotions via sms,email and whatsapp
          </span>
        </div>
        <button className="h-[50px] w-[10vw] p-[10px] bg-purple-800 text-white font-bold mt-[10px] rounded-[5px]">
          Register
        </button>
        <div className="flex gap-[20px] mt-[20px]">
          <p className="opacity-50">signup with</p>
          <img src={googleIcon} className="w-[30px] h-[30px]" />
        </div>
      </div>
    </div>
  );
}
