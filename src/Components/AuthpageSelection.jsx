import React, { useState,useEffect } from "react";
import axios from "axios";
import "../CSS/authpagestyle.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function AuthpageSelection() {
  const [pin, setPin] = useState(""); 
  const [error, setError] = useState(""); 
  const [eventData, setEventData] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          "https://web.snoxpro.com/public/api/v1/gallery/a8f1cf41-8438-442e-8555-1f0863326ac1"
        );
        setEventData(response.data.event || response.data); 
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("Failed to load event data.");
      }
    };

    fetchEvent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://web.snoxpro.com/public/api/v1/auth/selection/verify-pin/",
        {
          pin,
          event_uuid: "a8f1cf41-8438-442e-8555-1f0863326ac1", 
        }
      );
      const token = response.data.token; 
      localStorage.setItem("authSelToken", token);
      console.log("Token stored successfully:", token);
      navigate(`/selection/${eventData?.uuid}`, { replace: true });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Enter a valid PIN!");
      } else {
        setError("Failed to connect to the server. Please try again later.");
      }
      console.error("Error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div>
        <img className="logo-style" src={logo} alt="Logo" />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: eventData?.image ? `url(${eventData.image})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      ></div>

      <div className="content">
        <h2 className="title">
          {eventData ? `${eventData.bride_name || ""} & ${eventData.groom_name || ""}` : "Loading..."}
        </h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="input"
            placeholder="Enter PIN here"
            value={pin}
            onChange={(e) => setPin(e.target.value)} 
          />
          <button type="submit" className="button">CONTINUE</button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default AuthpageSelection;
