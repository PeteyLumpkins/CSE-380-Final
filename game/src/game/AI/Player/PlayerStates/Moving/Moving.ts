import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
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

import MovingLeft from "./MovingLeft";
import MovingRight from "./MovingRight";
import MovingDown from "./MovingDown";
import MovingUp from "./MovingUp";

export { MovingLeft, MovingRight, MovingDown, MovingUp }