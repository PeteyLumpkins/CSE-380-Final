import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import TurtleAI from "../TurtleAI";
import { TurtleAIStates } from "../TurtleAI"

export default abstract class RatState extends State {
    protected parent: TurtleAI;
    protected owner: GameNode;

    constructor(parent: TurtleAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    update(deltaT: number): void {

        // If the rat is dead - transition to the dead state
        if (this.isDead()) {
            this.finished(TurtleAIStates.DEAD);
        }

    }

    protected attackReady(): boolean {
        return this.parent.attackCooldownTimer.isStopped();
    }

    protected isDead(): boolean {
        return this.parent.health <= 0;
    }

    protected inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }

    protected inSwarmRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.swarmRange;
    }

    protected inAttackRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.attackRange;
    }
}