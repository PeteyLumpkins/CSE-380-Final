import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GooseIdle from "./GooseIdle";

export default class DemonGooseIdle extends GooseIdle {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("idle_aggro");
        }
    }

    /** Demon goose attacks player once it's in range */
    canMove(): boolean {
        return this.inSightRange(this.parent.target.position);
    }


}
