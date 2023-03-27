import React, { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { AiOutlineClose, AiFillEdit, AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import jwt_decode from "jwt-decode";

import ProfilePhoto from "../../Images/iphone6.png";
import baseURL from "../../url";

const Profile = () => {
  const updatedBio = useRef(null);
  const updatedName = useRef(null);
  const delPostModal = useRef(null);
  const updatedProfileImage = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [openFollowers, setOpenFollowers] = useState(false);
  const onOpenModalFollowers = async () => {
    onOpenModalDeletePost();
    try {
      const res = await axios.get(`${baseURL}/user/${user._id}/followers`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      respondeDelPostModal();
      setOpenFollowers(true);
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
        return;
      }
      if (res.data.status === "success") {
        setFollowersList(res.data.user.followers);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  };
  const onCloseModalFollowers = () => setOpenFollowers(false);

  const [openFollowing, setOpenFollowing] = useState(false);
  const onOpenModalFollowing = async () => {
    onOpenModalDeletePost();
    try {
      const res = await axios.get(`${baseURL}/user/${user._id}/following`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      respondeDelPostModal();
      setOpenFollowing(true);
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
        return;
      }
      if (res.data.status === "success") {
        setFollowingList(res.data.user.following);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  };
  const onCloseModalFollowing = () => setOpenFollowing(false);

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const onOpenModalEditProfile = () => setOpenEditProfile(true);
  const onCloseModalEditProfile = () => setOpenEditProfile(false);

  const onOpenModalDeletePost = () => {
    delPostModal.current.style.display = "flex";
    document.body.classList.add("modal-open");
  };

  function respondeDelPostModal() {
    delPostModal.current.style.display = "none";
    document.body.classList.remove("modal-open");
  }

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

  function validateImageFile(file, callback) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const byteArray = new Uint8Array(arrayBuffer);
      const headerBytes = byteArray.subarray(0, 4);
      const header = Array.from(headerBytes)
        .map((byte) => byte.toString(16))
        .join("");
      const mimeType = getMimeType(header);

      if (mimeType.startsWith("image/")) {
        const extension = getFileExtension(file.name);

        if (
          extension === "png" ||
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "gif"
        ) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    };

    reader.onerror = () => {
      notify("Something went wrong. Please try again");
    };

    reader.readAsArrayBuffer(file);
  }

  function getFileExtension(filename) {
    return filename.split(".").pop().toLowerCase();
  }

  function getMimeType(header) {
    switch (header) {
      case "89504e47":
        return "image/png";
      case "47494638":
        return "image/gif";
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
        return "image/jpeg";
      default:
        return "";
    }
  }

  async function updateUserDetails(bio, name, userImage) {
    const data = new FormData();
    data.append("bio", bio);
    data.append("name", name);
    data.append("userImage", userImage);
    try {
      onOpenModalDeletePost();
      const res = await axios.post(`${baseURL}/user/update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });
      respondeDelPostModal();
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
        return;
      }
      if (res.data.status === "success") {
        onCloseModalEditProfile();
        toast.success("Update Profile Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        setUser({
          ...user,
          bio,
          name,
          profileImage: res.data.profileImage,
        });
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  function updateUserProfile(e) {
    e.preventDefault();
    let updateBio = updatedBio.current.value;
    let updateName = updatedName.current.value;
    let updateProfileImage = updatedProfileImage.current.files[0];
    if (updateBio.trim() === "") updateBio = user.bio;
    if (updateName.trim() === "") updateName = user.name;
    if (!updateProfileImage) {
      updateUserDetails(updateBio, updateName, null);
    } else {
      validateImageFile(updateProfileImage, (isValid) => {
        if (!isValid) {
          notify("Please upload a valid image");
          return;
        } else {
          updateUserDetails(updateBio, updateName, updateProfileImage);
        }
      });
    }
  }

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
        setUser({
          ...user,
          followers: [currentUser.id, ...user.followers],
        });
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  async function unfollowUser(userId) {
    try {
      const res = await axios.post(
        `${baseURL}/user/unfollow`,
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
        setUser({
          ...user,
          followers: [...res.data.updatedFollowers],
        });
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  async function removeFollower(userId){
    try {
      const res = await axios.post(`${baseURL}/user/removeFollower`,{
        userId
      },{
        headers  : {
          token : localStorage.getItem('token')
        }
      })
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
        return;
      }
      if (res.data.status === "success") {
        setUser({
          ...user,
          following : [...res.data.updatedFollowing]
        })
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  async function populateProfile() {
    try {
      onOpenModalDeletePost();
      const res = await axios.get(`${baseURL}/user/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      respondeDelPostModal();
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
        navigate("/dashboard");
        return;
      }
      if (res.data.status === "success") {
        if (!res.data.user) {
          notify("Something went wrong. Please try again");
          navigate("/dashboard");
          return;
        }
        setUser(res.data.user);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const currentUser = jwt_decode(token);
        setCurrentUser(currentUser);
        populateProfile();
      } catch (error) {
        notify("Please log in to continue");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      notify("Please login to continue");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="pt-16 pb-[2em]">
      <div className="container">
        {user && (
          <div className="profile-container bg-clr_base_400 p-4 max-w-[555px] mx-auto">
            <div>
              <div className="flex gap-[1em]">
                {user.profileImage !== "noProfile" ? (
                  <img
                    className="w-[23%] rounded-full"
                    src={user.profileImage}
                    alt="Profile"
                  />
                ) : (
                  <FaUserAlt className="text-clr_primary_400 text-[2rem] w-[20%] h-[20%] rounded-full" />
                )}
                <div className="flex justify-between flex-1 items-center">
                  <div className="sm:flex gap-x-1">
                    <h5 className="text-center text-clr_primary_400 font-semibold">
                      {user.posts.length}
                    </h5>
                    <p className="text-clr_secondary_400">Posts</p>
                  </div>
                  <div className="sm:flex gap-x-1">
                    <h5 className="text-center text-clr_primary_400 font-semibold">
                      {user.followers.length}
                    </h5>
                    <p
                      className="text-clr_secondary_400 cursor-pointer"
                      onClick={onOpenModalFollowers}
                    >
                      Followers
                    </p>
                  </div>
                  <div className="sm:flex gap-x-1">
                    <h5 className="text-center text-clr_primary_400 font-semibold">
                      {user.following.length}
                    </h5>
                    <p
                      className="text-clr_secondary_400 cursor-pointer"
                      onClick={onOpenModalFollowing}
                    >
                      Following
                    </p>
                  </div>
                </div>
              </div>
              <hr className="text-clr_base_50 mt-3" />
              <div className="flex justify-between mt-1 mb-2">
                <h2 className="text-clr_secondary_400 font-semibold mt-1">
                  {user.name}
                </h2>
                {user._id === currentUser.id && (
                  <AiFillEdit
                    className="mt-1 text-2xl text-clr_primary_400 cursor-pointer"
                    onClick={onOpenModalEditProfile}
                  />
                )}
              </div>
              <p className="text-clr_secondary_400 leading-[1.15]">
                {user.bio}
              </p>
            </div>
            <hr className="text-clr_base_50 mt-3 mb-3" />
            {user._id !== currentUser.id && (
              <>
                <div className="flex justify-between">
                  {!user.followers.includes(currentUser.id) ? (
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
                  {
                    user.following.includes(currentUser.id) && (
                      <button
                      className="bg-clr_primary_400 text-clr_base_400 rounded-md py-2 px-4 hover:bg-clr_primary_100"
                      onClick={() => removeFollower(user._id)}
                    >
                      Remove
                    </button>
                    )
                  }
                </div>
                <hr className="text-clr_base_50 mt-3 mb-3" />
              </>
            )}
            <div className="profile-posts-container | grid grid-cols-3 auto-rows-[174.33px]">
              {user.posts.map((post) => {
                return (
                  <div key={post._id} className="relative">
                    <Link
                      className="profile-post | block h-full w-full relative"
                      to={`/posts/${post._id}`}
                    >
                      <img
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={post.postImage}
                        alt="Post"
                      />
                    </Link>
                    <div className="profile-post-controls | absolute invisible flex gap-[1em] justify-around top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <div className="text-center">
                        <AiOutlineHeart className="text-[1.2rem] text-clr_primary_400" />
                        <span className="text-[0.8rem]">
                          {post.likes.length}
                        </span>
                      </div>
                      <div className="text-center">
                        <BiCommentDetail className="text-[1.2rem] text-clr_primary_400" />
                        <span className="text-[0.8rem]">
                          {post.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Modal
        classNames="w-[88%]"
        open={openFollowers}
        onClose={onCloseModalFollowers}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        focusTrapped={false}
        showCloseIcon={false}
      >
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-clr_secondary_400">
              Followers
            </h2>
            <AiOutlineClose
              className="text-2xl cursor-pointer"
              onClick={onCloseModalFollowers}
            />
          </div>
          <hr className="text-clr_base_50 mt-3" />
          <div className="mt-5">
            <ul>
              {followersList.length !== 0 ? (
                <>
                  {followersList.map((follower) => {
                    return (
                      <li
                        key={follower._id}
                        className="followers-list-item | grid"
                      >
                        <Link onClick={()=>onCloseModalFollowers()} to={`/user/${follower._id}`} className="followers-profile-image">
                          {follower.profileImage !== "noProfile" ? (
                            <img
                              className="w-full rounded-full"
                              src={follower.profileImage}
                              alt="Profile"
                            />
                          ) : (
                            <FaUserAlt className="text-clr_primary_400 text-[2rem] w-full h-full rounded-full" />
                          )}
                        </Link>
                        <Link
                          onClick={()=>onCloseModalFollowers()}
                          className="followers-profile | text-clr_secondary_400 font-semibold"
                          to={`/user/${follower._id}`}
                        >
                          {follower.name}
                        </Link>
                        <p className="followers-followers | text-clr_base_100 mt-[-0.5em]">
                          {follower.followers.length} Followers
                        </p>
                      </li>
                    );
                  })}
                </>
              ) : (
                <p className="text-center font-[100] text-[1.5rem]">
                  No Followers
                </p>
              )}
            </ul>
          </div>
        </div>
      </Modal>
      <Modal
        classNames="w-[88%]"
        open={openFollowing}
        onClose={onCloseModalFollowing}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        focusTrapped={false}
        showCloseIcon={false}
      >
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-clr_secondary_400">
              Following
            </h2>
            <AiOutlineClose
              className="text-2xl cursor-pointer"
              onClick={onCloseModalFollowing}
            />
          </div>
          <hr className="text-clr_base_50 mt-3" />
          <div className="mt-5">
            {followingList.length !== 0 ? (
              <ul>
                {followingList.map((following) => {
                  return (
                    <li
                      key={following._id}
                      className="followers-list-item | grid"
                    >
                      <Link onClick={()=>onCloseModalFollowing()} to={`/user/${following._id}`} className="followers-profile-image">
                      {following.profileImage !== "noProfile" ? (
                        <img
                          className="w-full rounded-full"
                          src={following.profileImage}
                          alt="Profile"
                        />
                      ) : (
                        <FaUserAlt className="followers-profile-image | text-clr_primary_400 text-[2rem] w-full h-full rounded-full" />
                      )}
                      </Link>                      
                      <Link onClick={()=>onCloseModalFollowing()} to={`/user/${following._id}`} className="followers-profile | text-clr_secondary_400 font-semibold">
                        {following.name}
                      </Link>
                      <p className="followers-followers | text-clr_base_100 mt-[-0.5em]">
                        {following.followers.length} Followers
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center font-[100] text-[1.5rem]">
                No Following
              </p>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        classNames="w-[88%]"
        open={openEditProfile}
        onClose={onCloseModalEditProfile}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        focusTrapped={false}
        showCloseIcon={false}
      >
        {user && (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-clr_secondary_400">
                Edit Profile
              </h2>
              <AiOutlineClose
                className="text-2xl cursor-pointer"
                onClick={onCloseModalEditProfile}
              />
            </div>
            <hr className="text-clr_base_50 mt-3" />
            <div className="mt-5">
              <form
                onSubmit={updateUserProfile}
                className="update-profile-form | flex flex-col"
              >
                <label
                  className="text-clr_primary_400 font-semibold"
                  htmlFor="update-profile-name"
                >
                  Update Name
                </label>
                <input
                  id="update-profile-name"
                  placeholder={user.name}
                  className="text-clr_secondary_400 mb-[1em] mt-[0.5em]"
                  ref={updatedName}
                  type="text"
                />
                <label
                  className="text-clr_primary_400 font-semibold"
                  htmlFor="bio"
                >
                  Update Bio
                </label>
                <textarea
                  placeholder={user.bio}
                  className="updated-profile-bio | text-clr_secondary_400 border-[1px] border-clr_base_100 p-[10px] mt-[0.5em] mb-[1em]"
                  ref={updatedBio}
                  id="bio"
                  cols="10"
                  rows="10"
                ></textarea>
                <label
                  htmlFor="updateProfileImage"
                  className="text-clr_primary_400 font-semibold"
                >
                  Update Profile Image
                </label>
                <input
                  className="mb-[1em] mt-[0.5em]"
                  type="file"
                  ref={updatedProfileImage}
                  id="updateProfileImage"
                />
                <button
                  className="bg-clr_primary_400 text-clr_base_400 p-2 cursor-pointer rounded-sm mb-4 mt-4 font-semibold hover:bg-clr_primary_100"
                  type="submit"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
      <div ref={delPostModal} className="del-post-modal-2">
        <RotatingLines
          strokeColor="#458aca"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    </section>
  );
};

export default Profile;
