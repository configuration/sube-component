import {
    GET_DATA
} from '../constants/actionTypes'

const initialState = {};

const subeReducer = (state = initialState, action) => {
    switch (action.type){
        case GET_DATA:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export default subeReducer;