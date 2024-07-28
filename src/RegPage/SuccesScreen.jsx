/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import '../Student/Pages/SignUp.scss';
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Label, CarouselItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { InputBox } from '../stories/InputBox/InputBox';
import { useTranslation } from 'react-i18next';
import { Button } from '../stories/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import signuplogo from '../assets/media/logo-rect.svg';
// import successLogo from '../assets/media/11_Success.jpg';
import image_1 from '../assets/media/unisolve_slider1.png';
import image_2 from '../assets/media/unisolve_slider2.png';
import { URL, KEY } from '../constants/defaultValues';
import axios from 'axios';
import moment from 'moment';
import {
    FaCheckCircle,
    FaDownload,
    FaHourglassHalf,
    FaTimesCircle
} from 'react-icons/fa';


import { getNormalHeaders, openNotificationWithIcon } from '../helpers/Utils';
import { useHistory } from 'react-router-dom';

const SuccessPage = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const mentorDaTa = JSON.parse(localStorage.getItem('mentorData'));
    console.log(mentorDaTa, 'ment');
    const date = mentorDaTa.date_of_birth;
    const formattedDate = moment(date).format('MM/DD/YYYY');
    // const orgDaTa = JSON.parse(localStorage.getItem('orgData'));
    const user = mentorDaTa.username;
    // const myArray = user.split('@');
    // const word = myArray[0];
    const [buttonData, setButtonData] = useState('');

    // const handleButton = () => {
    //     // alert('hii');
    //     apiCall();
    // };

    const successData = history && history.location && history.location.data;
    return (
        <React.Fragment>
            <div className="container-fluid  SignUp Login ">
                <Row>
                    <div className="col-md-6 aside mobile-header">
                        <Carousel>
                            <CarouselItem>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={image_1}
                                            alt="image_1"
                                            style={{ width: '100%' }}
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={image_2}
                                            alt="image_2"
                                            style={{ width: '100%' }}
                                            className="img-fluid img-2"
                                        />
                                    </figure>
                                </div>
                            </CarouselItem>
                            {/* <CarouselItem>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={ellipse_1}
                                            alt="ellipse_1"
                                            style={{ width: '70%' }}
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </CarouselItem> */}
                        </Carousel>
                    </div>
                    <Col
                        xs={12}
                        sm={12}
                        md={6}
                        xl={6}
                        className="article"
                        style={{ padding: '8rem 8rem', marginTop: '100px' }}
                    >
                        <Row className="mb-0">
                            <Col
                                xs={12}
                                sm={12}
                                md={12}
                                xl={12}
                                className="my-auto"
                            >
                                <FaCheckCircle size={80} className='text-success' />
                                <h5 className='text-success mt-5'>Registration successful !</h5>
                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    Congratulations {mentorDaTa.student_full_name},  your account has been successfully created.
                                </p>

                                {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    ATL Code:{' '}
                                    {/* {successData &&
                                        successData.organization_code} */}
                                {/* {mentorDaTa.organization_code} */}
                                {/* </p>  */}
                                {/* <p style={{ 'font-size': '14px', 'fontWeight': 'bold' }} className='m-0'>LOGIN CREDENTIALS :</p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                    className='mb-2'
                                >
                                    Email Address: {mentorDaTa.email}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Password : Your default password will be your mobile number only.
                                </p> */}


                                <h3 className='mt-5'>
                                    To login into your account
                                    <Link
                                        exact="true"
                                        to="/login"
                                        className="p-0 blue text-link w-100 mt-3"
                                    >
                                        {t(' click here')}
                                    </Link>
                                </h3>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default SuccessPage;
