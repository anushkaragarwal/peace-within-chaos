const express = require("express");
const cors = require("cors");
const fs = require("fs");


const app = express();

app.use(cors());
app.use(express.json());

// memory storage (temporary)
let journals = [];

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API test
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Peace Within Chaos backend 🌌"
  });
});

// save journal
app.post("/api/journal", (req, res) => {

  const entry = req.body;

  journals.push(entry);

  res.json({
    message: "Journal saved successfully",
    data: entry
  });

});

// get journals
app.get("/api/journals", (req, res) => {

  res.json(journals);

});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});