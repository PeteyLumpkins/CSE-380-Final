import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import RatState from "../RatState";



export default abstract class RatDying extends RatState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play(this.animation, false, );
        }
    }

    handleInput(event: GameEvent): void {

    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }
}