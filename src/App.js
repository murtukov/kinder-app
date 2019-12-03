import React from 'react';
import Canvas from "./Canvas/Canvas";
import withStyles from 'react-jss';

function App({classes: c}) {
    return (
        <div className={c.root}>
            <Canvas/>
        </div>
    );
}

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default withStyles(styles)(App);
