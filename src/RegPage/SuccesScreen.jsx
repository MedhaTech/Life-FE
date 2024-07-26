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
import signuplogo from '../assets/media/logo-rect.svg';
import successLogo from '../assets/media/check.png';
import image_1 from '../assets/media/unisolve_slider1.png';
import image_2 from '../assets/media/aim_Slider.png';
import { URL, KEY } from '../constants/defaultValues';
import axios from 'axios';
import moment from 'moment';

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
                        {/* <div className="row">
                            <Col md={12} className=" mr-auto mobile_tab-hide">
                                {' '}
                                <h2 className="text-white">
                                    <img
                                        src={signuplogo}
                                        alt="Signup logo"
                                        className="img-fluid"
                                    />
                                    Unisolve
                                </h2>
                            </Col>
                        </div> */}

                        {/* <h1 className="text-left pb-5 mobile_tab-hide">
                            Together let’s learn and build something amazing.
                        </h1>
                        <p className="mobile_tab-hide">
                            Creating change makers of tomorrow
                        </p> */}
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
                        style={{ padding: '8rem 8rem' }}
                    >
                        <Row className="mb-0">
                            <Col
                                xs={12}
                                sm={12}
                                md={12}
                                xl={12}
                                className="my-auto"
                            >
                                <figure>
                                    <img
                                        src={successLogo}
                                        alt="successLogo"
                                        style={{
                                            width: '30%'
                                        }}
                                        className="img-fluid img-1"
                                    />
                                </figure>

                                <p
                                    style={{
                                        fontSize: '3.4rem',
                                        fontWeight: 'bold',
                                        color: 'DarkGreen'
                                    }}
                                >
                                    Congratulations
                                </p>

                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    You have successfully registered.
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

                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Institution Name:{' '}
                                    {mentorDaTa.institution_name}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    State: {mentorDaTa?.state}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    District: {mentorDaTa?.district}
                                </p>

                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    City: {mentorDaTa?.city}
                                </p>
                                {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Pin Code: {orgDaTa.pin_code}.{' '}
                                    {mentorDaTa.pin_code}
                                </p> */}
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Student Name:
                                    {mentorDaTa.student_full_name}
                                </p>

                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Login ID: {mentorDaTa.email}
                                </p>
                                {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Password: {mentorDaTa.username}
                                </p> */}
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Mobile Number: {mentorDaTa.mobile}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    Gender: {mentorDaTa.Gender}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Date of Birth: {formattedDate}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Age: {mentorDaTa.Age}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Year of Study:{' '}
                                    {mentorDaTa.year_of_study
                                        ? mentorDaTa.year_of_study
                                        : '-'}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Group:{' '}
                                    {mentorDaTa.group ? mentorDaTa.group : '-'}
                                </p>

                                <>
                                    {/* <Button
                                        label="Send Login Details to mail"
                                        btnClass="primary tex-center my-0 py-0 mx-3 px-3"
                                        style={{
                                            borderRadius: '0px',
                                            padding: '1rem 1rem',
                                            height: '35px'
                                        }}
                                        size="small"
                                        onClick={handleButton}
                                    /> */}
                                </>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    Take a screenshot for future reference.
                                </p>

                                <h3>
                                    To login into Student account
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
