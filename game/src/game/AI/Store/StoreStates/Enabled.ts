import StoreState from "./StoreState";
import { StoreStates } from "../StoreController";
import Input from "../../../../Wolfie2D/Input/Input";

export default class Enabled extends StoreState {

    onEnter(options: Record<string, any>): void {
        console.log("Started enabled store state");
        this.owner.animation.play("enabled");
    }

    // FIXME: for some reason the store isn't opening when I press the "open" key
    update(deltaT: number): void {

        if (!this.inRange(this.parent.target.position)) {
            this.finished(StoreStates.DISABLED);
        } else if (Input.isPressed("open")) {
            if (!this.justToggled) {
                this.justToggled = true;
                this.finished(StoreStates.OPEN);
            }
        } else {
            this.justToggled = false;
        }
    }

    onExit(): Record<string, any> { return {}; }
}