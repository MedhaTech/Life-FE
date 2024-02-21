/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable indent */
import moment from 'moment/moment';
import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Button } from '../stories/Button';
import { FaDownload } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import DetailToDownload from '../Admin/Challenges/DetailToDownload';
// import ViewDetail from '../Admin/Challenges/ViewDetail';
import axios from 'axios';
import { encryptGlobal } from '../constants/encryptDecrypt';
import { getCurrentUser } from '../helpers/Utils';
import { openNotificationWithIcon } from '../helpers/Utils';

const LinkComponent = ({ item }) => {
    return (
        <>
            {item &&
                item.length > 0 &&
                item.map((ans, i) => {
                    let a_link = ans.split('/');
                    let count = a_link.length - 1;
                    return (
                        <a
                            key={i}
                            className="badge mb-2 bg-info p-3 ms-3"
                            href={ans}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {a_link[count]}
                        </a>
                    );
                })}
        </>
    );
};
const IdeaSubmissionCard = ({ handleClose, show, response, props }) => {
    const submitted = response;
    const [acceptBtn, setAcceptBtn] = useState('');
    // const AcceptButton = submittedResponse?.verified_by;
    const currentUser = getCurrentUser('current_user');
    const mentorId = currentUser?.data[0]?.user_id;
    const teamId = submitted.team_id;
    const [submittedResponse, setIdeaSubmittedData] = React.useState(submitted);

    const componentRef = useRef();
    const [teamResponse, setTeamResponse] = React.useState([]);
    const [answers, setAnswers] = useState([]);
    const [hide, setHide] = useState(true);
    useEffect(async () => {
        await ideaSubmittedApi();
    }, []);
    const handleAccept = () => {
        const currentTime = new Date().toLocaleString();

        const body = {
            verified_by: mentorId,
            verified_at: currentTime,
            team_id: teamId
        };
        var config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        axios(config)
            .then(async function (response) {
                if (response.status === 200) {
                    // setAcceptBtn(response.data.data);
                    // console.log(response, 'response');
                    openNotificationWithIcon(
                        'success',
                        'Approve the Idea successfully'
                    );

                    setHide(false);
                    handleClose();
                    await ideaSubmittedApi();
                }
            })
            .catch(function (error) {
                console.log(error);
                openNotificationWithIcon('error', 'Something went wrong');
            });
    };
    // useEffect(() => {

    async function ideaSubmittedApi() {
        const Param = encryptGlobal(
            JSON.stringify({
                team_id: teamId
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
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data.data !== null) {
                        setIdeaSubmittedData(response.data.data[0]);
                        // setIsideadisable(true);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // }, [showCompleted]);
    // const data = Object.entries(submittedResponse);
    // useEffect(() => {
    //     if (submittedResponse) {
    //         // console.log(data);
    //         // const answerFormat = data.map((item) => {
    //             // console.log(item, 'item');
    //             return {
    //                 // question_no: item[1].question_no,
    //                 // question: item[1].question,
    //                 // answer: item[1]?.selected_option,
    //                 // type: item[1]?.question_type
    //             };
    //         });
    //         setAnswers(answerFormat);
    //     }
    // }, [submittedResponse]);
    // const answersSort = [...answers].sort(
    //     (a, b) => a.question_no - b.question_no
    // );

    // React.useEffect(() => {
    //     if (submittedResponse) {
    //         setTeamResponse(Object.entries(submittedResponse).map((e) => e[1]));
    //     }
    // }, [submittedResponse]);
    // React.useEffect(() => {
    //     if (props?.ideaDetails?.response) {
    //         setTeamResponse(
    //             Object.entries(props?.ideaDetails?.response).map((e) => e[1])
    //         );
    //     }
    // }, [props]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${
            response?.team_name ? response?.team_name : 'temp'
        }_IdeaSubmission`
    });
    // const files = submittedResponse?.Prototype_file.split(',') : [];
    const files = submittedResponse?.Prototype_file
        ? submittedResponse.Prototype_file.split(',')
        : [];

    const downloadFile = (item) => {
        const link = document.createElement('a');
        link.href = item;
        link.download = 'upload.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // console.log(
    //     "submittedResponse.Prototype_file.split(',')",
    //     submittedResponse.Prototype_file.split(',')
    // );
    return (
        <div>
            {/* <div style={{ display: 'none' }}>
                <DetailToDownload
                    ref={componentRef}
                    ideaDetails={response}
                    teamResponse={teamResponse}
                    level={'Draft'}
                />
            </div> */}
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="assign-evaluator ChangePSWModal teacher-register-modal"
                backdrop="static"
            >
                <Modal.Header closeButton onHide={handleClose}>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="w-100 d-block text-center"
                    >
                        {/* {response?.themes_problem?.theme_name} */}
                        <p style={{ fontSize: '2rem' }}>
                            CID : {response?.idea_id}{' '}
                        </p>
                        {/* <p>{response?.themes_problem?.problem_statement}</p> */}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Which theme are you targeting with your solution
                                ?
                            </label>
                            <CardText>
                                {submittedResponse.themes_problem.theme_name}
                            </CardText>
                        </CardBody>
                    </Card>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Which problem statement are you targeting with
                                your solution ?
                            </label>
                            <CardText>
                                {
                                    submittedResponse.themes_problem
                                        .problem_statement
                                }
                            </CardText>
                        </CardBody>
                    </Card>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Description of the Problem Statement
                            </label>
                            <CardText>
                                {
                                    submittedResponse.themes_problem
                                        .problem_statement_description
                                }
                            </CardText>
                        </CardBody>
                    </Card>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Idea Title
                            </label>
                            <CardText>{submittedResponse.idea_title}</CardText>
                        </CardBody>
                    </Card>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Solution Statement
                            </label>
                            <CardText>
                                {submittedResponse.solution_statement}
                            </CardText>
                        </CardBody>
                    </Card>{' '}
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Detailed Solution
                            </label>
                            <CardText>
                                {submittedResponse.detailed_solution}
                            </CardText>
                        </CardBody>
                    </Card>{' '}
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Do you already have a prototype built?
                            </label>
                            <CardText>
                                {submittedResponse.prototype_available}
                            </CardText>
                        </CardBody>
                    </Card>
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                If yes, Prototype File Upload (Only JPG/PNG)
                            </label>
                            <CardText>
                                {/* <a
                                    href={submittedResponse.Prototype_file}
                                    download="upload.pdf"
                                >
                                    File Upload
                                </a> */}
                                <CardText>
                                    {files.length > 0 &&
                                        files.map((item, i) => (
                                            <Card key={i}>
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
                                                        downloadFile(item)
                                                    }
                                                >
                                                    {item}
                                                </a>
                                                {/* </CardBody> */}
                                            </Card>
                                        ))}
                                    {/* {}{' '}
                                    <button onClick={downloadFile}>
                                        Download PDF
                                    </button> */}
                                </CardText>
                            </CardText>
                        </CardBody>
                    </Card>
                    {/* <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                If yes, Prototype File Upload (Only JPG/PNG)
                            </label>
                            <CardText>
                                {submittedResponse.Prototype_file}
                            </CardText>
                        </CardBody>
                    </Card> */}
                    <Card className="m-3 p-3">
                        <CardBody>
                            <label
                                htmlFor="teams"
                                className=""
                                style={{ fontSize: '1.3rem' }}
                            >
                                Is this idea submitted by you or your team
                                members in any other Forum or Programs or
                                Publications as on date?
                            </label>
                            <CardText>
                                {submittedResponse.idea_available}
                            </CardText>
                        </CardBody>
                    </Card>
                    {/* {data.map((item, index) => ( */}
                    {/* <Card>
                        <CardBody>
                            <CardTitle>
                                Theme Problem ID: {submittedResponse.district}
                            </CardTitle>
                        </CardBody>
                    </Card> */}
                    {/* ))} */}
                    {/* {answersSort.length > 0 &&
                        answersSort.map((item, i) => (
                            <Card key={i} className="p-2 mb-3">
                                <CardTitle className="fw-bold">
                                    {item.question}
                                </CardTitle>
                                {/* <CardBody>
                                    {item.type === 'DRAW' ? (
                                        <LinkComponent item={item.answer} />
                                    ) : (
                                        item.answer
                                    )}
                                </CardBody> */}
                    {/* </Card> */}
                    {/* ))}  */}
                    <div className="text-left">
                        <div>
                            <p className="fw-bold me-3">
                                Initiated By: {response?.initiated_name}
                            </p>
                        </div>

                        {/* {submittedResponse === SUBMITTED ? ( */}
                        {response?.status != 'DRAFT' ? (
                            <p className="fw-bold">
                                Submitted at:{' '}
                                {response?.submitted_at
                                    ? moment(response?.submitted_at).format(
                                          'DD-MM-YYYY'
                                      )
                                    : '-'}
                            </p>
                        ) : (
                            ''
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/* <FaDownload size={22} onClick={handlePrint} /> */}
                    {hide && submittedResponse?.verified_by === null ? (
                        <Button
                            size="small"
                            label={'Approve'}
                            btnClass="primary text-left"
                            onClick={handleAccept}
                        />
                    ) : (
                        // )}
                        // {hide === true && (
                        <>
                            <div>
                                <p
                                    style={{ fontSize: '1.5rem' }}
                                    className="fw-bold"
                                >
                                    Verified By :{' '}
                                    {submittedResponse.verified_name}
                                </p>
                            </div>
                            <br />
                            <div>
                                <p
                                    style={{ fontSize: '1.5rem' }}
                                    className="fw-bold"
                                >
                                    Verified At :{' '}
                                    {submittedResponse.verified_at}
                                </p>
                            </div>
                        </>
                    )}
                    <Button
                        size="small"
                        label={'Close'}
                        btnClass="primary ms-auto"
                        onClick={handleClose}
                    />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IdeaSubmissionCard;
