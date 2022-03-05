precision mediump float;

varying vec4 v_Position;
varying vec4 v_Color;

uniform vec4 circle_Color;

// HOMEWORK 3 - TODO
/*
	The fragment shader is where pixel colors are decided.
	You'll have to modify this code to make the circle vary between 2 colors.
	Currently this will render the exact same thing as the gradient_circle shaders
*/
void main(){
	// Default alpha is 0
	float alpha = 0.0;

	// Radius is 0.5, since the diameter of our quad is 1
	float radius = 0.5;

	// Get the distance squared of from (0, 0)
	float dist_sq = v_Position.x*v_Position.x + v_Position.y*v_Position.y;

	// Basically we want to color a circle, not a rectangle, so if the varying 
	// position is not in our "circle" we set alpha to 0.
	if(dist_sq < radius*radius) {
		alpha = 1.0;
	}

	// Lower left corner, set color to blue
	gl_FragColor = v_Color;
	gl_FragColor.a = alpha;
}