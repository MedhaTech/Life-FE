/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Pages/Layout';
import { Container, Row, Col, Table } from 'reactstrap';
import { Button } from '../../../stories/Button';
import { CSVLink } from 'react-csv';
import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import { useHistory } from 'react-router-dom';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../../../Admin/Reports/Helpers/Select.jsx';
import { Bar } from 'react-chartjs-2';
import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';

import axios from 'axios';
import '../../../Admin/Reports/reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
// import { categoryValue } from '../../Schools/constentText';

const ReportL1 = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');
    const [totalCount, setTotalCount] = useState([]);

    const SDGDate = cardData.map((i) => {
        return i.goal_title;
    });
    SDGDate.unshift('All Themes');
    const [sdg, setsdg] = React.useState('');
    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const filterOptions = ['Registered', 'Not Registered'];
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];

    const [downloadData, setDownloadData] = useState(null);
    const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
        useState(null);
    const [chartTableData, setChartTableData] = useState([]);
    const [chartTableData2, setChartTableData2] = useState([]);

    const csvLinkRefTable = useRef();
    const csvLinkRefTable2 = useRef();

    const csvLinkRef = useRef();
    const csvLinkRefNotRegistered = useRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const [registeredGenderChartData, setRegisteredGenderChartData] =
        useState(null);
    const [registeredChartData, setRegisteredChartData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [newFormat, setNewFormat] = useState('');
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const [downloadTableData, setDownloadTableData] = useState(null);
    const [downloadTableData2, setDownloadTableData2] = useState(null);

    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        {
            label: 'No of Ideas Evaluated',
            key: 'totalSubmited'
        },

        {
            label: 'No of Ideas Accepted',
            key: 'accepted'
        },
        {
            label: 'No of Ideas Rejected',
            key: 'rejected'
        }
    ];
    const summaryHeaders2 = [
        {
            label: 'Evaluator Name',
            key: 'full_name'
        },
        {
            label: 'No of Ideas Submitted',
            key: 'totalEvaluated'
        },

        {
            label: 'No of Ideas Accepted',
            key: 'accepted'
        },
        {
            label: 'No of Ideas Rejected',
            key: 'rejected'
        }
    ];
    const teacherDetailsHeaders = [
        {
            label: 'Institution Unique Code',
            key: 'institution_code'
        },
        {
            label: 'Institution Name',
            key: 'institution_name'
        },

        {
            label: 'Place',
            key: 'place_name'
        },
        {
            label: 'Block',
            key: 'block_name'
        },
        {
            label: 'District',
            key: 'district_name'
        },

        {
            label: 'State',
            key: 'state_name'
        },
        {
            label: 'Principal Name',
            key: 'principal_name'
        },
        {
            label: 'Principal Mobile Number',
            key: 'principal_mobile'
        },
        {
            label: 'Principal Email',
            key: 'principal_email'
        },

        {
            label: 'Mentor Name',
            key: 'mentor_name'
        },
        {
            label: 'Email ID',
            key: 'mentor_email'
        },

        {
            label: 'Mentor Mobile Number',
            key: 'mentor_mobile'
        },

        {
            label: 'Team Name',
            key: 'team_name'
        },
        {
            label: 'Student Name',
            key: 'students_names'
        },
        {
            label: 'Which theme are you targeting with your solution ?',
            key: 'theme_name'
        },
        {
            label: 'Idea Title',
            key: 'idea_title'
        },
        {
            label: 'Which problem statement are you targeting with your solution ?',
            key: 'problem_statement'
        },
        {
            label: 'Description of the Problem Statement ?',
            key: 'problem_statement_description'
        },
        { label: 'Solution Statement', key: 'solution_statement' },
        {
            label: 'Detailed Solution',
            key: 'detailed_solution'
        },
        {
            label: 'Do you already have a prototype built?',
            key: 'prototype_available'
        },
        {
            label: 'If yes, Prototype File Upload (Only JPG/PNG)',
            key: 'Prototype_file'
        },
        {
            label: 'Is this idea submitted by you or your team members in any other Forum or Programs or Publications as on date?',
            key: 'idea_available'
        },
        {
            label: ' I confirm that the Idea Submitted now submitted is not copied or plagiarized version.',
            key: 'self_declaration'
        },
        {
            label: 'L1 Status',
            key: 'evaluation_status'
        }
    ];

    useEffect(() => {
        // dispatch(getStateData());
    }, []);
    useEffect(() => {
        // if (RegTeachersState !== '') {
        dispatch(getFetchDistData());
        // }
        // setRegTeachersdistrict('');
        fetchChartTableData();
        fetchChartTableData2();
    }, []);

    useEffect(() => {
        // dispatch(getDistrictData());
        fetchChartTableData();
    }, []);

    const fetchData = () => {
        const edist =
            RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
        const param = encryptGlobal(
            JSON.stringify({
                status: 'ACTIVE',
                // state: RegTeachersState,
                district_name: edist
                // category: category,
                // sdg: sdg
            })
        );
        const url = `/reports/L1deatilreport?Data=${param}`;

        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const responseData = response?.data?.data || [];
                    if (Array.isArray(responseData)) {
                        const IdeaFormData = responseData.map((entry) => ({
                            ...entry,
                            evaluation_status:
                                entry.evaluation_status === 'SELECTEDROUND1'
                                    ? 'Accepted'
                                    : 'Rejected',
                            theme_name: entry.theme_name
                                ? `${entry.theme_name
                                      .replace(/"/g, '""')
                                      .replace(/\n/g, ' ')
                                      .replace(/,/g, ';')}`
                                : '',
                            problem_statement: entry.problem_statement
                                ? `${entry.problem_statement
                                      .replace(/"/g, '""')
                                      .replace(/\n/g, ' ')
                                      .replace(/,/g, ';')}`
                                : '',

                            problem_statement_description:
                                entry.problem_statement_description
                                    ? `${entry.problem_statement_description
                                          .replace(/"/g, '""')
                                          .replace(/\n/g, ' ')
                                          .replace(/,/g, ';')}`
                                    : '',
                            solution_statement: entry.solution_statement
                                ? `${entry.solution_statement
                                      .replace(/"/g, '""')
                                      .replace(/\n/g, ' ')
                                      .replace(/,/g, ';')}`
                                : '',
                            detailed_solution: entry.detailed_solution
                                ? `${entry.detailed_solution

                                      .replace(/"/g, '""')
                                      .replace(/\n/g, ' ')
                                      .replace(/,/g, ';')}`
                                : '',
                            idea_title: entry.idea_title
                                ? `${entry.idea_title

                                      .replace(/"/g, '""')
                                      .replace(/\n/g, ' ')
                                      .replace(/,/g, ';')}`
                                : ''
                        }));
                        setDownloadData(IdeaFormData);
                        csvLinkRef.current.link.click();
                        openNotificationWithIcon(
                            'success',
                            `L1 Status Detailed Reports Downloaded Successfully`
                        );
                        setIsDownloading(false);
                    }
                    // const transformedData = (response.data.data || []).map(
                    //     (item) => ({
                    //         ...item,
                    //         evaluation_status:
                    //             item.evaluation_status === 'SELECTEDROUND1'
                    //                 ? 'Accepted'
                    //                 : 'Rejected'
                    //     })
                    // );
                    // const transformedData = response.data.data.map((entry) => {
                    //     const { response, evaluation_status, ...rest } = entry;
                    //     const parsedResponse = JSON.parse(response);
                    //     entry['evaluation_status'] =
                    //         evaluation_status === 'SELECTEDROUND1'
                    //             ? 'Accepted'
                    //             : 'Rejected';
                    //     Object.keys(parsedResponse).forEach((key) => {
                    //         const { challenge_question_id, selected_option } =
                    //             parsedResponse[key];
                    //         var newSelectedOption;
                    //         const tostringCovert = selected_option.toString();
                    //         if (
                    //             tostringCovert === null ||
                    //             tostringCovert === undefined
                    //         ) {
                    //             newSelectedOption = selected_option;
                    //         } else {
                    //             newSelectedOption = tostringCovert
                    //                 .replace(/\n/g, ' ')
                    //                 .replace(/,/g, ';');
                    //         }
                    //         entry[challenge_question_id] = newSelectedOption;
                    //     });

                    //     return {
                    //         ...entry
                    //     };
                    // });
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };

    const handleDownload = () => {
        if (
            // !RegTeachersState ||
            !RegTeachersdistrict
            // !filterType ||
            // !category ||
            // !sdg
        ) {
            notification.warning({
                message: 'Please select district before Downloading Reports.'
            });
            return;
        }
        setIsDownloading(true);
        fetchData();
    };

    // useEffect(() => {
    //     if (filteredData.length > 0) {
    //         setDownloadData(filteredData);
    //     }
    // }, [filteredData, downloadNotRegisteredData]);

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
            // setRegTeachersState('');

            setRegTeachersdistrict('');

            // setFilterType('');
            // setsdg('');
        }
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, [downloadComplete]);

    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/reports/L1ReportTable1',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((res) => {
                if (res.status === 200) {
                    const chartTableData = res?.data?.data || [];
                    const total = chartTableData.reduce(
                        (acc, item) => {
                            (acc.totalSubmited += item.totalSubmited),
                                // (acc.state += item.state);
                                (acc.accepted += item.accepted),
                                (acc.rejected += item.rejected);

                            return acc;
                        },
                        {
                            // state: 0,
                            totalSubmited: 0,
                            accepted: 0,
                            rejected: 0
                        }
                    );

                    var array = chartTableData;
                    array.push({ district_name: 'Total Count', ...total });
                    setChartTableData(array);
                    setDownloadTableData(chartTableData);
                    setTotalCount(total);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    const fetchChartTableData2 = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/reports/L1ReportTable2',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((res) => {
                if (res.status === 200) {
                    const chartTableData2 = res?.data?.data || [];

                    setChartTableData2(chartTableData2);
                    setDownloadTableData2(chartTableData2);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    return (
        <>
            <Layout title="Reports">
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>L1 Status</h2>
                        </Col>
                        <Col className="text-right mb-1">
                            <Button
                                label="Back"
                                btnClass="primary mx-3"
                                size="small"
                                shape="btn-square"
                                onClick={() => history.push('/eadmin/reports')}
                            />
                        </Col>
                        <div className="reports-data p-5 mt-4 mb-5 bg-white">
                            <Row className="align-items-center">
                                {/* <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fullStatesNames}
                                            setValue={setRegTeachersState}
                                            placeHolder={'Select State'}
                                            value={RegTeachersState}
                                        />
                                    </div>
                                </Col> */}
                                <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col>

                                {/* <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col> */}
                                {/* <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={SDGDate}
                                            setValue={setsdg}
                                            placeHolder={'Select Themes'}
                                            value={sdg}
                                        />
                                        {/* <Select
                                            list={filterOptions}
                                            setValue={setFilterType}
                                            placeHolder={'Select Filter'}
                                            value={filterType}
                                        /> */}
                                {/* </div> */}
                                {/* </Col> */}
                                <Col
                                    md={2}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {/* <Button
                                        label="View Details"
                                        btnClass="primary mx-6"
                                        size="small"
                                        shape="btn-square"
                                        onClick={handleViewDetails}
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    /> */}
                                    <Button
                                        onClick={handleDownload}
                                        //label={'Download Report'}
                                        label={
                                            isDownloading
                                                ? 'Downloading'
                                                : 'Download Report'
                                        }
                                        // label={
                                        //     downloadComplete
                                        //         ? 'Download Complete'
                                        //         : isDownloading
                                        //         ? 'Downloading...'
                                        //         : 'Download Report'
                                        // }
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        type="submit"
                                        // style={{
                                        //     width: '160px',
                                        //     whiteSpace: 'nowrap',
                                        //     pointerEvents: isDownloading
                                        //         ? 'none'
                                        //         : 'auto'
                                        // }}
                                        disabled={isDownloading}
                                    />
                                </Col>
                            </Row>

                            <div className="chart">
                                {chartTableData.length > 0 && (
                                    <div className="mt-5">
                                        <div className="d-flex align-items-center mb-3">
                                            <h3>OVERVIEW</h3>
                                            <Button
                                                label="Download Table"
                                                btnClass="primary mx-2"
                                                size="small"
                                                shape="btn-square"
                                                onClick={() => {
                                                    if (downloadTableData) {
                                                        // setIsDownloading(true);
                                                        setDownloadTableData(
                                                            null
                                                        );
                                                        csvLinkRefTable.current.link.click();
                                                    }
                                                }}
                                                style={{
                                                    width: '150px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className=" bg-white">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>
                                                                    District
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Submitted
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Accepted
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Rejected
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {chartTableData.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <>
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {index +
                                                                                    1}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.district_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.totalSubmited
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    item.accepted
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    item.rejected
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            )}
                                                            {/* <tr>
                                                                <td>{}</td>
                                                                <td>
                                                                    {
                                                                        'Total Count'
                                                                    }
                                                                </td>
                                                                {/* <td>
                                                                    {
                                                                        totalCount.state
                                                                    }
                                                                </td> */}
                                                            {/* <td>
                                                                {
                                                                    totalCount.totalSubmited
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    totalCount.accepted
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    totalCount.rejected
                                                                }
                                                            </td> */}
                                                            {/* </tr> */}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {chartTableData2.length > 0 && (
                                    <div className="mt-5">
                                        <div className="d-flex align-items-center mb-3">
                                            <h3>L1 Evaluator Overview</h3>
                                            <Button
                                                label="Download Table"
                                                btnClass="primary mx-2"
                                                size="small"
                                                shape="btn-square"
                                                onClick={() => {
                                                    if (downloadTableData2) {
                                                        // setIsDownloading(true);
                                                        setDownloadTableData2(
                                                            null
                                                        );
                                                        csvLinkRefTable2.current.link.click();
                                                    }
                                                }}
                                                style={{
                                                    width: '150px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="table-wrapper bg-white">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>
                                                                    Evaluator
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Evaluated
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Accepted
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Rejected
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {chartTableData2.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {index +
                                                                                1}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.full_name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalEvaluated
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item.accepted
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item.rejected
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* <div className="mt-5">
                                    <div
                                        className="col-md-12 chart-container mt-5"
                                        style={{
                                            width: '100%',
                                            height: '370px'
                                        }}
                                    >
                                        <div className="chart-box">
                                            <Bar
                                                data={barChart1Data}
                                                options={options}
                                            />
                                            <div className="chart-title">
                                                <p>
                                                    <b>
                                                        Registered ATL Schools
                                                        v/s Registered Non ATL
                                                        Schools {newFormat}
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={summaryHeaders}
                                        filename={`L1StatusTable_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                                {downloadTableData2 && (
                                    <CSVLink
                                        data={downloadTableData2}
                                        headers={summaryHeaders2}
                                        filename={`L1EvaluatorTable_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable2}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                                {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={teacherDetailsHeaders}
                                        filename={`L1StatusDetailedSummaryReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                            </div>
                        </div>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default ReportL1;
