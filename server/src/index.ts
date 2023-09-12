import app from "./server"; // Adjust the path if necessary

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
