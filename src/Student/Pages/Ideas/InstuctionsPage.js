/* eslint-disable no-undef */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
// import './style.scss';
import { Button } from '../../../stories/Button';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { encryptGlobal } from '../../../constants/encryptDecrypt';

import { Card, CardBody, CardTitle } from 'reactstrap';

import Layout from '../../Layout';
import { getCurrentUser } from '../../../helpers/Utils';
import { openNotificationWithIcon } from '../../../helpers/Utils';

const InstructionsPage = (props) => {
    const currentUser = getCurrentUser('current_user');
    const { t } = useTranslation();
    const history = useHistory();
    const [ideaIntiation, setIdeaIntiation] = useState('');
    const TeamId = currentUser?.data[0]?.team_id;
    const userId = currentUser?.data[0]?.user_id;
    const district = currentUser?.data[0]?.district;
    const [button, setButton] = useState('');
    const [pageEnable, setPageEnable] = useState(true);

    const handleNext = () => {
        history.push('/challenges');
    };
    const handleStart = () => {
        apiCall();
        localStorage.setItem('condition', false);
        history.push({
            pathname: '/challenges',
            data:{
                FirstInitia:true
            }
        });
    };
    useEffect(() => {
        nextButtonApi();
    }, []);
    async function apiCall() {
        // Dice code list API //
        const body = JSON.stringify({
            team_id: TeamId,
            initiated_by: userId,
            district: district
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/ideas/initiate',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };

        await axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    setIdeaIntiation(response?.data?.data[0]?.initiated_by);
                    openNotificationWithIcon(
                        'success',
                        'Idea Initiated Successfully'
                    );
                    setPageEnable(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const nextButtonApi = () => {
        const Param = encryptGlobal(
            JSON.stringify({
                team_id: TeamId
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/ideas/submittedDetails?Data=${Param}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setButton(response.data.data === null);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const pdfFileURL =
        'https://s3.ap-south-1.amazonaws.com/aim1.0-bkt-cba6e2a/resources/stage/Final_Themes_AIM.pdf';
    return (
        <Layout title="Idea Submission">
            <div className="courses-page">
                <div
                    className="pb-5 my-5 px-5 container-fluid"
                    // style={{ minHeight: '72vh' }}
                >
                    <Row>
                        <Col
                            xl={12}
                            // className="course-video mb-5 order-1 order-xl-2"
                        >
                            <Fragment>
                                <Card className="course-sec-basic p-5">
                                    <CardTitle className="text-left" tag="h2">
                                        <p
                                            style={{
                                                color: 'blue',
                                                fontSize: '2.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {' '}
                                            {t('idea_page.main')}{' '}
                                        </p>
                                    </CardTitle>
                                    <CardBody>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: t(
                                                    'student_course.idea_ins_note'
                                                )
                                            }}
                                        ></div>

                                        <div className="text-right">
                                            {/* <div className="m-5"> */}
                                            {/* <a
                                                href={pdfFileURL}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="primary"
                                            >
                                                <Button
                                                    // button="submit"
                                                    label={t(
                                                        'student.download_theme'
                                                    )}
                                                    btnClass="primary mt-4 mx-4 "
                                                    size="small"
                                                />
                                            </a> */}
                                            {/* </div> */}
                                            {/* <div className="mx-5"> */}
                                            {button ? (
                                                <Button
                                                    label={t('idea_page.start')}
                                                    btnClass="primary mt-4 mx-4"
                                                    size="small"
                                                    onClick={handleStart}
                                                />
                                            ) : (
                                                <Button
                                                    label={t('idea_page.next')}
                                                    btnClass="primary mt-4 mx-4"
                                                    size="small"
                                                    onClick={handleNext}
                                                />
                                            )}
                                            {/* </div> */}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Fragment>
                        </Col>
                    </Row>
                </div>
            </div>
        </Layout>
    );
};

export default InstructionsPage;
