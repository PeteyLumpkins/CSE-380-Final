import PickupState from "./PickupState";
import { PickupStates } from "../PickupAI";

export default class CanPickup extends PickupState {

    onEnter(): void {}

    handleInput(): void {}

    update(deltaT: number): void {
        if (!this.parent.canPickup()) {
            this.finished(PickupStates.ON_GROUND);
        }

        if (this.parent.pickup()) {
            this.finished(PickupStates.PICKED_UP);
        }
    }

    onExit(): Record<string, any> { return {}; }

}