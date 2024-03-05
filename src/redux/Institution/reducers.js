/* eslint-disable no-unused-vars */
/* eslint-disable indent */
// Foulders Reducers //
import { languageOptions } from '../../constants/languageOptions';
import {
    GET_FETCH_INST_DIST,
    GET_INST_BLOCK,
    GET_INST_TALUK,
    GET_PLACE
} from '../actions';

// const localLang = JSON.parse(localStorage.getItem('s_language'));

const INIT_STATE = {
    loading: false,
    error: '',
    successMessage: '',

    instdist: [],
    instBlock: [],
    instTaluk: [],
    instPlace: []
};

export default (state = INIT_STATE, action) => {
    const newState = { ...state };
    // console.log(action.payload);
    switch (action.type) {
        case GET_FETCH_INST_DIST:
            return {
                ...state,
                instdist: action.payload
            };
        case GET_INST_BLOCK:
            return {
                ...state,
                instBlock: action.payload
            };
        case GET_INST_TALUK:
            return {
                ...state,
                instTaluk: action.payload
            };
        case GET_PLACE:
            return {
                ...state,
                instPlace: action.payload
            };
        default:
            return newState;
    }
};
