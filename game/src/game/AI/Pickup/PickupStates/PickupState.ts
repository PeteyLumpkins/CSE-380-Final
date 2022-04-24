import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";

import PickupAI from "../PickupAI";
import { EnemyActions } from "../../../GameEnums";

export default abstract class PickupState extends State {

    parent: PickupAI;
    owner: GameNode;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

}