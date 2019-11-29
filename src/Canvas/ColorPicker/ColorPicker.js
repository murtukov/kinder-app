import React from 'react';
import {Button} from "@blueprintjs/core";
import Square from "./Square";

const ColorPicker = ({onClick}) => {
    return (
        <div>
            <Button style={{padding: 1}} onClick={() => onClick('black')}>
                <Square color='black'/>
            </Button>
            <Button style={{padding: 1}} onClick={() => onClick('red')}>
                <Square color='red'/>
            </Button>
            <Button style={{padding: 1}} onClick={() => onClick('blue')}>
                <Square color='blue'/>
            </Button>
            <Button style={{padding: 1}} onClick={() => onClick('green')}>
                <Square color='green'/>
            </Button>
        </div>
    );
};

export default ColorPicker;