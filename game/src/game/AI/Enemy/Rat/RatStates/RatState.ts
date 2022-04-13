import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import RatAI from "../RatAI";
import { RatAIStates } from "../RatAI"

export default abstract class RatState extends State {
    protected parent: RatAI;
    protected owner: GameNode;

    constructor(parent: RatAI, owner: GameNode){
        super(parent);
        this.owner = owner;

    }

    handleInput(event: GameEvent): void {

    }

    update(deltaT: number): void {

        if (this.parent.health <= 0) {
            this.finished(RatAIStates.DEAD);
        }
    }

    inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }

    inSwarmRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.swarmRange;
    }

    inAttackRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.swarmRange;
    }
}