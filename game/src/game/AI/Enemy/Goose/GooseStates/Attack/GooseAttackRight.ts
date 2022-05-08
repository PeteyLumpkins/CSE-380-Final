import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIStates } from "../../GooseAI";
import GooseAttack from "./GooseAttack";


export default class GooseAttackRight extends GooseAttack {

    move(dir: Vec2): void {
        if (dir.x < 0) {
            this.finished(GooseAIStates.MOVE_LEFT);
        }
        this.finished(GooseAIStates.MOVE_RIGHT);
    }

    attack(dir: Vec2): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("attackRight");
        }
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }
    
}