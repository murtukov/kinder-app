import heart from "./assets/stamps/heart.svg";
import planet from "./assets/stamps/planet.svg";
import sun from "./assets/stamps/sun.svg";
import sun2 from "./assets/stamps/sun2.svg";
import cloud from "./assets/stamps/cloud.svg";
import star from "./assets/stamps/star.svg";
import star2 from "./assets/stamps/star2.svg";

export function getCurrentStamp(stamp) {
    switch (stamp) {
        case 'heart': return heart;
        case 'planet': return planet;
        case 'sun': return sun;
        case 'sun2': return sun2;
        case 'cloud': return cloud;
        case 'star': return star;
        case 'star2': return star2;
    }
}