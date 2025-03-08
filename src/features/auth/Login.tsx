import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import { LoginForm } from '../../forms';

const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div>
            {user ?
                <>
                    <p>Welcome, {user}!</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
                : (
                    <LoginForm />
                )}
        </div>
    );
};

export default Login;