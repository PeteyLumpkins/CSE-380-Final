import Map from "../Wolfie2D/DataTypes/Map";
import Mat4x4 from "../Wolfie2D/DataTypes/Mat4x4";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import Rect from "../Wolfie2D/Nodes/Graphics/Rect";
import RectShaderType from "../Wolfie2D/Rendering/WebGLRendering/ShaderTypes/RectShaderType";
import Color from "../Wolfie2D/Utils/Color";

/**
 * The linear gradient circle is technically rendered on a quad, and is similar to a rect, so we'll extend the RectShaderType
 */
export default class LinearGradientCircleShaderType extends RectShaderType {

	initBufferObject(): void {
		this.bufferObjectKey = "linear_gradient_circle";
		this.resourceManager.createBuffer(this.bufferObjectKey);
	}

	// HOMEWORK 3 - TODO 
	/**
	 * You should modify this method to pass another color into LinearGradientCircles
	 * 
	 * Think about the best way to pass data to the shader:
	 * Is color static throughout the shader program (uniforms)? Or does it depend on the vertex (attributes)?
	 * Is color interpolated depending on the position of the fragment between vertices (varying)?
	 * 
	 * You may look at the variables passed to the shader in this render function, as well as those
	 * in other ShaderTypes. 
	 * 
	 * @param gl The rendering context
	 * @param options The options object received from the getOptions() method
	 */
	render(gl: WebGLRenderingContext, options: Record<string, any>): void {
		// Get our program and buffer object
		const program = this.resourceManager.getShaderProgram(this.programKey);
		const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);

		// Let WebGL know we're using our shader program
		gl.useProgram(program);

		// Get our vertex data
		const vertexData = this.getVertices(options.size.x, options.size.y);
		const FSIZE = vertexData.BYTES_PER_ELEMENT;

		// Bind the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

		/* ##### ATTRIBUTES ##### */
		// No texture, the only thing we care about is vertex position
		const a_Position = gl.getAttribLocation(program, "a_Position");
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
		gl.enableVertexAttribArray(a_Position);

		/* ##### UNIFORMS ##### */

		// Get transformation matrix
		// We have a square for our rendering space, so get the maximum dimension of our quad
		let maxDimension = Math.max(options.size.x, options.size.y);

		// The size of the rendering space will be a square with this maximum dimension
		let size = new Vec2(maxDimension, maxDimension).scale(2/options.worldSize.x, 2/options.worldSize.y);

		// Center our translations around (0, 0)
		const translateX = (options.position.x - options.origin.x - options.worldSize.x/2)/maxDimension;
		const translateY = -(options.position.y - options.origin.y - options.worldSize.y/2)/maxDimension;

		// Create our transformation matrix
		this.translation.translate(new Float32Array([translateX, translateY]));
		this.scale.scale(size);
		this.rotation.rotate(options.rotation);
		let transformation = Mat4x4.MULT(this.translation, this.scale, this.rotation);

		// Pass the translation matrix to our shader
		const u_Transform = gl.getUniformLocation(program, "u_Transform");
		gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());

		//color
		let webGL_color;

		// Sets the primary color (yellow or red)
		webGL_color = options.color.toWebGL();
		const primary_color = gl.getUniformLocation(program, "primary");
		gl.uniform4f(primary_color, webGL_color[0], webGL_color[1], webGL_color[2], webGL_color[3]);

		// Sets the secondary color (should always be blue)
		webGL_color = Color.BLUE.toWebGL();
		const secondary_color = gl.getUniformLocation(program, "secondary");
		gl.uniform4f(secondary_color, webGL_color[0], webGL_color[1], webGL_color[2], webGL_color[3]);

		// Sets the split color, should be a green or purple depending on primary color
		if (options.color.toString() === Color.YELLOW.toString()) {
			webGL_color = new Color(127, 127, 127).toWebGL();
		} else {
			webGL_color = new Color(127, 0, 127).toWebGL();
		}
		const split_color = gl.getUniformLocation(program, "split");
		gl.uniform4f(split_color, webGL_color[0], webGL_color[1], webGL_color[2], webGL_color[3]);

		// Draw the quad
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	// HOMEWORK 3 - TODO
	/**
	 * This method decides what options get passed to the above render() method.
	 * You should modify this class to allow you to pass another color into the render method.
	 * The second color you pass in should be blue, and this can be hardcoded into this method since
	 * Rect only has 1 color field.
	 */
	getOptions(gc: Rect): Record<string, any> {
		let options: Record<string, any> = {
			position: gc.position,
			size: gc.size,
			rotation: gc.rotation,
			color: gc.color,
		}
		return options;
	}
}