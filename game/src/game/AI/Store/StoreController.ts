import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Receiver from "../../../Wolfie2D/Events/Receiver";


export default class StoreAI extends StateMachineAI {

    protected owner: GameNode;
    private radius: number;

    initializeAI(owner: GameNode, options: Record<string, any>): void {
        
        this.owner = owner;
        // Subscribe to player move event
    }

    handleEvent(event: GameEvent): void {

        switch(event.type) {

            case "playermove": {
                
            }

        }
    }

    handlePlayerMoveEvent(event: GameEvent) {
        if (this.owner.position.distanceTo(event.data.get("position")) <= this.radius) {
            // Play the popup hint animation and leave it on the screen
        } else {
            // Remove the popup hint animation
        }
    }

    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    
    activate(options: Record<string, any>) {}  
    
    destroy(): void {}


}