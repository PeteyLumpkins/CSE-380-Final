import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIStates } from "../../GooseAI";
import GooseAttack from "./GooseAttack";


export default class GooseAttackLeft extends GooseAttack {
    
    move(dir: Vec2): void {
        if (dir.x > 0) {
            this.finished(GooseAIStates.MOVE_RIGHT);
        }
        this.finished(GooseAIStates.MOVE_LEFT);
    }

    attack(dir: Vec2): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("attackLeft");
        }
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }
    
}