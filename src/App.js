import React from 'react';
import Canvas from "./Canvas/Canvas";
import withStyles from 'react-jss';
import ColorPicker from "./Canvas/ColorPicker/ColorPicker";
import {Button, Slider, Card, Intent, Divider, Popover, Tooltip, Position} from "@blueprintjs/core";
import {modes} from "./Canvas/Canvas";
import {Grid} from "@material-ui/core";
import pencil from '../src/assets/pencil.png'
import bucket from '../src/assets/paint-bucket.png'
import heart from '../src/assets/stamps/heart.svg'
import planet from '../src/assets/stamps/planet.svg'
import cloud from '../src/assets/stamps/cloud.svg'
import sun from '../src/assets/stamps/sun.svg'
import sun2 from '../src/assets/stamps/sun2.svg'
import star from '../src/assets/stamps/star.svg'
import star2 from '../src/assets/stamps/star2.svg'
import flash from '../src/assets/stamps/flash.svg'
import {getCurrentStamp, resolvePicture} from "./helpers";
import {POPOVER_DISMISS} from "@blueprintjs/core/lib/cjs/common/classes";


class App extends React.Component {
    canvasRef;

    state = {
        lineWidth: 1,
        mode: modes.DRAW,
        prevSteps: [],
        nextSteps: [],
        currentStamp: 'heart',
        stampSize: 16,
        color: 'black',
    };

    setRef = (ref) => {
        this.canvasRef = ref;
    };

    setColor = (color) => {
        const ctx = this.canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        this.setState({...this.state, color});
    };

    setWidth(width = 1) {
        const canvas = this.canvas.getContext('2d');
        canvas.lineWidth = width;

        this.setState({...this.state, lineWidth: width})
    }

    get canvas() {
        return this.canvasRef.current;
    }

    get ctx() {
        return this.canvasRef.current.getContext('2d');
    }

    clear = () => {
        const prevColor = this.ctx.fillStyle;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

        this.ctx.fillStyle = prevColor;

        this.drawSkeleton();
    };

    setMode = (mode) => {
        this.setState({...this.state, mode});
    };

    persistStep = () => {
        const prevSteps = this.state.prevSteps;

        prevSteps.push(this.ctx.getImageData(0, 0, Canvas.width, Canvas.height));

        this.setState({
            ...this.state,
            prevSteps,
        });
    };

    prevStep = () => {
        const prevSteps = this.state.prevSteps;

        if (prevSteps.length > 1) {
            prevSteps.pop();
            const imageData = prevSteps[prevSteps.length-1];
            this.setState({...this.state, prevSteps});
            this.ctx.putImageData(imageData, 0, 0);
        } else {
            this.clear();
        }
    };

    componentDidMount = () => {
        this.drawSkeleton();
    };

