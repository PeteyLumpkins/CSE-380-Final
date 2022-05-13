import GooseDying from "./GooseDying";

export default class GooseDyingLeft extends GooseDying {

    public static readonly ANIMATION = "dyingLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseDyingLeft.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {}
}