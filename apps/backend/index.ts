import express from "express";
import aiRoutes from './routes/aiRoutes';
import packRoutes from './routes/packRoutes';
import imageRoutes from './routes/imageRoutes';
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/ai", aiRoutes);
app.use("/pack", packRoutes);
app.use("/image", imageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});