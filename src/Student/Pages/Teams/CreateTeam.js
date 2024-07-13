/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import { Button } from '../../../stories/Button';
import axios from 'axios';
import { InputBox } from '../../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';

import { useHistory } from 'react-router-dom';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
const AddMentor = (props) => {
    // here we can edit the users details //
    const history = useHistory();

    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');

    const getValidationSchema = () => {
        // where data = mentorData //
        const adminValidation = Yup.object({
            mobile: Yup.string()
                .required('Please Enter Mobile Number')
                .trim()
                .matches(/^[0-9\s]+$/, 'Mobile number is not valid')
                .min(10, 'Please enter valid number')
                .max(10, 'Please enter valid number'),
            name: Yup.string()

                .required('lease Enter Ful Name is Required')
                .trim()
                .min(2, 'Enter Full Name')
                .matches(/^[aA-zZ\s]+$/, 'Special Characters are not allowed')
                .required('Required'),
            team_name: Yup.string()

                .required('Please  Enter Team Name')
                .trim()
                .min(2, 'Enter Team Name')
                .matches(/^[aA-zZ\s]+$/, 'Special Characters are not allowed'),
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Please Enter Email Address')
        });
        return adminValidation;
    };
    const getInitialValues = () => {
        const commonInitialValues = {
            name: '',
            mobile: '',
            email: '',
            team_name: ''
        };
        return commonInitialValues;
    };
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            const full_name = values.name;
            const mobile = values.mobile;
            const email = values.email;
            const team_name = values.team_name;
            const body = JSON.stringify({
                student_name: full_name,
                student_email: email,
                student_mobile: mobile,
                status: 'ACTIVE',
                team_name: team_name,
                student_id: JSON.stringify(currentUser?.data[0]?.student_id)
            });
            // const editParam = encryptGlobal(
            //     JSON.stringify(currentUser?.data[0]?.user_id)
            // );
            const url = process.env.REACT_APP_API_BASE_URL + '/teams';
            var config = {
                method: 'post',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 201) {
                        console.log(response, 'ress');
                        openNotificationWithIcon(
                            'success',
                            'Updated Successfully'
                        );
                        setTimeout(() => {
                            history.push('/teams');
                        }, 2000);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });

    const handleDiscard = () => {
        // where we can discard  the changes //
        props.history.push('/teams');
    };

    return (
        <Layout title="Teams">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Create Team</h3>
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <Row className="justify-content-center">
                                        <Col md={6}>
                                            <Label
                                                className="name-req"
                                                htmlFor="team_name"
                                            >
                                                Team Name
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Please Enter Team Name'
                                                }
                                                id="team_name"
                                                name="team_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.team_name}
                                            />

                                            {formik.touched.team_name &&
                                            formik.errors.team_name ? (
                                                <small className="error-cls">
                                                    {formik.errors.team_name}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={6}>
                                            <Label
                                                className="name-req"
                                                htmlFor="name"
                                            >
                                                Full Name
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Please Enter Full Name'
                                                }
                                                id="name"
                                                name="name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.name}
                                            />

                                            {formik.touched.name &&
                                            formik.errors.name ? (
                                                <small className="error-cls">
                                                    {formik.errors.name}
                                                </small>
                                            ) : null}
                                        </Col>

                                        <Col md={6}>
                                            <Label
                                                className="name-req"
                                                htmlFor="email"
                                            >
                                                Email Address
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Please Enter Email Address'
                                                }
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
                                        <Col md={6}>
                                            <Label
                                                className=" name-req"
                                                htmlFor="mobile"
                                            >
                                                Mobile Number
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Please Enter Mobile Number'
                                                }
                                                id="mobile"
                                                name="mobile"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.mobile}
                                            />

                                            {formik.touched.mobile &&
                                            formik.errors.mobile ? (
                                                <small className="error-cls">
                                                    {formik.errors.mobile}
                                                </small>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </div>

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <Button
                                            label="Discard"
                                            btnClass="secondary"
                                            size="small"
                                            onClick={handleDiscard}
                                        />
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                        <Button
                                            label="Submit details"
                                            type="submit"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            size="small"
                                            disabled={!formik.dirty}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default AddMentor;
