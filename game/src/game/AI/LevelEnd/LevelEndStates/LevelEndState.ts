import State from "../../../../Wolfie2D/DataTypes/State/State";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";

import LevelEndAI from "../LevelEndAI";
import { LevelEndStates } from "../LevelEndAI";

export default abstract class LevelEndState extends State {

    parent: LevelEndAI;
    protected owner: GameNode;


	constructor(parent: StateMachineAI, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {
		
	}

    nextLevel(): boolean {
        return Input.isPressed("nextlvl");
    }

    inRange(position: Vec2): boolean {
        return this.parent.player.position.distanceTo(this.owner.position) <= this.parent.range;
    }

	update(deltaT: number): void {
	}


}