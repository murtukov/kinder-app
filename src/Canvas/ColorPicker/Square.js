import React from 'react';
import useStyles from "../styles";

const Square = ({color}) => {
    const c = useStyles();

    return <div className={c.square} style={{backgroundColor: color}}/>;
};

export default Square;