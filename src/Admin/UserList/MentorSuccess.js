/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';

import axios from 'axios';
import '../../Student/Pages/SignUp.scss';
import { InputBox } from '../../stories/InputBox/InputBox';
import CryptoJS from 'crypto-js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import 'sweetalert2/src/sweetalert2.scss';
import Layout from '../Layout';
import { useHistory } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import successLogo from '../../assets/media/check.png';
import { Link } from 'react-router-dom';
import { Button } from '../../stories/Button';

// eslint-disable-next-line no-unused-vars
const ChangePSWModal = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const mentorDaTa = JSON.parse(localStorage.getItem('mentorData'));
    const orgDaTa = JSON.parse(localStorage.getItem('orgData'));
    // const user = mentorDaTa.username;
    // const myArray = user.split('@');
    // const word = myArray[0];
    const [buttonData, setButtonData] = useState('');
    return (
        <Layout title="Dashboard">
            <div className="container ChangePSWModal mb-5">
                <Row className="mt-5 change-password">
                    <Col md={12}>
                        <Col
                            xs={12}
                            sm={12}
                            md={6}
                            xl={6}
                            className="article"
                            style={{ padding: '8rem 8rem' }}
                        >
                            <Row className="mb-0">
                                <Col
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    xl={12}
                                    className="my-auto"
                                >
                                    <figure>
                                        <img
                                            src={successLogo}
                                            alt="successLogo"
                                            style={{
                                                width: '30%'
                                            }}
                                            className="img-fluid img-1"
                                        />
                                    </figure>

                                    <p
                                        style={{
                                            fontSize: '3.4rem',
                                            fontWeight: 'bold',
                                            color: 'DarkGreen'
                                        }}
                                    >
                                        Congratulations
                                    </p>

                                    <p
                                        style={{
                                            fontWeight: 'bold',
                                            marginBottom: '2rem'
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: '#404040',
                                                marginBottom: '1rem'
                                            }}
                                        >
                                            {/* Mentor Name:{' '} */}
                                            {mentorDaTa.mentor_title}.{' '}
                                            {mentorDaTa.mentor_name} &nbsp; have
                                            been successfully registered.
                                        </p>{' '}
                                    </p>

                                    {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    ATL Code:{' '}
                                    {/* {successData &&
                                        successData.organization_code} */}
                                    {/* {mentorDaTa.organization_code} */}
                                    {/* </p>  */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Institution Unique Code:{' '}
                                        {orgDaTa.institution_code
                                            ? orgDaTa.institution_code
                                            : '-'}
                                    </p> */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Institution Name:{' '}
                                        {orgDaTa.institution_name}
                                        {/* {mentorDaTa.organization_code} */}
                                    {/* </p>  */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        District:{' '}
                                        {
                                            orgDaTa?.place?.taluk?.block
                                                ?.district?.district_name
                                        }
                                        {/* {mentorDaTa.organization_code} */}
                                    {/* </p>  */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        State:{' '}
                                        {
                                            orgDaTa?.place?.taluk?.block
                                                ?.district?.state?.state_name
                                        }
                                        {/* {mentorDaTa.organization_code} */}
                                    {/* </p>  */}
                                    {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Pin Code: {orgDaTa.pin_code}.{' '}
                                    {mentorDaTa.pin_code}
                                </p> */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Mentor Name: {mentorDaTa.mentor_title}.{' '}
                                        {mentorDaTa.mentor_name}
                                    </p> */}

                                    <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Login ID: {mentorDaTa.username}
                                    </p>
                                    {/* <p
                                    style={{
                                        color: 'gray',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    Password: {mentorDaTa.username}
                                </p> */}
                                    <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Password: {mentorDaTa.mentor_mobile}
                                    </p>
                                    <p>
                                        Would you like to register another
                                        Mentor ?
                                    </p>
                                    {/* <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Button
                                            label="Yes"
                                            btnClass="primary tex-center m-3"
                                            size="small"
                                            style={{
                                                // borderRadius: '0px',
                                                // padding: '1rem 1rem',
                                                height: '35px'
                                            }}
                                            onClick={() =>
                                                history.push(
                                                    '/institution/register'
                                                )
                                            }
                                        />
                                        <Button
                                            label="No"
                                            btnClass="primary tex-center m-3"
                                            size="small"
                                            style={{
                                                // borderRadius: '0px',
                                                // padding: '1rem 1rem',
                                                height: '35px'
                                            }}
                                            // onClick={handleButton}
                                            onClick={() =>
                                                history.push(
                                                    '/institution/dashboard'
                                                )
                                            }
                                        />
                                    </div> */}
                                    {/* <div
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            justifyContent: 'center'
                                        }}
                                    > */}
                                    <Button
                                        label="Yes "
                                        btnClass=" m-3 btn btn-primary"
                                        size="small"
                                        shape="btn-square"
                                        style={{ margin: '5px' }}
                                        onClick={() =>
                                            history.push(
                                                '/admin/mentor/register'
                                            )
                                        }
                                    />
                                    <Button
                                        label="No "
                                        // btnClass="btn btn-primary"
                                        btnClass="m-3 btn btn-primary"
                                        size="small"
                                        shape="btn-square"
                                        style={{ margin: '5px' }}
                                        onClick={() =>
                                            history.push('/admin/userlist')
                                        }
                                    />
                                    {/* </div> */}
                                    {/* <Button
                                        label="Yes "
                                        btnClass="m-3 btn btn-success"
                                        size="small"
                                        shape="btn-square"
                                        onClick={() =>
                                            history.push(
                                                '/institution/register'
                                            )
                                        }
                                    />
                                    <Button
                                        label="No "
                                        btnClass="m-3 btn btn-primary"
                                        size="small"
                                        shape="btn-square"
                                        onClick={() =>
                                            history.push(
                                                '/institution/dashboard'
                                            )
                                        }
                                    /> */}
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        Whatsapp Number:{' '}
                                        {mentorDaTa.mentor_whatapp_mobile}
                                    </p> */}

                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '2rem'
                                        }}
                                    >
                                        Gender: {mentorDaTa.gender}
                                    </p> */}
                                    <>
                                        {/* <Button
                                        label="Send Login Details to mail"
                                        btnClass="primary tex-center my-0 py-0 mx-3 px-3"
                                        style={{
                                            borderRadius: '0px',
                                            padding: '1rem 1rem',
                                            height: '35px'
                                        }}
                                        size="small"
                                        onClick={handleButton}
                                    /> */}
                                    </>
                                    {/* <p
                                        style={{
                                            color: '#404040',
                                            marginBottom: '2rem'
                                        }}
                                    >
                                        Take a screenshot for future reference.
                                    </p> */}

                                    {/* <h3>
                                        Would you like to register another
                                        Mentor ?
                                        <Button
                                            label="Yes"
                                            btnClass="primary tex-center "
                                            // style={{
                                            //     borderRadius: '0px',
                                            //     padding: '1rem 1rem',
                                            //     height: '35px'
                                            // }}
                                            size="small"
                                            // onClick={handleButton}
                                        />
                                        <Button
                                            label="No"
                                            btnClass="primary tex-center "
                                            // style={{
                                            //     borderRadius: '0px',
                                            //     padding: '1rem 1rem',
                                            //     height: '35px'
                                            // }}
                                            size="small"
                                            // onClick={handleButton}
                                        />
                                        {/* <Link
                                            exact="true"
                                            to="/institution/register"
                                            className="p-0 blue text-link w-100 mt-3"
                                        >
                                            Yes /
                                        </Link>
                                        <Link
                                            exact="true"
                                            to="/institution/dashboard"
                                            className="p-0 blue text-link w-100 mt-3"
                                        >
                                            No
                                        </Link> */}
                                    {/* </h3>  */}
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default ChangePSWModal;
