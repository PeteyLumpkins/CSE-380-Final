import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

import GooseMove from "./GooseMove";
import { GooseAIStates } from "../../GooseAI";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class GooseMoveLeft extends GooseMove {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("WalkLeft");
        }
    }

    idle(): void {
        this.finished(GooseAIStates.IDLE_LEFT);
    }

    move(dir: Vec2): void {
        if (dir.x > 0) {
            this.finished(GooseAIStates.MOVE_RIGHT);
        }
    }

    attack(dir: Vec2): void {
        if (dir.x > 0) {
            this.finished(GooseAIStates.ATTACK_RIGHT);
        }
        this.finished(GooseAIStates.ATTACK_LEFT);
    }

    onExit(): Record<string, any> {
        return;
    }

}