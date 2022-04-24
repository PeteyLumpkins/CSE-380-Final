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

    protected justToggled: boolean;

    constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;
        this.justToggled = false;
	}

    handleInput(event: GameEvent): void {}

    protected inRange(position: Vec2): boolean {
        return this.owner.position.distanceTo(position) <= this.parent.range;
    }

    update(deltaT: number): void {}
}