/** 
 * This will define an interface for all enemy attack actions for our game. The idea is that 
 * each action will just have one method to perform the action (perform action) kind of like 
 * the GOAP system. 
 * 
 * An action gets passed in some data about the enviorment that it will need to perform the 
 * action, as well as a callback function that gets called after the action has been performed
 * to trigger any after-effects.
*/

export default interface EnemyAction {

    /** Performs whatever the action to be performed is */
    performAction(deltaT: number, options: Record<string,any>, effects: Function): void;

}