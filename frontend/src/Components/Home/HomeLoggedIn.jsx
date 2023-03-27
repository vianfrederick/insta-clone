import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RotatingLines } from "react-loader-spinner";

import CreatePost from "./CreatePost";
import SuggestionBox from "./SuggestionBox";
import baseURL from "../../url";

const Home_logged_in = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const delPostModal = useRef(null);

  dayjs.extend(relativeTime);

  const onOpenModalDeletePost = () => {
    delPostModal.current.style.display = "flex";
    document.body.classList.add("modal-open");
  };

  function respondeDelPostModal() {
    delPostModal.current.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  const handleInputChange = (formId, inputValue) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [formId]: inputValue,
    }));
  };

  async function populateDashboard() {
    try {
      onOpenModalDeletePost();
      const res = await axios.get(`${baseURL}/dashboard`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      respondeDelPostModal();
      setAllPosts(res.data.posts);
      setAllUsers(res.data.users);
      setLoggedInUser(res.data.loggedInUser);
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
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

  async function commentPost(formId, e) {
    e.preventDefault();
    const inputValue = inputValues[formId].trim();
    if (!inputValue) {
      notify("Comment is empty");
      return;
    }
    try {
      const res = await axios.post(
        `${baseURL}/post/addComment`,
        {
          postId: formId,
          postComment: inputValue,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.data.status === "error") {
        notify(res.data.message);
        return;
      }
      if (res.data.status === "success") {
        const updatedPosts = allPosts.map((post) => {
          if (post._id === formId) {
            return {
              ...post,
              comments: [
                {
                  content: inputValue,
                  author: {
                    ...loggedInUser,
                  },
                  created_at: Date.now(),
                },
                ...post.comments,
              ],
            };
          }
          return post;
        });
        setAllPosts(updatedPosts);
        setInputValues({});
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  function updateDashboardPost(newPost) {
    setAllPosts([newPost, ...allPosts]);
  }

  async function likePost(postId) {
    try {
      const res = await axios.post(
        `${baseURL}/post/likePost`,
        {
          postId,
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
        const updatedPosts = allPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: [loggedInUser._id, ...post.likes],
            };
          }
          return post;
        });
        setAllPosts(updatedPosts);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  async function unlikePost(postId) {
    try {
      const res = await axios.post(
        `${baseURL}/post/unlikePost`,
        {
          postId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.data.status === "error") {
        notify("Something went wrong. Please try again");
      }
      if (res.data.status === "success") {
        const updatedPosts = allPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: [...res.data.updatedLikes],
            };
          }
          return post;
        });
        setAllPosts(updatedPosts);
      }
    } catch (error) {
      notify("Something went wrong. Please try again");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const tokenp = jwt_decode(token);
        populateDashboard();
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
        <div className="dashboard-holder | mx-auto flex justify-center gap-4 items-start">
          <div className="basis-[555px] grow-0">
            {loggedInUser && (
              <CreatePost
                loggedInUser={loggedInUser}
                addPost={updateDashboardPost}
              />
            )}
            <hr className="mt-6 text-clr_base_100 w-[90%] mx-auto" />
            {allPosts.length !== 0 ? (
              <ul className="all-posts | mt-6">
                {allPosts.map((post) => {
                  return (
                    <li
                      key={post._id}
                      className="post-container | bg-clr_base_400 p-4 mb-8"
                    >
                      <div className="post-intro | grid gap-x-2 mb-5 px-[0.7em] py-[1em] bg-[#F0F8FF]">
                        <Link
                          className="post-author-image | min-w-[51px] flex justify-center items-center"
                          to={`/user/${post.author._id}`}
                        >
                          {post.author.profileImage !== "noProfile" ? (
                            <img
                              className="w-[3em] rounded-full"
                              src={post.author.profileImage}
                              alt="Profile"
                            />
                          ) : (
                            <FaUserAlt className="text-clr_primary_400 text-[2rem] rounded-full" />
                          )}
                        </Link>
                        <div>
                          <Link
                            className="post-author-name | text-clr_secondary_400 font-semibold text-[1.1rem] max-w-max"
                            to={`/user/${post.author._id}`}
                          >
                            {post.author.name}
                          </Link>
                        </div>
                        <p className="text-clr_base_100 mt-[-0.4em]">
                          {dayjs(post.created_at).fromNow()}
                        </p>
                      </div>
                      <p className="mb-5 text-clr_secondary_400">
                        {post.content}
                      </p>
                      <Link to={`/posts/${post._id}`}>
                        <img
                          className="mx-auto mb-5"
                          src={post.postImage}
                          alt="Post"
                        />
                      </Link>
                      <hr className="text-clr_base_50" />
                      <div className="post-outro | flex justify-between my-1 text-clr_base_100">
                        <p>{post.likes.length} Likes</p>
                        <p>{post.comments.length} Comments</p>
                      </div>
                      <hr className="text-clr_base_50 mb-4" />
                      <div className="user-controls | text-3xl mb-5 text-clr_secondary_400 bg-[#F0F8FF] p-[0.3em] pt-[0.5em]">
                        <button className="mr-2">
                          {post.likes.includes(loggedInUser._id) ? (
                            <AiFillHeart
                              onClick={() => unlikePost(post._id)}
                              className="text-[#ed4956]"
                            />
                          ) : (
                            <AiOutlineHeart
                              onClick={() => likePost(post._id)}
                            />
                          )}
                        </button>
                        <button className="mr-2">
                          <BiCommentDetail />
                        </button>
                        <button>
                          <BsBookmark />
                        </button>
                      </div>
                      <div className="all-comments">
                        <ul className="comment-box | mb-2">
                          {post.comments.slice(0, 2).map((comment, index) => {
                            return (
                              <li key={index} className="comment-intro | grid">
                                <div className="comment-user-photo">
                                  <Link
                                    to={`/user/${comment.author._id}`}
                                    className="flex justify-center items-center"
                                  >
                                    {comment.author.profileImage !==
                                    "noProfile" ? (
                                      <img
                                        className="w-[2em] rounded-full"
                                        src={comment.author.profileImage}
                                        alt="Profile"
                                      />
                                    ) : (
                                      <FaUserAlt className="text-clr_primary_400 text-[1.5rem] rounded-full" />
                                    )}
                                  </Link>
                                </div>
                                <div className="comment-user-name | font-semibold text-clr_secondary_400">
                                  <Link to={`/user/${comment.author._id}`}>
                                    {comment.author.name}
                                  </Link>
                                </div>
                                <div className="comment-content">
                                  <p className="text-clr_secondary_400 leading-[1.2] mt-[-0.2em]">
                                    {comment.content}
                                  </p>
                                </div>
                                <div className="comment-timestamp">
                                  <p className="text-clr_base_100">
                                    {dayjs(comment.created_at).fromNow()}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <Link
                          className="text-clr_primary_400 hover:text-clr_primary_100"
                          to={`/posts/${post._id}`}
                        >
                          View all comments
                        </Link>
                      </div>
                      <div className="your-comment | mt-5">
                        <form
                          onSubmit={(event) => commentPost(post._id, event)}
                          className="flex justify-between"
                        >
                          <input
                            className="bg-[#F0F8FF] p-2 pl-4 text-clr_secondary_400"
                            type="text"
                            placeholder="Add your comment"
                            name="postComment"
                            value={inputValues[post._id] || ""}
                            onChange={(event) =>
                              handleInputChange(post._id, event.target.value)
                            }
                          />
                          <button
                            type="submit"
                            className="cursor-pointer text-clr_primary_400 font-semibold hover:text-clr_primary_100"
                          >
                            Post
                          </button>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-clr_secondary_400 mt-[2em] text-[2rem]">
                No Post to show
              </p>
            )}
          </div>
          {loggedInUser && (
            <SuggestionBox allUsers={allUsers} currentUser={loggedInUser} />
          )}
        </div>
      </div>
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

export default Home_logged_in;
