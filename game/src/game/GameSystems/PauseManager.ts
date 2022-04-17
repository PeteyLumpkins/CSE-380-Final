import Scene from "../../Wolfie2D/Scene/Scene";

/**
 * Manages the pausing and unpausing of the a list of game layers.
 */
export default class PauseManager {

    
    private scene: Scene;

    /* The layers that we want to pause/freeze */
    private layersToPause: Array<string>;
    private resumeLayer: string;

    constructor(scene: Scene, layersToPause: Array<string>, resumeLayer: string) {
        this.scene = scene;
        this.layersToPause = layersToPause;
        this.resumeLayer = resumeLayer;
    }

    setResumeLayer(layer: string): void {
        this.resumeLayer = layer;
    }

    setLayersToPause(layers: Array<string>): void {
        this.layersToPause = layers;
    }

    pause(): void {
        for (let i = 0; i < this.layersToPause.length; i++) {
            let layer = this.scene.getLayer(this.layersToPause[i]);
            let items = layer.getItems();
            for (let j = 0; j < items.length; j++) {
                items[j].freeze();
            }
            layer.disable();
        }
        this.scene.getLayer(this.resumeLayer).enable();
    }

    unpause(): void {
        for (let i = 0; i < this.layersToPause.length; i++) {
            let layer = this.scene.getLayer(this.layersToPause[i]);
            let items = layer.getItems();
            for (let j = 0; j < items.length; j++) {
                items[j].unfreeze();
            }
            layer.enable();
        }
        this.scene.getLayer(this.resumeLayer).disable();
    }
}