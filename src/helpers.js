import heart from "./assets/stamps/heart.svg";
import planet from "./assets/stamps/planet.svg";
import sun from "./assets/stamps/sun.svg";
import sun2 from "./assets/stamps/sun2.svg";
import cloud from "./assets/stamps/cloud.svg";
import star from "./assets/stamps/star.svg";
import star2 from "./assets/stamps/star2.svg";
import flash from "./assets/stamps/flash.svg";
import ballerina from './assets/dashboard/balerina.png'
import bulldog from './assets/dashboard/bulldog.jpg'
import bibleStory from './assets/dashboard/bible-story.png'
import butterfly from './assets/dashboard/butterfly.jpg'
import catBoy from './assets/dashboard/cat_boy.gif'
import catGirl from './assets/dashboard/cat_girl.jpg'
import clown from './assets/dashboard/clown.svg'
import chameleon from './assets/dashboard/chameleon2.jpg'
import cock from './assets/dashboard/cock.gif'
import dog from './assets/dashboard/dog.svg'
import donaldDuck from './assets/dashboard/donald-duck.jpg'
import donkey from './assets/dashboard/donkey.gif'
import dragonfly from './assets/dashboard/dragonfly6.jpg'
import elephant from './assets/dashboard/elephant.jpg'
import giraffe from './assets/dashboard/giraffe.gif'
import hamster from './assets/dashboard/hamster.gif'
import house from './assets/dashboard/house.jpg'
import iguana from './assets/dashboard/iguana3.jpg'
import mickeyMouse from './assets/dashboard/mickey-mouse.jpg'
import pigAndMonkey from './assets/dashboard/pig_and_mokey.jpg'
import acne from './assets/dashboard/scene.jpg'

export function getCurrentStamp(stamp) {
    switch (stamp) {
        case 'heart': return heart;
        case 'planet': return planet;
        case 'sun': return sun;
        case 'sun2': return sun2;
        case 'cloud': return cloud;
        case 'star': return star;
        case 'star2': return star2;
        case 'flash': return flash;
    }
}

export function resolvePicture(name) {
    switch (name) {
        case 'ballerina': return ballerina;
        case 'bulldog': return bulldog;
        case 'bibleStory': return bibleStory;
        case 'butterfly': return butterfly;
        case 'catBoy': return catBoy;
        case 'catGirl': return catGirl;
        case 'clown': return clown;
        case 'chameleon': return chameleon;
        case 'cock': return cock;
        case 'dog': return dog;
        case 'donald': return donaldDuck;
        case 'donkey': return donkey;
        case 'dragonfly': return dragonfly;
        case 'elephant': return elephant;
        case 'giraffe': return giraffe;
        case 'hamster': return hamster;
        case 'house': return house;
        case 'iguana': return iguana;
        case 'mickeyMouse': return mickeyMouse;
        case 'pigAndMonkey': return pigAndMonkey;
        case 'acne': return acne;
    }
}