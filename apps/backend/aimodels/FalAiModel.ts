import { BaseModel } from "./baseModel";
import { fal } from "@fal-ai/client";

export class FalAiModel extends BaseModel {
    constructor() {
        super();
    }
    
    //Here we'll overwrite the generateImage method from the base/abstract class

    //Here we'll use the fal-ai client to generate an image
    private async generateImage(prompt: string, tensorPath: string) {

        //Here we'll use the fal-ai client to generate an image
        //This is comparatively simpler, since we are hitting fal for image, wait for it and get the images
        const result = await fal.subscribe("fal-ai/flux-lora", {
            input: {
                prompt: prompt,
                loras: [{
                    path: tensorPath,
                    scale: 1                //Not very heavily using the face, neither lightly  
                }],
            }
        })

        return result;

    }

    //Here we'll use the fal-ai client to train a model
    //Here we cant keep waiting, since it's a training job, it'll take time
    //We'll use webhook here
    private async trainModel(inputImages: string[], triggerWord: string) {


    }
    
}