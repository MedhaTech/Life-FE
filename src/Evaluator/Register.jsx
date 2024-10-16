/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import { Modal, Form, FormGroup } from 'react-bootstrap';
import { InputBox } from '../stories/InputBox/InputBox';
import { Label } from 'reactstrap';
import { Button } from '../stories/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getNormalHeaders, openNotificationWithIcon } from '../helpers/Utils';
import { KEY } from '../constants/defaultValues';
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';
import { getAdminEvalutorsList } from '../redux/actions';

const Register = (props) => {
    // here we can add admin / eadmin //
    const handleClose = () => {};
    const dispatch = useDispatch();

    const phoneRegExp = /^[0-9]+$/;

    const inputPhone = {
        type: 'text',
        placeholder: 'Enter Mobile Number',
        className: 'defaultInput'
    };
    // const inputPassword = {
    //     type: 'text',
    //     placeholder: 'Enter Password',
    //     className: 'defaultInput'
    // };
    const inputPassword = {
        placeholder: 'Enter Password',
        showEyeIcon: true
        // className: 'defaultInput'
    };
    const inputName = {
        type: 'text',
        placeholder: 'Enter Full Name',
        className: 'defaultInput'
    };
    const inputUserId = {
        type: 'text',
        placeholder: 'Enter Email Id',
        className: 'defaultInput'
    };
    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    // const inputCity = {
    //     type: 'text',
    //     placeholder: 'District Name',
    //     className: 'defaultInput'
    // };

    const validationForEvaluator = Yup.object({
        full_name: Yup.string()
            .trim()
            .min(2, 'Enter Name')
            .matches(/^[a-zA-Z\s]+$/, 'Enter only Alphabets')
            .required('Please enter full name'),
        mobile: Yup.string()
            // .required('required')
            // .trim()
            // .matches(/^\d+$/, 'Mobile number is not valid (Enter only digits)')
            // .max(10, 'Please enter only 10 digit valid number')
            // .min(10, 'Number is less than 10 digits'),
            .required('Please enter mobile number')
            .trim()
            // .matches(phoneRegExp, 'Contact number is not valid')
            .matches(/^[0-9]+$/, 'Mobile number must contain only numbers')
            .min(10, 'Number is less than 10 digits')
            .max(10, 'Please enter valid number'),
        username: Yup.string()
            .trim()
            .email('Invalid email id')
            .required('Please enter email id'),
        // password: Yup.string()
        //     .trim()
        //     .required('Please enter Password')
        //     .matches(
        //         passwordRegex,
        //         'Password must contains  8 characters, including one letter, one number, and one special character.'
        //     )
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            mobile: '',
            full_name: '',
            role: 'EVALUATOR'
            // district: ''
        },

        validationSchema: validationForEvaluator,

        onSubmit: async (values) => {
            // const axiosConfig = getNormalHeaders(KEY.User_API_Key);

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
                full_name: values.full_name.trim(),
                username: values.username.trim(),

                mobile: values.mobile.trim(),
                role: values.role.trim(),
                password: encrypted
            });
            var config = {
                method: 'post',
                url:
                    process.env.REACT_APP_API_BASE_URL + '/evaluators/register',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
                },

                data: body
            };
            // const actualUrl = URL.evaluatorRegister;
            await axios(config)
                // .post(actualUrl, JSON.stringify(values, null, 2), axiosConfig)
                .then((evaluatorRegRes) => {
                    if (evaluatorRegRes?.data?.status == 201) {
                        dispatch(getAdminEvalutorsList());
                        openNotificationWithIcon(
                            'success',
                            evaluatorRegRes?.data?.message
                        );
                        props.setShow(false);
                    }
                })
                .catch((err) => {
                    openNotificationWithIcon(
                        'error',
                        err.response.data?.message
                    );
                    formik.setErrors({
                        check: err.response && err?.response?.data?.message
                    });
                    props.setShow(false);
                    return err.response;
                });
        }
    });

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="assign-evaluator ChangePSWModal teacher-register-modal"
            backdrop="static"
            scrollable={true}
        >
            <Modal.Header closeButton onHide={handleClose}>
                <Modal.Title
                    id="contained-modal-title-vcenter"
                    className="w-100 d-block text-center"
                >
                    {'ADD EVALUATOR'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div>
                    <Form
                        className="form-row row  mt-0 pb-5"
                        onSubmit={formik.handleSubmit}
                        isSubmitting
                    >
                        <div className={`row justify-content-center pe-md-0`}>
                            <div className={`col-md-12 p-0 `}>
                                <FormGroup
                                    className={`form-group mt-md-0 mt-5 me-md-3 `}
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="name"
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        Name
                                    </Label>

                                    <InputBox
                                        {...inputName}
                                        id="full_name"
                                        name="full_name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.full_name}
                                        maxLength={100}
                                    />

                                    {formik.touched.full_name &&
                                    formik.errors.full_name ? (
                                        <small className="error-cls">
                                            {formik.errors.full_name}
                                        </small>
                                    ) : null}
                                </FormGroup>
                            </div>
                            <div className="col-md-12 p-0">
                                <FormGroup
                                    className={`form-group mt-md-0 mt-5 me-md-3 `}
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="username"
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        Email Id
                                    </Label>
                                    <InputBox
                                        {...inputUserId}
                                        id="username"
                                        name="username"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.username}
                                    />

                                    {formik.touched.username &&
                                    formik.errors.username ? (
                                        <small className="error-cls">
                                            {formik.errors.username}
                                        </small>
                                    ) : null}
                                </FormGroup>
                            </div>

                            <div className="col-md-12 p-0">
                                <FormGroup
                                    className="form-group mt-md-0 mt-5 me-md-3"
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="mobile"
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        Mobile Number
                                    </Label>
                                    <InputBox
                                        {...inputPhone}
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        // onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.mobile}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                                inputValue.replace(/\D/g, '');
                                            formik.setFieldValue(
                                                'mobile',
                                                numericValue
                                            );
                                        }}
                                        maxLength={10}
                                        minLength={10}
                                    />

                                    {formik.touched.mobile &&
                                    formik.errors.mobile ? (
                                        <small className="error-cls">
                                            {formik.errors.mobile}
                                        </small>
                                    ) : null}
                                </FormGroup>
                            </div>
                            {/* <div className="col-md-12 p-0">
                                <FormGroup
                                    className="form-group mt-md-0 mt-5 me-md-3"
                                    md={12}
                                >
                                    <Label
                                        className="mb-2"
                                        htmlFor="password"
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        Password
                                    </Label>
                                    <InputBox
                                        {...inputPassword}
                                        id="reg-password"
                                        type="password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        // maxLength={8}
                                        minLength={8}
                                    />

                                    {formik.touched.password &&
                                    formik.errors.password ? (
                                        <small className="error-cls">
                                            {formik.errors.password}
                                        </small>
                                    ) : null}
                                </FormGroup>
                            </div> */}
                        </div>

                        <div className="mt-5">
                            <Button
                                label={'Add Evaluator'}
                                btnClass={
                                    !(formik.dirty && formik.isValid)
                                        ? 'default'
                                        : 'primary'
                                }
                                size="large"
                                type="submit"
                                disabled={!(formik.dirty && formik.isValid)}
                            />
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Register;
