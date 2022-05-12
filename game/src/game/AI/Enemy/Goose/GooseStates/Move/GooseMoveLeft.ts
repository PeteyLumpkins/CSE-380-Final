import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

import GooseMove from "./GooseMove";
import { GooseAIStates } from "../../GooseAI";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class GooseMoveLeft extends GooseMove {

    public static readonly ANIMATION = "WalkLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseMoveLeft.ANIMATION;
        super.onEnter(options);
    }

    attack(): void {
        this.finished(GooseAIStates.ATTACK_LEFT);
    }
    takeDamage(): void {
        this.finished(GooseAIStates.HIT_LEFT);
    }

}