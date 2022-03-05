precision mediump float;

varying vec4 v_Position;

uniform vec4 circle_Color;

void main(){
	// Default alpha is 0
	float alpha = 0.0;

	// Radius is 0.5, since the diameter of our quad is 1
	float radius = 0.5;

	// Get the distance squared of from (0, 0)
	float dist_sq = v_Position.x*v_Position.x + v_Position.y*v_Position.y;

	if(dist_sq < radius*radius){
		// Multiply by 4, since distance squared is at most 0.25
		alpha = 4.0*dist_sq;
	}

	// Use the alpha value in our color
	gl_FragColor = vec4(circle_Color);
	gl_FragColor.a = alpha;
}