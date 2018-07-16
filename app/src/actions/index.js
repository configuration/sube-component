import * as webService from "../services/webService"
import * as actionTypes from "../constants/actionTypes"

export const dataResult = (payload) => ({
    type: actionTypes.GET_DATA,
    payload: payload
});

export const getData = () => dispatch => {
    return webService.getXMLData();
};
