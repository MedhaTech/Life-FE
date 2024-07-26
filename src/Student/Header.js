/* eslint-disable indent */
import React from 'react';
import './Header.scss';
import { FaBars } from 'react-icons/fa';
import { Row, Col, Navbar } from 'reactstrap';
import AvatarImg from '../assets/media/img/Avatar.png';
//import LanguageSelectorComp from '../components/LanguageSelectorComp';
import { getCurrentUser } from '../helpers/Utils';
//import { useDispatch} from 'react-redux';
//import i18next from 'i18next';
//import {getStudentGlobalLanguage } from '../redux/studentRegistration/actions';
import './header.css';

const Header = (props) => {
    //const dispatch= useDispatch();
    const currentUser = getCurrentUser('current_user');
    // const presuveyStatusGl = useSelector(
    //     (state) =>
    //         state?.studentRegistration?.presuveyStatusGl
    // );
    // const language = useSelector(
    //     (state) => state?.studentRegistration?.studentLanguage
    // );
    // useLayoutEffect(() => {
    //     if(!presuveyStatusGl && currentUser)
    //         dispatch(getPresurveyData(language));
    // }, [presuveyStatusGl,language,dispatch]);

    // const localLang = JSON.parse(localStorage.getItem("s_language"));
    // useEffect(() => {
    //     if(localLang){
    //         i18next.changeLanguage(localLang.code);
    //         dispatch(getStudentGlobalLanguage(localLang));
    //     }
    // }, []);

    window.onunload = function () {
        localStorage.setItem('headerOption', JSON.stringify('Home'));
    };

    return (
        <header>
            <div className="header-comp sticky-top py-4">
                <div className="header-container">
                    <div className="tollbar">
                        <div
                            className={'btn-toggle dfdf'}
                            onClick={() => props.handleToggleSidebar(true)}
                        >
                            <FaBars />
                        </div>
                        <Navbar>
                            <Row className="justify-content-between w-100">
                                <Col
                                    md={12}
                                    className="d-flex profile-section text-left"
                                >
                                    <div>
                                        <p>
                                            {/* <b className="menu-text">Menu :</b>{' '} 
                                            <span className="dynamic-text">
                                                {props.title}
                                            </span>
                                            &nbsp;
                                            <b className="institution-text">
                                                Institution :{' '}
                                            </b>{' '}
                                            <span className="dynamic-text">
                                                {
                                                    currentUser?.data[0]
                                                        .institution_name
                                                }
                                            </span>{' '}
                                            &nbsp;*/}
                                            <img src={AvatarImg} />
                                            &nbsp;
                                            <span className="header-name-size">
                                                Welcome Student{' '}
                                                {currentUser?.data[0].full_name}
                                            </span>
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Navbar>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
