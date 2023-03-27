import React,{useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {
    AiOutlineInstagram,
    AiOutlineTwitter,
    AiFillFacebook,
    AiFillYoutube
  } from "react-icons/ai";
  import {TiSocialLinkedin} from "react-icons/ti";

const Footer = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedIn, setIsloggedIn] = useState(false);

  function removeUser(){
    setIsloggedIn(false);
    setLoggedInUser(null);
  }

  function addUser(loggedUser){
    setLoggedInUser(loggedUser);
    setIsloggedIn(true);
  }

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const loggedUser = jwt_decode(token);
        addUser(loggedUser);
      } catch (error) {
        removeUser();
      }
    } else {
      removeUser();
    }
  },[])

  return (
    <footer className='bg-clr_primary_400 py-10'>
      <div className="container">
        <div className="grid gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[1em] lg:justify-between">
            <div className="footer-nav-container | max-w-[350px]">
                <ul className='footer-nav-list | grid grid-cols-2 text-clr_base_400'>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                </ul>
            </div>
            <div className="social-media-icons-container">
                <ul className='social-media-icons-list | text-clr_base_400 text-4xl flex lg:mx-auto'>
                    <li><Link to={isLoggedIn ? '/dashboard' : '/'}><AiFillFacebook /></Link></li>
                    <li><Link to={isLoggedIn ? '/dashboard' : '/'}><AiFillYoutube /></Link></li>
                    <li><Link to={isLoggedIn ? '/dashboard' : '/'}><AiOutlineInstagram /></Link></li>
                    <li><Link to={isLoggedIn ? '/dashboard' : '/'}><AiOutlineTwitter /></Link></li>
                    <li><Link to={isLoggedIn ? '/dashboard' : '/'}><TiSocialLinkedin /></Link></li>
                </ul>
            </div>
            <div className="copyright-container | text-clr_base_400">
                <p className='lg:text-end'>Copyright © 2023. All rights reserved.</p>
            </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer