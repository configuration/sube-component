import * as cities from '../constants/cities';

class Helper{

    static getCityNameByNo = (no) => {
        if(no){
            for (let i = 0; i < Object.keys(cities.CITIES).length; i++) {
                const elem = Object.keys(cities.CITIES)[i];

                if(elem == no[0]){
                    return cities.CITIES[elem.toString()]
                }
            }
        }
        else {
            return "";
        }
    };

    static removeUnderScoresFromStr = (str) => {
        return str.split("_").join(' ');
    }
}

export default Helper;
