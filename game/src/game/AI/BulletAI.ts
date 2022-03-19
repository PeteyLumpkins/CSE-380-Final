import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Homework3Event, Homework3Animations } from "../HW3_Enums";

/**
 * This class controls our bullet behavior. Bullets will start out at a certain speed and then accelerate until they either
 * hit a obstacle or leave the screen.
 */
export default class BulletBehavior implements AI {
    // The owner of this AI
    private owner: Graphic;

    // The velocity
    private current_speed: number;
    private start_speed: number;

    // Some vars to keep put bounds on the speed of the bullet
    static SPEED_INC: number = 75;
    static MAX_SPEED: number = 700;

    // An event emitter and receiver to hook into the event system
    private receiver: Receiver

    initializeAI(owner: Graphic, options: Record<string, any>): void {
        this.owner = owner;

        this.current_speed = options.speed;;
        
        this.receiver = new Receiver();

        this.receiver.subscribe(Homework3Event.BULLET_USED);
    }

    activate(options: Record<string, any>): void {
        this.start_speed = options.speed;
        this.current_speed = this.start_speed;
    }


    handleEvent(event: GameEvent): void {
        // If the bullet used was the same as this bullet, then reset the speed
        if (event.data.get("id") == this.owner.id) {
            this.current_speed = this.start_speed;
        }
    }

    update(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}
        
        if(this.owner.visible){
            //While this bullet is active, accelerate the bullet to a max speed over time. 
            this.current_speed += deltaT * BulletBehavior.SPEED_INC;
            this.current_speed = MathUtils.clamp(this.current_speed, this.start_speed, BulletBehavior.MAX_SPEED);

            // Update the position
            this.owner.position.add(Vec2.UP.scaled(deltaT * this.current_speed));
        }
    }

    destroy(): void {
        
    }

}