const express = require("express");
const router = express.Router();
const Blog = require("../models/blog.model");
const comment = require("../models/comment.model");
const isAdmin = require("../middleware/isAdmin");
const VerifyToken = require("../middleware/Verifytoken");

//creating a blog post
router.post("/create-post", VerifyToken, isAdmin, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId }); //to do later after token verification
    await newPost.save();
    res.status(201).send({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.err("Error creating blog post:", err);
    //sending error object msg
    res.status(500).send({ message: "Error creating blog post" });
  }
});
//this route is to get all blog posts
router.get("/", async (req, res) => {
  try {
    // for filtering the blog posts using search
    const { search, category, author } = req.query;
    // console.log(search);
    let query = {};
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (category) {
      query = {
        ...query,
        category: category,
      };
    }
    if (author) {
      query = {
        ...query,
        author: author,
      };
    }
    const posts = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (err) {
    console.error("Error showing blog post:", err);
    //sending error object msg
    res.status(500).send({ message: "Error showing blog post" });
  }
});

//to get a single blog based on id
router.get("/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const postid = req.params.id;
    const post = await Blog.findById(postid);
    if (!post) {
      res.status(404).send({ message: "No blog found" });
    }
    const comments = await comment
      .find({ postId: postid })
      .populate("user", "username email");
    res.status(200).send({
      post,
      comments,
    });
  } catch (err) {
    console.log("Error fetching this blog:", err);
    //sending error object msg
    res.status(500).send({ message: "Error fetching this blog" });
  }
});

//update a blog post based on id
router.patch("/update-post/:id", VerifyToken,isAdmin, async (req, res) => {
  try {
    const postid = req.params.id;
    const updatepost = await Blog.findByIdAndUpdate(
      postid,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!updatepost) {
      res.status(404).send({ message: "No blog found" });
    }
    res.status(200).send({
      message: "Blog updated sucessfully",
      post: updatepost,
    });
  } catch (error) {
    console.error("Error updating this blog:", error);
    //sending error object msg
    res.status(500).send({ message: "Error updating this blog" });
  }
});

//delete a blog post based on id
router.delete("/:id", VerifyToken,isAdmin, async (req, res) => {
  try {
    const postid = req.params.id;
    const post = await Blog.findByIdAndDelete(postid);
    if (!post) {
      res.status(404).send({ message: "No blog found" });
    }
    // delete related comments
    await comment.deleteMany({ postId: postid });
    res.status(200).send({
      meassge: "post deleted succesfully",
      post: post, // not required
    });
  } catch (error) {
    console.error("Error deleting this blog:", error);
    //sending error object msg
    res.status(500).send({ message: "Error deleting this blog" });
  }
});

//to get the related blogs
router.get("/related/:id", async (req, res) => {
  try {
    const pid = req.params.id;
    if (!pid) {
      res.status(404).send({ message: "NO blog id found" });
    }
    const blog = await Blog.findById(pid);
    if (!blog) {
      res.status(404).send({ message: "NO blog found" });
    }
    const titleregex = new RegExp(blog.title.split(" ").join("|"), "i");
    const relatedquery = {
      _id: { $ne: pid }, // to exclude current blog
      title: { $regex: titleregex },
    };
    const relatedblogs = await Blog.find(relatedquery);
    res.status(200).send(relatedblogs);
  } catch (error) {
    console.error("Error getting related blogs:", error);
    //sending error object msg
    res.status(500).send({ message: "Error getting related blog" });
  }
});

module.exports = router;
