import React, { useState } from 'react';
import './Navbar.css';
import {assets} from "../../assets/frontend_assets/assets"

const Navbar = () => {

    const [menu, setMenu] = useState("menu");


  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <ul className='navbar-menu'>
        <li onClick={()=>setMenu('home')} className={menu==='home' ? 'active' : ''}>Home</li>
        <li onClick={()=>setMenu('menu')} className={menu==='menu' ? 'active' : ''}>Menu</li>
        <li onClick={()=>setMenu('about')} className={menu==='about' ? 'active' : ''}>About</li>
        <li onClick={()=>setMenu('contact')} className={menu==='contact' ? 'active' : ''}>Contact Us</li>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt="Search_Icon" />
        <div className="navbar-search-icon">
            <img src={assets.basket_icon} alt="" />
            <div className="dot">

            </div>
        </div>
        <button>Sign In</button>
      </div>
   </div>
  )
}

export default Navbar