    drawSkeleton = () => {
        const {match} = this.props;

        const img = new Image;
        img.src = resolvePicture(match.params.name);

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let newWidth = 0;
            let newHeight = 0;

            if (img.width > img.height) {
                newHeight = (Canvas.width / aspectRatio);
                this.ctx.drawImage(img, (Canvas.width / 2) - (Canvas.width/2), (Canvas.height / 2) - (newHeight / 2), Canvas.width, newHeight);
            } else {
                newWidth = Canvas.height * aspectRatio;
                this.ctx.drawImage(img, (Canvas.width / 2) - (newWidth/2), (Canvas.height / 2) - (Canvas.height / 2), newWidth, Canvas.height);
            }
        };
    };

    renderStamps(c) {
        return (
            <div style={{padding: 15}}>
                <Button onClick={this.setStamp('heart')} className={POPOVER_DISMISS}>
                    <img src={heart} className={c.stampImg} alt='heart'/>
                </Button>

                <Button onClick={this.setStamp('planet')} className={POPOVER_DISMISS}>
                    <img src={planet} className={c.stampImg} alt='planet'/>
                </Button>

                <Button onClick={this.setStamp('sun')} className={POPOVER_DISMISS}>
                    <img src={sun} className={c.stampImg} alt='sun'/>
                </Button>

                <Button onClick={this.setStamp('sun2')} className={POPOVER_DISMISS}>
                    <img src={sun2} className={c.stampImg} alt='sun2'/>
                </Button>

                <Button onClick={this.setStamp('cloud')} className={POPOVER_DISMISS}>
                    <img src={cloud} className={c.stampImg} alt='cloud'/>
                </Button>

                <Button onClick={this.setStamp('star')} className={POPOVER_DISMISS}>
                    <img src={star} className={c.stampImg} alt='star'/>
                </Button>

                <Button onClick={this.setStamp('star2')} className={POPOVER_DISMISS}>
                    <img src={star2} className={c.stampImg} alt='star2'/>
                </Button>

                <Button onClick={this.setStamp('flash')} className={POPOVER_DISMISS}>
                    <img src={flash} className={c.stampImg} alt='flash'/>
                </Button>
            </div>
        );
    }

    setStamp = (stamp) => () => {
        this.setState({
            ...this.state,
            currentStamp: stamp
        });
    };

    saveImage = () => { console.log("saving");
        const image = this.canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = "my-image.png";
        link.href = image;
        link.click();
    };

    render() {
        let {classes: c} = this.props;

        return (
            <Grid container direction='row'>
                <Grid item>
                    <Card style={{display: 'flex', flexDirection: 'column'}} elevation={2}>
                        <Grid container>
                            <Grid item>
                                <Tooltip content='Pen'>
                                    <Button
                                        onClick={() => this.setMode(modes.DRAW)}
                                        active={this.state.mode === modes.DRAW}
                                        className={c.button}
                                    >
                                        <img src={pencil} alt='pencil-icon'/>
                                    </Button>
                                </Tooltip>
                                <Tooltip content='Fill'>
                                    <Button
                                        onClick={() => this.setMode(modes.FILL)}
                                        active={this.state.mode === modes.FILL}
                                        mode={this.state.mode}
                                        className={c.button}
                                    >
                                        <img src={bucket} alt='bucket-icon'/>
                                    </Button>
                                </Tooltip>
                                <Popover
                                    content={this.renderStamps(c)}
                                    onOpening={() => this.setMode(modes.STAMP)}
                                >
                                    <Tooltip content='Stamp'>
                                        <Button
                                            className={c.button}
                                            active={this.state.mode === modes.STAMP}
                                        >
                                            <img
                                                src={getCurrentStamp(this.state.currentStamp)}
                                                className={c.stampImg} alt='stamp'
                                            />
                                        </Button>
                                    </Tooltip>
                                </Popover>
                            </Grid>
                        </Grid>

                        <Divider/>

                        <Grid container>
                            <Grid item>
                                <Tooltip content='Undo' position={Position.BOTTOM}>
                                    <Button
                                        icon='undo'
                                        onClick={this.prevStep}
                                        className={c.button}
                                    />
                                </Tooltip>
                                <Tooltip content='Redo' position={Position.BOTTOM}>
                                    <Button
                                        icon='redo'
                                        className={c.button}
                                    />
                                </Tooltip>
                                <Tooltip content='Save image' position={Position.BOTTOM}>
                                    <Button
                                        icon='floppy-disk'
                                        className={c.button}
                                        intent={Intent.PRIMARY}
                                        onClick={this.saveImage}
                                    />
                                </Tooltip>
                            </Grid>
                        </Grid>

                        <Divider/>

                        <Tooltip content='Clean canvas'>
                            <Button
                                onClick={this.clear}
                                icon='trash'
                                intent={Intent.WARNING}
                            />
                        </Tooltip>
                    </Card>
                </Grid>

                <Grid item>
                    <Canvas
                        setRef={this.setRef}
                        mode={this.state.mode}
                        persistStep={this.persistStep}
                        currentStamp={this.state.currentStamp}
                        stampSize={this.state.stampSize}
                        color={this.state.color}
                        size={this.state.lineWidth}
                    />
                    <div style={{width: 800}}>
                        <Slider
                            initialValue={1}
                            stepSize={1}
                            labelStepSize={5}
                            onChange={val => this.setWidth(val)}
                            min={1}
                            max={100}
                            value={this.state.lineWidth}
                        />
                    </div>
                </Grid>

                <Grid item>
                    <Card elevation={2}>
                        <ColorPicker setColor={this.setColor}/>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 40,
        height: 40,
        margin: 2
    },
    stampImg: {
        width: 16,
        height: 16,
    }
};

export default withStyles(styles)(App);
