import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const accessToken = localStorage.access_token;
        if (accessToken) {
            const decoded = jwt_decode(accessToken);
            var current_time = Date.now() / 1000;
            // The tocken is expired
            if (decoded.exp < current_time) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
        } else {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)