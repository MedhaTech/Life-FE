/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent
} from 'react-pro-sidebar';
import {
    FaTh,
    FaThLarge,
    FaLandmark,
    FaLightbulb,
    FaShieldVirus,
    FaBars,
    FaHouseUser,
    FaCertificate
} from 'react-icons/fa';
import { RiSurveyFill, RiLockPasswordFill, RiTeamFill } from 'react-icons/ri';
import axios from 'axios';

import 'react-pro-sidebar/dist/css/styles.css';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/media/tn-brands/EDII_LOGO.png';

import TicketIcon from '../assets/media/ticket.png';
import FaqIcon from '../assets/media/faq.png';
import { useDispatch } from 'react-redux';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { logout } from '../helpers/Utils';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SmallLogo from '../assets/media/logo192.png';
import { encryptGlobal } from '../constants/encryptDecrypt';
import { getCurrentUser } from '../helpers/Utils';

const Aside = ({ rtl, toggled, handleToggleSidebar }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [ideaSubmittedData, setIdeaSubmittedData] = useState({});
    const currentUser = getCurrentUser('current_user');
    const TeamId = currentUser?.data[0]?.team_id;

    // const presuveyStatusGl = useSelector(
    //     (state) => state?.studentRegistration.presuveyStatusGl
    // );

    const location = useLocation();

    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(false);

    //create a custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = (val) => {
        //condition checking to change state from true to false and vice versa
        setMenuCollapse(val);
        // menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };
    useEffect(() => {
        if (
            location.pathname === '/playCourse' ||
            location.pathname === '/admin/add-course'
        ) {
            setMenuCollapse(true);
        }
        const Param = encryptGlobal(
            JSON.stringify({
                team_id: TeamId
            })
        );
        var configidea = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/ideas/submittedDetails?Data=${Param}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(configidea)
            .then(function (response) {
                if (response.status === 200) {
                    // if (response.data.data !== null) {
                    setIdeaSubmittedData(response.data.data[0]);
                    // }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    // const handleClick = (e) => {
    //     if (presuveyStatusGl !== 'COMPLETED') e.preventDefault();
    // };
    const handleLogout = (e) => {
        logout(history, t, 'student', dispatch);
        e.preventDefault();
    };
    return (
        <ProSidebar
            rtl={rtl}
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggleSidebar}
            collapsed={menuCollapse}
        >
            <SidebarHeader>
                <div
                    // className="sidebar-header header-comp sticky-top"
                    className="sidebar-header header-comp sticky-top d-flex logo-section justify-content-center align-items-center"
                >
                    <div
                        className="d-flex logo-section"
                        style={{ height: '5rem' }}
                    >
                        <Link to={'/dashboard'} exact className="d-flex">
                            {menuCollapse ? (
                                <img
                                    src={SmallLogo}
                                    alt="logo"
                                    className="img-fluid img-close p-2"
                                />
                            ) : (
                                <>
                                    <img
                                        src={Logo}
                                        alt="logo"
                                        className="img-fluid img-open w-100"
                                    />
                                </>
                            )}
                        </Link>
                    </div>
                </div>
                <div className="closemenu" style={{ paddingRight: '1rem' }}>
                    {/* changing menu collapse icon on click */}
                    {menuCollapse ? (
                        <FaBars onClick={() => menuIconClick(false)} />
                    ) : (
                        <FaBars onClick={() => menuIconClick(true)} />
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <Menu iconShape="circle">
                    {/* <MenuItem
                        icon={<RiSurveyFill />}
                        className={
                            location.pathname === '/student/pre-survey' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink exact={true} to={'/student/pre-survey'}>
                            {/* Pre Survey */}
                    {/* {t('home.pre_survey')} */}
                    {/* </NavLink> */}
                    {/* </MenuItem> */}
                    <MenuItem
                        icon={<FaThLarge />}
                        className={
                            location.pathname === '/dashboard' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={handleClick}
                            to={'/dashboard'}
                        >
                            {/* Dashboard */}
                            {t('home.dashboard')}
                        </NavLink>
                    </MenuItem>
                    <MenuItem
                        icon={<RiTeamFill />}
                        className={
                            location.pathname === '/teams' && 'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={(e) => handleClick(e, '')}
                            to={'/teams'}
                        >
                            {t('teacher.team')}
                        </NavLink>
                    </MenuItem>
                    <MenuItem
                        icon={<FaLightbulb />}
                        className={
                            (location.pathname === '/challenges' ||
                                location.pathname === '/challenge-initiation' ||
                                location.pathname === '/instructions') &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={handleClick}
                            to={
                                ideaSubmittedData.status == 'SUBMITTED' ||
                                ideaSubmittedData.status == 'DRAFT'
                                    ? '/challenges'
                                    : '/instructions'
                            }
                        >
                            {t('home.idea_submission')}
                        </NavLink>
                    </MenuItem>
                    {/* <MenuItem
                        icon={<FaTh />}
                        className={
                            location.pathname === `/playCourse/${1}` &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={handleClick}
                            to={`/playCourse/${1}`}
                        >
                            {t('home.courses')}
                        </NavLink>
                    </MenuItem> */}
                    {/* <MenuItem
                        icon={<FaLandmark />}
                        className={
                            location.pathname === '/Student/Resources/index' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={(e) => handleClick(e)}
                            // onClick={(e) => handleClick(e, 'Resources')}
                            to={'/Student/Resources/index'}
                        >
                            {t('home.resources')}
                        </NavLink>
                    </MenuItem> */}
                    {/* <MenuItem
                        icon={<FaShieldVirus />}
                        className={
                            location.pathname === '/badges' && 'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={handleClick}
                            to={'/badges'}
                        >
                            {t('home.badges')}
                        </NavLink>
                    </MenuItem> */}

                    {/* <MenuItem
                        icon={
                            <img
                                src={FaqIcon}
                                className="img-fluid"
                                alt="faq"
                            />
                        }
                        className={
                            location.pathname === '/faq' && 'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            //  onClick={handleClick}
                            to={'/faq'}
                        >
                           
                            {t('home.faq')}
                        </NavLink>
                    </MenuItem> */}
                    {/* <MenuItem
                        icon={
                            <img
                                src={TicketIcon}
                                className="img-fluid"
                                alt="ticket"
                            />
                        }
                        className={
                            location.pathname === '/student/post-survey' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={handleClick}
                            to={'/student/post-survey'}
                        >
                            {/* PostSurvey */}
                    {/* {t('home.post_survey')} */}
                    {/* </NavLink> */}
                    {/* </MenuItem>  */}
                    {/* <MenuItem
                        icon={<FaCertificate />}
                        className={
                            location.pathname === '/student/my-certificate' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink
                            exact={true}
                            // onClick={(e) => handleClick(e)}
                            to={'/student/my-certificate'}
                        >
                            {t('teacher.certificate')}
                        </NavLink>
                    </MenuItem> */}

                    <MenuItem
                        icon={<RiLockPasswordFill />}
                        className={
                            location.pathname === '/change-password' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink exact={true} to={'/change-password'}>
                            {t('home.change_pass')}
                        </NavLink>
                    </MenuItem>
                    <MenuItem
                        icon={<FaHouseUser />}
                        className={
                            location.pathname === '/my-profile' &&
                            'sidebar-active'
                        }
                    >
                        <NavLink exact={true} to={'/my-profile'}>
                            {t('home.my_profile')}
                        </NavLink>
                    </MenuItem>
                    <MenuItem
                        icon={<RiLogoutBoxRFill />}
                        className={location.pathname === '' && 'sidebar-active'}
                    >
                        <NavLink exact={true} onClick={handleLogout} to={''}>
                            {t('teacher.logout')}
                        </NavLink>
                    </MenuItem>
                </Menu>
            </SidebarContent>
        </ProSidebar>
    );
};

export default Aside;
