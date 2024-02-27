/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
// import './style.scss';
import Select from './Select.jsx';

import Layout from './Layout.jsx';

import { Button } from '../stories/Button.jsx';
import { DropDownWithSearch } from '../stories/DropdownWithSearch/DropdownWithSearch';

import axios from 'axios';
// import Select from './../Challenges/pages/Select';

import { InputBox } from '../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { useTranslation } from 'react-i18next';

import { URL, KEY } from '../constants/defaultValues';
import {
    getNormalHeaders,
    openNotificationWithIcon,
    getCurrentUser
} from '../helpers/Utils';
import { useHistory } from 'react-router-dom';
import { encryptGlobal } from '../constants/encryptDecrypt.js';

import { useDispatch, useSelector } from 'react-redux';
import dist from 'react-data-table-component-extensions';

const EditSchool = () => {
    const history = useHistory();

    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const [instType, setInstType] = useState([]);
    const [stream, setStream] = useState([]);
    const [program, setProgram] = useState([]);
    const inputDICE = {
        type: 'text',
        className: 'defaultInput'
    };
    const selectCategory = {
        label: 'Select Institution',
        options: instType,
        className: 'defaultDropdown'
    };
    const selectStream = {
        label: 'Select Stream',
        options: stream,
        className: 'defaultDropdown'
    };
    const selectProgram = {
        label: 'Select Program',
        options: program,
        className: 'defaultDropdown'
    };
    useEffect(() => {
        const paramApi = encryptGlobal(
            JSON.stringify({
                status: 'ALL'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/institutionTypes?Data=${paramApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response);
                    let dataa = response?.data?.data;

                    if (dataa) {
                        let courseOption = [];
                        dataa.map((item) => {
                            let option = {
                                label: item.institution_type,
                                value: item.institution_type_id
                            };
                            courseOption.push(option);
                        });
                        // setListCourse(courseOption);
                        setInstType(courseOption);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        const paramApi = encryptGlobal(
            JSON.stringify({
                status: 'ALL'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/Streams?Data=${paramApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response);
                    let data = response?.data?.data;

                    if (data) {
                        let StreamOption = [];
                        data.map((item) => {
                            let option = {
                                label: item.stream_name,
                                value: item.stream_id
                            };
                            StreamOption.push(option);
                        });
                        // setListCourse(courseOption);
                        setStream(StreamOption);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        const paramApi = encryptGlobal(
            JSON.stringify({
                status: 'ALL'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/programs?Data=${paramApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response);
                    let datA = response?.data?.data;

                    if (datA) {
                        let ProgramOption = [];
                        datA.map((item) => {
                            let option = {
                                label: item.program_name,
                                value: item.program_id
                            };
                            ProgramOption.push(option);
                        });
                        setProgram(ProgramOption);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    const formik = useFormik({
        initialValues: {
            institution_type_id: '',
            stream_id: '',

            program_id: ''
        },

        validationSchema: Yup.object({
            institution_type_id: Yup.string().required(
                'Institution  is required'
            ),
            stream_id: Yup.string().required('Stream is required'),
            program_id: Yup.string().required('Program is required')
        }),

        onSubmit: async (values) => {
            const body = {
                institution_id: currentUser?.data[0]?.institution_id,
                institution_type_id: values.institution_type_id,
                stream_id: values.stream_id,
                program_id: values.program_id
            };

            var config = {
                method: 'post',
                url:
                    process.env.REACT_APP_API_BASE_URL +
                    '/institutions/addinstCourse',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };

            await axios(config)
                .then((checkOrgRes) => {
                    if (checkOrgRes.status == 200) {
                        openNotificationWithIcon(
                            'success',
                            'Course Update Successfully'
                        );
                        history.push('/institution/my-profile');
                    }
                })
                .catch((err) => {
                    return err.response;
                });
        }
    });

    return (
        <Layout title="My Profile">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h3 className="mb-5">Add Courses</h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <FormGroup className="form-group">
                                        <Row>
                                            <Col md={12} className="mb-0">
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="stream_id"
                                                >
                                                    Institution Type
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>

                                                <DropDownWithSearch
                                                    {...selectCategory}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(option) => {
                                                        formik.setFieldValue(
                                                            'institution_type_id',
                                                            option[0]?.value
                                                        );
                                                    }}
                                                    // value={
                                                    //     formik.values
                                                    //         .stream_id
                                                    // }
                                                    name="Select Institution"
                                                    id="Select Institution"
                                                />
                                                {formik.touched
                                                    .institution_type_id &&
                                                formik.errors
                                                    .institution_type_id ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .institution_type_id
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12} className="mb-0">
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="stream_id"
                                                >
                                                    Stream Type
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>

                                                <DropDownWithSearch
                                                    {...selectStream}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(option) => {
                                                        formik.setFieldValue(
                                                            'stream_id',
                                                            option[0]?.value
                                                        );
                                                    }}
                                                    // value={
                                                    //     formik.values
                                                    //         .stream_id
                                                    // }
                                                    name="Select Stream"
                                                    id="Select Stream"
                                                />
                                                {formik.touched.stream_id &&
                                                formik.errors.stream_id ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .stream_id
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} className="mb-0">
                                                <Label
                                                    className="name-req-create-member"
                                                    htmlFor="stream_id"
                                                >
                                                    Program Type
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>

                                                <DropDownWithSearch
                                                    {...selectProgram}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(option) => {
                                                        formik.setFieldValue(
                                                            'program_id',
                                                            option[0]?.value
                                                        );
                                                    }}
                                                    // value={
                                                    //     formik.values
                                                    //         .stream_id
                                                    // }
                                                    name="Select Program"
                                                    id="Select Program"
                                                />
                                                {formik.touched.program_id &&
                                                formik.errors.program_id ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .program_id
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </div>

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <Button
                                            label="Discard"
                                            btnClass="secondary"
                                            size="small"
                                            onClick={() =>
                                                history.push(
                                                    '/institution/my-profile'
                                                )
                                            }
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

export default withRouter(EditSchool);
