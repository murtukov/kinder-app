import React from 'react';
import crosshair from '../../assets/crosshair.png';
import leftArrow from '../../assets/left-arrow.png';

let mousePressed = false;

class ColorPicker extends React.Component {
    canvasRef = React.createRef();
    layerRef = React.createRef();
    brightnessRef = React.createRef();

    componentDidMount() {
        const layerCanvas = this.layerRef.current;
        const layerCtx = layerCanvas.getContext('2d');
        const canvasCtx = this.canvasRef.current.getContext('2d');

        const brightnessCanvas = this.brightnessRef.current;
        const brightnessCtx = brightnessCanvas.getContext('2d');

        // Configure the gradient
        const gradient = brightnessCtx.createLinearGradient(0, 4, 0, 192);

        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'black');

        // Render the column
        brightnessCtx.fillStyle = gradient;
        brightnessCtx.fillRect(0, 4, 10, 192);

        brightnessCanvas.addEventListener('mousedown', () => mousePressed = true);
        layerCanvas.addEventListener('mousedown', () => mousePressed = true);

        layerCanvas.addEventListener('mousemove', e => {
            if (mousePressed) {
                this.drawCrosshair(e.offsetX, e.offsetY, layerCtx);
            }
        });
        brightnessCanvas.addEventListener('mousemove', e => {
            if (mousePressed) {
                this.drawArrow(e.offsetY, brightnessCtx);

                if (e.offsetY-7 === 0) {
                    this.drawCircle(1);
                } else {
                    this.drawCircle(1 - (1/(190/(e.offsetY-7))));
                }
            }
        });

        layerCanvas.addEventListener('mouseup', e => {
            mousePressed = false;
            const rgb = canvasCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
            this.props.onClick(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
            this.drawCrosshair(e.offsetX, e.offsetY, layerCtx);
        });

        brightnessCanvas.addEventListener('mouseup', e => {
            mousePressed = false;
            const rgb = canvasCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
            this.props.onClick(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
            this.drawArrow(e.offsetY, brightnessCtx);
        });

        brightnessCanvas.addEventListener('mouseleave', () => {
            mousePressed = false
        });

        this.drawCircle();
        this.drawArrow(0, brightnessCtx);
    }

    drawCrosshair(x, y, ctx) {
        const baseImage = new Image();
        baseImage.src = crosshair;
        baseImage.onload = () => {
            ctx.clearRect(0, 0, 200, 200);
            ctx.drawImage(baseImage, x-12, y-12, 24, 24);
        };
    }

    drawArrow(y, ctx) {
        const baseImage = new Image();

        if (y < 7) y = 7;
        else if (y > 197) y = 197;

        baseImage.src = leftArrow;
        baseImage.onload = () => {
            ctx.clearRect(10, 0, 20, 200);
            ctx.drawImage(baseImage, 10, y-8, 16, 12);
        };
    }

    drawCircle = (value = 1.0) => {
        const ctx = this.canvasRef.current.getContext("2d");
        let radius = 100;
        let image = ctx.createImageData(2*radius, 2*radius);

        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) {

                const [r, phi] = this.xy2polar(x, y);

                if (r > radius) {
                    // skip coordinates outside the circle
                    continue;
                }

                // Figure out the starting index of this pixel in the image data array.
                const rowLength = 2*radius;
                const adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                const adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                const pixelWidth = 4; // each pixel requires 4 slots in the data array
                const index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

                const hue = this.rad2deg(phi);
                const saturation = r / radius;

                const [red, green, blue] = this.hsv2rgb(hue, saturation, value);
                const alpha = 255;

                image.data[index] = red;
                image.data[index+1] = green;
                image.data[index+2] = blue;
                image.data[index+3] = alpha;
            }
        }

        ctx.putImageData(image, 0, 0);
    };

    /**
     * Converts HSV color to RGB
     * @param {number} hue          Value in range 0...360
     * @param {number} saturation   Value in range 0...1
     * @param {number} value        Value in range 0...1
     * @returns {number[]}
     */
    hsv2rgb(hue, saturation, value) {
        const chroma = value * saturation;
        const x = chroma * (1- Math.abs(((hue / 60) % 2) - 1));

        const [r1, g1, b1] = ((hue) => {
            if (hue >= 0 && hue <= 1) return [chroma, x, 0];
            if (hue >= 1 && hue <= 2) return [x, chroma, 0];
            if (hue >= 2 && hue <= 3) return [0, chroma, x];
            if (hue >= 3 && hue <= 4) return [0, x, chroma];
            if (hue >= 4 && hue <= 5) return [x, 0, chroma];
            if (hue >= 5 && hue <= 6) return [chroma, 0, x];
        })(hue / 60);

        const m = value - chroma;
        const [r, g, b] = [r1+m, g1+m, b1+m];

        // Change r, g, b values from [0,1] to [0,255]
        return [255*r, 255*g, 255*b];
    }

    /**
     * Converts cartesian coordinat system into polar.
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    xy2polar(x, y) {
        let r = Math.sqrt(x*x + y*y); // Radial coordinate
        let phi = Math.atan2(y, x);   // Angular coordinate

        return [r, phi];
    }

    // rad in [-π, π] range
    // return degree in [0, 360] range
    rad2deg(rad) {
        return ((rad + Math.PI) / (2 * Math.PI)) * 360;
    }

    render() {
        return (
            <div style={{position: 'relative', width: 200, height: 200}}>
                <canvas
                    ref={this.canvasRef}
                    width={200}
                    height={200}
                    style={{position: 'absolute', top: 0, left: 0, zIndex: 0}}
                />
                <canvas
                    ref={this.layerRef}
                    width={199}
                    height={199}
                    style={{position: 'absolute', top: 0, left: 0, zIndex: 1, border: '1px solid lightgrey', borderRadius: 200}}
                />
                <canvas
                    width={20}
                    height={200}
                    ref={this.brightnessRef}
                    style={{
                        right: -45,
                        position: 'absolute',
                        border: '1px solid lightgrey'
                    }}
                />
            </div>
        );
    }
}

export default ColorPicker;