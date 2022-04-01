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

        if (!this.inRange(this.parent.getPlayerPosition())) {
            this.finished(StoreStates.DISABLED);
        } else if (Input.isKeyJustPressed('open')) {
            this.finished(StoreStates.OPEN);
        }
    }

    onExit(): Record<string, any> { return {}; }
}