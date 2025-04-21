import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack} from "common/types";
import { prismaClient } from "db";
import { FalAiModel } from "./aimodels/FalAiModel";

//In BUN, we dont need any external providers like dotenv, we can just use the .env file directly
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

const USER_ID = "123";

const FalAiClient = new FalAiModel();

app.post("ai/training", async (req, res) => {

  //Parsing the data according to the schema type expected
  const parsedData = TrainModel.safeParse(req.body);

  const images = req.body.images;
  //Zip images, send it to s3, and get the URL

  console.log(parsedData);

  if (!parsedData.success) {

      res
          .status(411)
          .json({ 
              error: "Incorrect input"
          });

      return;
  }

  const {request_id, response_url} = await FalAiClient.trainModel("", parsedData.data.name);

  const data = await prismaClient.model.create({
      data: {
          name: parsedData.data.name,
          type: parsedData.data.type,
          age: parsedData.data.age,
          ethinicity: parsedData.data.ethinicity,
          eyeColor: parsedData.data.eyeColor,
          bald: parsedData.data.bald,
          userId: parsedData.data.userId ?? USER_ID,
          falAiReqId: request_id
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

  const model = await prismaClient.model.findUnique({
    where: {
      id: parsedData.data.modelId
    }
  });

  if(!model || !model?.tensorPath) {
    res
      .status(411)
      .json({
        error: "Model not found"
      });
      
  }
  const {request_id, response_url} = await FalAiClient.generateImage(parsedData.data.prompt, model?.tensorPath ?? "");

  const data = await prismaClient.outputImages.create({
      data: {
          prompt: parsedData.data.prompt,
          userId: parsedData.data.userId ?? USER_ID,
          modelId: parsedData.data.modelId,
          imageUrl: "",
          falAiReqId: request_id
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

//Webhook
app.post("/fal-ai/webhook/train", async (req, res) => {
  console.log(req.body);

  const request_id = req.body.request_id as string;

  //If we are updating a Model, other than the primary key, we need to make a unique index on that key
  // If this gives error in future, remove the index from falReqId and use updateMany
  await prismaClient.model.update({
    where: {
        falAiReqId: request_id
    },
    data: {
      status: "Completed",
      tensorPath: req.body.tensorPath,
    }
  });

  res
    .status(200)
    .json("Webhook train received");
});

app.post("/fal-ai/webhook/image", async (req, res) => {
    console.log(req.body);
  

    //If we are updating a Model, other than the primary key, we need to make a unique index on that key
    // If this gives error in future, remove the index from falReqId and use updateMany
    await prismaClient.outputImages.update({
      where: {
        falAiReqId: req.body.request_id
      },
      data: {
        status: "Generated",
        imageUrl: req.body.imageUrl
      }
    });

    res
      .status(200)
      .json("Webhook imagereceived");
  });
  

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});