import State from "../../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../../Wolfie2D/Input/Input";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../../PlayerController";
import PlayerState from "../PlayerState";



export default abstract class Moving extends PlayerState {

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();

        if (this.isAttacking()) {
            this.attack();
        }

        if(dir.isZero()){
            this.idle()
        } 
        
        this.move(dir);
    }

    abstract idle(): void;

    abstract move(dir: Vec2): void;

    abstract attack(): void;

}