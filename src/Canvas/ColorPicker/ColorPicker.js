import React from 'react';
import crosshair from '../../assets/crosshair.png';
import leftArrow from '../../assets/left-arrow.png';

let mousePressed = false;

const ACTIONS = {
    colorPicker: 'color-picker',
    brightness: 'brightness'
};

class ColorPicker extends React.Component {
    static radius = 100;

    canvasRef = React.createRef();
    layerRef = React.createRef();
    brightnessRef = React.createRef();

    state = {
        crosshairCoords: {x: 0, y: 0},
        action: ''
    };

    componentDidMount() {
        const layerCanvas = this.layerRef.current;
        const layerCtx = layerCanvas.getContext('2d');
        const canvasCtx = this.canvasRef.current.getContext('2d');

        const valueCanvas = this.brightnessRef.current;
        const brightnessCtx = valueCanvas.getContext('2d');

        // Configure the gradient
        const gradient = brightnessCtx.createLinearGradient(0, 4, 0, 192);

        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'black');

        // Render the column
        brightnessCtx.fillStyle = gradient;
        brightnessCtx.fillRect(0, 4, 10, 192);

        // Set mouseDown events
        valueCanvas.addEventListener('mousedown', () => this.setState({...this.state, action: ACTIONS.brightness}));
        layerCanvas.addEventListener('mousedown', () => this.setState({...this.state, action: ACTIONS.colorPicker}));

        // Set mouseMove event
        document.addEventListener('mousemove', e => {
            switch (this.state.action) {
                case ACTIONS.brightness: {
                    const {y} = this.getOffset(e, valueCanvas);

                    this.drawArrow(y, brightnessCtx);

                    if (y - 7 === 0) {
                        this.drawCircle();
                    } else {
                        this.drawCircle(1 - (1 / (190 / (y - 7))));
                    }

                    const rgb = canvasCtx.getImageData(this.state.crosshairCoords.x, this.state.crosshairCoords.y, 1, 1).data;
                    this.props.setColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

                    break;
                }
                case ACTIONS.colorPicker: {
                    const {x, y} = this.getOffset(e, layerCanvas);
                    this.drawCrosshair(x, y, layerCtx);
                    break;
                }
                default: return;
            }
        });

        // Set mouseUp event
        document.addEventListener('mouseup', e => {
            switch (this.state.action) {
                case ACTIONS.brightness: {
                    const {y} = this.getOffset(e, valueCanvas);
                    const {x: crossX, y: crossY} = this.state.crosshairCoords;

                    const rgb = canvasCtx.getImageData(crossX, crossY, 1, 1).data;

                    this.props.setColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    this.drawArrow(y, brightnessCtx);

                    break;
                }
                case ACTIONS.colorPicker: {
                    let {x, y} = this.getOffset(e, layerCanvas); // <--

                    const [offsetX, offsetY] = this.drawCrosshair(x, y, layerCtx);
                    const rgb = canvasCtx.getImageData(offsetX, offsetY, 1, 1).data;

                    this.props.setColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

                    break;
                }
            }

            this.setState({...this.state, action: ''});
        });

        this.drawCircle();
        this.drawArrow(0, brightnessCtx);
    }

    getOffset(mouseEvent, context) {
        return {
            x: mouseEvent.clientX - context.getBoundingClientRect().x,
            y: mouseEvent.clientY - context.getBoundingClientRect().y
        };
    }

    drawCrosshair(x, y, ctx) {
        let [r, phi] = this.xy2polar(x - ColorPicker.radius, y - ColorPicker.radius);

        if(r > ColorPicker.radius) {
            r = ColorPicker.radius-1;
            [x, y] = this.polar2xy(r, phi);
            x += ColorPicker.radius;
            y += ColorPicker.radius;
        }

        const baseImage = new Image();
        baseImage.src = crosshair;
        baseImage.onload = () => {
            ctx.clearRect(0, 0, 200, 200);
            ctx.drawImage(baseImage, x-12, y-12, 24, 24);
        };

        this.setState({...this.state, crosshairCoords: {x, y}});

        return [x, y];
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
        if (value < 0) value = 0;
        if (value > 1) value = 1;

        const ctx = this.canvasRef.current.getContext("2d");
        let radius = ColorPicker.radius;
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

        const [r1, g1, b1] = (hue => {
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

    polar2xy(r, phi) {
        return [r * Math.cos(phi), r * Math.sin(phi)];
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