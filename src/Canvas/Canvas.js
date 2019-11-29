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
            console.log("Region grown", Object.keys(region).length);

            this.fillRegion(region);
        }
    };

    growRegion(seedPxl, region, pixelsToCheck, ctx, color) {
        while (seedPxl) {
            for (let pxl of this.getAdjacentPixels(ctx, seedPxl.coords.x, seedPxl.coords.y)) {
                const key = `${pxl.coords.x}${pxl.coords.y}`;

                if (region[key] === undefined && this.sameColor(pxl.color, color)) {
                    region[key] = pxl.coords;
                    pixelsToCheck.push(pxl);
                }
            }

            seedPxl = pixelsToCheck.pop();
        }
    }

    fillRegion(region) {
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.fillStyle = "red";

        for (let i in region) {
            ctx.fillRect(region[i].x, region[i].y, 1, 1);
        }

        console.log("Region filled");
    }

    getAdjacentPixels(ctx, x, y) {
        return [
            {
                color: ctx.getImageData(x, y+1, 1, 1).data,
                coords: {x, y: y+1}
            },
            {
                color: ctx.getImageData(x+1, y, 1, 1).data,
                coords: {x: x+1, y}
            },
            {
                color: ctx.getImageData(x, y-1, 1, 1).data,
                coords: {x, y: y-1}
            },
            {
                color: ctx.getImageData(x-1, y, 1, 1).data,
                coords: {x: x-1, y}
            }
        ];
    }

    sameColor(first, second) {
        return (first[0] === second[0] && first[1] === second[1] && first[2] === second[2] /*&& first[3] === second[3]*/);
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