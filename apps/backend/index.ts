import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack} from "common/types";
import { prismaClient } from "db";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

const USER_ID = "123";

app.post("ai/training", async (req, res) => {

  //Parsing the data according to the schema type expected
  const parsedData = TrainModel.safeParse(req.body);

  console.log(parsedData);

  if (!parsedData.success) {

      res
          .status(411)
          .json({ 
              error: "Incorrect input"
          });

      return;
  }

  const data = await prismaClient.model.create({
      data: {
          name: parsedData.data.name,
          type: parsedData.data.type,
          age: parsedData.data.age,
          ethinicity: parsedData.data.ethinicity,
          eyeColor: parsedData.data.eyeColor,
          bald: parsedData.data.bald,
          userId: parsedData.data.userId ?? USER_ID
      }
  })

  res
      .status(200)
      .json({ 
          modelId: data.id 
      });

});

// Route to generate an image based on the trained model
app.post("ai/generate", async (req, res) => {

  //Parsing the data according to the schema type expected
  const parsedData = GenerateImage.safeParse(req.body);

  console.log(parsedData);

  if (!parsedData.success) {
      res
          .status(411)
          .json({ 
              error: "Incorrect input"
          });
      return;
  }

  const data = await prismaClient.outputImages.create({
      data: {
          prompt: parsedData.data.prompt,
          userId: parsedData.data.userId ?? USER_ID,
          modelId: parsedData.data.modelId,
          imageUrl: "",
      }
  });

  res
      .status(200)
      .json({
          imageId: data.id
      });
});

app.post("pack/generate", async (req, res) => {
  const parsedData = GenerateImagesFromPack.safeParse(req.body);

  if (!parsedData.success) {
      res
          .status(411)
          .json({ error: "Incorrect input" });
      return;
  }

  const prompts = await prismaClient.packPrompts.findMany({
      where: {
          packId: parsedData.data.packId
      }
  });

  const images = await prismaClient.outputImages.createManyAndReturn({
      data: prompts.map((prompt: any) => ({
          prompt: prompt.prompt,
          userId: USER_ID,
          modelId: parsedData.data.modelId,
          imageUrl: ""
      }))
  });

  //Return the entry id created for each image, since actual image generation will happen in third party, and pushed via webhook ?? CHECK
  res
      .status(200)
      .json({
          imageIds: images.map((image: any) => image.id)
      });
});

// Route to get all the packs available
app.get("pack/bulk", async (req, res) => {

  //Get all the packs from the database
  const packs = await prismaClient.packs.findMany();

  res
      .status(200)
      .json({
          packs: packs
      });
});

//Route to get all the images for a given user
app.get("/images/bulk", async (req, res) => {
    const imgIds = req.query.imgIds as string[];
    const limit = req.query.limit as string ?? "10";
    const offset = req.query.offset as string ?? "0";
    
    const imagesData = await prismaClient.outputImages.findMany({
        where: {
            id: {
                in: imgIds
            },
            userId: USER_ID
        },
        skip: parseInt(offset),
        take: parseInt(limit)
    });

    res
        .status(200)
        .json({
            images: imagesData
        });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});