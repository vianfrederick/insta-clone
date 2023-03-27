require("dotenv").config();
const { response } = require("express");
const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const verifytoken = require("../middleware/verifytoken");
const Post = require("../models/post.js");
const User = require("../models/user.js");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post("/user/follow", verifytoken, async (req, res) => {
  if (!req.body.userId || req.body.userId === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const followUserId = req.body.userId;
    const followUser = await User.findOne({ _id: followUserId });
    const currentUser = await User.findOne({ email: req.loggedInUser.email });
    if (followUser._id === currentUser._id) {
      res.json({
        status: "error",
        message: "You are not allowed to follow yourself",
      });
      return;
    }
    if (followUser.followers.includes(currentUser._id)) {
      res.json({
        status: "error",
        message: "You are already following this user",
      });
      return;
    }
    if (currentUser.following.includes(followUser._id)) {
      res.json({
        status: "error",
        message: "You are already following this user",
      });
      return;
    }
    followUser.followers.unshift(currentUser._id);
    await followUser.save();
    currentUser.following.unshift(followUser._id);
    await currentUser.save();
    res.json({ status: "success" });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.post("/user/unfollow", verifytoken, async (req, res) => {
  if (!req.body.userId || req.body.userId === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const unfollowUserId = req.body.userId;
    const unfollowUser = await User.findOne({ _id: unfollowUserId });
    const currentUser = await User.findOne({ email: req.loggedInUser.email });
    if (unfollowUser._id === currentUser._id) {
      res.json({
        status: "error",
        message: "You are not allowed to unfollow yourself",
      });
      return;
    }
    unfollowUser.followers = unfollowUser.followers.filter(
      (ele) => ele.toString() !== currentUser._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (ele) => ele.toString() !== unfollowUser._id.toString()
    );
    await unfollowUser.save();
    await currentUser.save();
    res.json({ status: "success", updatedFollowers: unfollowUser.followers });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.post(
  "/user/update",
  verifytoken,
  upload.single("userImage"),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.loggedInUser.email });
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        user.profileImage = cldRes.secure_url;
      }
      if (req.body.bio.trim() === "") req.body.bio = user.bio;
      if (req.body.name.trim() === "") req.body.name = user.name;
      user.bio = req.body.bio;
      user.name = req.body.name;
      user.save();
      res.json({ status: "success", profileImage: user.profileImage });
    } catch (error) {
      res.json({
        status: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }
);

router.post("/user/removeFollower", verifytoken, async (req, res) => {
  if (!req.body.userId || req.body.userId === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const removeFollowerUser = await User.findOne({ _id: req.body.userId });
    const currentUser = await User.findOne({ email: req.loggedInUser.email });
    if (removeFollowerUser._id === currentUser._id) {
      res.json({
        status: "error",
        message: "You cannot remove yourself from yourself",
      });
      return;
    }
    removeFollowerUser.following = removeFollowerUser.following.filter(
      (ele) => ele.toString() !== currentUser._id.toString()
    );
    currentUser.followers = currentUser.followers.filter(
      (ele) => ele.toString() !== removeFollowerUser.id.toString()
    );
    await removeFollowerUser.save();
    await currentUser.save();
    res.json({
      status: "success",
      updatedFollowing: removeFollowerUser.following,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.post("/user/search", verifytoken, async (req, res) => {
  if (!req.body.searchQuery || req.body.searchQuery === "") {
    res.json({ status: "error", message: "No search query provided" });
    return;
  }
  const searchTerm = req.body.searchQuery;
  const searchResults = await User.find({
    name: { $regex: new RegExp(searchTerm, "i") },
  }).select("name profileImage");
  res.json({ status: "success", searchResults });
});

router.get("/user/:id", verifytoken, async (req, res) => {
  if (!req.params.id || req.params.id === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId })
      .populate({
        path: "posts",
        select: "postImage likes comments",
      })
      .select("-email -password");
    res.json({ status: "success", user });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
});

router.get("/user/:id/followers", verifytoken, async (req, res) => {
  if (!req.params.id || req.params.id === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId })
      .populate({
        path: "followers",
        select: "name profileImage followers",
      })
      .select("followers");
    res.json({ status: "success", user });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
});

router.get("/user/:id/following", verifytoken, async (req, res) => {
  if (!req.params.id || req.params.id === "") {
    res.json({ status: "error", message: "No user id provided" });
    return;
  }
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId })
      .populate({
        path: "following",
        select: "name profileImage followers",
      })
      .select("following");
    res.json({ status: "success", user });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
});

module.exports = router;
