import React, {Component} from 'react';
import styles from './styles';
import withStyles from 'react-jss';
import { getOffset } from "./helpers";
import {getCurrentStamp} from "../helpers";

export const modes = {
    DRAW: 'draw',
    FILL: 'fill',
    STAMP: 'stamp'
};

let lastX, lastY;

class Canvas extends Component {
    static width = 800;
    static height = 600;
    static threshold = 100;

    state = {
        mouseDown: false
    };

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.layerRef = React.createRef();
    }

    get canvas() {
        return this.canvasRef.current;
    }

    get ctx() {
        return this.canvas.getContext("2d");
    }

    setMouseDown = (mouseDown) => {
        this.setState({...this.state, mouseDown});
    };

    componentDidMount() {
        // Pass canvas ref to parent
        this.props.setRef(this.canvasRef);

        const ctx = this.ctx;
        const layer = this.layerRef.current;
        const mode = this.props.mode;

        // Set background color
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1;

        this.canvas.addEventListener('mousedown', e => {
            this.setMouseDown(true);
            if (modes.DRAW === mode) {
                this.draw(getOffset(e, this.canvas), false);
            }
        });

        document.addEventListener('mousemove', e => {
            if (modes.DRAW === this.props.mode && this.state.mouseDown === true) {
                this.draw(getOffset(e, this.canvas), true);
            }
        });

        layer.addEventListener('mousemove', e => {
            if (modes.STAMP === this.props.mode) {
                this.drawStampCursor(e);
            }
        });

        layer.addEventListener('mouseleave', this.cleanLayer);
        layer.addEventListener('click', this.drawStamp);

        document.addEventListener('mouseup', () => {
            if(this.state.mouseDown) {
                this.props.persistStep();
            }
            this.setMouseDown(false);
        });
        this.canvas.addEventListener('click', this.onFillClick);
    }

    draw = ({x, y}, isDown) => {
        const ctx = this.ctx;

        if (isDown) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }

        lastX = x;
        lastY = y;
    };

    drawStamp = (e) => {
        const size = this.props.stampSize;
        const img = new Image;

        // ----------------------------------
        const request = new XMLHttpRequest();
        request.open("GET", getCurrentStamp(this.props.currentStamp));
        request.setRequestHeader("Content-Type", "image/svg+xml");
        request.addEventListener("load", function(event) {
            const src = this.responseText.split('black').join('red');
            img.src = "data:image/svg+xml;charset=utf-8," + src;
        });
        request.send();
        // -----------------------------------


        img.onload = () => {
            this.ctx.drawImage(img, e.offsetX - (size / 2), e.offsetY - (size / 2), size, size);
        }
    };

    drawStampCursor = (e) => {
        const size = this.props.stampSize;
        const ctx = this.layerRef.current.getContext('2d');

        ctx.clearRect(0, 0, Canvas.width, Canvas.height);

        const img = new Image;
        img.src = getCurrentStamp(this.props.currentStamp);

        ctx.drawImage(img, e.offsetX - (size/2), e.offsetY - (size/2), size, size);
    };

    onFillClick = (e) => {
        if (modes.FILL === this.props.mode) {
            const region = [];
            const pixelsToCheck = [];

            const ctx = this.canvasRef.current.getContext('2d');
            // Get color of seed pixel
            const seedPxl = {
                x: e.offsetX,
                y: e.offsetY
            };

            region[( seedPxl.y << 16 ) ^ seedPxl.x] = seedPxl;

            this.growRegion(seedPxl, region, pixelsToCheck, ctx, ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data);
            this.fillRegion(region);
        }
    };

    growRegion(seed, region, pixelsToCheck, ctx, color) {
        while (seed) {
            if (seed.x > Canvas.width || seed.y > Canvas.height || seed.x < 0 || seed.y < 0) {
                seed = pixelsToCheck.pop();
                continue;
            }

            const data = ctx.getImageData(seed.x-1, seed.y-1, 3, 3).data;

            // Get adjacent pixels
            for (let i = 4; i < 35; i += 8) {
                if (
                    Math.abs(data[i] - color[0]) < Canvas.threshold &&
                    Math.abs(data[i+1] - color[1]) < Canvas.threshold &&
                    Math.abs(data[i+2] - color[2]) < Canvas.threshold)
                {
                    const adjacent = {
                        x: i === 12 ? seed.x-1 : (i === 20 ? seed.x+1 : seed.x),
                        y: i  <  12 ? seed.y-1 : (i  >  23 ? seed.y+1 : seed.y),
                    };

                    const key = ( adjacent.y << 16 ) ^ adjacent.x;

                    if (undefined === region[key]) {
                        region[key] = adjacent;
                        pixelsToCheck[pixelsToCheck.length] = adjacent;
                    }
                }
            }

            seed = pixelsToCheck.pop();
        }
    }

    fillRegion = (region) => {
        const ctx = this.canvasRef.current.getContext('2d');

        for (let i in region) {
            ctx.fillRect(region[i].x, region[i].y, 1, 1);
        }
    };

    resolveClass = () => {
        const {mode, classes: c} = this.props;

        switch (mode) {
            case modes.DRAW: return c.canvasDraw;
            case modes.FILL: return c.canvasFill;
            case modes.STAMP: return c.canvasStamp;
        }
    };

    cleanLayer = () => {
        const layer = this.layerRef.current.getContext('2d');
        layer.clearRect(0, 0, Canvas.width, Canvas.height);
    };

    render() {
        const {classes: c, mode} = this.props;

        return <div style={{position:'relative'}}>
            <canvas
                ref={this.canvasRef}
                className={this.resolveClass()}
                width={Canvas.width}
                height={Canvas.height}
            />
            <canvas
                ref={this.layerRef}
                width={Canvas.width}
                height={Canvas.height}
                className={c.layer}
                style={{display: mode === modes.STAMP ? 'unset' : 'none'}}
            />
        </div>;
    }
}

export default withStyles(styles)(Canvas);