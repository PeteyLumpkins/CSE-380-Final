import State from "../../../../Wolfie2D/DataTypes/State/State";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import LevelEndState from "./LevelEndState";
import { LevelEndStates } from "../LevelEndAI";

export default class OutLevelEnd extends LevelEndState {

    onEnter(): void {
        console.log("Entering out of level end area");
    }

    handleInput(): void {}

    update(deltaT: number): void {
        if (this.inRange(this.parent.getPlayerPosition())) {
            this.finished(LevelEndStates.INSIDE);
        }
    }

    onExit(): Record<string, any> { return {}; }

}