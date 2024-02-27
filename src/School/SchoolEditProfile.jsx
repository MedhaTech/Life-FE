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
import {
    getInstPlaceData,
    getInstTalukData,
    getFetchInstDistData,
    getInstBlockData
} from '../redux/Institution/actions.js';
import { useDispatch, useSelector } from 'react-redux';
import dist from 'react-data-table-component-extensions';

const EditSchool = (props) => {
    const fullDistrictNames = useSelector(
        (state) => state?.institution?.instdist
    );
    const fiterBlockData = useSelector(
        (state) => state?.institution?.instBlock
    );
    const fiterTalukData = useSelector(
        (state) => state?.institution?.instTaluk
    );
    const fiterPlaceData = useSelector(
        (state) => state?.institution?.instPlace
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFetchInstDistData());
    }, []);
    // console.log(fullDistrictNames, '1');
    // useEffect(() => {
    //     if (district !== '') {
    //         dispatch(getInstBlockData(district));
    //     }
    //     setBlock('');
    //     setPlace('');
    // }, [district]);

    // useEffect(() => {
    //     if (block !== '') {
    //         dispatch(getInstTalukData(block));
    //     }
    //     setPlace('');
    // }, [block]);
    // useEffect(() => {
    //     if (taluk !== '') {
    //         dispatch(getInstPlaceData(taluk));
    //     }
    // }, [taluk]);

    const history = useHistory();

    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');

    const listId = (history && history.location && history.location.item) || {};
    // console.log(listId);
    const inputDICE = {
        type: 'text',
        className: 'defaultInput'
    };

    const formik = useFormik({
        initialValues: {
            institution_name: listId && listId.institution_name,
            principal_name: listId && listId.principal_name,
            principal_mobile: listId && listId.principal_mobile,
            principal_email: listId && listId.principal_email,
            principal_whatsapp_mobile:
                listId && listId.principal_whatsapp_mobile,
            taluk: listId && listId.taluk,
            block: listId && listId.block,
            district: listId && listId?.district,
            place_name: listId && listId.place_name,

            // state: listId && listId.state,
            status: 'ACTIVE'
            // category: 'Category'
        },

        validationSchema: Yup.object({
            // district: Yup.string()
            //     .matches(/^[aA-zZ\s]+$/, 'Invalid district')
            //     .required('District is Required'),
            // category: Yup.string()
            //     .matches(/^[aA-zZ\s]+$/, 'Invalid category')
            //     .required('category is Required'),
            // state: Yup.string()
            //     .optional()
            //     .matches(/^[aA-zZ\s]+$/, 'Invalid State'),
            principal_email: Yup.string()
                .optional()
                .email('Invalid email address format'),
            principal_name: Yup.string()
                .optional()
                .matches(/^[aA-zZ\s/^.*$/]+$/, 'Invalid Name')
                .trim(),
            principal_mobile: Yup.string()
                .optional()
                .matches(/^[0-9\s]+$/, 'Please Enter Valid Number')
                .trim(),
            principal_whatsapp_mobile: Yup.string()
                .optional()
                .matches(/^[0-9\s]+$/, 'Please Enter Valid Number')
                .trim(),
            place_name: Yup.string().required('Place is required')
        }),

        onSubmit: async (values) => {
            const body = {
                principal_name: values.principal_name,
                principal_mobile: values.principal_mobile,
                principal_email: values.principal_email,
                principal_whatsapp_mobile: values.principal_whatsapp_mobile,
                // district: values.district,
                // block: values.block,
                // taluk: values.taluk,
                place_id: values.place_name
                // place_id: values.place_id
            };
            const editId = encryptGlobal(
                JSON.stringify(currentUser?.data[0]?.institution_id)
            );
            var config = {
                method: 'put',
                url:
                    process.env.REACT_APP_API_BASE_URL +
                    `/institutions/edit/` +
                    editId,
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
                            'Institution Update Successfully'
                        );
                        props.history.push('/institution/my-profile');
                    }
                })
                .catch((err) => {
                    return err.response;
                });
        }
    });
    useEffect(() => {
        if (formik.values.district !== '') {
            dispatch(getInstBlockData(formik.values.district));
        }
    }, [formik.values.district]);
    useEffect(() => {
        if (formik.values.block !== '') {
            dispatch(getInstTalukData(formik.values.block));
        }
    }, [formik.values.block]);
    useEffect(() => {
        if (formik.values.taluk !== '') {
            dispatch(getInstPlaceData(formik.values.taluk));
        }
    }, [formik.values.taluk]);
    // console.log(formik.values.place_name, 'value');
    return (
        <Layout title="My Profile">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h3 className="mb-5">Edit Institutions Details</h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <FormGroup className="form-group">
                                        <Row className="justify-content-center">
                                            <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="
                                                    institution_name"
                                                >
                                                    Institution Name
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <InputBox
                                                    {...inputDICE}
                                                    id="
                                                    institution_name"
                                                    isDisabled={true}
                                                    name="institution_name "
                                                    placeholder="Please enter Principal nmae"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .institution_name
                                                    }
                                                />
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
                                            <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="principal_name"
                                                >
                                                    Principal Name
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <InputBox
                                                    {...inputDICE}
                                                    id="principal_name"
                                                    // isDisabled={true}
                                                    name="principal_name"
                                                    placeholder="Please enter Principal nmae"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .principal_name
                                                    }
                                                />
                                                {formik.touched
                                                    .principal_name &&
                                                formik.errors.principal_name ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .principal_name
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="district"
                                                >
                                                    Principal Mobile
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <InputBox
                                                    id="principal_mobile"
                                                    name="principal_mobile"
                                                    // isDisabled={true}
                                                    className="code"
                                                    placeholder="Please enter Principal Mobile"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .principal_mobile
                                                    }
                                                />

                                                {formik.touched
                                                    .principal_mobile &&
                                                formik.errors
                                                    .principal_mobile ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .principal_mobile
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="principal_email"
                                                >
                                                    Principal Email
                                                    <span required>*</span>
                                                </Label>
                                                <InputBox
                                                    {...inputDICE}
                                                    id="principal_email"
                                                    name="principal_email"
                                                    placeholder="Please enter Principal email"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .principal_email
                                                    }
                                                    className="code"
                                                />
                                                {formik.touched
                                                    .principal_email &&
                                                formik.errors
                                                    .principal_email ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .principal_email
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="principal_whatsapp_mobile"
                                                >
                                                    Principal Whatsapp No
                                                </Label>
                                                <InputBox
                                                    {...inputDICE}
                                                    id="principal_whatsapp_mobile"
                                                    name="principal_whatsapp_mobile"
                                                    placeholder="Please enter principal whatsapp number"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .principal_whatsapp_mobile
                                                    }
                                                />
                                                {formik.touched
                                                    .principal_whatsapp_mobile &&
                                                formik.errors
                                                    .principal_whatsapp_mobile ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .principal_whatsapp_mobile
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            {/* <Col md={4}>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="district"
                                                >
                                                    District
                                                    {/* <span required>*</span> */}
                                            {/* </Label> */}
                                            {/* <InputBox
                                                    {...inputDICE}
                                                    id="district"
                                                    name="district"
                                                    className="code"
                                                    // isDisabled={true}
                                                    placeholder="Please enter district"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.district
                                                    }
                                                /> */}

                                            {/* {formik.touched.district &&
                                                formik.errors.district ? (
                                                    <small className="error-cls">
                                                        {formik.errors.district}
                                                    </small>
                                                ) : null} */}
                                            {/* </Col> */}
                                            <Col md={4}>
                                                <p>
                                                    <b> Select District</b>
                                                </p>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={fullDistrictNames}
                                                        setValue={(value) =>
                                                            formik.setFieldValue(
                                                                'district',
                                                                value
                                                            )
                                                        }
                                                        // value={[
                                                        //     {
                                                        //         label:
                                                        //             teamMemberData &&
                                                        //             teamMemberData.program_name,
                                                        //         value:
                                                        //             teamMemberData &&
                                                        //             // teamMemberData.stream &&
                                                        //             teamMemberData.institution_course_id
                                                        //     }
                                                        // ]}
                                                        // setValue={(value) =>
                                                        //     formik.setFieldValue(
                                                        //         'district_id',
                                                        //         value
                                                        //     )
                                                        // }
                                                        // setValue={setdistrict}
                                                        drop={1}
                                                        value={
                                                            formik.values
                                                                .district
                                                        }
                                                        placeHolder={
                                                            'Select District'
                                                        }
                                                        // value={district}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={4}>
                                                <p>
                                                    <b> Select Block</b>
                                                </p>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={fiterBlockData}
                                                        setValue={(value) =>
                                                            formik.setFieldValue(
                                                                'block',
                                                                value
                                                            )
                                                        }
                                                        drop={2}
                                                        // setValue={setBlock}
                                                        placeHolder={
                                                            'Select Block'
                                                        }
                                                        value={
                                                            formik.values.block
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <p>
                                                    <b> Select Taluk</b>
                                                </p>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={fiterTalukData}
                                                        setValue={(value) =>
                                                            formik.setFieldValue(
                                                                'taluk',
                                                                value
                                                            )
                                                        }
                                                        drop={3}
                                                        // setValue={setTaluk}
                                                        placeHolder={
                                                            'Select Taluk'
                                                        }
                                                        value={
                                                            formik.values.taluk
                                                        }
                                                    />
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <p>
                                                    <b> Select Place</b>
                                                </p>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={fiterPlaceData}
                                                        setValue={(value) =>
                                                            formik.setFieldValue(
                                                                'place_name',
                                                                value
                                                            )
                                                        }
                                                        drop={4}
                                                        placeHolder={
                                                            'Select Place'
                                                        }
                                                        value={
                                                            formik.values
                                                                .place_name
                                                        }
                                                    />
                                                    {formik.touched
                                                        .place_name &&
                                                    formik.errors.place_name ? (
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .place_name
                                                            }
                                                        </small>
                                                    ) : null}
                                                </div>
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
                                                props.history.push(
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
