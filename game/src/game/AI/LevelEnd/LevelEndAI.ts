import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import GameLevel from "../../Scenes/GameLevel";
import InLevelEnd from "./LevelEndStates/InLevelEnd";
import OutLevelEnd from "./LevelEndStates/OutLevelEnd";


export enum LevelEndStates {
    INSIDE = "LEVEL_END_STATE_INSIDE",
    OUTSIDE = "LEVEL_END_STATE_OUTSIDE"
}

export default class LevelEndAI extends StateMachineAI {

    protected owner: GameNode;

    protected player: GameNode;
    nextLevel: new (...args: any) => GameLevel;
    protected range: number;
    public playerSpawn: Vec2;   // ! Needs to be public for it to work in the InLevelEnd?

    protected emitter: Emitter;

    /**
     * @param owner the GameNode that owns this pickup AI
     */
    initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;

        this.player = options.player;
        this.range = options.range;

        this.nextLevel = options.nextLevel;
        this.playerSpawn = options.spawn;

        this.emitter = new Emitter();

        this.addState(LevelEndStates.INSIDE, new InLevelEnd(this, this.owner));
        this.addState(LevelEndStates.OUTSIDE, new OutLevelEnd(this, this.owner));
        this.initialize(LevelEndStates.OUTSIDE);


    }   

    getRange(): number { return this.range; }

    getPlayerPosition(): Vec2 { return this.player.position; }

    getPlayer(): GameNode { return this.player; }

    destroy(): void {}

    /** Activates this AI from a stopped state and allows variables to be passed in */
    activate(options: Record<string, any>): void {}

    update(deltaT: number): void {
        super.update(deltaT);
    }

    /** Handles events from the Actor */
    handleEvent(event: GameEvent): void {
    }

}