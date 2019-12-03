import React, {Component} from 'react';
import styles from './styles';
import {Button, Slider} from "@blueprintjs/core";
import withStyles from 'react-jss';
import ColorPicker from "./ColorPicker/ColorPicker";

const modes = {DRAW: 'draw', FILL: 'fill'};

let mousePressed = false;
let lastX, lastY;

class Canvas extends Component {
    static width = 500;
    static height = 300;

    state = {
        mousePressed: false,
        strokeStyle: 'black',
        lineWidth: 1,
        lineJoin: 'round',
        mode: modes.DRAW,
        ctx: null
    };

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() { console.log("Mount");
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set background color
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = this.state.strokeStyle;
        ctx.fillStyle = "black";
        ctx.lineWidth = this.state.lineWidth;
        ctx.lineJoin = this.state.lineJoin;

        canvas.addEventListener('mousedown', e => {
            mousePressed = true;

            if (modes.DRAW === this.state.mode) {
                this.draw(e.pageX - offset(e.target).left, e.pageY - offset(e.target).top, false);
            }
        });

        canvas.addEventListener('mousemove', e => {
            if (mousePressed && modes.DRAW === this.state.mode) {
                this.draw(e.pageX - offset(e.target).left, e.pageY - offset(e.target).top, true);
            }
        });

        canvas.addEventListener('mouseup', () => mousePressed = false);
        canvas.addEventListener('click', this.onFillClick);

        // Todo: rethink this
        canvas.addEventListener('mouseleave', () => {
            mousePressed = false
        });
    }

    draw(x, y, isDown) {
        const ctx = this.canvasRef.current.getContext("2d");

        if (isDown) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }

        lastX = x;
        lastY = y;
    }

    setMode(mode) {
        this.setState({...this.state, mode});
        console.log("Change mode...");
    }

    setWidth(width = 1) {
        const canvas = this.canvasRef.current.getContext('2d');
        canvas.lineWidth = width;

        this.setState({...this.state, lineWidth: width});
    }

    setColor = (color) => { console.log("Setting the color", color);
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    };

    clear = () => {
        const ctx = this.canvasRef.current.getContext('2d');
        const prevColor = ctx.fillStyle;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

        ctx.fillStyle = prevColor;
    };

    onFillClick = (e) => {
        if (modes.FILL === this.state.mode) {
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
                if (data[i] === color[0] && data[i+1] === color[1] && data[i+2] === color[2]) {
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

    render() {
        const {classes: c} = this.props;

        return <>
            <canvas
                id="myCanvas"
                ref={this.canvasRef}
                className={this.state.mode === modes.DRAW ? c.canvasDraw : c.canvasFill}
                width={Canvas.width}
                height={Canvas.height}
            />
            <ColorPicker
                onClick={this.setColor}
            />
            <Button
                text="Draw"
                icon="draw"
                onClick={() => this.setMode(modes.DRAW)}
                active={this.state.mode === modes.DRAW}
            />
            <Button
                text="Fill"
                icon="tint"
                onClick={() => this.setMode(modes.FILL)}
                active={this.state.mode === modes.FILL}
            />
            <Button
                text="Clear"
                onClick={this.clear}
            />
            <div style={{width: 300}}>
                <Slider
                    initialValue={1}
                    stepSize={1}
                    onChange={val => this.setWidth(val)}
                    min={1}
                    max={20}
                    value={this.state.lineWidth}
                />
            </div>
        </>;
    }
}

function offset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
}

export default withStyles(styles)(Canvas);