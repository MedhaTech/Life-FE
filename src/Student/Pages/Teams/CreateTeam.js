/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
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

import {
    collegesList
} from '../../../RegPage/OrgData';


import { useHistory } from 'react-router-dom';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
const AddMentor = (props) => {
    // here we can edit the users details //
    const history = useHistory();
    const category = ['Student', 'Faculty', 'Research Scholar', 'Others'];
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    // const fileHandler = (e) => {
    //     let file = e.target.files[0];

    //     if (!file) {
    //         return;
    //     }

    //     let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
    //     const fileName = file.name.split('.').slice(0, -1).join('.');
    //     const isValidFileName = pattern.test(fileName);

    //     const maxFileSize = 10000000;
    //     const isOverMaxSize = file.size > maxFileSize;

    //     const allowedTypes = [
    //         'image/jpeg',
    //         'image/png'
    //     ];
    //     if (!allowedTypes.includes(file.type)) {
    //         openNotificationWithIcon(
    //             'error',
    //             t('Accepting only png,jpg,jpeg,pdf,doc,docx Only')
    //         );
    //         return;
    //     }

    //     if (isOverMaxSize) {
    //         openNotificationWithIcon('error', t('student.less_10MB'));
    //         return;
    //     }

    //     if (!isValidFileName) {
    //         openNotificationWithIcon(
    //             'error',
    //             "Only alphanumeric and '_' are allowed"
    //         );
    //         return;
    //     }

    //     formik.setFieldValue('id_card', file);
    // };

    const inputDate = {
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        className: 'defaultInput'
    };
    const getValidationSchema = () => {
        // where data = mentorData //
        const adminValidation = Yup.object({
            // mobile: Yup.string()
            //     .required('Please Enter Mobile Number')
            //     .trim()
            //     .matches(/^[0-9\s]+$/, 'Mobile number is not valid')
            //     .min(10, 'Please enter valid number')
            //     .max(10, 'Please enter valid number'),
            gender: Yup.string().required('Please Select Gender'),
            member_category: Yup.string().required('Select Member Category'),
            name: Yup.string()

                .required('lease Enter Ful Name is Required')
                .trim()
                .min(2, 'Enter Full Name')
                .matches(/^[aA-zZ\s]+$/, 'Special Characters are not allowed')
                .required('Required'),
            institution_name: Yup.string()


                .trim()

                .required('Required'),
            dob: Yup.date().required('Date of Birth is required'),

            // id_card: Yup.mixed().required('Please  upload'),
            // team_name: Yup.string()

            //     .required('Please  Enter Reg Id')
            //     .trim(),
            age: Yup.number()
            // email: Yup.string()
            //     .email('Must be a valid email')
            //     .max(255)
            //     .required('Please Enter Email Address')
        });
        return adminValidation;
    };
    const getInitialValues = () => {
        const commonInitialValues = {
            name: '',
            mobile: '',
            email: '',
            team_name: '',
            gender: '',
            member_category: '',
            dob: '',
            age: '',
            institution_name: ''
        };
        return commonInitialValues;
    };
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: getValidationSchema(),
        onSubmit: async (values) => {
            // if (values.id_card !== '') {
            //     const fileData = new FormData();
            //     fileData.append('file', values.id_card);

            //     const response = await axios.post(
            //         `${process.env.REACT_APP_API_BASE_URL}/teams/teamidcardUpload`,
            //         fileData,
            //         {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //                 Authorization: `Bearer ${currentUser?.data[0]?.token}`
            //             }
            //         }
            //     );
            //     values.id_card = response?.data?.data[0].attachments[0];
            const full_name = values.name;
            // const mobile = values.mobile;
            // const email = values.email;
            const team_name = values.team_name;
            const gender = values.gender;
            const institution_name = values.institution_name;
            // const id_card = values.id_card;
            const body = JSON.stringify({
                student_name: full_name,
                student_email: "life@gmail.com",
                student_mobile: "0",
                status: 'ACTIVE',
                gender: gender,
                dob: values.dob,
                age: values.age,
                member_category: values.member_category,
                institution_name: institution_name,
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
                        openNotificationWithIcon(
                            'success',
                            'Updated Successfully'
                        );
                        history.push('/teams');
                        // setTimeout(() => {

                        // }, 2000);
                    }
                })
                .catch(function (error) {
                    if (
                        error.message === 'Request failed with status code 400'
                    ) {
                        openNotificationWithIcon(
                            'error',
                            'Email already exists'
                        );
                    }
                    console.log(error);
                });
            // }
        }
    });

    const handleDiscard = () => {
        // where we can discard  the changes //
        props.history.push('/teams');
    };
    // useEffect(() => {
    //     const currentDate = new Date();
    //     const selectedDate = new Date(formik.values.dob);

    //     if (!isNaN(selectedDate.getTime())) {
    //         const Age = currentDate.getFullYear() - selectedDate.getFullYear();
    //         formik.setFieldValue('age', JSON.stringify(Age));
    //     }

    // }, [formik.values.dob]);
    const handleSchoolChange = (event) => {
        const value = event.target.value;
        setIsOtherSelected(value === 'Others');
        formik.setFieldValue('institution_name', value === 'Others' ? '' : value);
    };
    useEffect(() => {
        const currentDate = new Date();
        const selectedDate = new Date(formik.values.dob);

        if (!isNaN(selectedDate.getTime())) {
            if (selectedDate > currentDate) {
                formik.setFieldError('dob', 'Future dates are not allowed');
                formik.setFieldValue('dob', '');
            } else {
                const age =
                    currentDate.getFullYear() - selectedDate.getFullYear();
                formik.setFieldValue('age', JSON.stringify(age));
            }
        }
    }, [formik.values.dob]);
    // console.log(formik.values.institution_name,"111");
    return (
        <Layout title="Teams">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Create Member</h3>
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <Row className="justify-content-center">
                                        <Col md={6} className='mb-2'>
                                            <Label
                                                className="name-req"
                                                htmlFor="name"
                                            >
                                                Team Member Category
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
                                            {/* <div className="dropdown CalendarDropdownComp "> */}
                                            <select
                                                className="col-8 selectDropdown"
                                                id="member_category"
                                                name="member_category"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={
                                                    formik.values
                                                        .member_category
                                                }
                                            >
                                                <option value={''}>
                                                    Team Member Category
                                                </option>
                                                {category.map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* </div> */}
                                            {formik.touched.member_category &&
                                                formik.errors.member_category ? (
                                                <small className="error-cls">
                                                    {
                                                        formik.errors
                                                            .member_category
                                                    }
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={6} className='mb-2'>
                                            <Label
                                                className="name-req"
                                                htmlFor="name"
                                            >
                                                Team Member Name
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
                                        <Col md={4} className='mb-2'>
                                            <Label
                                                className="mb-2"
                                                htmlFor="gender"
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
                                                name="gender"
                                                className="col-8 selectDropdown"
                                                value={formik.values.gender}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
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
                                                <option value="OTHERS">
                                                    Others
                                                </option>
                                            </select>
                                            {formik.touched.gender &&
                                                formik.errors.gender ? (
                                                <small className="error-cls">
                                                    {formik.errors.gender}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className='mb-2'>
                                            <Label
                                                className="mb-2"
                                                htmlFor="dob"
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
                                                id="dob"
                                                pattern={dateRegex.source}
                                                name="dob"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.dob}
                                            />

                                            {formik.touched.dob &&
                                                formik.errors.dob ? (
                                                <small className="error-cls">
                                                    {formik.errors.dob}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={4} className='mb-2'>
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
                                                isDisabled={true}
                                                placeholder="age"
                                                id="age"
                                                name="age"
                                                type="text"
                                                value={String(
                                                    formik.values.age
                                                )}
                                            />
                                            {formik.touched.age &&
                                                formik.errors.age ? (
                                                <small className="error-cls">
                                                    {formik.errors.age}
                                                </small>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6} className='mb-2'>
                                            <Label
                                                className="name-req"
                                                htmlFor="institution_name"
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
                                                {/* <span style={{ fontSize: '12px' }}>(Select Others if your institution is not listed.)</span> */}
                                            </Label>
                                            <select
                                                className="col-8 selectDropdown"
                                                id="institution_name"
                                                name="institution_name"
                                                // onChange={formik.handleChange}

                                                onChange={handleSchoolChange}
                                                onBlur={formik.handleBlur}
                                                value={isOtherSelected ? 'Others' : formik.values.institution_name}
                                            // value={
                                            //     formik.values
                                            //         .member_category
                                            // }
                                            >
                                                <option value={''}>
                                                    Institution Name
                                                </option>
                                                {collegesList.map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* </div> */}
                                            {formik.touched.institution_name &&
                                                formik.errors.institution_name ? (
                                                <small className="error-cls">
                                                    {
                                                        formik.errors
                                                            .institution_name
                                                    }
                                                </small>
                                            ) : null}
                                        </Col>
                                        {isOtherSelected && (<Col md={6}>
                                            <Label
                                                className="name-req"
                                                htmlFor="institution_name"
                                            >
                                                Enter Institution Name
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Enter Institution Name'
                                                }
                                                id="institution_name"
                                                name="institution_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={
                                                    formik.values
                                                        .institution_name
                                                }
                                            />

                                            {formik.touched.institution_name &&
                                                formik.errors.institution_name ? (
                                                <small className="error-cls">
                                                    {
                                                        formik.errors
                                                            .institution_name
                                                    }
                                                </small>
                                            ) : null}
                                        </Col>)}
                                        {/* <Col md={6}>
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
                                        </Col> */}
                                        {/* <Col md={6}>
                                            <Label
                                                className="name-req"
                                                htmlFor="team_name"
                                            >
                                                Reg. Number as per ID Card
                                            </Label>
                                            <InputBox
                                                className={'defaultInput'}
                                                placeholder={
                                                    'Please Reg. Number as per ID Card'
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
                                        </Col> */}
                                        {/* <Col md={6}>
                                            <Label
                                                className="mb-2"
                                                htmlFor="CollegeIDCard"
                                            >
                                                Colleg ID Card
                                            </Label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="file"
                                                    id="id_card"
                                                    name="id_card"
                                                    style={{
                                                        display: 'none'
                                                    }}
                                                    accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={(e) =>
                                                        fileHandler(e)
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                                <Button
                                                    label="Upload File "
                                                    btnClass="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        document
                                                            .getElementById(
                                                                'id_card'
                                                            )
                                                            .click();
                                                    }}
                                                />
                                                {formik.values.id_card &&
                                                formik.values.id_card.name ? (
                                                    <span className="ml-2">
                                                        {
                                                            formik.values
                                                                .id_card.name
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="ml-2">
                                                        {formik.initialValues
                                                            .id_card &&
                                                            formik.initialValues
                                                                .id_card.name}
                                                    </span>
                                                )}
                                            </div>
                                            {formik.touched.id_card &&
                                                formik.errors.id_card && (
                                                    <small className="error-cls">
                                                        {formik.errors.id_card}
                                                    </small>
                                                )}
                                        </Col> */}

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
                </Row >
            </div >
        </Layout >
    );
};

export default AddMentor;
