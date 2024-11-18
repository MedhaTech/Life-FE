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
import { stateList } from '../../../RegPage/OrgData.js';
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
    const [state, setState] = useState('');
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
            label: 'State Name',
            key: 'state'
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
            label: 'CID',
            key: 'idea_id'
        },
        {
            label: 'Institution Name',
            key: 'institution_name'
        },
        {
            label: 'State',
            key: 'state'
        },
        {
            label: 'District',
            key: 'district'
        },
        {
            label: 'Student Name',
            key: 'student_full_name'
        },
        {
            label: 'Student Mobile Number',
            key: 'mobile'
        },
        {
            label: 'Student Email',
            key: 'email'
        },
        {
            label: 'Which theme are you targeting with your solution ?',
            key: 'theme_name'
        },
        {
            label: 'Idea Category',
            key: 'technology'
        },
        {
            label: 'Enter your problem statement',
            key: 'idea_title'
        },
        {
            label: 'Enter your detailed solution',
            key: 'detailed_solution'
        },
        {
            label: 'Do you already have a prototype built?',
            key: 'prototype_available'
        },
        { label: 'If yes, Prototype File Upload (Only JPG/PNG)', key: 'Prototype_file' },
        {
            label: 'Please share youtube link of the solution/prototype or idea (Video recorded by you and uploaded on youtube)',
            key: 'youtubelink'
        },
        {
            label: 'Is this idea submitted by you or your team members in any other Forum or Programs or Publications as on date?',
            key: 'idea_available'
        },
        {
            label: 'Please Share Forum/Programs/Publications Details',
            key: 'fpp'
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
                state: state
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
                                : '',
                                technology: entry.technology
                                ? `${entry.technology

                                    .replace(/"/g, '""')
                                    .replace(/\n/g, ' ')
                                    .replace(/,/g, ';')}`
                                : '',
                                fpp: entry.fpp
                                ? `${entry.fpp

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
            !state
            // !filterType ||
            // !category ||
            // !sdg
        ) {
            notification.warning({
                message: 'Please select state before Downloading Reports.'
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
        const formattedDate = `${newDate.getUTCDate()}/${1 + newDate.getMonth()
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
                    array.push({ state: 'Total Count', ...total });
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
                                <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={stateList}
                                            setValue={setState}
                                            placeHolder={
                                                'Select State'
                                            }
                                            value={state}
                                        />
                                    </div>
                                </Col>
                                {/* <Col md={2}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col> */}

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
                                                                    State
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
                                                                                    item.state
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
