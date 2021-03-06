import StoreState from "./StoreState";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { StoreStates }  from "../StoreController";

export default class Disabled extends StoreState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play("idle");
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.inRange(this.parent.target.position)) {
            this.finished(StoreStates.ENABLED);
        }
    }

    onExit(): Record<string, any> { return {}; }
}