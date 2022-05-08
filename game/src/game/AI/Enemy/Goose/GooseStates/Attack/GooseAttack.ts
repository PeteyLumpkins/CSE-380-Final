import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import GooseState from "../GooseState";


export default abstract class GooseAttack extends GooseState {

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.owner.position.dirTo(this.parent.target.position);

        if (!this.inAttackRange(this.parent.target.position)) {
            this.move(dir);
        }

        if (this.attackReady()) {
            this.attack(dir);
            this.parent.attackAction.performAction(deltaT, {}, ()=>{this.parent.attackCooldownTimer.start()});
        }
        
    }

    abstract move(dir: Vec2): void;
    
    abstract attack(dir: Vec2): void;
}


import GooseAttackLeft from "./GooseAttackLeft";
import GooseAttackRight from "./GooseAttackRight";

export { GooseAttackRight, GooseAttackLeft } 