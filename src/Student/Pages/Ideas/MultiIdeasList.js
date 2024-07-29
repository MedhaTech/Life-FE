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
    const [ideaID, setIdeaID] = useState();
    const userId = currentUser?.data[0]?.user_id;
    const district = currentUser?.data[0]?.district;
    const state = currentUser?.data[0]?.state;
    const [pageEnable, setPageEnable] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [totalideasinitited,setTotalideasinitited] = useState(15);
    let idea_id = 0;
    const handleStart = () => {
        //apiCall();
        localStorage.setItem('condition', false);
        history.push({
            pathname: '/challenges',
            data: {
                FirstInitia: true,
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

                    setIdeaIntiation(response?.data.data[0].initiated_by);
                    idea_id = (response?.data.data[0].idea_id);
                    openNotificationWithIcon(
                        'success',
                        'Idea Initiated Successfully'
                    );

                    setPageEnable(false);
                    history.push({
                        data: {
                            idea: idea_id,
                            submitedData: response?.data.data[0]
                        }
                    });
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
                    setTotalideasinitited(response?.data?.count);
                    setTableData(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleView = (record) => {
        console.log(record.status, "record");
        if (record.status === "SUBMITTED") {
            setSelectedRecord(record);
            setShowModal(true);
        }
        else {
            history.push({
                pathname: '/challenges',
                data: {
                    submitedData: record
                }
            });
            console.log(record, "record");
            console.log(history, "histiry");

        }

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
                name: 'NO',
                selector: (row, key) => key + 1,
                sortable: true,
                width: '10%'
                // center: true,
            },

            {
                name: 'THEME',
                selector: (row) => row.themes_problem?.theme_name,
                width: '25%'
                // center: true,
            },
            {
                name: 'IDEA TITLE',
                selector: (row) => row.idea_title,
                width: '25%'
            },
            {
                name: 'STATUS',
                selector: (row) => row.status,
                width: '10%'
            },
            {
                name: 'SUBMITTED ON',
                selector: (row) =>
                    row.submitted_at
                        ? moment(row.submitted_at).format('DD-MM-YYYY')
                        : row.submitted_at,
                width: '15%'
            },

            {
                name: 'ACTIONS',
                center: true,
                width: '15%',
                cell: (record) => [
                    <>
                        <div
                            key={record}
                            onClick={() => handleView(record)}
                            style={{ marginRight: '12px' }}
                        >
                            {record.status === "SUBMITTED" ? (
                                <div className="btn btn-primary btn-lg mx-2">
                                    View
                                </div>) : (<div className="btn btn-warning btn-lg mx-2">
                                    Proceed
                                </div>)}
                        </div>
                    </>
                ]
            }
        ]
    };
    const centerTitleMobile = {
        '@media (max-width: 768px)': {
            marginLeft: '2rem'
        }
    };
    console.log(selectedRecord,"vvvvvv");
    return (
        <Layout title="Idea Submission">
            <div className="courses-page">
                <div
                    className="pb-5 my-5 px-5 container-fluid"
                // style={{ minHeight: '72vh' }}
                >
                    <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                        <Col className="col-auto" style={centerTitleMobile}>
                            <h2>Submitted Ideas List</h2>
                        </Col>
                        {totalideasinitited < 15 && <Col className="ticket-btn col ml-auto ">
                            <div className="d-flex justify-content-end">
                                <Button
                                    label="NEW  IDEA"
                                    btnClass="primary mt-4 mx-4"
                                    size="small"
                                    onClick={handleStart}
                                />
                            </div>
                        </Col>}
                        
                    </Row>

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
                                size='lg'
                                className="assign-evaluator ChangePSWModal teacher-register-modal"
                                backdrop="static"
                            >
                                <Modal.Header closeButton onHide={handleClose}>
                                    {/* <Modal.Title>Idea Details</Modal.Title> */}
                                    <Modal.Title
                                        id="contained-modal-title-vcenter"
                                        className="w-100 d-block text-left"
                                    >
                                        {/* {response?.themes_problem?.theme_name} */}
                                        <p style={{ fontSize: '2rem' }}>
                                            ID : {selectedRecord?.idea_id}{' '}
                                        </p>
                                        {/* <p>{response?.themes_problem?.problem_statement}</p> */}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Card className="p-2">
                                        <CardBody>
                                            <label
                                                htmlFor="teams"
                                                className=""
                                                style={{ fontSize: '1.3rem' }}
                                            >
                                               Which theme are you targeting with your solution ?
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
                                    <Card className="p-2">
                                        <CardBody>
                                            <label
                                                htmlFor="teams"
                                                className=""
                                                style={{ fontSize: '1.3rem' }}
                                            >
                                               Enter your problem statement
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord
                                                        .idea_title
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
                                    <Card className="p-2">
                                        <CardBody>
                                            <label
                                                htmlFor="teams"
                                                className=""
                                                style={{ fontSize: '1.3rem' }}
                                            >
                                                Enter your detailed solution
                                            </label>
                                            <CardText>
                                                {selectedRecord.
detailed_solution
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
                                                Solution Statement
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord.solution_statement
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>{' '} */}
                                    {/* <Card className="m-3 p-3">
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
                                    </Card>{' '} */}
                                    <div>
                                    <Card className="p-2">
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
                                            <><Card className="p-2">
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
                                                {/* <CardText> */}
                                                    {/* <CardText> */}
                                                        {files.length > 0 &&
                                                            files.map(
                                                                (
                                                                    item,
                                                                    i
                                                                ) => (
                                                                    <Card
                                                                        key={i}
                                                                    >
                                                                        <a
                                                                            key={i}
                                                                            className="badge bg-info p-3 ms-3 col-2"
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            onClick={() => downloadFile(
                                                                                item
                                                                            )}
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
                                                    {/* </CardText> */}
                                                {/* </CardText> */}
                                            </CardBody>
                                        </Card>
                                        <Card className="p-2">
                                                <CardBody>
                                                    <label
                                                        htmlFor="teams"
                                                        className=""
                                                        style={{
                                                            fontSize: '1.3rem'
                                                        }}
                                                    >
                                                      Please share youtube link of the solution/prototype or idea (Video recorded by you and uploaded on youtube)
                                                    </label>
                                                    <CardText>
                                                        <CardText>
                                                        {/* {selectedRecord.youtubelink
                                                        } */}
                                                          {selectedRecord?.youtubelink && (
                <a href={selectedRecord.youtubelink} target="_blank" rel="noopener noreferrer"  className="badge bg-info p-3 ms-3 col-2">
                    YouTube Link
                </a>
           
            )}
                                                        </CardText>
                                                    </CardText>
                                                </CardBody>
                                            </Card></>
                                        )}
</div>
<Card className="p-2">
                                        <CardBody>
                                            <label
                                                htmlFor="teams"
                                                className=""
                                                style={{ fontSize: '1.3rem' }}
                                            >
                                                Is this idea submitted by you or your team members in any other Forum or Programs or Publications as on date?
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord.idea_available
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                     {selectedRecord.idea_available === "YES" &&  
                                     <Card className="p-2">
                                        <CardBody>
                                            <label
                                                htmlFor="teams"
                                                className=""
                                                style={{ fontSize: '1.3rem' }}
                                            >
                                               Please Share Forum/Programs/Publications Details
                                            </label>
                                            <CardText>
                                                {
                                                    selectedRecord.fpp
                                                }
                                            </CardText>
                                        </CardBody>
                                    </Card>
}
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
