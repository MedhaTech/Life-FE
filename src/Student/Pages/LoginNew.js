/* eslint-disable indent */
import './SignUp.scss';
import React, { useLayoutEffect } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { InputBox } from '../../stories/InputBox/InputBox.jsx';
import { Carousel } from 'react-bootstrap';
import { Button } from '../../stories/Button.jsx';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/media/Life_logo.jpg';
// import studentIcon from '../../assets/media/student_login_icon.png';
// import teacherIcon from '../../assets/media/teacher_login_icon.png';
import image_9 from '../../assets/media/unisolve_slider1.png';
import image_10 from '../../assets/media/LIFE_Slider.png';
import { loginUser } from '../../redux/actions.js';
import CryptoJS from 'crypto-js';
import { openNotificationWithIcon } from '../../helpers/Utils';

const LoginNew = (props) => {
    const { t } = useTranslation();
    const hide = true;
    const history = useHistory();
    useLayoutEffect(() => {
        const moduleName = localStorage.getItem('module');

        if (
            localStorage.getItem('current_user') &&
            localStorage.getItem('module')
        ) {
            moduleName === 'MENTOR'
                ? history.push('/mentor/dashboard')
                : moduleName === 'ADMIN'
                    ? history.push('/admin/dashboard')
                    : moduleName === 'EVALUATOR'
                        ? history.push('/evaluator/submitted-ideas')
                        : moduleName === 'EADMIN'
                            ? history.push('/eadmin/dashboard')
                            : history.push('/dashboard');
        }
    }, []);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .required('Please Enter Email Address')
                .trim()
                .email(),
            // .matches(
            //     /^\d+$/,
            //     'Mobile number is not valid (Enter only digits)'
            // )
            // .matches(/^[0-9]+$/, 'Mobile number must contain only numbers')
            // .max(10, 'Please enter only 10 digit valid number')
            // .min(10, 'Number is less than 10 digits'),
            password: Yup.string().required('Please Enter Password')
        }),
        // STIDENT ROLE
        onSubmit: (values) => {
            if (
                localStorage.getItem('current_user') &&
                localStorage.getItem('module')
            ) {
                openNotificationWithIcon(
                    'error',
                    `Another User(${localStorage.getItem(
                        'module'
                    )}) has already logged in.`
                );
                return;
            }
            const key = CryptoJS.enc.Hex.parse(
                '253D3FB468A0E24677C28A624BE0F939'
            );
            const iv = CryptoJS.enc.Hex.parse(
                '00000000000000000000000000000000'
            );
            const encrypted = CryptoJS.AES.encrypt(
                values.password.trim(),
                key,
                {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }
            ).toString();
            const body = {
                username: values.email.trim(),
                password: encrypted.trim(),
                role: 'STUDENT'
            };
            props.loginUserAction(body, history, 'STUDENT');
        }
    });

    const inputUserId = {
        type: 'tel',
        placeholder: 'Enter Your Email Address'
    };

    const inputPassword = {
        placeholder: 'Enter Your Password',
        showEyeIcon: true
    };

    const logInBtn = {
        label: 'Login',
        size: 'large'
    };

    return (
        <React.Fragment>
            <div className="container-fluid  SignUp Login">
                {/* <UsersPage /> */}
                <Row className="row-flex height-100">
                    <div className="col-md-4 aside mobile-header" style={{ backgroundColor: '#4dae51' }}>
                        {/* <h1 className="text-left pb-5 mobile_tab-hide">
                            {t('login.Title')}
                        </h1>
                        <p className="mobile_tab-hide">{t('login.subtitle')}</p> */}
                        <Carousel>
                            <Carousel.Item>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={image_9}
                                            alt="image_9"
                                            className="img-fluid img-1"
                                        />
                                    </figure>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="mobile_tab-hide">
                                    <figure>
                                        <img
                                            src={image_10}
                                            alt="image_10"
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
                                    className="img-fluid img-3"
                                />
                            </figure>
                        </div>
                            </Carousel.Item> */}
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
                        <Row className="login-options mb-4 mt-4 text-center">
                            <Col md={12} className="text-center"><h6 className="mb-4 title-head">APPLICANT LOGIN</h6></Col>
                        </Row>
                        {/* <Row className=" article-header d-flex ">
                            <div className="d-flex mt-4 login-div justify-content-center align-items-center">
                            
                                <Link
                                    className="landing-page-actions "
                                    exact="true"
                                    to="/mentor"
                                >
                                    <button className="storybook-button storybook-button--small storybook-button--loginBtn ">
                                        <img
                                            src={teacherIcon}
                                            alt="login icon"
                                            className="img-fluid"
                                        />{' '}
                                        Mentor Login
                                    </button>
                                </Link>
                                <Link
                                    className="landing-page-actions"
                                    exact="true"
                                    to="/login"
                                >
                                    <button className="storybook-button storybook-button--small storybook-button--loginBtn active">
                                        <img
                                            src={studentIcon}
                                            alt="login icon"
                                            className="img-fluid"
                                        />{' '}
                                        {t('loginPage.student_login')}
                                    </button>
                                </Link>
                            </div>
                        </Row> */}

                        {hide ? (
                            <Row className="my-2">
                                <Col md={12}>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <div className="form-row row mb-3">
                                            <Col
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="email"
                                                >
                                                    Email Address
                                                </Label>
                                                <InputBox
                                                    {...inputUserId}
                                                    id="email"
                                                    name="email"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    // onChange={
                                                    //     formik.handleChange
                                                    // }
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
                                        <div className="form-row row mb-5">
                                            <Col
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="Password"
                                                >
                                                    {t(
                                                        'loginPage.Password_label'
                                                    )}
                                                </Label>
                                                <InputBox
                                                    {...inputPassword}
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.password
                                                    }
                                                />

                                                {formik.touched.password &&
                                                    formik.errors.password ? (
                                                    <small className="error-cls">
                                                        {formik.errors.password}
                                                    </small>
                                                ) : null}
                                            </Col>
                                            {/* <Row className="keepme_login"></Row> */}
                                        </div>
                                        <div className="form-row row mb-3">
                                            {/* <p>Student login will be launched shortly. Please wait for notice from the program coordinators.</p> */}
                                            {/* Login button */}
                                            <Col
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Button
                                                    {...logInBtn}
                                                    type="submit"
                                                    btnClass={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                            ? 'default'
                                                            : 'primary'
                                                    }
                                                    disabled={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                    }
                                                    style={{
                                                        borderRadius: '0'
                                                    }}
                                                />
                                            </Col>
                                        </div>
                                        <div className="form-row row mb-3">
                                            {/* <p>Student login will be launched shortly. Please wait for notice from the program coordinators.</p> */}
                                            {/* Login button */}
                                            {/* <Col
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={6}
                                                xl={6}
                                            >
                                                <p className='mt-2' style={{ 'font-size': '14px', fontWeight: 'bold' }}>
                                                    {"Don't have an account ?"}
                                                    <Link
                                                        exact="true"
                                                        to="/registration"
                                                        className=""
                                                    >
                                                        {t(' Create Account')}
                                                    </Link>
                                                </p>
                                            </Col> */}
                                            <Col className="forgotp" xs={12}
                                                sm={12}
                                                md={6}
                                                xl={6}>
                                                <div
                                                    // onClick={handleOnClick}
                                                    className="text-link text-primary"
                                                >
                                                    <Link
                                                        exact="true"
                                                        to="/student/forgotpassword"
                                                        className="text-link"
                                                        style={{ 'font-size': '14px', fontWeight: 'bold' }}
                                                    >
                                                        <span style={{ 'font-size': '14px', fontWeight: 'bold' }} className='m='> Forgot Password ?</span>
                                                    </Link>
                                                </div>
                                            </Col>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>

                        ) : (
                            <h2 className="text-center">
                                Student Journey Will be Enable Soon
                            </h2>
                        )}
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = ({ authUser }) => {
    const { loading, error, currentUser } = authUser;
    return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
    loginUserAction: loginUser
})(LoginNew);
