import axios from 'axios';
// import {DATA} from '../constants';

export const getXMLData = () => {
    // return axios.get("http://localhost:3000/data/SUBELER.xml");
    //return axios.get("/app/data/SUBELER.xml");
    return axios.get("https://s3.us-east-2.amazonaws.com/emreavcilar/SUBELER.XML");
};