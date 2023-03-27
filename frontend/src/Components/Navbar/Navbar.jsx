import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

import Logo from "../../Images/logo.png";
import dummyProfile from "../../Images/image-one.jpg";
import { TfiMenu } from "react-icons/tfi";
import {
  AiOutlineClose,
  AiOutlineSearch,
  AiFillHome,
  AiFillMessage,
  AiFillContacts,
  AiFillInfoCircle,
} from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import baseURL from "../../url";

const Navbar = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const searchBoxRef = useRef(null);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  const notify = (errorMessage) =>
    toast.warn(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });

  async function fetchSearchResults(e) {
    setSearchValue(e.target.value);
    const searchQuery = e.target.value.trim();
    if (searchQuery !== "") {
      try {
        const res = await axios.post(
          `${baseURL}/user/search`,
          {
            searchQuery,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        if (res.data.status === "error") {
          notify("Something went wrong. Please try again");
          return;
        }
        if (res.data.status === "success") {
          setSearchResults(res.data.searchResults);
        }
      } catch (error) {
        notify("Something went wrong. Please try again");
      }
    } else {
      setSearchValue("");
      setSearchResults([]);
    }
  }

  function logOutUser() {
    localStorage.removeItem("token");
    toast.success("You are successfullly logged out", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: false,
      theme: "colored",
    });
    navigate("/login");
    setLoggedInUser(null);
    setIsloggedIn(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const loggedUser = jwt_decode(token);
        setLoggedInUser(loggedUser);
        setIsloggedIn(true);
      } catch (error) {
        setIsloggedIn(false);
      }
    } else {
      setIsloggedIn(false);
    }
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBoxRef]);
  function handleClick() {
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileNavContainer = document.querySelector(".mobile-nav-container");
    const mobielNavToggle = document.querySelector(".mobile-nav-toggle");
    const visibility = mobileNav.getAttribute("data-visible");
    if (visibility === "false") {
      document.body.classList.add("modal-open");
      mobileNav.setAttribute("data-visible", "true");
      mobileNavContainer.setAttribute("data-visible", "true");
      mobielNavToggle.setAttribute("aria-expanded", "true");
    } else {
      document.body.classList.remove("modal-open");
      mobileNav.setAttribute("data-visible", "false");
      mobileNavContainer.setAttribute("data-visible", "false");
      mobielNavToggle.setAttribute("aria-expanded", "false");
    }
  }
  return (
    <header className="py-2 bg-clr_base_400">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="nav-container | flex items-center justify-between gap-4">
            <Link className="w-10" to={isLoggedIn ? "/dashboard" : "/"}>
              <img src={Logo} alt="Logo" />
            </Link>
            {isLoggedIn && (
              <div className="relative text-center justify-between w-full">
                <span className="absolute top-[7px] left-[9px] z-[1]">
                  <AiOutlineSearch className="text-[1.2rem] text-clr_base_100" />
                </span>
                <input
                  placeholder="Search"
                  className="pl-[2em] w-full rounded-sm bg-clr_base_50 text-clr_backdrop text-base min-h-[32px]"
                  type="text"
                  ref={searchBoxRef}
                  onClick={() => setShowResults(true)}
                  value={searchValue}
                  onChange={fetchSearchResults}
                />
                {showResults && (
                  <div
                    ref={searchResultsRef}
                    className="search-results | absolute w-full py-[0.5em] z-[1] overflow-y-auto max-h-[205px]"
                  >
                    {searchResults.length !== 0 && (
                      <ul>
                        {searchResults.map((searchResult, index) => {
                          return (
                            <li key={index}>
                              <Link
                                className="search-results-item | flex items-center gap-x-2"
                                to={`/user/${searchResult._id}`}
                              >
                                {searchResult.profileImage !== "noProfile" ? (
                                  <img
                                    className="w-[3em] rounded-full"
                                    src={searchResult.profileImage}
                                    alt="Profile"
                                  />
                                ) : (
                                  <FaUserAlt className="text-clr_primary_400 text-[3rem] rounded-full" />
                                )}
                                <h3 className="text-clr_secondary_400 font-semibold">
                                  {searchResult.name}
                                </h3>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <div className="desktop-nav-loggedin | text-clr_primary_400 max-[510px]:hidden">
              <ul className="flex justify-between items-center">
                <li>
                  <Link to="/dashboard">
                    <AiFillHome />
                  </Link>
                </li>
                <li>
                  <Link to="/about">
                    <AiFillInfoCircle />
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <AiFillContacts />
                  </Link>
                </li>
                <li>
                  {loggedInUser && (
                    <Link to={`/user/${loggedInUser.id}`}>
                      {loggedInUser.profileImage !== "noProfile" ? (
                        <img
                          className="w-[2.2em] rounded-full"
                          src={loggedInUser.profileImage}
                          alt="Profile"
                        />
                      ) : (
                        <FaUserAlt className="text-clr_primary_400 rounded-full" />
                      )}
                    </Link>
                  )}
                </li>
                <li>
                  <FiLogOut onClick={logOutUser} className="cursor-pointer" />
                </li>
              </ul>
            </div>
          ) : (
            <div className="desktop-nav-loggedout | text-clr_primary_400">
              <ul className="flex justify-between items-center">
                <li>
                  <Link to="/">
                    <AiFillHome />
                  </Link>
                </li>
                <li>
                  <Link to="/about">
                    <AiFillInfoCircle />
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <AiFillContacts />
                  </Link>
                </li>
                <li>
                  <Link to="/signup">
                    <FiLogIn />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {isLoggedIn && (
            <>
              <div className="min-[510px]:hidden">
                <TfiMenu
                  aria-expanded="false"
                  onClick={() => handleClick()}
                  className="mobile-nav-toggle | text-clr_primary_400 h-[2em] w-[1.5em] cursor-pointer"
                />
              </div>
              <div
                data-visible="false"
                className="mobile-nav | text-clr_primary_400 min-[510px]:hidden bg-clr_backdrop z-[2]"
              >
                <ul
                  data-visible="false"
                  className="mobile-nav-container | bg-clr_base_400 my-0 ml-auto h-full w-[200px] p-4"
                >
                  <li className="mb-4">
                    <AiOutlineClose
                      onClick={() => handleClick()}
                      className="h-[2em] w-[1.5em] cursor-pointer ml-auto"
                    />
                  </li>
                  <li>
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                  <li>
                    {loggedInUser && (
                      <Link to={`/user/${loggedInUser.id}`}>Profile</Link>
                    )}
                  </li>
                  <li onClick={logOutUser}>Log out</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
