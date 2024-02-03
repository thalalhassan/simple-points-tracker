const fs = require("fs/promises");

(async () => {
  try {
    const dataRead = await fs.readFile("data.json", "utf-8");
    const data = JSON.parse(dataRead) || { participants: [], quiz: [] };

    const participants = data.participants;
    const quizData = data.quiz;

    // Create an object to store points for each question
    const pointsByQuestion = {};

    // Iterate through quiz questions and store points by participant and question
    quizData.forEach((question) => {
      const questionName = question.question;
      const points = question.points;

      participants.forEach((participant) => {
        if (!pointsByQuestion[participant]) {
          pointsByQuestion[participant] = {};
        }

        pointsByQuestion[participant][questionName] = points[participant] || 0;
      });
    });

    // Generate CSV header
    const csvHeader = [
      "Name",
      ...quizData.map((question) => question.question),
    ];

    // Generate CSV rows
    const csvRows = participants.map((participant) => {
      const rowData = [
        participant,
        ...quizData.map(
          (question) => pointsByQuestion[participant][question.question]
        ),
      ];
      return rowData.join(",");
    });

    // Combine header and rows
    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");

    // Output CSV content
    await fs.writeFile("data.csv", csvContent);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === "ENOENT") {
      return { participants: [], quiz: [] };
    }
    throw error;
  }
})();
