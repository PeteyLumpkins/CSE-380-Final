import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import MainMenu from "./GameLevels/MainMenu";

export default class GameOver extends Scene {
    private score: number;
    private minerals: number;

    initScene(options: Record<string, any>){
        console.log(options);
    }

    startScene() {
        
    }

    updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}