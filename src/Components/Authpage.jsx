import React, {useState, useEffect} from "react";
import axios from "axios";
import "../CSS/authpagestyle.css";
import logo from "../assets/logo.png";
import {useNavigate} from "react-router-dom";

import CONFIG from '../config';

function AuthPage() {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [eventData, setEventData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const eventId = localStorage.getItem("eventUUID");
        const storedEventId = localStorage.getItem("lastEventUUID");

        if (eventId !== storedEventId) {
            localStorage.removeItem("authToken");
            localStorage.setItem("lastEventUUID", eventId);
        }

        const fetchEvent = async () => {
            try {
                console.log("Event Id:", eventId);
                const response = await axios.get(`${CONFIG.API_BASE_URL}public/api/v1/gallery/${eventId}/`);
                setEventData(response.data.data.event);
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
                `${CONFIG.API_BASE_URL}public/api/v1/auth/gallery/verify-pin/`,
                {
                    pin,
                    event_id: localStorage.getItem("eventUUID"),
                }
            );


            console.log(response);
            const token = response.data.data.token;
            localStorage.setItem("authToken", token);

            navigate(`/gallery/${eventData.id}`, {replace: true});
        } catch (error) {
            console.error("Error:", error);
            setError("Enter a valid PIN!");
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

            <div className="content" style={{zIndex: 2}}>
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
                    <button type="submit" className="button">
                        CONTINUE
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default AuthPage; 