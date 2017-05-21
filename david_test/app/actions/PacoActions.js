/**
 * Created by Fabacus on 17/05/2017.
 */
import {PACO_TYPED,FETCHING_DATA} from "./types";


export function pacoisTyped() {
    return (dispatch, getState) => {
        dispatch(onPacoTyped({ payload: true }));
    };
}


export function onPacoTyped({ payload }) {
    return {
        type: PACO_TYPED,
        payload,
    };
}


export function fetchData() {
    return {
        type: FETCHING_DATA
    }
}