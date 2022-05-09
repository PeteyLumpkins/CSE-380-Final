import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIStates } from "../../GooseAI";
import GooseMove from "./GooseMove";

export default class GooseMoveRight extends GooseMove {

    onEnter(options: Record<string, any>): void {
        console.log("Starting gooose move right state!");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("WalkRight");
        }
    }

    move(dir: Vec2) {
        if (dir.x < 0) {
            this.finished(GooseAIStates.MOVE_LEFT);
        }
    }

    attack(dir: Vec2) {
        if (dir.x < 0) {
            this.finished(GooseAIStates.ATTACK_LEFT);
        }
        this.finished(GooseAIStates.ATTACK_RIGHT);
    }

    onExit(): Record<string, any> {
        return;
    }

}