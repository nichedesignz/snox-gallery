import React from 'react';
import { Link } from 'react-router';

import '../CSS/indexpagestyle.css'
import logo from '../assets/logo.png'
function HomePage() {
  return (
    <div className='indexpage'>
        <div><img  className='logostyle' src={logo}  alt="" /></div>
       <div className='indexcontainer zoom-in-out-element'></div>
       <div className='indexContent'>
        <h2 >Steffy & Nobin</h2>
     <Link to='/photoselection'> <button>Select photos</button>
       </Link>  
      
       </div>
    </div>
  )
}

export default HomePage