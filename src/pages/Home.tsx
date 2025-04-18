import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { FullPageSpinner } from '../components';
import { useDispatch } from 'react-redux';
import { loggedUserDetails, login } from '../features/auth/authSlice';

const Home: React.FC = () => {
    const { userDetails, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const dummyData = {
            id: 1,
            email: "johndoe@example.com",
            access: "dummy_access_token",
            refresh: "dummy_refresh_token",
            first_name: "John",
            last_name: "Doe",
            user_role: "user",
        };

        dispatch(loggedUserDetails({ userDetails: dummyData }));
        dispatch(login({
            user: dummyData.email,
            access: dummyData.access,
            refresh: dummyData.refresh
        }));
    }, []);


    useEffect(() => {

        if (user) {
            if(userDetails?.user_role == "user"){
                navigate("/header-graphic-creator");
            }else{
                navigate("/upload-template");
            }
        } else {
            navigate("/login");
        }

    }, [user, navigate]);

    return (
        <FullPageSpinner />
    );
};

export default Home;
