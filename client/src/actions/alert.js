import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid';
console.log(SET_ALERT)
export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 2000)
}