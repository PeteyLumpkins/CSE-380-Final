import EnemyAction from "./EnemyAction";

export enum MoveActionType {
    DEFAULT_RAT_MOVE = "BLACK_RAT_MOVE_ACTION",
    FAST_RAT_MOVE = "WHITE_RAT_MOVE_ACTION",
    DEMON_GOOSE_MOVE = "DEMON_GOOSE_MOVE_ACTION",
    NORMAL_GOOSE_MOVE = "NORMAL_GOOSE_MOVE_ACTION",

    DEFAULT_RAT_KNOCKBACK = "DEFAULT_RAT_KNOCKBACK_ACTION",
    FAST_RAT_KNOCKBACK = "FAST_RAT_KNOCKBACK_ACTION",
    NORMAL_GOOSE_KNOCKBACK = "GOOSE_KNOCKBACK_ACTION"
}

/**
 * The MoveAction for an EnemyAI - moves the target along a path towards a desired position
 */
export default class MoveAction implements EnemyAction {

    public static readonly DEFAULT_NAVKEY = "navmesh"

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

    public static moveActionBuilder(type: MoveActionType, navkey: string, direct: boolean): MoveAction {

        switch(type) {

            case MoveActionType.DEFAULT_RAT_MOVE: {
                return new MoveAction(navkey, 100, direct);
            }
            case MoveActionType.FAST_RAT_MOVE: {
                return new MoveAction(navkey, 200, direct);
            }
            case MoveActionType.NORMAL_GOOSE_MOVE: {
                return new MoveAction(navkey, 75, direct);
            }
            case MoveActionType.DEMON_GOOSE_MOVE: {
                return new MoveAction(navkey, 75, direct);
            }
            case MoveActionType.DEFAULT_RAT_KNOCKBACK: {
                return new MoveAction(navkey, 200, direct);
            }
            default: {
                throw new Error(`Unknown move action type: ${type}`);
            }
        }
    }
}