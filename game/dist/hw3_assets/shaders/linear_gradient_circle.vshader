attribute vec4 a_Position;

uniform mat4 u_Transform;

uniform vec4 primary;
uniform vec4 secondary;
uniform vec4 split;

varying vec4 v_Position;
varying vec4 v_Color;

void main(){
	gl_Position = u_Transform * a_Position;

	v_Position = a_Position;

	if (-1.0 * v_Position.x > v_Position.y) {
		v_Color = secondary;
	} else if (-1.0 * v_Position.x < v_Position.y) {
		v_Color = primary;
	} else {
		v_Color = split;
	}
}