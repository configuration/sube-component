import { combineReducers } from 'redux';
import subeReducer from './subeReducer';
const combineRed = combineReducers({
    subeReducer,
});

export default combineRed