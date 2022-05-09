import EnemyAction from "./EnemyAction";

export enum MoveActionType {
    BLACK_RAT_MOVE = "BLACK_RAT_MOVE_ACTION",
    WHITE_RAT_MOVE = "WHITE_RAT_MOVE_ACTION",

    RAT_KNOCKBACK = "RAT_KNOCKBACK_ACTION",
    GOOSE_KNOCKBACK = "GOOSE_KNOCKBACK_ACTION"
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

        let path = target.getScene().getNavigationManager().getPath(this.navkey, target.position, toPos, this.direct);
        target.moveOnPath(this.speed*deltaT, path);

        effects();
    }
}