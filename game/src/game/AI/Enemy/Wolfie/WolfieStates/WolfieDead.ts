import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import WolfieState from "./WolfieState";

export default class WolfieDead extends WolfieState {
    
    onEnter(options: Record<string, any>): void {
        /** Destroys the enemy */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {}
    
    onExit(): Record<string, any> { return; }
    
}