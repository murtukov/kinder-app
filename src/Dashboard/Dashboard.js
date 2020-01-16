import React from 'react';
import {Grid} from "@material-ui/core";
import withStyles from 'react-jss';
import {Button} from "@blueprintjs/core";
import styles from "./styles";
import ballerina from '../assets/dashboard/balerina.png'
import bibleStory from '../assets/dashboard/bible-story.png'
import bulldog from '../assets/dashboard/bulldog.jpg'
import butterfly from '../assets/dashboard/butterfly.jpg'
import catBoy from '../assets/dashboard/cat_boy.gif'
import catGirl from '../assets/dashboard/cat_girl.jpg'
import clown from '../assets/dashboard/clown.svg'
import chameleon from '../assets/dashboard/chameleon2.jpg'
import cock from '../assets/dashboard/cock.gif'
import dog from '../assets/dashboard/dog.svg'
import donald from '../assets/dashboard/donald-duck.jpg'
import donkey from '../assets/dashboard/donkey.gif'
import dragonfly from '../assets/dashboard/dragonfly6.jpg'
import elephant from '../assets/dashboard/elephant.jpg'
import giraffe from '../assets/dashboard/giraffe.gif'
import hamster from '../assets/dashboard/hamster.gif'
import house from '../assets/dashboard/house.jpg'
import iguana from '../assets/dashboard/iguana3.jpg'
import mickeyMouse from '../assets/dashboard/mickey-mouse.jpg'
import pigAndMonkey from '../assets/dashboard/pig_and_mokey.jpg'

const Dashboard = ({classes: c, history}) => {
    const go = url => () => {
        history.push(url);
    };

    return <div className={c.root}>
        <h1>Kinder App</h1>
        <Grid container spacing={2}>
            <Grid item>
                <Button onClick={go('/workspace/ballerina')}>
                    <img src={ballerina} className={c.tile}/>
                    <div>Ballerina</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/ballerina/bibleStory')}>
                    <img src={bibleStory} className={c.tile}/>
                    <div>Bible story</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/bulldog')}>
                    <img src={bulldog} className={c.tile}/>
                    <div>Bulldog</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/butterfly')}>
                    <img src={butterfly} className={c.tile}/>
                    <div>Butterfly</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/catBoy')}>
                    <img src={catBoy} className={c.tile}/>
                    <div>Cat boy</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/catGirl')}>
                    <img src={catGirl} className={c.tile}/>
                    <div>Cat girl</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/clown')}>
                    <img src={clown} className={c.tile}/>
                    <div>Clown</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/chameleon')}>
                    <img src={chameleon} className={c.tile}/>
                    <div>Chameleon</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/cock')}>
                    <img src={cock} className={c.tile}/>
                    <div>Cock</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/dog')}>
                    <img src={dog} className={c.tile}/>
                    <div>Dog</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/donald')}>
                    <img src={donald} className={c.tile}/>
                    <div>Donald Duck</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/donkey')}>
                    <img src={donkey} className={c.tile}/>
                    <div>Donkey</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/dragonfly')}>
                    <img src={dragonfly} className={c.tile}/>
                    <div>Dragonfly</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/elephant')}>
                    <img src={elephant} className={c.tile}/>
                    <div>Elephant</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/giraffe')}>
                    <img src={giraffe} className={c.tile}/>
                    <div>Giraffe</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/hamster')}>
                    <img src={hamster} className={c.tile}/>
                    <div>Hamster</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/house')}>
                    <img src={house} className={c.tile}/>
                    <div>House</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/iguana')}>
                    <img src={iguana} className={c.tile}/>
                    <div>Iguana</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/mickeyMouse')}>
                    <img src={mickeyMouse} className={c.tile}/>
                    <div>Mickey Mouse</div>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={go('/workspace/pigAndMonkey')}>
                    <img src={pigAndMonkey} className={c.tile}/>
                    <div>Pig and Monkey</div>
                </Button>
            </Grid>
        </Grid>
    </div>;
};

export default withStyles(styles)(Dashboard);