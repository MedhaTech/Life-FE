/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable indent */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardText,
    Form,
    Label,
    UncontrolledAlert
} from 'reactstrap';
import { Input, Radio } from 'antd';
import { useTranslation } from 'react-i18next';

import 'sweetalert2/src/sweetalert2.scss';
import Layout from '../Layout.jsx';
import {
    getCurrentUser,
    openNotificationWithIcon,
    getNormalHeaders
} from '../../helpers/Utils';
import { URL, KEY } from '../../constants/defaultValues';
import CryptoJS from 'crypto-js';

import { useDispatch, useSelector } from 'react-redux';
import { getSchoolByID } from '../../School/store/school/actions';
import { Button } from '../../stories/Button';
import { InputBox } from '../../stories/InputBox/InputBox';

import { useHistory } from 'react-router-dom';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
// import logout from '../assets/media/logout.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const MySchoolProfile = () => {
    // here we can see all the details of details of teacher //
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');

    const history = useHistory();
    const [diesCode, setDiesCode] = useState(
        currentUser.data[0]?.institution_code
    );
    const [orgData, setOrgData] = useState({});
    const [data, setData] = useState(false);
    const [error, setError] = useState('');
    const [schoolBtn, setSchoolBtn] = useState(false);
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
    // console.log(diesCode, 'new');
    // console.log(instId, '222');
    // const handleOnChange = (e) => {
    //     setDiesCode(e.target.value.trim());
    //     setOrgData();
    //     setError('');
    // };
    // const diesCode = currentUser.data[0]?.institution_code;
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
    const inputmentor_Email = {
        type: 'text',
        placeholder: 'Enter Email Address',
        className: 'defaultInput'
    };
    const inputDate = {
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        className: 'defaultInput'
    };
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const name = /^[a-zA-Z\s\u0B80-\u0BFF]+$/;
    const formik = useFormik({
        initialValues: {
            mentor_name: '',
            institution_code: diesCode,
            username: '',
            mentor_mobile: '',
            institution_id: '',
            mentor_whatapp_mobile: '',
            role: 'MENTOR',
            qualification: '-',
            reg_status: false,
            otp: '',
            password: '',
            gender: '',
            mentor_title: '',
            mentor_email: '',
            click: false,
            checkbox: false,
            // mentor_name_vernacular: '',
            date_of_birth: ''
        },

        validationSchema: Yup.object({
            mentor_name: Yup.string()
                .trim()
                .min(2, 'Enter Name')
                .matches(name, 'Special Characters are not allowed')
                .required('Required'),
            // mentor_name_vernacular: Yup.string()
            //     .trim()
            //     .min(2, 'Enter Mentor Name')
            //     .matches(/^[aA-zZ\s]+$/, 'Special Characters are not allowed')
            //     .required('Required'),
            mentor_mobile: Yup.string()
                .required('required')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .max(10, 'Please enter only 10 digit valid number')
                .min(10, 'Number is less than 10 digits'),
            // password: Yup.string()
            //     .required('required')
            //     .trim()
            //     .matches(/^\d+$/, 'Enter only digits')
            //     .max(8, 'Password is more than 8 digits')
            //     .min(8, 'password is less than 8 digits'),
            mentor_email: Yup.string()
                .email('Must be a valid Email Id')
                .matches(regex, 'only accept small letters only ')
                .max(255),
            mentor_whatapp_mobile: Yup.string()
                .required('required')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digit)'
                )
                .max(10, 'Please enter only 10 digit valid number')
                .min(10, 'Number is less than 10 digit'),
            gender: Yup.string().required('Please select valid gender'),
            date_of_birth: Yup.date()
                .required('Date of Birth is required')
                .min(
                    new Date(new Date().getFullYear() - 50, 0, 1),
                    'Age cannot exceed 50 years'
                )
                .max(
                    new Date(new Date().getFullYear() - 20, 11, 31),

                    'Age must be at least 20 years'
                ),
            // date_of_birth: Yup.string()
            //     .required('Please select DOB')
            //     .max(
            //         1970,
            //         'Age must be at least 20 years and cannot exceed 50 years'
            //     )
            //     .min(
            //         2004,
            //         'Age must be at least 20 years and cannot exceed 50 years'
            //     )
            //     // .date_of_birth('Please Enter DOB')
            //     .trim(),
            mentor_title: Yup.string().required('Please select Title')
        }),

        onSubmit: async (values) => {
            // alert('hi');
            // if (values.otp.length < 5) {
            //     setErrorMsg(true);
            // } else {
            const axiosConfig = getNormalHeaders(KEY.User_API_Key);
            var pass = values.mentor_mobile.trim();
            // var myArray = pass.split('@');
            // let word = myArray[0];
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
            // values.password = encrypted;
            const body = JSON.stringify({
                mentor_name: values.mentor_name.trim(),
                institution_id: JSON.stringify(instId),
                // mentor_name_vernacular:
                //     values.mentor_name_vernacular.trim(),

                institution_code: values.institution_code.trim(),
                mentor_mobile: values.mentor_mobile.trim(),
                mentor_email: values.mentor_email.trim(),

                mentor_whatapp_mobile: values.mentor_whatapp_mobile.trim(),
                username: values.mentor_mobile.trim(),
                role: values.role.trim(),
                gender: values.gender,
                mentor_title: values.mentor_title,
                date_of_birth: values.date_of_birth,
                reg_status: values.reg_status,
                password: encrypted
            });
            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_BASE_URL + '/mentors/register',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
                },

                data: body
            };
            await axios(config)
                .then((mentorRegRes) => {
                    if (mentorRegRes?.data?.status == 201) {
                        setMentorData(mentorRegRes?.data?.data[0]);
                        const successData = {
                            password: mentorRegRes?.data?.data[0].password,

                            mentor_name:
                                mentorRegRes?.data?.data[0].mentor_name,
                            // mentor_name_vernacular:
                            //     mentorRegRes?.data?.data[0]
                            //         .mentor_name_vernacular,
                            // district: orgData?.district,
                            // school: orgData?.organization_name,
                            institution_code:
                                mentorRegRes?.data?.data[0].institution_code,
                            gender: mentorRegRes?.data?.data[0].gender,
                            mentor_title:
                                mentorRegRes?.data?.data[0].mentor_title,
                            mentor_mobile:
                                mentorRegRes?.data?.data[0].mentor_mobile,
                            username: mentorRegRes?.data?.data[0].mentor_mobile,
                            mentor_whatapp_mobile:
                                mentorRegRes?.data?.data[0]
                                    .mentor_whatapp_mobile
                        };
                        // setBtn(true);
                        history.push({
                            pathname: '/institution/successScreen',
                            data: successData
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
            // }
        }
    });
    useEffect(async () => {
        if (diesCode) {
            await handleRegister();
        }
    }, [diesCode]);
    const handleRegister = (e) => {
        const body = JSON.stringify({
            institution_code: diesCode
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/institutions/checkOrg',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                if (response?.status == 200) {
                    // console.log(response, '333');
                    if (response?.data.count === 0) {
                        setError('Enter Valid Institution Unique Code ');
                    }
                    if (
                        response?.data?.data[0] &&
                        process.env.REACT_APP_USEDICECODE == 1
                    ) {
                        // {
                        //     setError(
                        //         'Another Mentor is already registered in given Institution'
                        //     );
                        // } else
                        if (Object.keys(response?.data?.data[0]).length) {
                            setOrgData(response?.data?.data[0]);
                            setInstId(response?.data?.data[0]?.institution_id);
                            formik.setFieldValue(
                                'institution_code',
                                response?.data?.data[0].institution_code
                            );

                            setDiceBtn(false);
                            setSchoolBtn(true);
                        } else {
                            setError(
                                'Oops..! Institution Unique Code seems incorrect'
                            );
                        }
                    }
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 404) {
                    setError('Entered Wrong Institution Unique Code');
                }
            });

        // e.preventDefault();
    };

    const handleSendOtp = async (e) => {
        setHoldKey(true);
        setDisable(false);
        formik.setFieldValue('mentor_mobile', formik.values.mentor_mobile);
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
        // setTimeout(() => {
        //     setChange('Resend OTP');
        //     setDisable(true);
        //     setHoldKey(false);
        //     setTimer(0);
        // }, 60000);
        const body = JSON.stringify({
            mobile: formik.values.mentor_mobile
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/mentors/mobileOtp',
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
            formik.values.mentor_title.length > 0 &&
            formik.values.mentor_name.length > 0 &&
            formik.values.gender.length > 0 &&
            formik.values.mentor_mobile.length > 0 &&
            formik.values.mentor_email.length > 0 &&
            formik.values.mentor_whatapp_mobile.length > 0 &&
            // formik.values.password.length === 8 &&
            formik.values.date_of_birth.length > 0
            // formik.values.mentor_name_vernacular.length > 0
        ) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [
        formik.values.mentor_title,
        formik.values.mentor_name,
        formik.values.gender,
        formik.values.username,
        formik.values.mentor_email,
        // formik.values.mentor_name_vernacular,
        formik.values.date_of_birth,
        // formik.values.password,
        formik.values.mentor_whatapp_mobile
    ]);

    const handleOtpChange = (e) => {
        formik.setFieldValue('otp', e);
        setErrorMsg(false);
    };

    const handleCheckbox = (e, click) => {
        if (click) {
            setCheckBox(click);
            formik.setFieldValue(
                'mentor_whatapp_mobile',
                formik.values.mentor_mobile
            );
            setWtsNum(formik.values.mentor_mobile);
        } else {
            setCheckBox(click);
            formik.setFieldValue('mentor_whatapp_mobile', '');
        }
    };

    useEffect(() => {
        setCheckBox(false);
        formik.setFieldValue('mentor_whatapp_mobile', '');
    }, [formik.values.mentor_mobile.length == 0]);
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return (
        <Layout title="Dashboard">
            <div className="container ChangePSWModal mb-5">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <div className="d-flex justify-content-between mb-3">
                            {/* <h2>My Profile</h2> */}
                        </div>
                        <Row className="mt-5">
                            <Col md={12}>
                                <Form onSubmit={formik.handleSubmit}>
                                    <div className="w-100 clearfix" />
                                    {schoolBtn && (
                                        <div className="form-row row mb-5">
                                            <Card className="w-100  mb-5 p-4">
                                                <Col className="form-row row mb-5">
                                                    <Col
                                                        className="form-group"
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        xl={12}
                                                    >
                                                        <Label className="mb-3 w-100 mt-4">
                                                            <UncontrolledAlert
                                                                color="primary"
                                                                toggle={false}
                                                            >
                                                                {/* {t(
                                                            'teacehr_red.school'
                                                        )} */}
                                                                Institution Name
                                                                :{' '}
                                                                {
                                                                    orgData?.institution_name
                                                                }{' '}
                                                                <br />
                                                                {/* Institution Type:{' '}
                                                        {orgData
                                                            ?.institution_type
                                                            ?.institution_type
                                                            ? orgData
                                                                  ?.institution_type
                                                                  ?.institution_type
                                                            : ' N/A'}{' '}
                                                        <br /> */}
                                                                Place :{' '}
                                                                {orgData?.place
                                                                    ?.place_name
                                                                    ? orgData
                                                                          ?.place
                                                                          ?.place_name
                                                                    : ' N/A'}
                                                                <br />
                                                                Block :{' '}
                                                                {orgData?.place
                                                                    ?.block
                                                                    ?.block_name
                                                                    ? orgData
                                                                          ?.place
                                                                          ?.block
                                                                          ?.block_name
                                                                    : ' N/A'}{' '}
                                                                <br />
                                                               
                                                                Taluk :{' '}
                                                                {orgData?.place
                                                                    ?.block
                                                                    ?.district
                                                                    ?.taluk
                                                                    ?.taluk_name
                                                                    ? orgData
                                                                          ?.place
                                                                          ?.block
                                                                          ?.district
                                                                          ?.taluk
                                                                          ?.taluk_name
                                                                    : ' N/A'}
                                                                <br />
                                                                District :{' '}
                                                                {orgData?.place
                                                                    ?.block
                                                                    ?.district
                                                                    ?.district_name
                                                                    ? orgData
                                                                          ?.place
                                                                          ?.block
                                                                          ?.district
                                                                          ?.district_name
                                                                    : ' N/A'}{' '}
                                                                <br />
                                                                State :{' '}
                                                                {orgData?.place
                                                                    ?.block
                                                                    ?.district
                                                                    ?.state
                                                                    ?.state_name
                                                                    ? orgData
                                                                          ?.place
                                                                          ?.block
                                                                          ?.district
                                                                          ?.state
                                                                          ?.state_name
                                                                    : ' N/A'}{' '}
                                                                <br />
                                                            </UncontrolledAlert>
                                                        </Label>
                                                    </Col>
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
                                                            xl={3}
                                                        >
                                                            <Label
                                                                className="mb-2"
                                                                htmlFor="mentor_title"
                                                            >
                                                                {t(
                                                                    'teacehr_red.title'
                                                                )}
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
                                                                name="mentor_title"
                                                                // id="gender"
                                                                className=" col-8 selectDropdown"
                                                                style={{
                                                                    borderRadius:
                                                                        '0'
                                                                }}
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .mentor_title
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
                                                                        'teacehr_red.teacher_title'
                                                                    )}
                                                                </option>
                                                                <option value="Dr">
                                                                    {t(
                                                                        'teacehr_red.teacher_title_drs'
                                                                    )}
                                                                </option>
                                                                <option value="Mr">
                                                                    {t(
                                                                        'teacehr_red.teacher_title_mrs'
                                                                    )}
                                                                </option>
                                                                <option value="Miss">
                                                                    {t(
                                                                        'teacehr_red.teacher_title_misss'
                                                                    )}
                                                                </option>
                                                                <option value="Mrs">
                                                                    {t(
                                                                        'teacehr_red.teacher_title_mrss'
                                                                    )}
                                                                </option>
                                                            </select>
                                                            {formik.touched
                                                                .mentor_title &&
                                                            formik.errors
                                                                .title ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .mentor_title
                                                                    }
                                                                </small>
                                                            ) : null}
                                                        </Col>
                                                        <Col
                                                            className="form-group"
                                                            xs={12}
                                                            sm={12}
                                                            md={12}
                                                            xl={9}
                                                        >
                                                            <Label
                                                                className="mb-2"
                                                                htmlFor="name"
                                                            >
                                                                Mentor Name
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
                                                                {...inputName}
                                                                id="mentor_name"
                                                                isDisabled={
                                                                    holdKey
                                                                        ? true
                                                                        : false
                                                                }
                                                                name="mentor_name"
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .mentor_name
                                                                }
                                                            />

                                                            {formik.touched
                                                                .mentor_name &&
                                                            formik.errors
                                                                .mentor_name ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .mentor_name
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
                                                            <Label
                                                                className="mb-2"
                                                                htmlFor="mentor_email"
                                                            >
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
                                                                {...inputmentor_Email}
                                                                id="mentor_email"
                                                                isDisabled={
                                                                    holdKey
                                                                        ? true
                                                                        : false
                                                                }
                                                                name="mentor_email"
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .mentor_email
                                                                }
                                                            />

                                                            {formik.touched
                                                                .mentor_email &&
                                                            formik.errors
                                                                .mentor_email ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .mentor_email
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
                                                                htmlFor="gender"
                                                            >
                                                                {t(
                                                                    'teacehr_red.gender'
                                                                )}
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
                                                                name="gender"
                                                                // id="gender"
                                                                className="col-8 selectDropdown"
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .gender
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
                                                                <option value="Male">
                                                                    {t(
                                                                        'teacehr_red.teacher_gender_male'
                                                                    )}
                                                                </option>
                                                                <option value="Female">
                                                                    {t(
                                                                        'teacehr_red.teacher_gender_female'
                                                                    )}
                                                                </option>
                                                            </select>
                                                            {formik.touched
                                                                .gender &&
                                                            formik.errors
                                                                .gender ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .gender
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
                                                                {...inputDate}
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
                                                                    formik
                                                                        .values
                                                                        .date_of_birth
                                                                }
                                                            />

                                                            {formik.touched
                                                                .date_of_birth &&
                                                            formik.errors
                                                                .date_of_birth ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .date_of_birth
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
                                                            <Label
                                                                className="mb-2 mt-3"
                                                                htmlFor="mentor_mobile"
                                                            >
                                                                Your Mobile
                                                                Number
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
                                                                {...inputUsername}
                                                                id="mentor_mobile"
                                                                isDisabled={
                                                                    holdKey
                                                                        ? true
                                                                        : false
                                                                }
                                                                name="mentor_mobile"
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .mentor_mobile
                                                                }
                                                            />

                                                            {formik.touched
                                                                .mentor_mobile &&
                                                            formik.errors
                                                                .mentor_mobile ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .mentor_mobile
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
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <Label
                                                                    className="mb-2 mt-3"
                                                                    htmlFor="phone"
                                                                >
                                                                    Your
                                                                    WhatsApp
                                                                    Number
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
                                                                <div
                                                                    className="my-10 checkbox-right"
                                                                    style={{
                                                                        display:
                                                                            'flex'
                                                                    }}
                                                                >
                                                                    <b
                                                                        style={{
                                                                            marginRight:
                                                                                '0.5rem',
                                                                            marginTop:
                                                                                '1rem',
                                                                            fontSize:
                                                                                '1.5rem'
                                                                        }}
                                                                    >
                                                                        Same
                                                                    </b>
                                                                    <Input
                                                                        type="checkbox"
                                                                        className="mt-3 mb-8 my-10 pb-4 pt-3"
                                                                        name="click"
                                                                        disabled={
                                                                            (formik
                                                                                .values
                                                                                .mentor_mobile
                                                                                .length >
                                                                            0
                                                                                ? false
                                                                                : true) ||
                                                                            (holdKey
                                                                                ? true
                                                                                : false)
                                                                        }
                                                                        id="click"
                                                                        checked={
                                                                            checkBox
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleCheckbox(
                                                                                e,
                                                                                !checkBox
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <InputBox
                                                                {...inputMobile}
                                                                id="mentor_whatapp_mobile"
                                                                isDisabled={
                                                                    (formik
                                                                        .values
                                                                        .mentor_mobile
                                                                        .length >
                                                                    0
                                                                        ? false
                                                                        : true) ||
                                                                    (holdKey
                                                                        ? true
                                                                        : false) ||
                                                                    checkBox
                                                                }
                                                                name="mentor_whatapp_mobile"
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .mentor_whatapp_mobile
                                                                }
                                                            />

                                                            {formik.touched
                                                                .mentor_whatapp_mobile &&
                                                            formik.errors
                                                                .mentor_whatapp_mobile ? (
                                                                <small className="error-cls">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .mentor_whatapp_mobile
                                                                    }
                                                                </small>
                                                            ) : null}
                                                        </Col>
                                                        {/* <Row
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
                                                        xl={12}
                                                    >
                                                        <Label
                                                            className="mb-2 mt-3"
                                                            htmlFor="password"
                                                        >
                                                            Password
                                                        </Label>
                                                        <InputBox
                                                            {...inputPassword}
                                                            id="reg-password"
                                                            type="password"
                                                            isDisabled={
                                                                holdKey
                                                                    ? true
                                                                    : false
                                                            }
                                                            name="password"
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            value={
                                                                formik.values
                                                                    .password
                                                            }
                                                        />

                                                        {formik.touched
                                                            .password &&
                                                        formik.errors
                                                            .password ? (
                                                            <small className="error-cls">
                                                                {
                                                                    formik
                                                                        .errors
                                                                        .password
                                                                }
                                                            </small>
                                                        ) : null}
                                                    </Col>
                                                </Row> */}
                                                        {/* <div className="mt-3">
                                                    <span
                                                        required
                                                        className="p-1 "
                                                        style={{ color: 'red' }}
                                                    >
                                                        * Note : PWD is set
                                                        default with Characters
                                                        in mail (till before @)
                                                        ex : ID-
                                                        abcd.98@gmail.com ,
                                                        Password : “abcd.98”
                                                    </span>
                                                </div> */}
                                                    </Row>
                                                    {/* <Row
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
                                                        className="mb-2 mt-3"
                                                        htmlFor="password"
                                                    >
                                                        Mentor Name
                                                    </Label>
                                                    <InputBox
                                                        {...inputMentorTn}
                                                        id="mentor_name_vernacular"
                                                        isDisabled={
                                                            holdKey
                                                                ? true
                                                                : false
                                                        }
                                                        name="mentor_name_vernacular"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .mentor_name_vernacular
                                                        }
                                                    />

                                                    {formik.touched
                                                        .mentor_name_vernacular &&
                                                    formik.errors
                                                        .mentor_name_vernacular ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .mentor_name_vernacular
                                                            }
                                                        </small>
                                                    ) : null}
                                                </Col>
                                            </Row> */}
                                                    {/* <div className="mt-5 d-flex align-items-center">
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
                                            </div> */}
                                                    {/* {btnOtp && (
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
                                            )} */}
                                                    {/* {formik.values.otp.length > 5 &&
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
                                                )} */}
                                                    {/* {btnOtp && ( */}
                                                    <div className="mt-5">
                                                        <Button
                                                            label={
                                                                'VERIFY & REGISTER'
                                                            }
                                                            // btnClass={'primary'}
                                                            btnClass={
                                                                !(
                                                                    formik.dirty &&
                                                                    formik.isValid
                                                                )
                                                                    ? 'default'
                                                                    : 'primary'
                                                            }
                                                            // btnClass={
                                                            //     formik.values.otp
                                                            //         .length > 5 &&
                                                            //     otpRes ==
                                                            //         formik.values
                                                            //             .otp
                                                            //         ? 'primary rounded-0'
                                                            //         : 'default rounded-0'
                                                            // }
                                                            size="small"
                                                            type="submit"
                                                            // disabled={
                                                            //     !(
                                                            //         formik.values
                                                            //             .otp
                                                            //             .length >
                                                            //             5 &&
                                                            //         otpRes ==
                                                            //             formik
                                                            //                 .values
                                                            //                 .otp
                                                            //     )
                                                            // }
                                                        />
                                                    </div>
                                                    {/* )} */}
                                                </Col>
                                            </Card>
                                        </div>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default MySchoolProfile;
