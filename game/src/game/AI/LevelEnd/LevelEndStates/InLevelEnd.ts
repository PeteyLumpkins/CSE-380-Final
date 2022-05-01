import State from "../../../../Wolfie2D/DataTypes/State/State";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import LevelEndState from "./LevelEndState";
import { LevelEndStates } from "../LevelEndAI";
import { GameEvents } from "../../../GameEnums";

export default class InLevelEnd extends LevelEndState {

    /* Might want to diplay a message once we're inside the level end */
    onEnter(): void {
        console.log("Entering level end area");
    }

    handleInput(): void {}

    update(deltaT: number): void {
        if (!this.inRange(this.parent.getPlayerPosition())) {
            this.finished(LevelEndStates.OUTSIDE);
        }

        // TODO: Retreive Inventory and send it over to the next scene
        if (this.nextLevel()) {
            console.log("Firing next level event");
            this.emitter.fireEvent(GameEvents.CHANGE_LEVEL, {
                "level": this.parent.nextLevel, 
                "spawn": this.parent.playerSpawn,   // Spawn vector is passed into the event handler and then sent to the initScene of next level
                "inventory": this.parent.getPlayer()
            });
        }
    }

    onExit(): Record<string, any> { 
        return {}; 
    }

}