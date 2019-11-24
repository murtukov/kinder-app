import React, {useState, useEffect, useMemo} from 'react';
import useStyles from './styles';
import {Button} from "@blueprintjs/core";

const modes = {DRAW: 0, FILL: 1};

const Canvas = () => {
    let mousePressed = false;
    let lastX, lastY;
    let ctx;

    const c = useStyles();
    const [state, update] = useState({
        mousePressed: false,
        strokeStyle: 'red',
        lineWidth: 10,
        lineJoin: 'round',
        mode: modes.DRAW
    });

    function setMode(mode) {
        update({...state, mode});
    }

    function setWidth() {
        update({...state, lineWidth: 1, strokeStyle: 'blue'});
    }

    useEffect(() => {
        const canvas = document.getElementById('myCanvas');
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
        {useMemo(() =>
            <canvas id="myCanvas" className={c.canvas} width="500" height="200" />, []
        )}
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