import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import PickupAI from "../PickupAI";
import { EnemyActions } from "../../../GameEnums";

export default abstract class PickupState extends State {

    parent: PickupAI;
    protected owner: GameNode;


	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {
		
	}

    inRange(position: Vec2): boolean {
        return this.parent.getPlayerPosition().distanceTo(this.owner.position) <= this.parent.getRange();
    }

	update(deltaT: number): void {
	}
}