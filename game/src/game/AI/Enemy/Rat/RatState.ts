import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import RatAI from "./RatAI";
import { RatStates } from "./RatAI"

export default abstract class RatState extends State {
    protected parent: RatAI;
    protected owner: GameNode;

    constructor(parent: RatAI, owner: GameNode){
        super(parent);
        this.owner = owner;

    }

    update(deltaT: number): void {

        if (this.parent.health <= 0) {
            this.finished(RatStates.DEAD);
        }
    }

    inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }

    inSwarmRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.swarmRange;
    }
}