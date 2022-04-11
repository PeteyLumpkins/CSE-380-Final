import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import EnemyAI from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Active extends EnemyState {
    // Timers for managing this state
    pollTimer: Timer;
    exitTimer: Timer;

    private route: NavigationPath;

    private retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: AnimatedSprite) {
        super(parent, owner);
    }

    onEnter(options: Record<string, any>): void {
        // Reset the return object
        this.retObj = {};
        this.parent.path = this.owner.getScene().getNavigationManager().getPath("navmesh", this.owner.position, this.parent.player.position, true);
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {

        let nextAction = this.parent.plan.peek();

        // Perform the action
        let result = nextAction.performAction(this.parent.currentStatus, this.parent, deltaT);

        // If result is not null -> should check the effects...
        if (result !== null) {
            this.parent.plan.pop()
        } 
        // If result is null and next action is NOT a loop action -> should also pop it
        else if (!nextAction.loopAction) {
            this.parent.plan.pop();
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}