
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/CSS/indexpagestyle.css';
import logo from '../src/assets/logo.png';
import CONFIG from '/src/config';
function IndexPage() {
  const [eventData, setEventData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
  
    const fetchEvent = async () => {
      try {

        setLoading(true);
        const eventId = localStorage.getItem('eventUUID')
        console.log("Event Id "+eventId)
        const response = await fetch(`${CONFIG.API_BASE_URL}public/api/v1/gallery/${eventId}/`);
        if (!response.ok) throw new Error('Failed to fetch event data');
        const data = await response.json();
        console.log(data)
        if(data.result) setEventData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
        <div className="loader-wrapper">
            <div className="loader"></div>
        </div>
    );
}
  if (error) return <div>No event</div>;

  return (
    <div className="indexpage">
      <div>
        <img className="logostyle" src={logo} alt="Logo" />
      </div>
      <div
        className="zoom-in-out-element"
        style={{
          position: 'relative',
          backgroundImage: `url(${eventData.event.cover_image})`,
          height: '100vh',
          width: '100%',
          objectFit: 'contain',
          backgroundSize: 'cover',
        
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: '20px',
        }}
      ></div>
      <div className="indexContent">
        <h2>{eventData.event.title}</h2>
       
        {/* <p>Date: {eventData.event.date}</p>
        <p>Venue: {eventData.event.venue}</p> */}

       
        

   
        <Link to="/authpage">
          <button>Enter</button>
        </Link>
      </div>
    </div>
  );
}

export default IndexPage;
