/* eslint-disable indent */
import '../Student/Pages/SignUp.scss';
import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Row, Col, Form, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/media/tn-brands/EDII.png';
import { InputBox } from '../stories/InputBox/InputBox';
import { Button } from '../stories/Button';
import { useFormik } from 'formik';
// import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
// import signuplogo from "../assets/media/logo-rect.svg";
import iname_3 from '../assets/media/unisolve_slider1.png';
import image_4 from '../assets/media/unisolve_slider2.png';

const ForgotPassword = () => {
    // const { t } = useTranslation();
    const formik = useFormik({
        initialValues: {
            email: ''
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email('required')
                .max(255)
                .required('Must be a valid email')
        }),

        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        }
    });

    const inputEmail = {
        type: 'email',
        placeholder: 'Enter your unisolve registered email address'
    };

    const logInBtn = {
        label: 'Request Reset Link',
        size: 'large',
        btnClass: 'default'
    };

    return (
        <React.Fragment>
            <div className="container-fluid  SignUp Login vh-100">
                <Row>
                    <div className="col-md-4 aside mobile-header">
                        {/* <h1 className="text-left pb-5 mobile_tab-hide">
                            {t('login.Title')}
                        </h1>
                        <p className="mobile_tab-hide">{t('login.subtitle')}</p> */}
                        <Carousel>
                            <Carousel.Item>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={iname_3}
                                            alt="iname_3"
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={image_4}
                                            alt="image_4"
                                            className="img-fluid img-2"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item>
                            {/* <Carousel.Item>                                
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={ellipse_1}
                                            alt="ellipse_1"
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item> */}
                        </Carousel>
                    </div>
                    <Col xs={12} sm={12} md={8} xl={8} className="article">
                        <Row className="logo">
                            <Col
                                md={12}
                                className="d-flex justify-content-center align-items-center"
                            >
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="logo-image"
                                />
                            </Col>
                        </Row>
                        <Row className="mb-0">
                            <Col
                                xs={12}
                                sm={12}
                                md={12}
                                xl={12}
                                className="my-auto"
                            >
                                <h4>Did you forgot your password?</h4>
                                <span className=" sub mt-2 w-100">
                                    Don’t worry! Resetting your password is
                                    easy, just type in the email you registered
                                    to Unisolve
                                </span>
                                <Form onSubmit={formik.handleSubmit}>
                                    <div className="form-row row my-5">
                                        <Col
                                            className="form-group"
                                            xs={12}
                                            sm={12}
                                            md={11}
                                            xl={12}
                                        >
                                            <Label
                                                className="mb-2"
                                                htmlFor="email"
                                            >
                                                Email Address
                                            </Label>

                                            <InputBox
                                                {...inputEmail}
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

                                    <div className="form-row row mb-5">
                                        <Col className="form-group">
                                            <Link
                                                exact="true"
                                                to="/verifypassword"
                                            >
                                                <Button
                                                    {...logInBtn}
                                                    type="submit"
                                                    style={{
                                                        borderRadius: '0'
                                                    }}
                                                />
                                            </Link>
                                        </Col>
                                    </div>
                                </Form>
                                <p className="d-flex text-center ">
                                    <Link
                                        exact="true"
                                        to="/admin"
                                        className="p-0 blue text-link w-100"
                                    >
                                        Back to Login
                                    </Link>
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default ForgotPassword;
