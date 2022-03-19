import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";

export default class RockAI implements AI {
    // The owner of this AI
    protected owner: Graphic;

    // The direction of an rock
    public direction: Vec2;

    // The speed all rocks move at
    public static SPEED: number = 10;

    initializeAI(owner: Graphic, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.ZERO;
    }

    activate(options: Record<string, any>): void {
        this.direction = options.direction;
    }

    handleEvent(event: GameEvent): void {
        // Do nothing
    }

    update(deltaT: number): void {
        if(this.owner.visible)
            this.owner.position.add(Vec2.DOWN.scaled(RockAI.SPEED * deltaT));
    }

    destroy(): void {

    }
}