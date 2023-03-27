require("dotenv").config();
const express = require("express");
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

router.post(
  "/createpost",
  verifytoken,
  upload.single("uploadedImage"),
  async (req, res) => {
    try {
      if(!req.file){
        res.json({status : 'error', message : "No post image found"});
        return;
      }
      const user = await User.findOne({ email: req.loggedInUser.email });
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      const post = await Post.create({
        content: req.body.postContent,
        postImage: cldRes.secure_url,
        author: user._id,
      });
      user.posts.unshift(post);
      await user.save();
      const newPost = await Post.findOne({ _id: post._id }).populate({
        path: "author",
        select: "name profileImage",
      });
      res.json({ status: "success", newPost });
    } catch (error) {
      res.json({
        status: "error",
        message: "Something went wrong. Please try again",
      });
    }
  }
);

router.post("/post/addComment", verifytoken, async (req, res) => {
  try {
    if (!req.body.postComment.trim() || req.body.postComment.trim() === "") {
      res.json({ status: "error", message: "Comment is empty" });
      return;
    }
    if (!req.body.postId || req.body.postId === "") {
      res.json({ status: "error", message: "No post specified" });
      return;
    }
    const post = await Post.findOne({ _id: req.body.postId });
    const user = await User.findOne({ email: req.loggedInUser.email });
    user.comments.unshift({
      content: req.body.postComment,
      post: req.body.postId,
    });
    await user.save();
    post.comments.unshift({
      content: req.body.postComment,
      author: user._id,
    });
    await post.save();
    res.json({ status: "success" });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.post("/post/likePost", verifytoken, async (req, res) => {
  if (req.body.postId === "" || !req.body.postId) {
    res.json({ status: "error", message: "No post specified" });
    return;
  }
  try {
    const post = await Post.findOne({ _id: req.body.postId });
    const user = await User.findOne({ email: req.loggedInUser.email });
    if (user.likes.includes(req.body.postId)){
      res.json({status : "error", message : "You have already liked this post"});
      return;
    }
    if (post.likes.includes(user._id)){
      res.json({status  :"error", message : "You have already liked this post"});
      return;
    }
    user.likes.unshift(req.body.postId);
    await user.save();    
    post.likes.unshift(user._id);
    await post.save();
    res.json({ status: "success" });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong.Please try again",
    });
  }
});

router.post("/post/unlikePost", verifytoken, async (req, res) => {
  if (req.body.postId === "" || !req.body.postId) {
    res.json({ status: "error", message: "No post specified" });
    return;
  }
  try {
    const post = await Post.findOne({ _id: req.body.postId });
    const user = await User.findOne({ email: req.loggedInUser.email });
    user.likes = user.likes.filter((ele) => ele.toString() !== req.body.postId);
    post.likes = post.likes.filter(
      (ele) => ele.toString() !== user._id.toString()
    );
    await user.save();
    await post.save();
    res.json({ status: "success", updatedLikes: post.likes });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong.Please try again",
    });
  }
});

router.post("/postThis/addComment", verifytoken, async (req, res) => {
  try {
    if (!req.body.postComment || req.body.postComment === "") {
      res.json({ status: "error", message: "Comment is empty" });
      return;
    }
    if (!req.body.postId || req.body.postId === "") {
      res.json({ status: "error", message: "No post specified" });
      return;
    }
    const post = await Post.findOne({ _id: req.body.postId });
    const user = await User.findOne({ email: req.loggedInUser.email });
    user.comments.unshift({
      content: req.body.postComment,
      post: req.body.postId,
    });
    await user.save();
    post.comments.unshift({
      content: req.body.postComment,
      author: user._id,
    });
    await post.save();
    const postPopulated = await Post.findOne({ _id: req.body.postId }).populate({
      path: "comments.author",
      select: "name profileImage",
    });
    res.json({status:'success', UpdatedComments : postPopulated.comments})
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.get("/posts/:id", verifytoken, async (req, res) => {
  const postId = req.params.id;
  if (!req.params.id || req.params.id === "") {
    res.json({ status: "error", message: "No post id provided" });
    return;
  }
  try {
    const post = await Post.findOne({ _id: postId }).populate([
      {
        path: "author",
        select: "name profileImage",
      },
      {
        path: "comments.author",
        select: "name profileImage",
      },
    ]);
    const loggedInUser = await User.findOne({
      email: req.loggedInUser.email,
    }).select("name profileImage");
    res.json({ status: "success", post, loggedInUser });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

router.get("/dashboard", verifytoken, async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ created_at: -1 })
      .populate([
        {
          path: "author",
          select: "name profileImage",
        },
        {
          path: "comments.author",
          select: "name profileImage",
        },
      ])
    const users = await User.find({
      email: { $ne: req.loggedInUser.email },
    }).select("name profileImage followers");
    const loggedInUser = await User.findOne({
      email: req.loggedInUser.email,
    }).select("name profileImage");
    res.json({ status: "success", posts, users, loggedInUser });
  } catch (error) {
    res.json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
});

module.exports = router;
