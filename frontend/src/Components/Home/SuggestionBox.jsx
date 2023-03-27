import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

import baseURL from "../../url";

const SuggestionBox = (props) => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  async function followUser(userId) {
    try {
      const res = await axios.post(
        `${baseURL}/user/follow`,
        {
          userId,
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
        const updatedUsers = allUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              followers: [currentUser._id, ...user.followers],
            };
          }
          return user;
        });
        setAllUsers(updatedUsers);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  async function unfollowUser(userId) {
    try {
      const res = await axios.post(`${baseURL}/user/unfollow`,{
        userId
      },{
        headers : {
          token : localStorage.getItem('token')
        }
      })
      if(res.data.status === 'error'){
        notify("Something went wrong. Please try again");
        return;
      }
      if(res.data.status === 'success'){
        const updatedUsers = allUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              followers: [...res.data.updatedFollowers],
            };
          }
          return user;
        });
        setAllUsers(updatedUsers);        
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  useEffect(() => {
    setAllUsers(props.allUsers);
    setCurrentUser(props.currentUser);
  }, [props.allUsers, props.currentUser]);
  return (
    <div className="suggestions-box | bg-clr_base_400 p-4 max-[950px]:hidden ">
      <h3 className="text-clr_primary_400 font-semibold">
        Suggestions for you
      </h3>
      <hr className="text-clr_base_100 mt-2" />
      {allUsers.length !== 0 ? (
        <ul className="mt-5">
          {allUsers.map((user) => {
            return (
              <li key={user._id} className="suggestions-list-item | grid">
                <div className="suggestions-profile-image | flex justify-center items-center">
                  <Link to={`/user/${user._id}`}>
                    {user.profileImage !== "noProfile" ? (
                      <img
                        className="w-[3em] rounded-full"
                        src={user.profileImage}
                        alt="Profile"
                      />
                    ) : (
                      <FaUserAlt className="text-clr_primary_400 text-[1.5rem] rounded-full" />
                    )}
                  </Link>
                </div>
                <h2 className="suggestions-profile | text-clr_secondary_400 font-semibold">
                  <Link to={`/user/${user._id}`}>{user.name}</Link>
                </h2>
                <p className="suggestions-followers | text-clr_base_100 mt-[-0.5em]">
                  {user.followers.length} Followers
                </p>
                <div className="suggestions-follow-btn-container | my-auto text-end">
                  {!user.followers.includes(currentUser._id) ? (
                    <button
                      className="bg-clr_primary_400 text-clr_base_400 rounded-md py-2 px-4 hover:bg-clr_primary_100"
                      onClick={() => followUser(user._id)}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      className="bg-clr_primary_400 text-clr_base_400 rounded-md py-2 px-4 hover:bg-clr_primary_100"
                      onClick={() => unfollowUser(user._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-clr_secondary_400 mt-[0.15em] text-[2rem]">
          Nothing to show
        </p>
      )}
    </div>
  );
};

export default SuggestionBox;
