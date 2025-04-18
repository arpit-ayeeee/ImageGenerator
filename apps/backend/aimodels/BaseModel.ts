// Abstract class is a class that cannot be instantiated, it can only be extended by other classes
// Abstract classes are used to define a common interface for a group of classes, 
// but they cannot be used to create objects directly,
// Abstract classes are used to provide a common implementation for a group of classes

export abstract class BaseModel {

    constructor() {}

    //Tensor path is the path to the tensor file that will be used to generate the image, weights are hosted
    private async generateImage(prompt: string, tensorPath: string) {

    }

    //Trigger word is the word that will be used to trigger the model to generate an image, we can mention this in the prompt
    private async trainModel(inputImages: string[], triggerWord: string) { 

    }
}