import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";

/**
 * The enemy AI class is the main, top level AI class. Each enemy AI should
 * have some state, some custom options/attributes passed in via options, an
 * array of statuses, an array of actions, and a goal.
 * 
 * Initializing the state and custom attributes of the AI are delegated to
 * concrete implementations of the EnemyAI class. The enemy AI class sets
 * up the owner GameNode, goal, statuses, and possible actions the AI can take.
 */
export default abstract class EnemyAI extends StateMachineAI {

    /** The owner of this AI */
    owner: GameNode

    /** The gamenode that the enemy ai will target - ie the player */
    target: GameNode;

    initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;
        this.target = options.target;

        /* States */
        this.initStates();

        /* Options */
        this.initOptions(options);

        /* Subscribe to events */
        this.subscribeToEvents();
    }

    activate(options: Record<string, any>): void {}

    update(deltaT: number){
        super.update(deltaT);
    }

    abstract initStates(): void;

    abstract initOptions(options: Record<string, any>): void;

    abstract subscribeToEvents(): void;
}

