import React, {useState, useEffect, useCallback} from 'react';
import useStyles from './styles';
import {Button, Slider} from "@blueprintjs/core";
import ColorPicker from "./ColorPicker/ColorPicker";

const modes = {DRAW: 'draw', FILL: 'fill'};

const Canvas = () => {
    const canvasRef = React.useRef(null);
    let mousePressed = false;
    let lastX, lastY;
    let ctx;

    const c = useStyles();
    const [state, update] = useState({
        mousePressed: false,
        strokeStyle: 'red',
        lineWidth: 1,
        lineJoin: 'round',
        mode: modes.DRAW,
    });

    function setMode(mode) {
        update({...state, mode});

        console.log("Change mode...");
    }

    function setWidth(width = 1) {
        const canvas = canvasRef.current.getContext('2d');
        canvas.lineWidth = width;

        update({...state, lineWidth: width});
    }

    function setColor(color) {
        const canvas = canvasRef.current.getContext('2d');
        canvas.strokeStyle = color;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = state.strokeStyle;
        ctx.lineWidth = state.lineWidth;
        ctx.lineJoin = state.lineJoin;

        canvas.addEventListener('mousedown', function(e) {
            mousePressed = true;
            draw(e.pageX - offset(this).left, e.pageY - offset(this).top, false);
        });

        canvas.addEventListener('mousemove', function(e) {
            if (mousePressed) {
                draw(e.pageX - offset(this).left, e.pageY - offset(this).top, true);
            }
        });

        canvas.addEventListener('mouseup', e => {
            mousePressed = false;
            let imgd = ctx.getImageData(0, 0, 1, 1);
        });

        canvas.addEventListener('mouseleave', e => {
            mousePressed = false;
        });
    }, []);

    // On fill click
    const onCanvasClick = useCallback(event => {
        if (modes.FILL === state.mode) {
            const ctx = canvasRef.current.getContext('2d');
            const p = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;

            console.log("Pixel: ", p);
        }
    }, [state.mode]);

    // const onCanvasMousedown = useCallback(e => {
    //     mousePressed = true;
    //     draw(e.pageX - offset(this).left, e.pageY - offset(this).top, false);
    // }, []);

    // Set event listener for filler
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvasRef.current.getContext("2d");
        canvas.addEventListener('click', onCanvasClick);
        return () => canvas.removeEventListener('click', onCanvasClick)
    }, [state.mode]);

    function draw(x, y, isDown) {
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

    return <>
        <canvas
            id="myCanvas"
            ref={canvasRef}
            className={c.canvas}
            width="500"
            height="200"
        />
        <Button
            text="Draw"
            icon="draw"
            onClick={() => setMode(modes.DRAW)}
        />
        <Button
            text="Fill"
            icon="tint"
            onClick={() => setMode(modes.FILL)}
        />
        <Button
            text="1px"
            onClick={() => setWidth()}
        />
        <div style={{width: 300}}>
            <Slider
                initialValue={1}
                stepSize={1}
                onChange={val => setWidth(val)}
                min={1}
                max={20}
                value={state.lineWidth}
            />
        </div>

        <ColorPicker onClick={setColor}/>
    </>;
};

function offset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
}

export default Canvas;