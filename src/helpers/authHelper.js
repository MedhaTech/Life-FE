/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthGuardActive } from '../constants/defaultValues';
import { getCurrentUser } from './Utils';

const ProtectedRoute = ({ component: Component, user: user, ...rest }) => {
    const setComponent = (props) => {
        if (isAuthGuardActive) {
            const currentUser = getCurrentUser();
            const loginTime = localStorage.getItem('time');

            const loginTimestamp = new Date(loginTime).getTime();

            const currentTime = new Date();
            const difference = currentTime - loginTimestamp;
            //  difference = currentTime - loginTimestamp in milliseconds //

            // if (difference > 3600000) {
            //     localStorage.clear();
            //     return <Redirect to="/mentor" />;
            // } else {
            //     localStorage.setItem('time', new Date().toString());
            // }

            // if (currentUser?.data[0]?.role === user) {
            //     return <Component {...props} />;
            // }

            if (difference > 300000) {
                localStorage.clear();
                if (user.includes('ADMIN')) {
                    return <Redirect to="/admin" />;
                // } else if (user.includes('MENTOR')) {
                //     return <Redirect to="/mentor" />;
                } else if (user.includes('EADMIN')) {
                    return <Redirect to="/eadmin" />;
                } else if (user.includes('INSTITUTION')) {
                    return <Redirect to="/institution" />;
                } else if (user.includes('STUDENT')) {
                    return <Redirect to="/login" />;
                } else if (user.includes('EVALUATOR')) {
                    return <Redirect to="/evaluator" />;
                }
            } else {
                localStorage.setItem('time', new Date().toString());
            }

            // Check if the user is logged in and has an allowed role
            if (currentUser && user.includes(currentUser?.data[0]?.role)) {
                return <Component {...props} />;
            }
            return (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />
            );
        }
        return <Component {...props} />;
    };

    return <Route {...rest} render={setComponent} />;
};

export { ProtectedRoute };
