import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import GooseAI from "../GooseAI";
import { GooseAIStates } from "../GooseAI"

export default abstract class GooseState extends State {

    owner: GameNode;

    constructor(parent: GooseAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    update(deltaT: number): void {}

}

