const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Keep startup log simple for local development.
  console.log(`Server is running on port ${PORT}`);
});
