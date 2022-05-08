import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";

import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GooseIdle from "./GooseIdle";



export default class NormalGooseIdle extends GooseIdle {

    /** Play Idle animation */
    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("idle_not_aggro");
        }
    }

    /** Normal goose can't attack until player hits it */
    canMove(): boolean {
        return this.hasBeenHit();
    }


}