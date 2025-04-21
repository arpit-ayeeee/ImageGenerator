import { BaseModel } from "./BaseModel";
import { fal } from "@fal-ai/client";

export class FalAiModel extends BaseModel {
    constructor() {
        super();
    }
    
    //Here we'll overwrite the generateImage method from the base/abstract class

    //Here we'll use the fal-ai client to generate an image
    public async generateImage(prompt: string, tensorPath: string) {

        //Here we'll use the fal-ai client to generate an image
        //This is comparatively simpler, since we are hitting fal for image, wait for it and get the images
        //Here not using the webhook approach is still fine, as we will wait for shorter duration here, but in 
        //trainModel method, we'll use webhook approach, as it'll take more time for training
        const {request_id, response_url} = await fal.queue.submit("fal-ai/flux-lora", {
            input: {
                prompt: prompt,
                loras: [{
                    path: tensorPath,
                    scale: 1                //Not very heavily using the face, neither lightly  
                }],
            },
            webhookUrl: `${process.env.WEBHOOK_BASEURL}/fal-ai/webhook/image`,
        })

        return {request_id, response_url};
    }

    //Here we'll use the fal-ai client to train a model
    //Here we cant keep waiting, since it's a training job, it'll take time
    //We'll use webhook here
    public async trainModel(zipUrl: string, triggerWord: string) {

        //inputImageUrl is the url of the zip archive that will have the images to train the model

        const { request_id, response_url} = await fal.queue.submit("fal-ai/flux-lora-fast-training", {
            input: {
                images_data_url: zipUrl,
                trigger_word: triggerWord
            },
            webhookUrl: `${process.env.WEBHOOK_BASEURL}/fal-ai/webhook/train`,
        });

        return {request_id, response_url};
         
    }
    
}