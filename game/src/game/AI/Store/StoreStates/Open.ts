import StoreState from "./StoreState";
import { StoreStates } from "../StoreController";
import { GameEvents } from "../../../GameEnums";
import Input from "../../../../Wolfie2D/Input/Input";

export default class Open extends StoreState {

    /**
     * TODO: when the open state starts -> should fire event to open the store,
     * the event should be caught and handled in the Scene class. Should make
     * the store layer visible and freeze the rest of the game (something like that).
     */
    onEnter(options: Record<string, any>): void {
        console.log("Started open store state");
        this.emitter.fireEvent(GameEvents.OPEN_STORE);
    }

    // FIXME: also needs to be fixed so that the store closes properly
    update(deltaT: number): void {
        if (Input.isPressed("close")) {
            this.finished(StoreStates.ENABLED);
        }
    }

    /**
     * TODO: Sends a signal to the scene that we are closing the store.
     */
    onExit(): Record<string, any> { 
        console.log("Closing the store");
        this.emitter.fireEvent(GameEvents.CLOSE_STORE);
        return {}; 
    }
}