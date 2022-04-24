import PickupState from "./PickupState";
import { GameEvents } from "../../../GameEnums";

export default class PickedUp extends PickupState {

    onEnter(): void {
        // this.owner.tweens.play("pickup");
        this.emitter.fireEvent(GameEvents.PICKUP_ITEM, this.parent.data);
        this.owner.destroy();
    }

    handleInput(): void {}

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return {}; }

}