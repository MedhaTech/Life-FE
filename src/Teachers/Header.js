import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Row, Col, Navbar } from 'reactstrap';
// import AvatarImg from '../assets/media/img/teacher.png';
import AvatarImg from '../assets/media/img/Avatar.png';
import './header.css';
import { getAdminNotificationsList } from '../redux/actions';
import { connect } from 'react-redux';
import { getCurrentUser } from '../helpers/Utils';

const Header = (props) => {
    const currentUser = getCurrentUser('current_user');
    //const dispatch = useDispatch();
    // const presurveyStatus = useSelector(
    //     (state) => state?.mentors.teacherPresurveyStatus
    // );
    // eslint-disable-next-line no-unused-vars
    window.onunload = function () {
        localStorage.setItem('headerOption', JSON.stringify('Home'));
    };

    // useLayoutEffect(() => {
    //     if (!presurveyStatus) {
    //         dispatch(getTeacherPresurveyStatus());
    //     }
    // }, [dispatch]);
    return (
        <header>
            <div
                className="header-comp sticky-top py-2"
                style={{ height: '7.3rem' }}
            >
                <div className="header-container">
                    <div className="tollbar">
                        <div
                            className={`btn-toggle dfdf`}
                            onClick={() => props.handleToggleSidebar(true)}
                        >
                            <FaBars />
                        </div>
                        <Navbar>
                            <Row className=" w-100">
                                <Col
                                    md={12}
                                    className="d-flex profile-section text-left"
                                >
                                    <div>
                                        <p>
                                            <b className="menu-text">Menu :</b>{' '}
                                            <span className="dynamic-text">
                                                {props.title}
                                            </span>
                                            &nbsp;
                                            {/* </p>
                                    <p className="m-0"> */}
                                            <b className="institution-text">
                                                Institution :{' '}
                                            </b>{' '}
                                            <span className="dynamic-text">
                                                {
                                                    currentUser?.data[0]
                                                        .institution_name
                                                }
                                            </span>{' '}
                                            &nbsp;
                                            <img src={AvatarImg} />
                                            &nbsp;
                                            <span className="dynamic-text">
                                                Welcome Mentor{' '}
                                                {currentUser?.data[0].full_name}
                                            </span>
                                        </p>
                                        {/* <div>
                                            <img src={AvatarImg} />
                                            <span className="dynamic-text">
                                                Welcome Mentor{' '}
                                                {currentUser?.data[0].full_name}
                                            </span>
                                        </div> */}
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

const mapStateToProps = ({ adminNotifications }) => {
    const { notificationsList, NotificationCount } = adminNotifications;
    return { notificationsList, NotificationCount };
};

export default connect(mapStateToProps, {
    getAdminNotificationsListActions: getAdminNotificationsList
})(Header);
