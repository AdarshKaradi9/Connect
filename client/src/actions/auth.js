import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from './types';
import { setAlert } from './alert'
import setAuthToken from '../util/setAuthToken'


export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth');
        
        dispatch({
            type: USER_LOADED,
            payload: res.data
        }) 
    }catch(err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}


export const register = ({ name, email,password }) => async dispatch => {
    const config = {
        headers:  {
            'method': 'post',
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({ name, email, password });
    console.log(body)
    try {
        const res = await axios.post('/api/users', body, config);
        
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }) 
        dispatch(loadUser());
    }catch(err) {
        const errors = err.response.data.errors;
        if(errors) {
            console.log(errors)
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//Login user

export const login = ({ email,password }) => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }
    const config = {
        headers:  {
            'method': 'post',
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({email, password});
    console.log(body)
    try {
        const res = await axios.post('/api/auth', body, config);
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }) 
        dispatch(loadUser());
    }catch(err) {
        const errors = err.response.data.errors;
        if(errors.length>1) {
            console.log(errors)
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        } else  {
            console.log(errors)
            dispatch(setAlert(errors[0].msg,'danger'))
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    })
    
}