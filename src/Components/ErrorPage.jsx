import React, {useState, useEffect} from "react";
import axios from "axios";
import "../CSS/authpagestyle.css";
import logo from "../assets/logo.png";
import {useNavigate} from "react-router-dom";

import CONFIG from '../config';

function ErrorPage() {
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
                    // backgroundColor:"black",
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

               

                {error && <p className="error-message">{error}</p>}
                {/* <p>{error}</p> */}
                <p style={{ 
    color: "white", 
    fontWeight: "bold", 
    fontSize:"20px",
    textShadow:" 3px 3px 4px rgba(0, 0, 0, 0.61)"
}}>
    No images have been published for this event. Please contact the event organizer or support team.
</p>
            </div>
        </div>
    );
}

export default ErrorPage;
