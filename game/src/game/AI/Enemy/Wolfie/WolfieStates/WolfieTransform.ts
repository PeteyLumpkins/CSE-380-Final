
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";

export default class WolfieTransform extends WolfieState {

    onEnter(options: Record<string, any>): void {        
        console.log("Entering the wolfie transform state");
        this.parent.health = this.parent.maxHealth; // Refill on HP
        console.log(this.parent.health);
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("transform");
        }
    }
    handleInput(event: GameEvent): void {
    }

    update(deltaT: number): void {
        // if (!this.owner.animation.isPlaying("ENVY_TFORM")) {
        //     this.finished(BossStates.ENVY_WALK);
        // }        
        if (!this.owner.animation.isPlaying("transform")) {
            this.finished(WolfieAIStates.MOVE);
        }
    }

    onExit(): Record<string, any> { return; }


}