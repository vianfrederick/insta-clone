const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    content: { type: "String" },
    postImage: { type: "String", required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData"
      },
    ],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserData",
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "_post-data" }
);

const PostData = new mongoose.model("PostData", Post);

module.exports = PostData;
