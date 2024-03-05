import axios from 'axios';

import {
    GET_FETCH_INST_DIST,
    GET_INST_BLOCK,
    GET_INST_TALUK,
    GET_PLACE
} from '../actions';
import { URL, KEY } from '../../constants/defaultValues';
import { getNormalHeaders } from '../../helpers/Utils';
import 'sweetalert2/src/sweetalert2.scss';
import { encryptGlobal } from '../../constants/encryptDecrypt';

export const getInstPlaceSuccess = (data) => async (dispatch) => {
    // where data = all districts //
    dispatch({
        type: GET_PLACE,
        payload: data
    });
};
export const getInstPlaceData = (item) => async (dispatch) => {
    // here we can see  district wise data //
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let result;
        const ItemAtl = encryptGlobal(
            JSON.stringify({
                block_id: item
            })
        );
        result = await axios
            .get(`${URL.getInstPlacesOnly}Data=${ItemAtl}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data = result.data.data.length > 0 ? result.data.data : [];
            // const ATLlistObj = {};
            // const ATLCodeslist = data.map((code) => {
            //     ATLlistObj[code.organization_code] = code.organization_name;
            //     return code.organization_code;
            // });
            // console.log(ATLCodeslist, '1');
            dispatch(getInstPlaceSuccess(data));
        } else {
            dispatch(getInstPlaceSuccess([]));
        }
    } catch (error) {
        dispatch(getInstPlaceSuccess([]));
    }
};
export const getInstTalukSuccess = (data) => async (dispatch) => {
    // where data = all districts //
    dispatch({
        type: GET_INST_TALUK,
        payload: data
    });
};
export const getInstTalukData = (item) => async (dispatch) => {
    // here we can see  district wise data //
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let result;
        const Item = encryptGlobal(
            JSON.stringify({
                district_id: item
            })
        );
        result = await axios
            .get(`${URL.getInstTalukOnly}Data=${Item}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data = result.data.data.length > 0 ? result.data.data : [];
            dispatch(getInstTalukSuccess(data));
        } else {
            dispatch(getInstTalukSuccess([]));
        }
    } catch (error) {
        dispatch(getInstTalukSuccess([]));
    }
};
export const getFetchInstDistsSuccess = (data) => async (dispatch) => {
    // where data = all districts //

    dispatch({
        type: GET_FETCH_INST_DIST,
        payload: data
    });
};
export const getFetchInstDistData = () => async (dispatch) => {
    // here we can see  district wise data //
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);

        let result;
        result = await axios
            .get(`${URL.getFetchInstDistsOnly}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data = result.data.data.length > 0 ? result.data.data : [];

            dispatch(getFetchInstDistsSuccess(data));
        } else {
            dispatch(getFetchInstDistsSuccess([]));
        }
    } catch (error) {
        dispatch(getFetchInstDistsSuccess([]));
    }
};
export const getInstBlockSuccess = (data) => async (dispatch) => {
    // where data = all districts //
    dispatch({
        type: GET_INST_BLOCK,
        payload: data
    });
};
export const getInstBlockData = (item) => async (dispatch) => {
    // here we can see  district wise data //
    try {
        const blockId = encryptGlobal(
            JSON.stringify({
                district_id: item
            })
        );
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let result;
        result = await axios
            .get(`${URL.getBlocksOnly}Data=${blockId}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data = result.data.data.length > 0 ? result.data.data : [];

            dispatch(getInstBlockSuccess(data));
        } else {
            dispatch(getInstBlockSuccess([]));
        }
    } catch (error) {
        dispatch(getInstBlockSuccess([]));
    }
};
