import { z } from "zod";

// When the user wants to train a model
export const TrainModel = z.object({
    name: z.string(),
    type: z.enum(["Man", "Woman", "Others"]),
    age: z.number(),
    ethinicity: z.enum([
        "White", 
        "Black", 
        "Asian_American", 
        "East_Asian", 
        "South_East_Asian", 
        "South_Asian", 
        "Middle_Eastern", 
        "Pacific",
        "Hispanic"
    ]),
    eyeColor: z.enum([
        "Brown",
        "Blue",
        "Hazel",
        "Gray"
    ]),
    bald: z.boolean(),
    userId: z.string(),
    images: z.array(z.string())
})

//When a user wants to generate images basis the model
export const GenerateImage = z.object({
    prompt: z.string(),
    modelId: z.string(),
    num: z.number(),
    userId: z.string()
})

//When the user wants to generate images from a pack
export const GenerateImagesFromPack = z.object({
    modelId: z.string(),
    packId: z.string()
})