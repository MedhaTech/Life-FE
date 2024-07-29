/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import '../../Student/Pages/SignUp.scss';
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Label, CarouselItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { InputBox } from '../../stories/InputBox/InputBox';
import { useTranslation } from 'react-i18next';
import { Button } from '../../stories/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import signuplogo from '../../assets/media/logo-rect.svg';
import successLogo from '../../assets/media/check.png';
import image_1 from '../../assets/media/unisolve_slider1.png';
import image_2 from '../../assets/media/unisolve_slider2.png';
// import { URL, KEY } from '../../languageOptionsconstants/defaultValues';
import axios from 'axios';

import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';
import { useHistory } from 'react-router-dom';

const SuccessPage = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const mentorDaTa = JSON.parse(localStorage.getItem('mentorData'));
    const orgDaTa = JSON.parse(localStorage.getItem('orgData'));
    const user = mentorDaTa.username;
    const myArray = user.split('@');
    const word = myArray[0];
    const [buttonData, setButtonData] = useState('');

    // const handleButton = () => {
    //     // alert('hii');
    //     apiCall();
    // };
    async function apiCall() {
        // Dice code list API //
        // where list = diescode //
        const body = JSON.stringify({
            school_name: orgDaTa.organization_name,
            udise_code: orgDaTa.unique_code,
            atl_code: mentorDaTa.organization_code,
            district: orgDaTa.district,
            state: orgDaTa.state,
            pin_code: orgDaTa.pin_code,
            email: mentorDaTa.username,
            mobile: mentorDaTa.mobile
        });
        var config = {
            method: 'post',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/mentors/triggerWelcomeEmail',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };

        await axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    setButtonData(response?.data?.data[0]?.data);
                    openNotificationWithIcon(
                        'success',
                        'Email sent successfully'
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
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
                                    Institution Unique Code:{' '}
                                    {orgDaTa.institution_code
                                        ? orgDaTa.institution_code
                                        : '-'}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Institution Name: {orgDaTa.institution_name}
                                    {/* {mentorDaTa.organization_code} */}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    District:{' '}
                                    {
                                        orgDaTa?.place?.taluk?.block?.district
                                            ?.district_name
                                    }
                                    {/* {mentorDaTa.organization_code} */}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    State:{' '}
                                    {
                                        orgDaTa?.place?.taluk?.block?.district
                                            ?.state?.state_name
                                    }
                                    {/* {mentorDaTa.organization_code} */}
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
                                    Mentor Name: {mentorDaTa.mentor_title}.{' '}
                                    {mentorDaTa.mentor_name}
                                </p>

                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Login ID: {mentorDaTa.username}
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
                                    Mobile Number: {mentorDaTa.mentor_mobile}
                                </p>
                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Whatsapp Number:{' '}
                                    {mentorDaTa.mentor_whatapp_mobile}
                                </p>

                                <p
                                    style={{
                                        color: '#404040',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    Gender: {mentorDaTa.gender}
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
                                    To login into Mentor account
                                    <Link
                                        exact="true"
                                        to="/institution/dashboard"
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
