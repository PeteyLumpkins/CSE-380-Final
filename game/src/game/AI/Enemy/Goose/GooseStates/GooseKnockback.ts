import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import GooseState from "./GooseState";

export default class GooseKnockback extends GooseState {
    
    onEnter(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }
    handleInput(event: GameEvent): void {
        throw new Error("Method not implemented.");
    }
    onExit(): Record<string, any> {
        throw new Error("Method not implemented.");
    }
    
}