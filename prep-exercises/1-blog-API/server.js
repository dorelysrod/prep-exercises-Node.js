const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const blogDirectory = "./blogs";

if (!fs.existsSync(blogDirectory)) {
  fs.mkdirSync(blogDirectory);
}

// Create a new blog POST
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const filePath = path.join(blogDirectory, title);
  fs.writeFileSync(filePath, content);
  res.status(201).send("Blog post created");
});

// Update a blog post
app.put("/blogs/:title", (req, res) => {
  const { title } = req.params;
  const { content } = req.body;
  const filePath = path.join(blogDirectory, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "This post does not exist!" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: "Content is required to update the post" });
  }
  fs.writeFileSync(filePath, content);
  res.send("Blog post updated");
});

// Delete a blog post
app.delete("/blogs/:title", (req, res) => {
  const { title } = req.params;
  const filePath = path.join(blogDirectory, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "This post does not exist!" });
  }
  fs.unlinkSync(filePath);
  res.send("Blog post deleted");
});

// Reading a single post
app.get("/blogs/:title", (req, res) => {
  const { title } = req.params;
  const filePath = path.join(blogDirectory, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "This post does not exist!" });
  }
  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});

// Reading all posts
app.get("/blogs", (req, res) => {
  const files = fs.readdirSync(blogDirectory);
  const posts = files.map((file) => {
    const content = fs.readFileSync(path.join(blogDirectory, file), "utf-8");
    return { title: file, content };
  });
  res.json(posts);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
