import * as cities from '../constants/cities';

class Helper{

    static getCityNameByNo = (no) => {
        // console.log( typeof  no[0]);

        if(no){
/*
            Object.keys(cities.CITIES).forEach((e) => {

                // console.log("e " , typeof e);
                // console.log("no " ,typeof no.toString());

                if (e == no[0]) {
                    console.log("e " ,e);
                    console.log("no " ,no[0]);
                    console.log("cities.CITIES e " , cities.CITIES[e]);
                    return cities.CITIES[e.toString()];
                }
            });
*/

            for (let i = 0; i < Object.keys(cities.CITIES).length; i++) {
                const elem = Object.keys(cities.CITIES)[i];

                // console.log("elem " , elem)

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
