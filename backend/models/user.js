const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", required: true, unique: true },
    password: { type: "String", required: true },
    profileImage: { type: "String", default: "noProfile" },
    bio : {type : "String", default : ""},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostData" }],
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PostData" },
    ],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PostData",
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { collection: "_user-data" }
);

const UserData = new mongoose.model("UserData", User);

module.exports = UserData;
