import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";

import baseURL from "../../url";

const CreatePost = (props) => {
  const createPostContent = useRef(null);
  const postImage = useRef(null);
  const delPostModal = useRef(null);

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const notify = (errorMessage) =>
    toast.warn(errorMessage, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: false,
      theme: "colored",
    });

  const onOpenModalDeletePost = () => {
    delPostModal.current.style.display = "flex";
    document.body.classList.add("modal-open");
  };

  function respondeDelPostModal() {
    delPostModal.current.style.display = "none";
    document.body.classList.remove("modal-open");
  }

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

  function submitPost(e) {
    e.preventDefault();
    let createdPostContent = createPostContent.current.value;
    let uploadedPostImage = postImage.current.files[0];
    if (uploadedPostImage == null) {
      notify("Please upload image for your post");
      return;
    }
    validateImageFile(uploadedPostImage, async (isValid) => {
      if (!isValid) {
        notify("Please upload a valid image");
        return;
      } else {
        const data = new FormData();
        data.append("postContent", createdPostContent);
        data.append("uploadedImage", uploadedPostImage);
        try {
          onOpenModalDeletePost();
          const res = await axios.post(`${baseURL}/createpost`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("token"),
            },
          });
          respondeDelPostModal();
          if (res.data.status === "error") {
            notify(res.data.message);
          }
          if (res.data.status === "success") {
            toast.success("Successfully Posted", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: false,
              theme: "colored",
            });
            onCloseModal();
            props.addPost(res.data.newPost, res.data.loggedUser);
          }
        } catch (err) {
          notify("Something went wrong! Please try again");
        }
      }
    });
  }

  return (
    <div className="create-post | flex bg-clr_base_400 p-4">
      <Link to={`/user/${props.loggedInUser._id}`}>
        {props.loggedInUser.profileImage !== "noProfile" ? (
          <img
            className="w-[4em] rounded-full"
            src={props.loggedInUser.profileImage}
            alt="Profile"
          />
        ) : (
          <FaUserAlt className="text-clr_primary_400 text-[5rem] rounded-full" />
        )}
      </Link>
      <button
        className="write-post | ml-4 pl-5 flex-1 text-left rounded-full border-clr_base_100 border text-clr_base_100 font-semibold"
        onClick={onOpenModal}
      >
        Start a Post
      </button>
      <Modal
        classNames="w-[88%]"
        open={open}
        onClose={onCloseModal}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        focusTrapped={false}
        showCloseIcon={false}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-clr_secondary_400">
            Create Post
          </h2>
          <AiOutlineClose
            className="text-2xl cursor-pointer"
            onClick={onCloseModal}
          />
        </div>
        <hr className="text-clr_base_50 mt-3" />
        <div className="flex items-center gap-2 mt-5 bg-[#F0F8FF] p-[0.5em]">
          <div>
            {props.loggedInUser.profileImage !== "noProfile" ? (
              <img
                className="w-[4em] rounded-full"
                src={props.loggedInUser.profileImage}
                alt="Profile"
              />
            ) : (
              <FaUserAlt className="text-clr_primary_400 text-[2.5rem] rounded-full" />
            )}
          </div>
          <h3 className="flex-1 font-semibold text-clr_secondary_400">
            {props.loggedInUser.name}
          </h3>
        </div>
        <form onSubmit={submitPost} className="mt-5">
          <label className="text-clr_base_100 block" htmlFor="create-post">
            What you would like to say?{" "}
          </label>
          <textarea
            ref={createPostContent}
            id="create-post"
            className="border-[1px] border-clr_base_100 min-h-[40px] p-2 mt-2 text-clr_secondary_400 w-full"
            name="create-post-content"
          ></textarea>
          <input
            ref={postImage}
            className="mt-5"
            type="file"
            name="post-image"
          />
          <hr className="text-clr_base_50 mt-3" />
          <button
            className="create-post-submit-btn | text-clr_base_400 bg-clr_primary_400 rounded-[5px] py-1 px-4 cursor-pointer block mt-5"
            type="submit"
          >
            Submit
          </button>
        </form>
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
    </div>
  );
};

export default CreatePost;
