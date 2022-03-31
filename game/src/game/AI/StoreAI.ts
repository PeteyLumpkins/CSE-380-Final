import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Receiver from "../../Wolfie2D/Events/Receiver";

export default class StoreAI implements AI {

    private receiver: Receiver;
    private radius: number;

    initializeAI(owner: GameNode, options: Record<string, any>): void {
        
        // Subscribe to player move event
    }

    handleEvent(event: GameEvent): void {

    }

    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    
    activate(options: Record<string, any>) {}  
    
    destroy(): void {}


}