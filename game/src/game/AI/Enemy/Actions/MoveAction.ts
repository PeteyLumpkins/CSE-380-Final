import EnemyAction from "./EnemyAction";

/**
 * The MoveAction takes 3 items in it's options parameter. The keys associated with these values are defined here:
 * 
 * options.target - the GameNode of the enemy AI that we are trying to move
 * options.toPos - the position we want to move the GameNode to
 * options.speed - a scalar that indicates how fast we want to move the enemy
 * 
 * It is assumed that the fromPosition the target will be moving from is it's current position (target.position)
 */
export enum MoveOptionKey {
    TARGET = "MOVE_OPTION_TARGET",
    TO_POS = "MOVE_OPTION_TO_POS",
}

/**
 * The MoveAction for an EnemyAI - moves the target along a path towards a desired position
 */
export default class MoveAction implements EnemyAction {

    private navkey: string;
    private direct: boolean;
    private speed: number;

    /**
     * The constructor for MoveAction sets up a few constants that won't change each time we want 
     * to perform a quote "Move". Namely the navmesh we may or may not want to use.
     * 
     * @param navkey the name of the navigation mesh that is to be used to move the target
     */
    constructor(navkey: string, speed: number, direct: boolean) {
        this.navkey = navkey;
        this.speed = speed;
        this.direct = direct;
    }

    /**
     * Performs the move action
     * 
     * @param deltaT change in time since the last movement
     * @param options 
     * @param effects 
     */
    performAction(deltaT: number, options: Record<string, any>, effects: Function): void {
        let target = options["target"];
        let toPos = options["position"];

        console.log(options);

        let path = target.getScene().getNavigationManager().getPath(this.navkey, target.position, toPos, this.direct);
        target.moveOnPath(this.speed*deltaT, path);

        effects();
    }
}