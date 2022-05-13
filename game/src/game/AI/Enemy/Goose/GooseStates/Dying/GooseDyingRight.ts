import GooseDying from "./GooseDying";

export default class GooseDyingRight extends GooseDying {

    public static readonly ANIMATION = "dyingRight";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseDyingRight.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {}
}