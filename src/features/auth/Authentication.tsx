import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, SubHeader } from '../../components';
import Spinner from '../../components/spinner/Spinner';
import { useDispatch } from 'react-redux';
import { loggedUserDetails, login, logout } from './authSlice';

const Authentication = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dummyData = {
        id: 1,
        email: "johndoe@example.com",
        access: "dummy_access_token",
        refresh: "dummy_refresh_token",
        first_name: "Jhon",
        last_name: "Doe",
        user_role: "user",
    };

    useEffect(() => {
        dispatch(login({
            user: "dummy@email.com",
            access: dummyData.access,
            refresh: dummyData.refresh
        }));
    }, [])

    useEffect(() => {
        
        const timer = setTimeout(() => {
            const params = new URLSearchParams(location.search);
            const entityid = params.get("entityid");
            const realm = params.get("realm");

            if (!entityid || !realm) {
                navigate("/unauthorized");
                return;
            }

            if (entityid === "urn:test:pwd:pwcguid:p" && realm === "/pwc") {

                dispatch(loggedUserDetails({ userDetails: dummyData }));
                dispatch(login({
                    user: dummyData.email,
                    access: dummyData.access,
                    refresh: dummyData.refresh
                }));
                navigate("/header-graphic-creator");
            } else {
                dispatch(logout())
                navigate("/unauthorized");
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [location.search, navigate]);

    return (
        <Card className="w-full h-full flex flex-col items-center justify-center">
            <Spinner />
            <SubHeader>Authenticating your request</SubHeader>
        </Card>
    );
};

export default Authentication;
