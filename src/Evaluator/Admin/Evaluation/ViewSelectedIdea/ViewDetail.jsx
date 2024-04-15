/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect } from 'react';
import './ViewSelectedideas.scss';
import { Button } from '../../../../stories/Button';
import LinkComponent from '../Pages/LinkComponent';
import {
    getCurrentUser,
    openNotificationWithIcon
} from '../../../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';

import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Select from '../Pages/Select';
import { useHistory, useLocation } from 'react-router-dom';
import RatedDetailCard from '../Pages/RatedDetailCard';
import jsPDF from 'jspdf';
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';
import DetailToDownload from '../../Challenges/DetailToDownload';
import html2canvas from 'html2canvas';
import { Row, Col, Form, Label } from 'reactstrap';
import { useReactToPrint } from 'react-to-print';
import { encryptGlobal } from '../../../../constants/encryptDecrypt';
const ViewDetail = (props) => {
    const { t } = useTranslation();

    const history = useHistory();
    const { search } = useLocation();
    const level = new URLSearchParams(search).get('level');
    const currentUser = getCurrentUser('current_user');
    const [teamResponse, setTeamResponse] = React.useState({});
    const [isReject, setIsreject] = React.useState(false);
    const [reason, setReason] = React.useState('');
    const [reasonSec, setReasonSec] = React.useState('');

    const selectData = [
        'Not novel - Idea and problem common and already in use.',
        'Not novel - Idea has been 100% plagiarized.',
        'Not useful - Idea does not solve the problem identified / problem & solution not connected.',
        'Not understandable - Idea Submission does not have proper details to make a decision.',
        'Not clear (usefulness)',
        'Not filled - Inaccurate data (form is not filled properly)'
    ];
    const reasondata2 = [
        'Lot of project effort visible.',
        'Some project effort visible.',
        'Zero project effort visible.'
    ];
    // React.useEffect(() => {
    //     if (props?.ideaDetails?.response) {
    //         setTeamResponse(
    //             Object.entries(props?.ideaDetails?.response).map((e) => e[1])
    //         );
    //     }
    // }, [props]);
    useEffect(() => {
        if (props?.ideaDetails) {
            setTeamResponse(props?.ideaDetails);
        }
    }, [props]);
    // console.warn(props);

    const handleAlert = (handledText) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });

        swalWithBootstrapButtons
            .fire({
                title:
                    handledText === 'accept'
                        ? 'You are attempting to accept this Idea'
                        : 'You are attempting to reject this Idea',
                text: 'Are you sure?',
                showCloseButton: true,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if (result.isConfirmed) {
                        handleL1Round(handledText);
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', '', 'error');
                }
            });
    };

    const handleL1Round = (handledText) => {
        const currentTime = new Date().toLocaleString();

        const body = JSON.stringify({
            evaluation_status:
                handledText == 'accept' ? 'SELECTEDROUND1' : 'REJECTEDROUND1',
            team_id: teamResponse?.team_id,
            evaluated_by: currentUser?.data[0]?.user_id,
            evaluated_at: currentTime,
            rejected_reason: handledText == 'reject' ? reason : ''
            // rejected_reasonSecond: handledText == 'reject' ? reasonSec : ''
        });
        // const challId = encryptGlobal(
        //     JSON.stringify(props?.ideaDetails?.challenge_response_id)
        // );
        var config = {
            method: 'put',
            url: `${
                process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate'
                //  +
                // challId
            }`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                openNotificationWithIcon(
                    'success',
                    response?.data?.message == 'OK'
                        ? 'Idea processed successfully!'
                        : response?.data?.message
                );
                history.push({
                    pathname: '/eadmin/evaluationStatus'
                });
            })
            .catch(function (error) {
                openNotificationWithIcon(
                    'error',
                    error?.response?.data?.message
                );
            });
    };

    const handleReject = () => {
        if (reason) {
            handleAlert('reject');
            setIsreject(false);
        }
    };

    const [pdfLoader, setPdfLoader] = React.useState(false);
    const downloadPDF = async () => {
        setPdfLoader(true);
        const domElement = document.getElementById('pdfId');
        await html2canvas(domElement, {
            onclone: (document) => {
                document.getElementById('pdfId').style.display = 'block';
            },
            scale: 1.13
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', [2580, 3508]);
            pdf.addImage(
                imgData,
                'JPEG',
                20,
                20,
                2540,
                pdf.internal.pageSize.height,
                undefined,
                'FAST'
            );
            pdf.save(`${new Date().toISOString()}.pdf`);
        });
        setPdfLoader(false);
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${
            props?.ideaDetails?.team_name
                ? props?.ideaDetails?.team_name
                : 'temp'
        }_IdeaSubmission`
    });
    const files = teamResponse?.Prototype_file
        ? teamResponse?.Prototype_file.split(',')
        : [];
    const downloadFile = (item) => {
        // const link = document.createElement('a');
        // link.href = item;
        // link.download = 'upload.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        fetch(item)
            .then((response) => {
                // Convert the response to a blob
                return response.blob();
            })
            .then((blob) => {
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                const parts = item.split('/');
                link.setAttribute('download', parts[parts.length - 1]);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };
    return (
        <div>
            {teamResponse ? (
                <>
                    <div style={{ display: 'none' }}>
                        <DetailToDownload
                            ref={componentRef}
                            ideaDetails={props?.ideaDetails}
                            teamResponse={teamResponse}
                            level={'Draft'}
                        />
                    </div>
                    {/* <div id="pdfId" style={{ display: 'none' }}>
                        <DetailToDownload
                            ideaDetails={props?.ideaDetails}
                            teamResponse={teamResponse}
                            level={level}
                        />
                    </div> */}
                    <div className="row idea_detail_card">
                        <div className="col-12 p-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <Row>
                                        {/* <Col>
                                            <h2 className="mb-md-4 mb-3">
                                                Theme :
                                                <span className="text-capitalize fs-3">
                                                    {props?.ideaDetails?.sdg?.toLowerCase() ||
                                                        ''}
                                                </span>
                                            </h2>
                                        </Col> */}
                                        <Col>
                                            <h2 className="mb-md-4 mb-3">
                                                CID :
                                                <span className="text-capitalize fs-3">
                                                    {props?.ideaDetails
                                                        ?.idea_id || ''}
                                                </span>
                                            </h2>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass="primary"
                                            size="small"
                                            label="Back to List"
                                            onClick={() =>
                                                props?.setIsDetail(false)
                                            }
                                        />
                                    </div>
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass={
                                                props?.currentRow > 1
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            size="small"
                                            label={'Previous'}
                                            onClick={() => props?.handlePrev()}
                                            disabled={props?.currentRow == 1}
                                        />
                                    </div>
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass={
                                                props?.dataLength !=
                                                props?.currentRow
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            size="small"
                                            label={'Next'}
                                            onClick={() => props?.handleNext()}
                                            disabled={
                                                props?.dataLength ==
                                                props?.currentRow
                                            }
                                        />
                                    </div>
                                    <div className="mx-2 pointer d-flex align-items-center">
                                        {/* {!pdfLoader ? (
                                            <FaDownload
                                                size={22}
                                                onClick={async () => {
                                                    await downloadPDF();
                                                }}
                                            />
                                        ) : (
                                            <FaHourglassHalf size={22} />
                                        )} */}
                                        {/* <FaDownload
                                            size={22}
                                            onClick={handlePrint}
                                        /> */}
                                    </div>
                                </div>
                                <div className="col-lg-12 mt-3">
                                    <Row className="col-lg-12">
                                        <Col className="md-6">
                                            <Card
                                                bg="light"
                                                text="dark"
                                                className="mb-4"
                                                // style={{ height: '150px' }}
                                            >
                                                <Card.Body>
                                                    <label
                                                        htmlFor="teams"
                                                        className=""
                                                    >
                                                        Institutions Details
                                                    </label>
                                                    <Card.Text
                                                        style={{
                                                            // fontSize: '30px',
                                                            // fontWeight: 'bold',
                                                            marginTop: '10px',
                                                            marginBottom: '20px'
                                                        }}
                                                    >
                                                        {/* {regInst} */}
                                                        <span>
                                                            Institution Code :
                                                        </span>
                                                        <span className=" fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.institution_code
                                                            }
                                                        </span>
                                                        <br />
                                                        <span>
                                                            Institution Name :
                                                        </span>
                                                        <span className="fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.institution_name
                                                            }
                                                        </span>
                                                        <br />
                                                        <span>Place :</span>
                                                        <span className="fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.place_name
                                                            }
                                                        </span>
                                                        <br />
                                                        <span>Block :</span>
                                                        <span className="fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.block_name
                                                            }
                                                        </span>{' '}
                                                        <br />
                                                        <span>Taluk :</span>
                                                        <span className="fs-3">
                                                            &nbsp;
                                                            {teamResponse?.taluk_name
                                                                ? teamResponse?.taluk_name
                                                                : '-'}
                                                        </span>{' '}
                                                        <br />
                                                        <span>District :</span>
                                                        <span className="fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.district
                                                            }
                                                        </span>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                            {/* <h2>
                                                <span
                                                    style={{
                                                        color: 'blue'
                                                    }}
                                                >
                                                    Institutions Details:{' '}
                                                </span>
                                                {/* <span className="text-capitalize fs-3">
                                                {props?.ideaDetails?.themes_problem?.problem_statement?.toLowerCase() ||
                                                    ''}
                                            </span> */}
                                            {/* </h2>  */}
                                        </Col>
                                        <Col className="md-6">
                                            <Card
                                                bg="light"
                                                text="dark"
                                                className="mb-4"
                                                style={{ height: '227px' }}
                                            >
                                                <Card.Body>
                                                    <label
                                                        htmlFor="teams"
                                                        className=""
                                                    >
                                                        Team Details
                                                    </label>
                                                    <Card.Text
                                                        style={{
                                                            // fontSize: '30px',
                                                            // fontWeight: 'bold',
                                                            marginTop: '10px',
                                                            marginBottom: '20px'
                                                        }}
                                                    >
                                                        {/* {regInst} */}
                                                        <span>Team Name :</span>
                                                        <span className=" fs-3">
                                                            &nbsp;
                                                            {
                                                                teamResponse?.team_name
                                                            }
                                                        </span>
                                                        <br />
                                                        <span>
                                                            Team Members :
                                                        </span>
                                                        <span className=" fs-3">
                                                            &nbsp;
                                                            {teamResponse &&
                                                                teamResponse.team_members &&
                                                                teamResponse.team_members.join(
                                                                    ', '
                                                                )}
                                                        </span>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                            {/* <h2>
                                                <span
                                                    style={{
                                                        color: 'blue'
                                                    }}
                                                >
                                                    Institutions Details:{' '}
                                                </span>
                                                {/* <span className="text-capitalize fs-3">
                                                {props?.ideaDetails?.themes_problem?.problem_statement?.toLowerCase() ||
                                                    ''}
                                            </span> */}
                                            {/* </h2>  */}
                                        </Col>
                                    </Row>
                                    {/* <Row className="col-lg-12">
                                        <h2>
                                            <span
                                                style={{
                                                    color: 'blue'
                                                }}
                                            >
                                                Problem Statement :{' '}
                                            </span>
                                            <span className="text-capitalize fs-3">
                                                {props?.ideaDetails?.sub_category?.toLowerCase() ||
                                                    ''}
                                            </span>
                                        </h2>
                                    </Row> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 order-lg-0 order-1 p-0 h-100">
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {1}. {t('student_course.ques1')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {
                                                teamResponse?.themes_problem
                                                    ?.theme_name
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {2}. {t('student_course.ques2')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {
                                                teamResponse?.themes_problem
                                                    ?.problem_statement
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {3}.{' '}
                                            {t(
                                                'student_course.ques3description'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {
                                                teamResponse?.themes_problem
                                                    ?.problem_statement_description
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {4}.{' '}
                                            {t(
                                                'student_course.ques4ideatitile'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.idea_title}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {5}.{' '}
                                            {t('student_course.ques5solution')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.solution_statement}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {6}.{' '}
                                            {t('student_course.ques6detailsol')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.detailed_solution}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {7}.{' '}
                                            {t('student_course.ques7Prototype')}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.prototype_available}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            {teamResponse?.prototype_available !== 'NO' &&
                                teamResponse?.prototype_available !== '' && (
                                    <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                        <div
                                            // key={index}
                                            className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                        >
                                            <div className="question quiz mb-0">
                                                <b
                                                    style={{
                                                        fontSize: '1.6rem'
                                                    }}
                                                >
                                                    {t(
                                                        'student_course.ques8file'
                                                    )}
                                                    {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                                </b>
                                            </div>
                                            <div className="bg-light rounded p-5">
                                                {files.length > 0 &&
                                                    files.map((item, i) => (
                                                        <div key={i}>
                                                            {/* <CardTitle className="fw-bold">
                                                    {item.question}
                                                </CardTitle> */}
                                                            {/* <CardBody> */}
                                                            <a
                                                                key={i}
                                                                className="badge mb-2 bg-info p-3 ms-3"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={() =>
                                                                    downloadFile(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                {item
                                                                    .split('/')
                                                                    .pop()}
                                                            </a>
                                                            {/* </CardBody> */}
                                                        </div>
                                                    ))}
                                                {/* <p
                                        style={{
                                            fontSize: '1.4rem'
                                        }}
                                    >
                                        {teamResponse?.Prototype_file}
                                    </p> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1.6rem'
                                            }}
                                        >
                                            {8}.{' '}
                                            {t(
                                                'student_course.ques9publication'
                                            )}
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
                                        </b>
                                    </div>
                                    <div className="bg-light rounded p-5">
                                        <p
                                            style={{
                                                fontSize: '1.4rem'
                                            }}
                                        >
                                            {teamResponse?.idea_available}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* {teamResponse?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                    >
                                        <div className="question quiz mb-0">
                                            <b
                                                style={{
                                                    fontSize: '1.6rem'
                                                }}
                                            >
                                                {item?.question_no || ''}.{' '}
                                                {item?.question || ''}
                                            </b>
                                        </div>
                                        <div className="bg-light rounded p-5">
                                            <p
                                                style={{
                                                    fontSize: '1.4rem'
                                                }}
                                            >
                                                {item?.question_type ===
                                                'MCQ' ? (
                                                    item?.selected_option?.map(
                                                        (data, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    {data || ''}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                ) : item?.question_type ===
                                                      'TEXT' ||
                                                  item?.question_type ===
                                                      'MRQ' ? (
                                                    item?.selected_option
                                                ) : item?.question_type ===
                                                  'DRAW' ? (
                                                    <LinkComponent
                                                        item={
                                                            item.selected_option
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })} */}
                        </div>
                        <div className="col-lg-4 order-lg-1 order-0 p-0 h-100 mt-3 status_info_col">
                            <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                                {props?.ideaDetails?.evaluation_status ? (
                                    <p
                                        className={`${
                                            props?.ideaDetails
                                                ?.evaluation_status ==
                                            'SELECTEDROUND1'
                                                ? 'text-success'
                                                : 'text-danger'
                                        } fs-3 fw-bold text-center`}
                                    >
                                        <span className="fs-3 text-info">
                                            L1:{' '}
                                        </span>
                                        {props?.ideaDetails
                                            ?.evaluation_status ==
                                        'SELECTEDROUND1'
                                            ? 'Accepted'
                                            : 'Rejected'}
                                    </p>
                                ) : (
                                    ''
                                )}

                                {props?.ideaDetails?.evaluated_name ? (
                                    <p className="text-center">
                                        <span className="text-bold">
                                            Evaluated By:{' '}
                                        </span>{' '}
                                        {props?.ideaDetails?.evaluated_name ||
                                            ''}
                                    </p>
                                ) : (
                                    ''
                                )}

                                {props?.ideaDetails?.evaluated_at ? (
                                    <p className="text-center">
                                        <span className="text-bold">
                                            Evaluated At:{' '}
                                        </span>{' '}
                                        {moment
                                            .utc(
                                                props?.ideaDetails?.evaluated_at
                                            )
                                            .format('DD-MM-YYYY HH:mm:ss a') ||
                                            ''}
                                    </p>
                                ) : (
                                    ''
                                )}

                                {props?.ideaDetails?.evaluation_status ==
                                    'REJECTEDROUND1' && (
                                    <>
                                        <p className="text-center">
                                            <span className="text-bold">
                                                Rejected Reason :{' '}
                                            </span>{' '}
                                            {props?.ideaDetails
                                                ?.rejected_reason || ''}
                                        </p>
                                        {/* <p className="text-center">
                                            <span className="text-bold">
                                                Rejected Reason 2:{' '}
                                            </span>{' '}
                                            {props?.ideaDetails
                                                ?.rejected_reasonSecond || ''}
                                        </p> */}
                                    </>
                                )}
                                {level === 'L1' &&
                                    (props?.ideaDetails?.evaluation_status ? (
                                        props?.ideaDetails?.evaluation_status ==
                                        'SELECTEDROUND1' ? (
                                            <button
                                                className="btn btn-lg px-5 py-2 btn-danger me-3 rounded-pill"
                                                onClick={() => {
                                                    setIsreject(true);
                                                    setReason('');
                                                    setReasonSec('');
                                                }}
                                            >
                                                <span className="fs-4">
                                                    Reject
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-lg px-5 py-2 btn-success me-3 rounded-pill"
                                                onClick={() => {
                                                    handleAlert('accept');
                                                    setReason('');
                                                    setReasonSec('');
                                                }}
                                            >
                                                <span className="fs-4">
                                                    Accept
                                                </span>
                                            </button>
                                        )
                                    ) : (
                                        <>
                                            {teamResponse.verified_name !==
                                                null && (
                                                <>
                                                    <button
                                                        className="btn btn-lg px-5 py-2 btn-danger me-3 rounded-pill m-2"
                                                        onClick={() => {
                                                            setIsreject(true);
                                                            setReason('');
                                                            setReasonSec('');
                                                        }}
                                                    >
                                                        <span className="fs-4">
                                                            Reject
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="btn btn-lg px-5 py-2 btn-success me-3 rounded-pill m-2"
                                                        onClick={() => {
                                                            handleAlert(
                                                                'accept'
                                                            );
                                                            setReason('');
                                                            setReasonSec('');
                                                        }}
                                                    >
                                                        <span className="fs-4">
                                                            Accept
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ))}
                            </div>
                            {level !== 'L1' &&
                                props?.ideaDetails?.evaluator_ratings.length >
                                    0 && (
                                    <RatedDetailCard
                                        details={props?.ideaDetails}
                                    />
                                )}
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <p
                            style={{ fontSize: '1.5rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Submitted By :{' '}
                            {teamResponse.initiated_name
                                ? teamResponse.initiated_name
                                : '-'}
                        </p>
                        <p
                            style={{ fontSize: '1.5rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Submitted At :{' '}
                            {teamResponse.submitted_at
                                ? moment(teamResponse.submitted_at).format(
                                      'DD-MM-YYYY'
                                  )
                                : '-'}
                        </p>
                    </div>
                    <br />
                    <div style={{ display: 'flex' }}>
                        <p
                            style={{ fontSize: '1.5rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Verified By :{' '}
                            {teamResponse.verified_name
                                ? teamResponse.verified_name
                                : '-'}
                        </p>
                        <p
                            style={{ fontSize: '1.5rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Verified At :{' '}
                            {teamResponse.verified_at
                                ? moment(teamResponse.verified_at).format(
                                      'DD-MM-YYYY '
                                  )
                                : '-'}
                        </p>
                    </div>
                    <div>
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            onClick={() => {
                                props?.setIsDetail(false);
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h2 className="my-auto text-center mt-5">
                        Details Not Available.
                    </h2>
                    <div className="text-center mt-5">
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            onClick={() => {
                                props?.setIsDetail(false);
                            }}
                        />
                    </div>
                </>
            )}
            <Modal
                show={isReject}
                onHide={() => setIsreject(false)}
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="assign-evaluator ChangePSWModal teacher-register-modal"
                backdrop="static"
                scrollable={true}
            >
                <Modal.Header closeButton onHide={() => setIsreject(false)}>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="w-100 d-block text-center"
                    >
                        Reject
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="my-3 text-center">
                        <h3 className="mb-sm-4 mb-3">
                            Please Select the reason for rejection.
                        </h3>
                        <Col>
                            <Col className="m-5">
                                <p className="text-left">
                                    <b>1. Novelty & Usefulness</b>
                                </p>
                                <Select
                                    list={selectData}
                                    setValue={setReason}
                                    placeHolder="Please Select Reject Reason"
                                    value={reason}
                                />
                            </Col>
                            {/* <Col className="m-5">
                                <p className="text-left">
                                    <b>
                                        2. Does the submission show any evidence
                                        of efforts put in to complete the
                                        project?
                                    </b>
                                </p>
                                <Select
                                    list={reasondata2}
                                    setValue={setReasonSec}
                                    placeHolder="Please Select Reject Reason"
                                    value={reasonSec}
                                />
                            </Col> */}
                        </Col>
                    </div>
                    <div className="text-center">
                        <Button
                            label={'Submit'}
                            btnClass={!reason ? 'default' : 'primary'}
                            size="small "
                            onClick={() => handleReject()}
                            disabled={!reason}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ViewDetail;
