import React from 'react';
import crosshair from '../../assets/crosshair.png';

let mousePressed = false;

class ColorPicker extends React.Component {
    canvasRef = React.createRef();
    layerRef = React.createRef();

    componentDidMount() {
        const layerCanvas = this.layerRef.current;
        const layerCtx = layerCanvas.getContext('2d');
        const canvasCtx = this.canvasRef.current.getContext('2d');

        layerCanvas.addEventListener('mousedown', () => mousePressed = true);

        layerCanvas.addEventListener('mousemove', e => {
            if (mousePressed) {
                this.drawCrosshair(e.offsetX, e.offsetY, layerCtx);
            }
        });

        layerCanvas.addEventListener('mouseup', e => {
            mousePressed = false;
            const rgb = canvasCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
            this.props.onClick(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        });

        this.drawCircle();
    }

    drawCrosshair(x, y, ctx) {
        const baseImage = new Image();
        baseImage.src = crosshair;
        baseImage.onload = () => {
            ctx.clearRect(0, 0, 100, 100);
            ctx.drawImage(baseImage, x-12, y-12, 24, 24);
        };
    }

    drawCircle = () => {
        const ctx = this.canvasRef.current.getContext("2d");
        let radius = 50;
        let image = ctx.createImageData(2*radius, 2*radius);
        let data = image.data;

        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) {

                let [r, phi] = this.xy2polar(x, y);

                if (r > radius) {
                    // skip all (x,y) coordinates that are outside of the circle
                    continue;
                }

                let deg = this.rad2deg(phi);

                // Figure out the starting index of this pixel in the image data array.
                let rowLength = 2*radius;
                let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                let pixelWidth = 4; // each pixel requires 4 slots in the data array
                let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

                let hue = deg;
                let saturation = 1.0;
                let value = 1.0;

                let [red, green, blue] = this.hsv2rgb(hue, saturation, value);
                let alpha = 255;

                data[index] = red;
                data[index+1] = green;
                data[index+2] = blue;
                data[index+3] = alpha;
            }
        }

        ctx.putImageData(image, 0, 0);
    };

    // hue in range [0, 360]
    // saturation, value in range [0,1]
    // return [r,g,b] each in range [0,255]
    // See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
    hsv2rgb(hue, saturation, value) {
        let chroma = value * saturation;
        let hue1 = hue / 60;
        let x = chroma * (1- Math.abs((hue1 % 2) - 1));
        let r1, g1, b1;
        if (hue1 >= 0 && hue1 <= 1) {
            ([r1, g1, b1] = [chroma, x, 0]);
        } else if (hue1 >= 1 && hue1 <= 2) {
            ([r1, g1, b1] = [x, chroma, 0]);
        } else if (hue1 >= 2 && hue1 <= 3) {
            ([r1, g1, b1] = [0, chroma, x]);
        } else if (hue1 >= 3 && hue1 <= 4) {
            ([r1, g1, b1] = [0, x, chroma]);
        } else if (hue1 >= 4 && hue1 <= 5) {
            ([r1, g1, b1] = [x, 0, chroma]);
        } else if (hue1 >= 5 && hue1 <= 6) {
            ([r1, g1, b1] = [chroma, 0, x]);
        }

        let m = value - chroma;
        let [r,g,b] = [r1+m, g1+m, b1+m];

        // Change r,g,b values from [0,1] to [0,255]
        return [255*r, 255*g, 255*b];
    }

    xy2polar(x, y) {
        let r = Math.sqrt(x*x + y*y);
        let phi = Math.atan2(y, x);
        return [r, phi];
    }

    // rad in [-π, π] range
    // return degree in [0, 360] range
    rad2deg(rad) {
        return ((rad + Math.PI) / (2 * Math.PI)) * 360;
    }

    render() {
        return <div style={{position: 'relative', width: 100, height: 100}}>
            <canvas
                id="color-picker"
                ref={this.canvasRef}
                width={100}
                height={100}
                style={{position: 'absolute', top: 0, left: 0, zIndex: 0}}
            />
            <canvas
                id="color-picker-layer"
                ref={this.layerRef}
                width={99}
                height={99}
                style={{position: 'absolute', top: 0, left: 0, zIndex: 1, border: '1px solid lightgrey', borderRadius: 100}}
            />
        </div>;
    }
}

export default ColorPicker;