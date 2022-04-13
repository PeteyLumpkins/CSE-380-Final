import EnemyState from "./EnemyState";
import { EnemyStates, EnemyStatuses } from "../../../GameEnums";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";


export default abstract class Idle extends EnemyState {

    handleInput(event: GameEvent): void {

    }

    onEnter(): void {
        if (this.owner instanceof AnimatedSprite) {
            // Play an animation
        }
    }

    update(deltaT: number): void {
        if (this.isActive()) {
            this.finished(EnemyStates.ACTIVE);
        }
	}

    abstract isActive(): boolean;

    onExit(): Record<string, any> {
        return;
    }

}