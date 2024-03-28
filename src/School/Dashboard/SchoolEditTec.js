/* eslint-disable indent */
import React from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Layout from '../Layout';
import { Button } from '../../stories/Button';
import axios from 'axios';
import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
    getCurrentUser,
    openNotificationWithIcon,
    setCurrentUser
} from '../../helpers/Utils';
import { useHistory } from 'react-router-dom';
import { encryptGlobal } from '../../constants/encryptDecrypt';

const EditTeacherProfileDetails = (props) => {
    // here we can edit the users details //
    const history = useHistory();
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const mentorData =
        // where  mentorData = mentor details //
        (history && history.location && history.location.item) || {};
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const name = /^[a-zA-Z\s\u0B80-\u0BFF]+$/;

    const getValidationSchema = () => {
        // where data = mentorData //
        const adminValidation = Yup.object({
            mentor_whatapp_mobile: Yup.string()
                .required('required')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .min(10, 'Please enter valid number')
                .max(10, 'Please enter valid number'),
            mentor_mobile: Yup.string()
                .required('required')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .min(10, 'Please enter valid number')
                .max(10, 'Please enter valid number'),
            mentor_email: Yup.string()
                .email('Must be a valid Email Id')
                .matches(regex, 'accept only small letters only')
                .max(255),
            gender: Yup.string().required('Please select valid gender'),
            mentor_title: Yup.string().required('Please select Title'),
            // date_of_birth: Yup.string().required('Please Select DOb'),
            date_of_birth: Yup.date()
                .required('Date of Birth is required')
                .min(
                    new Date(new Date().getFullYear() - 65, 0, 1),
                    'Age cannot exceed 65 years'
                )
                .max(
                    new Date(new Date().getFullYear() - 21, 11, 31),

                    'Age must be at least 21 years'
                ),
            mentor_name: Yup.string()

                .trim()
                .min(2, 'Enter Name')
                .matches(name, 'Special Characters are not allowed')
                .required('Required')
            // mentor_name_vernacular: Yup.string()

            //     .trim()
            //     .min(2, 'Enter Name')
            //     .matches(/^[aA-zZ\s]+$/, 'Special Characters are not allowed')
            //     .required('Required')
        });
        return adminValidation;
    };
    const getInitialValues = (mentorData) => {
        const commonInitialValues = {
            mentor_name: mentorData?.mentor_name,
            mentor_title: mentorData.mentor_title,
            mentor_whatapp_mobile: mentorData.mentor_whatapp_mobile,
            gender: mentorData.gender,
            date_of_birth: mentorData?.date_of_birth,
            mentor_mobile: mentorData?.mentor_mobile,
            mentor_email: mentorData?.mentor_email
            // username: mentorData?.username
        };
        return commonInitialValues;
    };
    const formik = useFormik({
        initialValues: getInitialValues(mentorData),
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            const body = {
                mentor_name: values.mentor_name,
                mentor_email: values.mentor_email,
                mentor_title: values.mentor_title,
                mentor_whatapp_mobile: values.mentor_whatapp_mobile,
                gender: values.gender,
                date_of_birth: values.date_of_birth,
                mentor_mobile: values.mentor_mobile,
                username: mentorData.username
            };
            if (
                mentorData &&
                mentorData.mentor_mobile !== values.mentor_mobile
            ) {
                body['username'] = values.mentor_mobile;
            }
            const ment = encryptGlobal(JSON.stringify(mentorData.mentor_id));
            const url = process.env.REACT_APP_API_BASE_URL + '/mentors/' + ment;
            var config = {
                method: 'put',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        openNotificationWithIcon(
                            'success',
                            'Updated Successfully'
                        );
                        currentUser.data[0].mentor_name = values.mentor_name;
                        setCurrentUser(currentUser);
                        setTimeout(() => {
                            props.history.push('/institution/dashboard');
                        }, 200);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });
    const inputmentor_Email = {
        type: 'text',
        placeholder: 'Enter Email Id',
        className: 'defaultInput'
    };

    const handleDiscard = () => {
        // where we can discard  the changes //
        props.history.push('/institution/dashboard');
    };

    return (
        <Layout title="My Profile">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit Profile</h3>
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <Row className="justify-content-center">
                                        <Row>
                                            <Col md={3}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="mentor_title"
                                                >
                                                    Title
                                                    {/* {t('teacehr_red.mentor_title')} */}
                                                </Label>
                                                <select
                                                    name="mentor_title"
                                                    // id="gender"
                                                    className=" col-8 form-control custom-registerdropdown "
                                                    value={
                                                        formik.values
                                                            .mentor_title
                                                    }
                                                    onBlur={formik.handleBlur}
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
                                                {formik.touched.mentor_title &&
                                                formik.errors.mentor_title ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .mentor_title
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={3}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="gender"
                                                >
                                                    {t('teacehr_red.gender')}
                                                </Label>
                                                <select
                                                    name="gender"
                                                    // id="gender"
                                                    className=" col-8 SelectBox form-control custom-registerdropdown "
                                                    value={formik.values.gender}
                                                    onBlur={formik.handleBlur}
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
                                                {formik.touched.gender &&
                                                formik.errors.gender ? (
                                                    <small className="error-cls">
                                                        {formik.errors.gender}
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={6}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="mentor_name"
                                                >
                                                    Full Name
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    id="mentor_name"
                                                    name="mentor_name"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .mentor_name
                                                    }
                                                />

                                                {formik.touched.mentor_name &&
                                                formik.errors.mentor_name ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .mentor_name
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="date_of_birth"
                                                >
                                                    DOB
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    id="date_of_birth"
                                                    name="date_of_birth"
                                                    type="date"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .date_of_birth
                                                    }
                                                />

                                                {formik.touched.date_of_birth &&
                                                formik.errors.date_of_birth ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .date_of_birth
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col className="form-group" md={3}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="mentor_email"
                                                >
                                                    Email Address
                                                </Label>
                                                <InputBox
                                                    {...inputmentor_Email}
                                                    id="mentor_email"
                                                    // isDisabled={
                                                    //     holdKey ? true : false
                                                    // }
                                                    name="mentor_email"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .mentor_email
                                                    }
                                                />

                                                {formik.touched.mentor_email &&
                                                formik.errors.mentor_email ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .mentor_email
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>

                                            <Col md={4}>
                                                <Label
                                                    className=" name-req"
                                                    htmlFor="mentor_whatapp_mobile"
                                                >
                                                    {t(
                                                        'teacehr_red.faculty_mobile'
                                                    )}
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    id="mentor_whatapp_mobile"
                                                    name="mentor_whatapp_mobile"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .mentor_whatapp_mobile
                                                    }
                                                />

                                                {formik.touched
                                                    .mentor_whatapp_mobile &&
                                                formik.errors
                                                    .mentor_whatapp_mobile ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .mentor_whatapp_mobile
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={3}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="name"
                                                >
                                                    Mobile number
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    type="text"
                                                    id="mentor_mobile"
                                                    name="mentor_mobile"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .mentor_mobile
                                                    }
                                                />

                                                {formik.touched.mentor_mobile &&
                                                formik.errors.mentor_mobile ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .mentor_mobile
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
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

export default withRouter(EditTeacherProfileDetails);
