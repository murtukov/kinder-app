import React, {Component} from 'react';
import styles from './styles';
import {Button, Slider} from "@blueprintjs/core";
import ColorPicker from "./ColorPicker/ColorPicker";
import withStyles from 'react-jss';

const modes = {DRAW: 'draw', FILL: 'fill'};

let mousePressed = false;
let lastX, lastY;

class Canvas extends Component {
    state = {
        mousePressed: false,
        strokeStyle: 'red',
        lineWidth: 1,
        lineJoin: 'round',
        mode: modes.DRAW,
        ctx: null
    };

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = this.state.strokeStyle;
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

        canvas.addEventListener('mouseup', e => {
            mousePressed = false;
            let imgd = ctx.getImageData(0, 0, 1, 1);
        });

        canvas.addEventListener('mouseleave', () => mousePressed = false);
        canvas.addEventListener('click', this.onFillClick);
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

    setColor = (color) => {
        const canvas = this.canvasRef.current.getContext('2d');
        canvas.strokeStyle = color;
    };

    clear = () => {
        const canvas = this.canvasRef.current.getContext('2d');
        canvas.clearRect(0, 0, 500, 200)
    };

    onFillClick = (e) => {
        if (modes.FILL === this.state.mode) {
            const region = {};
            const pixelsToCheck = [];

            const ctx = this.canvasRef.current.getContext('2d');
            // Get color of seed pixel
            const seedPxl = {
                color: ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data,
                coords: {x: e.offsetX, y: e.offsetY}
            };

            region[`${seedPxl.coords.x}${seedPxl.coords.y}`] = seedPxl.coords;

            this.growRegion(seedPxl, region, pixelsToCheck, ctx, seedPxl.color);
            this.fillRegion(region);
        }
    };

    growRegion(seedPxl, region, pixelsToCheck, ctx, color) {
        while (seedPxl) {
            const pixels = this.getAdjacentPixels(ctx, seedPxl.coords.x, seedPxl.coords.y, color);

            for (let pxl of pixels) {
                const key = `${pxl.coords.x}${pxl.coords.y}`;

                if (region[key] === undefined) {
                    region[key] = pxl.coords;
                    pixelsToCheck.push(pxl);
                }
            }

            seedPxl = pixelsToCheck.pop();
        }
    }

    fillRegion(region) {
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.fillStyle = this.state.strokeStyle;

        for (let i in region) {
            ctx.fillRect(region[i].x, region[i].y, 1, 1);
        }
    }

    getAdjacentPixels(ctx, x, y, color) {
        const data = ctx.getImageData(x-1, y-1, 3, 3).data;
        const result = [];

        for (let i = 4; i < 35; i += 8) {
            if (data[i] === color[0] && data[i+1] === color[1] && data[i+2] === color[2]) {
                result.push({
                    color: [data[i], data[i+1], data[i+2]],
                    coords: {
                        x: i === 12 ? x-1 : (i === 20 ? x+1: x),
                        y: i < 12 ? y-1 : (i > 23 ? y+1 : y),
                    }
                });
            }
        }

        return result;
    }

    render() {
        const {classes: c} = this.props;

        return <>
            <canvas
                id="myCanvas"
                ref={this.canvasRef}
                className={c.canvas}
                width="500"
                height="200"
            />
            <Button
                text="Draw"
                icon="draw"
                onClick={() => this.setMode(modes.DRAW)}
            />
            <Button
                text="Fill"
                icon="tint"
                onClick={() => this.setMode(modes.FILL)}
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

            <ColorPicker onClick={this.setColor}/>
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