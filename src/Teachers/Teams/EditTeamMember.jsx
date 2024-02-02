/* eslint-disable indent */
import React from 'react';
import './styles.scss';
import { Row, Col, Form, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Layout from '../Layout';
import { Button } from '../../stories/Button';
import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { openNotificationWithIcon, getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { encryptGlobal } from '../../constants/encryptDecrypt';
const EditTeamMember = (props) => {
    const { t } = useTranslation();
    const allowedAge = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    const allowedYear = [1, 2, 3, 4, 5];
    const allowCourse = [1, 2, 3];
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const teamMemberData =
        (history && history.location && history.location.item) || {};
    console.log(teamMemberData, 'data');
    const formik = useFormik({
        initialValues: {
            student_full_name:
                teamMemberData && teamMemberData.student_full_name,
            age: JSON.stringify(teamMemberData && teamMemberData.Age),
            gender: teamMemberData && teamMemberData.Gender,
            email: teamMemberData && teamMemberData.email,
            mobile: teamMemberData && teamMemberData.mobile,
            course_id: teamMemberData && teamMemberData.course_id,
            date_of_birth: teamMemberData && teamMemberData.date_of_birth,
            year_of_study: teamMemberData && teamMemberData.year_of_study

            // username: teamMemberData && teamMemberData.user.username
        },

        validationSchema: Yup.object({
            student_full_name: Yup.string()
                .required('Please Enter valid Full Name')
                .max(40)
                .matches(
                    /^[A-Za-z0-9\s]*$/,
                    'Please enter only alphanumeric characters'
                )
                .trim(),
            age: Yup.number()
                .integer()
                .min(10, 'Min age is 10')
                .max(18, 'Max age is 18')
                .required('required'),
            gender: Yup.string().required('Please select valid gender'),
            email: Yup.string()
                .required('required')
                .trim()
                .email('Enter Valid Email Id'),

            course_id: Yup.string().required('Please select Course'),
            year_of_study: Yup.string().required('Please select Year'),

            mobile: Yup.string()
                .required('required')
                .trim()
                .matches(
                    /^\d+$/,
                    'Mobile number is not valid (Enter only digits)'
                )
                .min(10, 'Please enter valid number')
                .max(10, 'Please enter valid number'),
            date_of_birth: Yup.string().required('Please select DOB')
        }),

        onSubmit: (values) => {
            // if (values.username) {
            //     const start = values.username.indexOf('@');
            //     const main = values.username.substring(start);
            //     const checkarry = ['@gmail.com', '@outlook.com', '@yahoo.com'];
            //     const text = checkarry.includes(main);
            //     if (!text) {
            //         openNotificationWithIcon(
            //             'error',
            //             'Email id should end with any of these "@gmail.com,@outlook.com,@yahoo.com"'
            //         );
            //         return;
            //     }
            // }
            const body = {
                team_id: teamMemberData.team_id,
                role: 'STUDENT',
                student_full_name: values.student_full_name,
                Age: values.age,
                Grade: values.grade,

                // // username: values.username,
                course_id: values.course_id,
                Gender: values.gender,
                year_of_study: values.year_of_study,
                mobile: values.mobile,
                // username: values.mobile,
                email: values.email,
                data_of_birth: values.date_of_birth
            };
            // if (teamMemberData && teamMemberData.mobile !== values.mobile) {
            //     body['mobile'] = values.email;
            // }
            const teamparamId = encryptGlobal(
                JSON.stringify(teamMemberData.student_id)
            );
            var config = {
                method: 'put',
                url:
                    process.env.REACT_APP_API_BASE_URL +
                    '/students/' +
                    teamparamId,
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
                            'Team Member Update Successfully'
                        );
                        handleView(teamMemberData);
                    } else {
                        openNotificationWithIcon(
                            'error',
                            'Opps! Something Wrong'
                        );
                    }
                })
                .catch(function (error) {
                    openNotificationWithIcon(
                        'error',
                        error?.response?.data?.message
                    );
                });
        }
    });

    const handleView = (item) => {
        history.push({
            pathname: '/teacher/view-team-member',
            item: item
        });
    };
    return (
        <Layout>
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit Team Member Details </h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-blockt">
                                    <Row>
                                        <Row>
                                            <Col md={4}>
                                                <Label
                                                    className="name-req"
                                                    htmlFor="fullName"
                                                >
                                                    {t(
                                                        'teacher_teams.student_name'
                                                    )}
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    placeholder={t(
                                                        'teacher_teams.student_name_pl'
                                                    )}
                                                    id="student_full_name"
                                                    name="student_full_name"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
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
                                            <Col md={4} className="mb-0">
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="course_id"
                                                >
                                                    Course
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <div className="dropdown CalendarDropdownComp ">
                                                    <select
                                                        className="form-control custom-dropdown"
                                                        id="course_id"
                                                        name="course_id"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .course_id
                                                        }
                                                    >
                                                        <option value={''}>
                                                            Select Course
                                                        </option>
                                                        {allowCourse.map(
                                                            (item) => (
                                                                <option
                                                                    key={item}
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                {formik.touched.course_id &&
                                                formik.errors.course_id ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .course_id
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4} className="mb-0">
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="year_of_study"
                                                >
                                                    Year Of Study
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <div className="dropdown CalendarDropdownComp ">
                                                    <select
                                                        className="form-control custom-dropdown"
                                                        id="year_of_study"
                                                        name="year_of_study"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .year_of_study
                                                        }
                                                    >
                                                        <option value={''}>
                                                            Select Year
                                                        </option>
                                                        {allowedYear.map(
                                                            (item) => (
                                                                <option
                                                                    key={item}
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                {formik.touched.year_of_study &&
                                                formik.errors.year_of_study ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .year_of_study
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                md={6}
                                                className="mb-5 mb-xl-0"
                                            >
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="email"
                                                >
                                                    Email Address
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    placeholder="Enter Email Address"
                                                    id="email"
                                                    name="email"
                                                    onChange={
                                                        formik.handleChange
                                                    }
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
                                            <Col
                                                md={6}
                                                className="mb-5 mb-xl-0"
                                            >
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="mobile"
                                                >
                                                    Mobile Number
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    placeholder="Enter Mobile Number"
                                                    id="mobile"
                                                    name="mobile"
                                                    onChange={
                                                        formik.handleChange
                                                    }
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
                                        <Row>
                                            <Col
                                                md={6}
                                                className="mb-5 mb-xl-0"
                                            >
                                                <Label
                                                    className="name-req"
                                                    htmlFor="age"
                                                >
                                                    {t('teacher_teams.age')}
                                                </Label>

                                                <div className="dropdown CalendarDropdownComp ">
                                                    <select
                                                        className="form-control custom-dropdown"
                                                        id="age"
                                                        name="age"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.age
                                                        }
                                                    >
                                                        <option value={''}>
                                                            Select Age
                                                        </option>
                                                        {allowedAge.map(
                                                            (item) => (
                                                                <option
                                                                    key={item}
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                {formik.touched.age &&
                                                formik.errors.age ? (
                                                    <small className="error-cls">
                                                        {formik.errors.age}
                                                    </small>
                                                ) : null}
                                            </Col>

                                            <Col
                                                md={6}
                                                className="mb-5 mb-xl-0"
                                            >
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="date_of_birth"
                                                >
                                                    DOB
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <InputBox
                                                    className={'defaultInput'}
                                                    placeholder="DD/MM/YYYY"
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
                                        </Row>
                                    </Row>
                                </div>

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <Button
                                            label={t('teacher_teams.discard')}
                                            btnClass="secondary"
                                            size="small"
                                            onClick={() =>
                                                props.history.push(
                                                    '/teacher/view-team-member'
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                        <Button
                                            label={t('teacher_teams.submit')}
                                            type="submit"
                                            btnClass={
                                                !(
                                                    formik.dirty &&
                                                    formik.isValid
                                                )
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            disabled={!formik.dirty}
                                            size="small"
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

export default withRouter(EditTeamMember);
