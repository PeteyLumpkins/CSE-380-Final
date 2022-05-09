import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {
    private score: number;
    private minerals: number;

    initScene(options: Record<string, any>){
        console.log(options);
    }

    loadScene(): void {
        this.load.image("missing", "assets/images/missingPaper.png");
    }

    startScene() {
        console.log("Starting game over");
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.viewport.setZoomLevel(1);

        this.addLayer("gameOverLayer", 0);
        let center = this.viewport.getCenter();
        center.sub(this.viewport.getOrigin());

        const gameOverText = <Label>this.add.uiElement(UIElementType.LABEL, "gameOverLayer", {position: new Vec2(center.x, center.y - 100), text: "Game Over"});
        gameOverText.textColor = Color.WHITE;

        const clickToExit = <Label>this.add.uiElement(UIElementType.LABEL, "gameOverLayer", {position: new Vec2(center.x, center.y), text: "Click anywhere to return to main menu"});
        clickToExit.textColor = Color.WHITE;
    }

    updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}