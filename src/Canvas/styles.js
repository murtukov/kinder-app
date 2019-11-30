import bucket from '../assets/bucket.png';
import pen from '../assets/pen.png';

export default {
    canvas: {
        border: '1px solid black',
    },
    canvasFill: {
        extend: 'canvas',
        cursor: `url(${bucket}) 0 21, pointer`
    },
    canvasDraw: {
        extend: 'canvas',
        cursor: `url(${pen}) 0 30, pointer`
    },
    square: {
        width: 20,
        height: 20
    }
}