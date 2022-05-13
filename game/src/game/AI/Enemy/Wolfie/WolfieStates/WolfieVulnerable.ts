import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";



export default class WolfieVulnerable extends WolfieState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("vulnerable");
        }
        console.log("Entering the wolfie vulnerable state");
    }

    handleInput(event: GameEvent): void { return; }

    handlePlayerSeenEvent(event: GameEvent): void {
        console.log("Handlign a player seen event");
    }

    update(deltaT: number): void {
        super.update(deltaT);


        if (this.parent.vulnerableTimer.isStopped()) {
            console.log("Vulernable timer done");
            this.finished(WolfieAIStates.MOVE);
        } 

    }

    onExit(): Record<string, any> { return; }

}