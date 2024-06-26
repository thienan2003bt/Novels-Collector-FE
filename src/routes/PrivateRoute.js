import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute(props) {
    const { user } = useContext(UserContext);
    const { children } = props;

    return (
        <div>
            {(user && user.isAdmin === true)
                ? <>
                    {children}
                </>
                : <Navigate to="/login" />
            }
        </div>
    );
}

export default PrivateRoute;