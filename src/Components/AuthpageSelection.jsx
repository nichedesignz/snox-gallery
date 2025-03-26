import React, {useState, useEffect} from "react";
import axios from "axios";
import "../CSS/authpagestyle.css";
import logo from "../assets/logo.png";
import {useNavigate} from "react-router-dom";
import CONFIG from '../config';

function AuthpageSelection() {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [eventData, setEventData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {

            try {
                const eventId = localStorage.getItem('eventUUID')
                console.log("Event Id " + eventId)
                const response = await axios.get(`${CONFIG.API_BASE_URL}public/api/v1/selection/${eventId}/`);
                console.log(response.data.result)
                if (response.data.result) setEventData(response.data.data.event);
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
                `${CONFIG.API_BASE_URL}public/api/v1/auth/selection/verify-pin/`,
                {
                    pin,
                    event_id: localStorage.getItem('eventUUID')
                }
            );
            if (response.data.result) {
                const token = response.data.data.token;
                localStorage.setItem("authSelToken", token);
                console.log("Token stored successfully:", token);
                console.log(`/selection/${eventData?.id}`)
                navigate(`/selection/${eventData?.id}`, {replace: true});
            } else {
                setError("Enter a valid PIN!");
            }
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
                <img className="logo-style" src={logo} alt="Logo"/>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: eventData?.cover_image ? `url(${eventData.cover_image})` : "none",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    zIndex: 1,
                }}
            ></div>

            <div className="content">
                <h2 className="title">
                    {eventData ? `${eventData.title}` : "Loading..."}
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
