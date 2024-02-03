const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs/promises");

const app = express();
const PORT = 4000;

// Middleware to parse JSON in request body
app.use(bodyParser.json());
app.use(cors());

// Endpoint to store data
app.post("/", async (req, res) => {
  try {
    // Read existing data from the JSON file
    const existingData = await readDataFromFile();

    let participants = existingData.participants;
    const quiz = existingData.quiz;
    const points = req.body?.points || {};
    if (Object.keys(points)?.length > 0) {
      quiz.push(req.body);
      participants = participants.concat(Object.keys(points));

      await writeDataToFile({ participants, quiz });
    }

    res.status(200).json({ message: "Data stored successfully", participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to store data
app.get("/points", async (req, res) => {
  try {
    const existingData = await readDataFromFile();

    let data = [];
    let questionNumbers = [];
    let topScorer = [];
    let totalScorer = {};

    if (req.query.question?.length > 0) {
      data = existingData.quiz.filter(
        (quiz) => quiz.question == req.query.question
      )?.[0];
    } else {
      questionNumbers = existingData.quiz.map((quiz) => quiz.question);

      existingData.quiz.forEach((quiz) =>
        Object.entries(quiz.points).forEach(([u, p]) => {
          totalScorer[u] = parseInt(totalScorer[u] ?? 0) + parseInt(p);
        })
      );

      // Convert the object into an array of [user, points] pairs
      const pointEntries = Object.entries(totalScorer);

      // Sort the array in descending order based on points
      topScorer = pointEntries.sort((a, b) => b[1] - a[1]);
    }

    res.status(200).json({
      message: "Data stored successfully",
      questionNumbers,
      data,
      // totalScorer,
      topScorer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper function to read data from the JSON file
const readDataFromFile = async () => {
  try {
    const data = await fs.readFile("data.json", "utf-8");
    return JSON.parse(data) || { participants: [], quiz: [] };
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === "ENOENT") {
      return { participants: [], quiz: [] };
    }
    throw error;
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = async (data) => {
  await fs.writeFile("data.json", JSON.stringify(data, null, 2));
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
