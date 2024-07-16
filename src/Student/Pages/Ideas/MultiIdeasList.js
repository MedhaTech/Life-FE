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
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { CardText } from 'reactstrap';

import { Card, CardBody, CardTitle } from 'reactstrap';

import Layout from '../../Layout';
import { getCurrentUser } from '../../../helpers/Utils';
import { openNotificationWithIcon } from '../../../helpers/Utils';
import CommonPage from '../../../components/CommonPage';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
const InstructionsPage = (props) => {
    const currentUser = getCurrentUser('current_user');
    const StudentId = currentUser?.data[0]?.student_id;
    const history = useHistory();
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [ideaIntiation, setIdeaIntiation] = useState('');
    const userId = currentUser?.data[0]?.user_id;
    const district = currentUser?.data[0]?.district;
    const state = currentUser?.data[0]?.state;
    const [pageEnable, setPageEnable] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const handleStart = () => {
        apiCall();
        localStorage.setItem('condition', false);
        history.push({
            pathname: '/challenges',
            data: {
                FirstInitia: true
            }
        });
    };
    async function apiCall() {
        // Dice code list API //
        const body = JSON.stringify({
            student_id: StudentId,
            initiated_by: userId,
            district: district,
            state: state
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
    useEffect(() => {
        nextButtonApi();
    }, []);
    const nextButtonApi = () => {
        const Param = encryptGlobal(
            JSON.stringify({
                student_id: StudentId
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
                    setTableData(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleView = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedRecord(null);
    };
    const files = selectedRecord?.Prototype_file
    ? selectedRecord.Prototype_file.split(',')
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
    const resData = {
        data: tableData && tableData.length > 0 ? tableData : [],
        // data: staticData,
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                sortable: true,
                width: '10%'
                // center: true,
            },

            {
                name: 'Theme',
                selector: (row) => row.themes_problem?.theme_name,
                width: '30rem'
                // center: true,
            },
            {
                name: 'Idea Title',
                selector: (row) => row.idea_title,
                width: '20rem'
            },
            {
                name: 'Submitted on',
                selector: (row) =>
                    row.submitted_at
                        ? moment(row.submitted_at).format('DD-MM-YYYY')
                        : row.submitted_at,
                width: '20rem'
            },

            {
                name: 'Actions',
                center: true,
                width: '30rem',
                cell: (record) => [
                    <>
                        <div
                            key={record}
                            onClick={() => handleView(record)}
                            style={{ marginRight: '12px' }}
                        >
                            <div className="btn btn-primary btn-lg mx-2">
                                View
                            </div>
                        </div>
                    </>
                ]
            }
        ]
    };
    return (
        <Layout title="Idea Submission">
            <div className="courses-page">
                <div
                    className="pb-5 my-5 px-5 container-fluid"
                    // style={{ minHeight: '72vh' }}
                >
                    <Row>
                        <h3>Ideas List</h3>
                    </Row>
                    <Col>
                        <Button
                            label="NEW  Idea"
                            btnClass="primary mt-4 mx-4"
                            size="small"
                            onClick={handleStart}
                        />
                    </Col>
                    <div className="my-2">
                        <DataTableExtensions
                            print={false}
                            export={false}
                            {...resData}
                            exportHeaders
                        >
                            <DataTable
                                data={setTableData}
                                // noHeader
                                defaultSortField="id"
                                defaultSortAsc={false}
                                pagination
                                highlightOnHover
                                fixedHeader
                                subHeaderAlign={Alignment.Center}
                            />
                        </DataTableExtensions>
                    </div>
                    <div>
                        {/* Render your table here using resData */}

                        {showModal && selectedRecord && (
                            <Modal
                                show={showModal}
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                className="assign-evaluator ChangePSWModal teacher-register-modal"
                                backdrop="static"
                            >
                                <Modal.Header closeButton onHide={handleClose}>
                                    {/* <Modal.Title>Idea Details</Modal.Title> */}
                                    <Modal.Title
                                        id="contained-modal-title-vcenter"
                                        className="w-100 d-block text-center"
                                    >
                                        {/* {response?.themes_problem?.theme_name} */}
                                        <p style={{ fontSize: '2rem' }}>
                                            CID : {selectedRecord?.idea_id}{' '}
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
                                                Which theme are you targeting
                                                with your solution ?
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord
                                                        .themes_problem
                                                        .theme_name
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
                                                Which problem statement are you
                                                targeting with your solution ?
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord
                                                        .themes_problem
                                                        .problem_statement
                                                }
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
                                                Description of the Problem
                                                Statement
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord
                                                        .themes_problem
                                                        .problem_statement_description
                                                }
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
                                                Idea Title
                                            </label>
                                            <CardText>
                                                {selectedRecord.idea_title}
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
                                                Solution Statement
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord.solution_statement
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>{' '} */}
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
                                                {
                                                    selectedRecord.detailed_solution
                                                }
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
                                                Do you already have a prototype
                                                built?
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord.prototype_available
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                    {selectedRecord.prototype_available !==
                                        'NO' &&
                                        selectedRecord.prototype_available !==
                                            '' && (
                                            <Card className="m-3 p-3">
                                                <CardBody>
                                                    <label
                                                        htmlFor="teams"
                                                        className=""
                                                        style={{
                                                            fontSize: '1.3rem'
                                                        }}
                                                    >
                                                        If yes, Prototype File
                                                        Upload (Only JPG/PNG)
                                                    </label>
                                                    <CardText>
                                                        <CardText>
                                                            {files.length > 0 &&
                                                                files.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <Card
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <a
                                                                                key={
                                                                                    i
                                                                                }
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
                                                                                    .split(
                                                                                        '/'
                                                                                    )
                                                                                    .pop()}
                                                                            </a>
                                                                        </Card>
                                                                    )
                                                                )}
                                                        </CardText>
                                                    </CardText>
                                                </CardBody>
                                            </Card>
                                        )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        size="small"
                                        label={'Close'}
                                        btnClass="primary ms-auto"
                                        onClick={handleClose}
                                    />
                                </Modal.Footer>
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InstructionsPage;
