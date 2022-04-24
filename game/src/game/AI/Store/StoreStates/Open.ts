import StoreState from "./StoreState";
import { StoreStates } from "../StoreController";
import { GameEvents } from "../../../GameEnums";
import Input from "../../../../Wolfie2D/Input/Input";
import { TimerState } from "../../../../Wolfie2D/Timing/Timer";

export default class Open extends StoreState {

    /**
     * When the open state starts -> should fire event to open the store,
     * the event should be caught and handled in the Scene class. Should make
     * the store layer visible and freeze the rest of the game (something like that).
     */
    onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(GameEvents.OPEN_STORE, {
            items: this.parent.items, 
            player: this.parent.player
        });
    }

    // FIXME: also needs to be fixed so that the store closes properly
    update(deltaT: number): void {
        if (Input.isPressed("close")) {
            if (!this.justToggled) {
                this.justToggled = true;
                this.finished(StoreStates.ENABLED);
            }
        } else {
            this.justToggled = false;
        }
    }

    /**
     * Sends a signal to the scene that we are closing the store.
     */
    onExit(): Record<string, any> { 
        this.emitter.fireEvent(GameEvents.CLOSE_STORE);
        return {}; 
    }
}