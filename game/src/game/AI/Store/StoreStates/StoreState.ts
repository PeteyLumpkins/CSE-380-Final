import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../../Wolfie2D/Input/Input";
import StoreController from "../StoreController";


export default abstract class StoreState extends State {

    protected parent: StoreController;
    protected owner: AnimatedSprite;

    constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {

    }

    // TODO: checks if player is within range of the store -> needs to be tested
    protected inRange(playerPosition: Vec2): boolean {
        return this.owner.position.distanceTo(playerPosition) <= this.parent.getRange().radius 
    }

    update(deltaT: number): void {
        
    }
}