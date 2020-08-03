import axios from 'axios';
import { User } from '../interfaces/user.interface'
import { Request } from '../interfaces/request.interface'
import authenticationHeader from '../_helpers/auth-header';
import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(localStorage.getItem('access_token') || '');

const API_URL = 'http://127.0.0.1:5000/api/';

const registerUser = (newUser: User) => {
    return axios.post(API_URL + 'register', {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        password: newUser.password,
        headers: authenticationHeader
    })
    .then(res => {
        console.log({ status: 'ok' });
    })
}

const loginUser = (user: User) => {
    return axios.post(API_URL + 'login', {
        email: user.email,
        password: user.password,
        headers: authenticationHeader
    })
    .then((res: Request) => {
        if (res.data.status === 'ok') {
            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
            }
        } else if (res.data.status === 'error') {
            return { status: 'error', message: res.data.message };
        }
        return { status: 'ok' };
    }).catch(err => {
        console.log(err);
    })
}

const logout = () => {
    localStorage.removeItem('access_token');
    window.location.reload();
}

export const authenticationService = {
    registerUser,
    loginUser,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};