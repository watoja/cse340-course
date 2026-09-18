const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5500;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});

// Organizations route
app.get("/organizations", (req, res) => {
  res.render("organizations", {
    title: "Organizations"
  });
});

// Projects route
app.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Service Projects"
  });
});

// Categories route
app.get("/categories", (req, res) => {
  res.render("categories", {
    title: "Categories"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});