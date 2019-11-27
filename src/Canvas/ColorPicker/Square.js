import React from 'react';
import withStyles from "react-jss";
import styles from "../styles";

const Square = ({classes: c, color}) => {
    return <div className={c.square} style={{backgroundColor: color}}/>;
};

export default withStyles(styles)(Square);