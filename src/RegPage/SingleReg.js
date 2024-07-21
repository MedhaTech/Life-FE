/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Label, UncontrolledAlert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Input, Radio } from 'antd';

import successIcon from '../assets/media/img/rocket.gif';
import signuplogo from '../assets/media/Life_logo.jpg';
import image_1 from '../assets/media/unisolve_slider1.png';
import image_2 from '../assets/media/unisolve_slider2.png';
import image_3 from '../assets/media/LIFE_Slider.png';
import { useFormik } from 'formik';
import { Carousel } from 'react-bootstrap';
import { InputBox } from '../stories/InputBox/InputBox';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Button } from '../stories/Button';
import { URL, KEY } from '../constants/defaultValues';
import { Modal } from 'react-bootstrap';
// import './dropDown.scss';
import { getNormalHeaders, openNotificationWithIcon } from '../helpers/Utils';

import axios from 'axios';
import CryptoJS from 'crypto-js';
import OtpInput from 'react-otp-input-rc-17';
import { useHistory } from 'react-router-dom';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { decryptGlobal } from '../constants/encryptDecrypt';
import { stateList, districtList, collegesList } from './OrgData';

function AtlPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const [diesCode, setDiesCode] = useState('');
    const [orgData, setOrgData] = useState({});
    const [data, setData] = useState(false);
    const [error, setError] = useState('');
    const [schoolBtn, setSchoolBtn] = useState(true);
    const [btnOtp, setBtnOtp] = useState(false);
    const [otpRes, setOtpRes] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);
    const [mentorData, setMentorData] = useState({});
    const [diceBtn, setDiceBtn] = useState(true);
    const [btn, setBtn] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const [change, setChange] = useState('Send OTP');
    const [wtsNum, setWtsNum] = useState('');
    const [mobNum, setMobNum] = useState('');
    const [holdKey, setHoldKey] = useState(false);
    const [sendOtp, setSendOtp] = useState('');
    const [time] = useState('00');
    const [counter, setCounter] = useState(59);
    const [sec, setSec] = useState(59);
    const [disable, setDisable] = useState(false);
    const [timer, setTimer] = useState(0);
    const [or, setOr] = useState('');
    const [instId, setInstId] = useState('');
    const [districts, setDistricts] = useState([]);
    const yearList = Array.from(
        { length: 2024 - 2000 + 1 },
        (_, index) => 2000 + index
    );
    const handleOnChange = (e) => {
        setDiesCode(e.target.value.trim());
        setOrgData();
        setError('');
    };
    localStorage.setItem('mentorData', JSON.stringify(mentorData));
    localStorage.setItem('orgData', JSON.stringify(orgData));

    const handleClose = () => {
        setBtn(false);
    };
    const inputField = {
        type: 'text',
        className: 'defaultInput'
    };
    const inputName = {
        type: 'text',
        placeholder: 'Enter Full Name',
        className: 'defaultInput'
    };

    const inputUsername = {
        type: 'text',
        placeholder: 'Enter Mobile Number',
        className: 'defaultInput'
    };
    const inputPassword = {
        placeholder: 'Enter Password',
        showEyeIcon: true
        // className: 'defaultInput'
    };
    const inputMentorTn = {
        type: 'text',
        placeholder: 'Enter Mentor Name',
        className: 'defaultInput'
    };
    const inputMobile = {
        type: 'text',
        placeholder: 'Enter WhatsApp Number',
        className: 'defaultInput'
    };
    // const = {
    //     type: 'text',
    //     placeholder: 'Enter Email Address',
    //     className: 'defaultInput'
    // };
    const inputDate = {
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        className: 'defaultInput'
    };
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const name = /^[a-zA-Z\s\u0B80-\u0BFF]+$/;
    const formik = useFormik({
        initialValues: {
            state: '',
            district: '',
            institution_name: '',
            city: '',
            student_full_name: '',
            mobile: '',
            role: 'STUDENT',
            reg_status: false,
            otp: '',
            password: '',
            Gender: '',
            email: '',
            group: '',
            Age: '',
            year_of_study: '',
            date_of_birth: ''
        },

        validationSchema: Yup.object({
            state: Yup.string().required('select state'),
            district: Yup.string().required('select district'),
            institution_name: Yup.string()
                .trim()
                .required('Enter Institution Name')
                .min(2, 'Enter Institution Name')
                .matches(name, 'Special Characters are not allowed'),
            city: Yup.string()
                .trim()
                .required('Enter City Name')
                .min(2, 'Enter City Name')
                .matches(name, 'Special Characters are not allowed'),
            email: Yup.string().email('Must be a valid Email Id').max(255),
            student_full_name: Yup.string()
                .trim()
                .required('Enter Full Name')

                .min(2, 'Enter Full Name')
                .matches(name, 'Special Characters are not allowed'),
            Group: Yup.string()
                .trim()
                .optional()
                .min(2, 'Enter Group')
                .matches(name, 'Special Characters are not allowed'),
            year_of_study: Yup.string()
                .trim()
                .optional()
                .min(2, 'Select Year Of Study'),

            mobile: Yup.string()
                .required('Enter MObile Number')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .max(10, 'enter only 10 digit valid number')
                .min(10, 'Number is less than 10 digits'),

            Age: Yup.number(),

            Gender: Yup.string().required('select valid Gender'),
            date_of_birth: Yup.date().required('Date of Birth is required')
            // .min(
            //     new Date(new Date().getFullYear() - 65, 0, 1),
            //     'Age cannot exceed 65 years'
            // )
            // .max(
            //     new Date(new Date().getFullYear() - 21, 11, 31),

            //     'Age must be at least 21 years'
            // )
        }),

        onSubmit: async (values) => {
            if (values.otp.length < 5) {
                setErrorMsg(true);
            } else {
                const axiosConfig = getNormalHeaders(KEY.User_API_Key);
                var pass = values.mobile.trim();

                const key = CryptoJS.enc.Hex.parse(
                    '253D3FB468A0E24677C28A624BE0F939'
                );
                const iv = CryptoJS.enc.Hex.parse(
                    '00000000000000000000000000000000'
                );
                const encrypted = CryptoJS.AES.encrypt(pass, key, {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }).toString();
                const body = JSON.stringify({
                    student_full_name: values.student_full_name.trim(),
                    date_of_birth: values.date_of_birth,
                    email: values.email.trim(),
                    mobile: values.mobile.trim(),
                    institution_name: values.institution_name.trim(),
                    city: values.city.trim(),
                    // group: values.group.trim(),
                    Gender: values.Gender,
                    Age: values.Age,
                    state: values.state,
                    district: values.district,
                    role: values.role.trim(),
                    reg_status: values.reg_status,
                    password: encrypted,
                    ...(values.year_of_study && {
                        year_of_study: values.year_of_study.trim()
                    }),
                    ...(values.group && { group: values.group.trim() })
                });
                var config = {
                    method: 'post',
                    url:
                        process.env.REACT_APP_API_BASE_URL +
                        '/students/register',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
                    },

                    data: body
                };
                await axios(config)
                    .then((mentorRegRes) => {
                        if (mentorRegRes?.data?.status == 201) {
                            setMentorData(mentorRegRes?.data?.data[0]);

                            history.push({
                                pathname: '/successScreen'
                            });
                        }
                    })
                    .catch((err) => {
                        openNotificationWithIcon(
                            'error',
                            err.response.data?.message
                        );
                        // setBtn(false);
                        formik.setErrors({
                            check: err.response && err?.response?.data?.message
                        });
                        return err.response;
                    });
            }
        }
    });

    const handleSendOtp = async (e) => {
        setHoldKey(true);
        setDisable(false);
        formik.setFieldValue('mobile', formik.values.mobile);
        setTimer(timer + 1);
        setSec(59);
        setCounter(59);
        if (change == 'Resend OTP') {
            if (!sec) {
                setSec(sec - 1);
            }
        } else {
            setSec(sec - 1);
        }

        const body = JSON.stringify({
            email: formik.values.email
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/students/emailOtp',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                if (response.status === 202) {
                    const UNhashedPassword = decryptGlobal(
                        response?.data?.data
                    );
                    console.log(UNhashedPassword);
                    setOtpRes(JSON.parse(UNhashedPassword));
                    openNotificationWithIcon(
                        'success',
                        'Otp send to Mobile Number'
                    );
                    setBtnOtp(true);
                    setTimeout(() => {
                        setChange('Resend OTP');
                        setDisable(true);
                        setHoldKey(false);
                        setTimer(0);
                    }, 60000);
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 406) {
                    openNotificationWithIcon(
                        'error',
                        'Mobile Number already exists'
                    );
                    setTimeout(() => {
                        // setChange('Resend OTP');
                        setDisable(true);
                        setHoldKey(false);
                        setTimer(0);
                    }, 1000);
                }
            });
        e.preventDefault();
    };
    useEffect(() => {
        if (!disable) {
            counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter, disable]);

    useEffect(() => {
        if (
            formik.values.student_full_name.length > 0 &&
            formik.values.date_of_birth.length > 0 &&
            formik.values.mobile.length > 0 &&
            formik.values.Gender.length > 0 &&
            formik.values.email.length > 0 &&
            // formik.values.Age.length > 0 &&
            formik.values.state.length > 0 &&
            formik.values.district.length > 0 &&
            formik.values.city.length > 0 &&
            formik.values.institution_name.length > 0
        ) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [
        formik.values.student_full_name,
        formik.values.date_of_birth,
        formik.values.mobile,
        formik.values.Gender,
        formik.values.email,
        // formik.values.Age,
        formik.values.state,
        formik.values.district,
        formik.values.city,
        formik.values.institution_name
    ]);

    const handleOtpChange = (e) => {
        formik.setFieldValue('otp', e);
        setErrorMsg(false);
    };
    useEffect(() => {
        const currentDate = new Date();
        const selectedDate = new Date(formik.values.date_of_birth);

        if (!isNaN(selectedDate.getTime())) {
            const Age = currentDate.getFullYear() - selectedDate.getFullYear();
            formik.setFieldValue('Age', JSON.stringify(Age));
        }
        // else {
        //     formik.setFieldValue('age', 0);
        // }
    }, [formik.values.date_of_birth]);
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const [hide, setHide] = useState(true);
    return (
        <div className="container-fluid  SignUp Login">
            <Row className="row-flex  ">
                <div className="col-md-6 aside mobile-header">
                    <Carousel>
                        <Carousel.Item>
                            <div className="mobile_tab-hide">
                                <figure>
                                    <img
                                        src={image_1}
                                        alt="image_1"
                                        className="img-fluid img-1"
                                    />
                                </figure>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="mobile_tab-hide">
                                <figure>
                                    <img
                                        src={image_2}
                                        alt="image_2"
                                        className="img-fluid img-2"
                                    />
                                </figure>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="mobile_tab-hide">
                                <figure>
                                    <img
                                        src={image_3}
                                        alt="image_3"
                                        className="img-fluid img-1"
                                    />
                                </figure>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>

                <Col xs={12} sm={12} md={12} xl={6} className="article">
                    <div className="row">
                        <a href={process.env.REACT_APP_LANDING_PAGE_URL}>
                            <Col md={12} className="mr-auto text-center">
                                <h2 className="text-white">
                                    <img
                                        src={signuplogo}
                                        alt="Signup logo"
                                        className="img-fluid w-50"
                                    />
                                </h2>
                            </Col>
                        </a>
                    </div>

                    <Row className="article-header mb-4 mt-4 text-center">
                        <h5 className="mb-4">
                            <span className="color-black">
                                STUDENT REGISTRATION
                            </span>
                        </h5>
                    </Row>

                    {hide ? (
                        <Row className="mt-5">
                            <Col md={12}>
                                <Form onSubmit={formik.handleSubmit}>
                                    {/* {diceBtn && (
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
                                                    htmlFor="institution_code"
                                                >
                                                    Institution Unique Code /
                                                    Unique Code
                                                </Label>
                                                <Input
                                                    {...inputField}
                                                    id="institution_code"
                                                    onChange={(e) =>
                                                        handleOnChange(e)
                                                    }
                                                    value={diesCode}
                                                    maxLength={11}
                                                    minLength={11}
                                                    name="institution_code"
                                                    placeholder="Enter Institution Unique Code / Unique Code "
                                                    className="w-100 mb-3 mb-md-0"
                                                    style={{
                                                        borderRadius: '0px',
                                                        padding: '9px 11px'
                                                    }}
                                                />
                                                {error ? (
                                                    <p
                                                        style={{
                                                            color: 'red'
                                                        }}
                                                    >
                                                        {error}
                                                    </p>
                                                ) : null}

                                                {diceBtn && (
                                                    <div className="mt-4">
                                                        <Button
                                                            label={t(
                                                                'teacehr_red.continue'
                                                            )}
                                                            btnClass={
                                                                !diesCode.length
                                                                    ? 'default rounded-0'
                                                                    : 'primary rounded-0'
                                                            }
                                                            size="small"
                                                            onClick={(e) =>
                                                                handleRegister(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                <div className="form-row row mb-5 mt-5">
                                                    <p>
                                                        {' '}
                                                        Already a member ?
                                                        <Link
                                                            to={'/mentor'}
                                                            exact
                                                            className=" m-3 text-center"
                                                            style={{
                                                                color: 'blue'
                                                            }}
                                                        >
                                                            Login Here
                                                        </Link>
                                                    </p>
                                                </div>
                                            </Col>
                                        </div>
                                    )} */}
                                    <div className="w-100 clearfix" />
                                    {schoolBtn && (
                                        <div className="form-row row mb-5">
                                            <Row
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="name"
                                                    >
                                                        Student Name
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="Enter Student Name"
                                                        className="defaultInput"
                                                        id="student_full_name"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="student_full_name"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .student_full_name
                                                        }
                                                    />

                                                    {formik.touched
                                                        .student_full_name &&
                                                        formik.errors
                                                            .student_full_name ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .student_full_name
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label className="mb-2">
                                                        Email Address
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="Enter Email Address"
                                                        className="defaultInput"
                                                        id="email"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="email"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.email
                                                        }
                                                    />

                                                    {formik.touched.email &&
                                                        formik.errors.email ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .email
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                            <Row
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label htmlFor="mobile">
                                                        Mobile Number
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="Enter Mobile Number"
                                                        className="defaultInput"
                                                        id="mobile"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="mobile"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.mobile
                                                        }
                                                    />

                                                    {formik.touched.mobile &&
                                                        formik.errors.mobile ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .mobile
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={3}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="date_of_birth"
                                                    >
                                                        Date of Birth
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        type="date"
                                                        placeholder="DD/MM/YYYY"
                                                        className="defaultInput"
                                                        id="date_of_birth"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        pattern={
                                                            dateRegex.source
                                                        }
                                                        name="date_of_birth"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .date_of_birth
                                                        }
                                                    />

                                                    {formik.touched
                                                        .date_of_birth &&
                                                        formik.errors
                                                            .date_of_birth ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .date_of_birth
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={3}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="date_of_birth"
                                                    >
                                                        Age
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        // isDisabled={
                                                        //     holdKey
                                                        //         ? true
                                                        //         : false
                                                        // }
                                                        isDisabled={true}
                                                        placeholder="Age"
                                                        id="age"
                                                        name="age"
                                                        type="text"
                                                        value={String(
                                                            formik.values.Age
                                                        )}
                                                    // pattern={
                                                    //     dateRegex.source
                                                    // }
                                                    // name="Age"
                                                    // onChange={
                                                    //     formik.handleChange
                                                    // }
                                                    // onBlur={
                                                    //     formik.handleBlur
                                                    // }
                                                    // value={
                                                    //     formik.values.Age
                                                    // }
                                                    />

                                                    {formik.touched.Age &&
                                                        formik.errors.Age ? (
                                                        <small className="error-cls">
                                                            {formik.errors.Age}
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>

                                            <Row
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="state"
                                                    >
                                                        Select State
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <select
                                                        disabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="state"
                                                        className="col-8 selectDropdown"
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.state
                                                        }
                                                        onChange={(e) => {
                                                            const selectedState =
                                                                e.target.value;
                                                            formik.setFieldValue(
                                                                'state',
                                                                selectedState
                                                            );
                                                            formik.setFieldValue(
                                                                'district',
                                                                ''
                                                            ); // Reset district value
                                                            setDistricts(
                                                                districtList[
                                                                selectedState
                                                                ] || []
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select State
                                                        </option>
                                                        {stateList.map(
                                                            (state) => (
                                                                <option
                                                                    key={state}
                                                                    value={
                                                                        state
                                                                    }
                                                                >
                                                                    {state}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {formik.touched.state &&
                                                        formik.errors.state ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .state
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="district"
                                                    >
                                                        Select District
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <select
                                                        disabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="district"
                                                        className="col-8 selectDropdown"
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .district
                                                        }
                                                        onChange={(e) => {
                                                            const selectedDistrict =
                                                                e.target.value;
                                                            formik.setFieldValue(
                                                                'district',
                                                                selectedDistrict
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select District
                                                        </option>
                                                        {districts.map(
                                                            (district) => (
                                                                <option
                                                                    key={
                                                                        district
                                                                    }
                                                                    value={
                                                                        district
                                                                    }
                                                                >
                                                                    {district}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {formik.touched.district &&
                                                        formik.errors.district ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .district
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                {/* )} */}
                                            </Row>
                                            <Row
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="name"
                                                    >
                                                        Institution Name
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <select
                                                        disabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="state"
                                                        className="col-8 selectDropdown"
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.state
                                                        }
                                                        onChange={(e) => {
                                                            const selectedState =
                                                                e.target.value;
                                                            formik.setFieldValue(
                                                                'state',
                                                                selectedState
                                                            );
                                                            formik.setFieldValue(
                                                                'district',
                                                                ''
                                                            ); // Reset district value
                                                            setDistricts(
                                                                districtList[
                                                                selectedState
                                                                ] || []
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select Instituion
                                                        </option>
                                                        {collegesList.map(
                                                            (college) => (
                                                                <option
                                                                    key={college}
                                                                    value={
                                                                        college
                                                                    }
                                                                >
                                                                    {college}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {/* <InputBox
                                                        type="text"
                                                        placeholder="Enter Institution Name"
                                                        className="defaultInput"
                                                        id="institution_name"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="institution_name"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .institution_name
                                                        }
                                                    /> */}

                                                    {formik.touched
                                                        .institution_name &&
                                                        formik.errors
                                                            .institution_name ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .institution_name
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={6}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="name"
                                                    >
                                                        City Name
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="Enter City Name"
                                                        className="defaultInput"
                                                        id="city"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="city"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.city
                                                        }
                                                    />

                                                    {formik.touched.city &&
                                                        formik.errors.city ? (
                                                        <small className="error-cls">
                                                            {formik.errors.city}
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>

                                            <Row
                                                className="form-group"
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                xl={12}
                                            >
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={5}
                                                >
                                                    <Label htmlFor="group">
                                                        Stream
                                                    </Label>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="Enter Stream"
                                                        className="defaultInput"
                                                        id="group"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="group"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.group
                                                        }
                                                    />

                                                    {formik.touched.group &&
                                                        formik.errors.group ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .group
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={4}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="year_of_study"
                                                    >
                                                        Year Of Study
                                                    </Label>
                                                    <select
                                                        disabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="year_of_study"
                                                        className="col-8 selectDropdown"
                                                        value={
                                                            formik.values
                                                                .year_of_study
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Year of Study
                                                        </option>
                                                        {yearList.map(
                                                            (year) => (
                                                                <option
                                                                    key={year}
                                                                    value={year}
                                                                >
                                                                    {year}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {formik.touched
                                                        .year_of_study &&
                                                        formik.errors
                                                            .year_of_study ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .year_of_study
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={3}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="Gender"
                                                    >
                                                        Gender
                                                        <span
                                                            className="m-2"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                            required
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <select
                                                        disabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="Gender"
                                                        className="col-8 selectDropdown"
                                                        value={
                                                            formik.values.Gender
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                    >
                                                        <option value="">
                                                            {t(
                                                                'teacehr_red.teacher_gender'
                                                            )}
                                                        </option>
                                                        <option value="MALE">
                                                            {t(
                                                                'teacehr_red.teacher_gender_male'
                                                            )}
                                                        </option>
                                                        <option value="FEMALE">
                                                            {t(
                                                                'teacehr_red.teacher_gender_female'
                                                            )}
                                                        </option>
                                                    </select>
                                                    {formik.touched.Gender &&
                                                        formik.errors.Gender ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .Gender
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                                <Col
                                                    className="form-group"
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    xl={3}
                                                >
                                                    <Label
                                                        className="mb-2"
                                                        htmlFor="Gender"
                                                    >
                                                        Colleg ID Card
                                                    </Label>
                                                    <div className="wrapper">
                                                        <div className="btnimg">
                                                            Upload File
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="file"
                                                            accept={'.pdf,.csv'}
                                                            onChange={(e) =>
                                                                changeHandler(e)
                                                            }
                                                        />
                                                    </div>
                                                    {formik.touched.Gender &&
                                                        formik.errors.Gender ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .Gender
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row>

                                            <div className="mt-5 d-flex align-items-center">
                                                <Button
                                                    label={change}
                                                    btnClass={
                                                        !disable
                                                            ? 'default rounded-0'
                                                            : 'primary rounded-0 '
                                                    }
                                                    onClick={(e) =>
                                                        handleSendOtp(e)
                                                    }
                                                    size="small"
                                                    disabled={
                                                        (timer == 0
                                                            ? false
                                                            : true) || !disable
                                                    }
                                                />
                                            </div>
                                            {btnOtp && (
                                                <div>
                                                    <h3>
                                                        {time}:
                                                        {counter < 59
                                                            ? counter - '0'
                                                            : counter}
                                                    </h3>

                                                    <div
                                                        className="w-100 d-block text-left"
                                                    // className="form-row row mb-5 col-md-3 text-centered"
                                                    >
                                                        <Label
                                                            className="mb-2 mt-4  text-left"
                                                            htmlFor="otp"
                                                        >
                                                            Enter OTP
                                                        </Label>
                                                        <div
                                                            // className="form-row row mb-6"
                                                            className="d-flex justify-content-left "
                                                        >
                                                            <OtpInput
                                                                numInputs={6}
                                                                isDisabled={
                                                                    false
                                                                }
                                                                errorStyle="error"
                                                                onChange={
                                                                    handleOtpChange
                                                                }
                                                                separator={
                                                                    <span>
                                                                        {'-'}
                                                                    </span>
                                                                }
                                                                isInputNum={
                                                                    true
                                                                }
                                                                isInputSecure={
                                                                    false
                                                                }
                                                                shouldAutoFocus
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .otp
                                                                }
                                                                placeholder={''}
                                                                inputStyle={{
                                                                    border: '1px solid var(--color-grey-light-3)',
                                                                    borderRadius:
                                                                        '8px',
                                                                    width: '5.4rem',
                                                                    height: '5.4rem',
                                                                    fontSize:
                                                                        '2.2rem',
                                                                    color: '#000',
                                                                    fontWeight:
                                                                        '400',
                                                                    caretColor:
                                                                        'blue'
                                                                }}
                                                                focusStyle={{
                                                                    border: '1px solid #CFD3DB',
                                                                    outline:
                                                                        'none'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {formik.values.otp.length > 5 &&
                                                otpRes != formik.values.otp && (
                                                    <div
                                                        className="form-row row mb-5 text-center"
                                                    // className=" w-50 d-flex justify-content-center"
                                                    >
                                                        <span
                                                            className=" w-100 mt-3 d-flex justify-content-center"
                                                            style={{
                                                                color: 'red'
                                                            }}
                                                        >
                                                            Invalid OTP
                                                        </span>
                                                    </div>
                                                )}
                                            {btnOtp && (
                                                <div className="mt-5">
                                                    <Button
                                                        label={
                                                            'VERIFY & REGISTER'
                                                        }
                                                        btnClass={
                                                            formik.values.otp
                                                                .length > 5 &&
                                                                otpRes ==
                                                                formik.values
                                                                    .otp
                                                                ? 'primary rounded-0'
                                                                : 'default rounded-0'
                                                        }
                                                        size="small w-50"
                                                        type="submit"
                                                        disabled={
                                                            !(
                                                                formik.values
                                                                    .otp
                                                                    .length >
                                                                5 &&
                                                                otpRes ==
                                                                formik
                                                                    .values
                                                                    .otp
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                    ) : (
                        <h2 className="text-center" style={{ color: 'red' }}>
                            {' '}
                            Registrations Are Closed
                        </h2>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default AtlPage;
