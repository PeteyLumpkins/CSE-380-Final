import GoapActionPlanner from "../../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import StateMachineGoapAI from "../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Stack from "../../../Wolfie2D/DataTypes/Stack";
import State from "../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";

import { EnemyStates, EnemyStatuses } from "../../GameEnums";

/**
 * The enemy AI class is the main, top level AI class. Each enemy AI should
 * have some state, some custom options/attributes passed in via options, an
 * array of statuses, an array of actions, and a goal.
 * 
 * Initializing the state and custom attributes of the AI are delegated to
 * concrete implementations of the EnemyAI class. The enemy AI class sets
 * up the owner GameNode, goal, statuses, and possible actions the AI can take.
 */
export default abstract class EnemyAI extends StateMachineGoapAI {
    /** The owner of this AI */
    owner: GameNode

    /** The player node */
    player: GameNode;

    initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;
        this.player = options.player;

        /* States */
        this.initStates();

        /* Options */
        this.initOptions(options);

        /* Subscribe to events */
        this.subscribeToEvents();

        /* Attributes of the GOAP AI */
        this.goal = options.goal;
        this.currentStatus = options.statuses;
        this.possibleActions = options.actions;
        this.plan = new Stack<GoapAction>();
        this.planner = new GoapActionPlanner();
    }

    activate(options: Record<string, any>): void {}

    update(deltaT: number){
        super.update(deltaT);

        // This is the plan that is executed in the Active state, so whenever we don't have a plan, acquire a new one given the current statuses the enemy has
        if (this.plan.isEmpty()) {
            //get a new plan
            this.plan = this.planner.plan(this.goal, this.possibleActions, this.currentStatus, null);
        }
    }

    abstract initStates(): void;

    abstract initOptions(options: Record<string, any>): void;

    abstract subscribeToEvents(): void;
}

