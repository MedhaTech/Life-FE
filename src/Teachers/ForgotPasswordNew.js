/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import '../Student/Pages/SignUp.scss';
import React, { useState } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { InputBox } from '../stories/InputBox/InputBox';
import { Button } from '../stories/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-bootstrap';
import logo from '../assets/media/Life_logo.jpg';
import image_7 from '../assets/media/unisolve_slider1.png';
import image_8 from '../assets/media/unisolve_slider2.png';
import { URL, KEY } from '../constants/defaultValues';
import axios from 'axios';

import { getNormalHeaders, openNotificationWithIcon } from '../helpers/Utils';
const ForgotPasswordNew = () => {
    const { t } = useTranslation();
    const [errorMsg, seterrorMsg] = useState('');
    const inputemail = {
        type: 'email',
        placeholder: 'Enter Your Email Address'
    };

    const logInBtn = {
        label: 'Request Reset Link',
        size: 'large',
        btnClass: 'default'
    };
    const formik = useFormik({
        initialValues: {
            email: ''
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email').max(255)
                .required("Please Enter Your Email Address")
            // .trim()
            // .matches(/^[0-9\s]+$/, 'email number is not valid')
            // .min(10, 'Please enter valid number')
            // .max(10, 'Please enter valid number')
        }),

        onSubmit: async (values) => {
            // alert(JSON.stringify(values, null, 2));
            const axiosConfig = getNormalHeaders(KEY.User_API_Key);
            await axios
                .put(
                    `${URL.stuForget}`,
                    JSON.stringify(values, null, 2),
                    axiosConfig
                )
                .then((checkOrgRes) => {
                    if (checkOrgRes.status == 200) {
                        console.log(checkOrgRes, "rr");
                        // props.setShow(false);
                        openNotificationWithIcon(
                            'success',
                            'Password has been send to registered email address. Please check your inbox.'
                        );
                        seterrorMsg('');
                    }
                })
                .catch((err) => {
                    seterrorMsg(err.response.data.message);
                    return err.response;
                });
        }
    });

    return (
        <React.Fragment>
            <div className="container-fluid  SignUp Login vh-100">
                <Row>
                    <div className="col-md-4 aside email-header" style={{ backgroundColor: '#0b3d62' }}>
                        {/* <h1 className="text-left pb-5 email_tab-hide">
                            {t('login.Title')}
                        </h1>
                        <p className="email_tab-hide">{t('login.subtitle')}</p> */}
                        <Carousel>
                            <Carousel.Item>
                                <div className="email_tab-hide">
                                    <figure>
                                        <img
                                            src={image_7}
                                            alt="image_7"
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="email_tab-hide">
                                    <figure>
                                        <img
                                            src={image_8}
                                            alt="image_8"
                                            className="img-fluid img-2"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <Col xs={12} sm={12} md={8} xl={8} className="article">
                        <Row className="logo">
                            <a href={process.env.REACT_APP_LANDING_PAGE_URL}>
                                <Col
                                    md={12}
                                    className="d-flex justify-content-center align-items-center"
                                >
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="logo-image"
                                        style={{ 'width': '150px' }}
                                    />
                                </Col>
                            </a>
                        </Row>
                        <Row className="mb-0">
                            <Col
                                xs={12}
                                sm={12}
                                md={12}
                                xl={12}
                                className="my-auto"
                            >
                                <h6 className="mb-4 mt-4 title-head">Did you forgot your password?</h6>
                                {/* <h2>Did you forgot your password?</h2> */}
                                <span className="sub mt-2 w-100"> No need to worry! Resetting your password is simple. Just enter the email address you used to register for this program. </span>
                                <Form onSubmit={formik.handleSubmit}>
                                    <div className="form-row row my-5">
                                        <Col className="form-group">
                                            <Label
                                                className="mb-2"
                                                htmlFor="email"
                                            >
                                                Enter Your Email Address
                                            </Label>
                                            <InputBox
                                                {...inputemail}
                                                id="email"
                                                name="email"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                            />

                                            {formik.touched.email &&
                                                formik.errors.email ? (
                                                <small className="error-cls">
                                                    {formik.errors.email}
                                                </small>
                                            ) : null}
                                        </Col>
                                    </div>
                                    <div className="w-100 clearfix" />

                                    {errorMsg === 'User not found' && (
                                        <b className="text-danger m-3">
                                            Please Enter Your Registered Email Address
                                        </b>
                                    )}
                                    <div className="mt-2">
                                        <Button
                                            label="Generate Password"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            size="large "
                                            type="submit"
                                            disabled={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                            }
                                            style={{ borderRadius: '0' }}
                                        />
                                    </div>
                                </Form>
                                <p className='mt-2' style={{ 'font-size': '14px', fontWeight: 'bold' }}>
                                    <Link
                                        exact="true"
                                        to="/login"
                                        className=""
                                    >
                                        Back to Login
                                    </Link>
                                </p>
                                {/* <p className="d-flex text-center  ">
                                    <Link
                                        exact="true"
                                        to="/mentor"
                                        className="p-0 blue text-link w-100 mt-3"
                                    >
                                        Back to Login
                                    </Link>
                                </p> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </React.Fragment >
    );
};

export default ForgotPasswordNew;
