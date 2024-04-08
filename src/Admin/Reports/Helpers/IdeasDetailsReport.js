/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../Layout';
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
import Select from '../Helpers/Select';
import { Bar } from 'react-chartjs-2';
import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
// import { categoryValue } from '../../Schools/constentText';

const ReportsRegistration = () => {
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
    const categoryData = ['Draft', 'Submitted', 'Pending for Approval', 'All'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];

    const [downloadData, setDownloadData] = useState(null);
    const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
        useState(null);
    const [chartTableData, setChartTableData] = useState([]);
    const csvLinkRefTable = useRef();
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
    const [responseData, setResponseData] = useState(null);
    const [combinedArray, setCombinedArray] = useState([]);

    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [isDownload, setIsDownload] = useState(false);
    const [data, setData] = useState([]);
    const [dataCount, setDataCount] = useState('');

    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const [getData, setGetData] = useState([]);
    const [downloadTableData, setDownloadTableData] = useState(null);
    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        {
            label: 'Pending For Approval Ideas',
            key: 'PFACount'
        },
        {
            label: 'Submitted Ideas',
            key: 'submittedCount'
        },
        {
            label: 'Draft Ideas',
            key: 'draftCount'
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
        // {
        //     label: 'Principal Whatsapp Noo',
        //     key: 'principal_whatsapp_mobile'
        // },
        {
            label: 'Principal Email',
            key: 'principal_email'
        },

        // {
        //     label: 'Address',
        //     key: 'address'
        // },

        // {
        //     label: 'City',
        //     key: 'city'
        // },
        // {
        //     label: 'HM Name',
        //     key: 'HM Name'
        // },
        // {
        //     label: 'HM Contact',
        //     key: 'HM Contact'
        // },
        // {
        //     label: 'Mentor Name',
        //     key: 'Teacher Name'
        // },
        {
            label: 'Mentor Name',
            key: 'mentor_name'
        },
        {
            label: 'Email ID',
            key: 'mentor_email'
        },
        // {
        //     label: 'Mentor Gender',
        //     key: 'gender'
        // },
        {
            label: 'Mentor Mobile Number',
            key: 'mentor_mobile'
        },
        // {
        //     label: 'Mentor WhatsApp No',
        //     key: 'mentor_whatapp_mobile'
        // },

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
        }
    ];

    useEffect(() => {
        // if (RegTeachersState !== '') {
        dispatch(getFetchDistData());
        // }
        // setRegTeachersdistrict('');
        fetchChartTableData();
    }, []);

    // useEffect(() => {
    //     dispatch(getDistrictData());
    //     fetchChartTableData();
    // }, []);

    const chartOption = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        },
        plugins: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
            }
        }
    };
    const chartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        },
        plugins: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
            }
        }
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                },
                title: {
                    display: true,
                    text: 'Number of Registered ATL and Non ATL Schools',
                    color: 'blue'
                }
            },
            x: {
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                },
                title: {
                    display: true,
                    text: 'States',
                    color: 'blue'
                },
                ticks: {
                    maxRotation: 80,
                    autoSkip: false
                    //maxTicksLimit: 10,
                }
            }
        }
    };

    const fetchData = () => {
        const IdeaPram = encryptGlobal(
            JSON.stringify({
                status: category,
                // state: RegTeachersState,
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category,
                // sdg: sdg
            })
        );
        // alert('hi');
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/ideadeatilreport?Data=${IdeaPram}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        // const url = `/reports/ideadeatilreport?status=ACTIVE&state=${RegTeachersState}&district=${
        //     RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict
        // }&category=${category}&sdg=${sdg}`;

        // const config = {
        //     method: 'get',
        //     url: process.env.REACT_APP_API_BASE_URL + url,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${currentUser?.data[0]?.token}`
        //     }
        // };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const responseData = response?.data?.data || [];
                    setData(responseData);
                    // setData(response.data.count);

                    if (Array.isArray(responseData)) {
                        const IdeaFormData = responseData.map((entry) => ({
                            ...entry,
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
                        setGetData(IdeaFormData);
                        csvLinkRef.current.link.click();
                        openNotificationWithIcon(
                            'success',
                            `Ideas Detailed Reports Downloaded Successfully`
                        );
                    }
                    // const IdeaFormData = response.data.data.map((entry) => ({
                    //     // const { response, ...rest } = entry;
                    //     ...entry,
                    //     solution_statement: `"${entry.solution_statement
                    //         .replace(/"/g, '""')
                    //         .replace(/\n/g, ' ')
                    //         .replace(/,/g, ';')}"`
                    // }));
                    // setDownloadData(IdeaFormData);
                    // console.log(downloadData, '222');
                    // csvLinkRef.current.link.click();
                    // openNotificationWithIcon(
                    //     'success',
                    //     `Ideas Detailed Reports Downloaded Successfully`
                    // );
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };
    // console.log(getData, 'data');
    const distEx =
        RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
    const handleDownload = () => {
        // alert('hii');
        if (
            // !RegTeachersState ||
            !RegTeachersdistrict ||
            // !filterType ||
            !category
            // !sdg
        ) {
            notification.warning({
                message:
                    'Please select district type and category before Downloading Reports.'
            });
            return;
        }
        setIsDownloading(true);
        fetchData();
    };
    const handleDownloadView = () => {
        // alert('hii');
        if (
            // !RegTeachersState ||
            !RegTeachersdistrict ||
            // !filterType ||
            !category
            // !sdg
        ) {
            notification.warning({
                message:
                    'Please select district type and category before Downloading Reports.'
            });
            return;
        }
        setIsDownloading(true);
        fetchDataView();
    };
    const distName =
        RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
    const fetchDataView = () => {
        setDataCount();
        const IdeaPram = encryptGlobal(
            JSON.stringify({
                status: category,
                // state: RegTeachersState,
                district_name:
                    RegTeachersdistrict === ''
                        ? 'All Districts'
                        : RegTeachersdistrict
                // category: category,
                // sdg: sdg
            })
        );
        // alert('hi');
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/ideadeatilreport?Data=${IdeaPram}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        // const url = `/reports/ideadeatilreport?status=ACTIVE&state=${RegTeachersState}&district=${
        //     RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict
        // }&category=${category}&sdg=${sdg}`;

        // const config = {
        //     method: 'get',
        //     url: process.env.REACT_APP_API_BASE_URL + url,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${currentUser?.data[0]?.token}`
        //     }
        // };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    // console.log(response, '11');
                    const responseData = response?.data?.data;

                    setDataCount(response?.data?.count);
                    // console.log(data, 'qqqqq')
                    if (Array.isArray(responseData)) {
                        const IdeaFormData = responseData.map((entry) => ({
                            ...entry,
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
                        setGetData(IdeaFormData);
                        // csvLinkRef.current.link.click();
                        // openNotificationWithIcon(
                        //     'success',
                        //     `Ideas Detailed Reports Downloaded Successfully`
                        // );
                    }
                    // const IdeaFormData = response.data.data.map((entry) => ({
                    //     // const { response, ...rest } = entry;
                    //     ...entry,
                    //     solution_statement: `"${entry.solution_statement
                    //         .replace(/"/g, '""')
                    //         .replace(/\n/g, ' ')
                    //         .replace(/,/g, ';')}"`
                    // }));
                    // setDownloadData(IdeaFormData);
                    // console.log(downloadData, '222');
                    // csvLinkRef.current.link.click();
                    // openNotificationWithIcon(
                    //     'success',
                    //     `Ideas Detailed Reports Downloaded Successfully`
                    // );
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
            // setRegTeachersState('');

            // setRegTeachersdistrict('');

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
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/reports/ideaDeatailsTable',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const PFACount = response.data.data[0].PFACount;
                    const submittedCount = response.data.data[0].submittedCount;

                    const combinedArray = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const draftCount = summaryItem.draftCount;

                        const PFACountItem = PFACount.find(
                            (item) => item.district_name === district_name
                        );
                        const submittedCountItem = submittedCount.find(
                            (item) => item.district_name === district_name
                        );

                        return {
                            draftCount,
                            PFACount: PFACountItem
                                ? PFACountItem.PFACount
                                : '0',
                            submittedCount: submittedCountItem
                                ? submittedCountItem.submittedCount
                                : '0',
                            district_name
                        };
                    });
                    const total = combinedArray.reduce(
                        (acc, item) => {
                            acc.draftCount += item.draftCount;
                            // acc.PFACount += item.PFACount;
                            // acc.submittedCount += item.submittedCount;
                            acc.PFACount += parseInt(item.PFACount, 10);
                            acc.submittedCount += parseInt(
                                item.submittedCount,
                                10
                            );

                            return acc;
                        },
                        {
                            draftCount: 0,
                            PFACount: 0,
                            submittedCount: 0
                        }
                    );

                    var array = combinedArray;

                    array.push({ district_name: 'Total Count', ...total });
                    setCombinedArray(array);
                    setDownloadTableData(combinedArray);
                    setTotalCount(total);
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
                            <h2>Submitted Ideas Report</h2>
                        </Col>
                        <Col className="text-right mb-1">
                            <Button
                                label="Back"
                                btnClass="primary mx-3"
                                size="small"
                                shape="btn-square"
                                onClick={() => history.push('/admin/reports')}
                            />
                        </Col>

                        <div className="reports-data p-5 mt-4 mb-5 bg-white">
                            <Row className="align-items-center">
                                {/* <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fullStatesNames}
                                            setValue={setState}
                                            placeHolder={'Select State'}
                                            value={state}
                                        />
                                    </div>
                                </Col> */}
                                <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col>
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
                                        onClick={handleDownloadView}
                                        label={'Get Details'}
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        type="submit"
                                    />
                                </Col>
                                {/* <Col md={3}>
                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col> */}
                                <Col
                                    md={3}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {/* <Button
                                        label="View Details"
                                        btnClass="primary mx-3"
                                        size="small"
                                        shape="btn-square"
                                        onClick={() =>
                                            fetchData(
                                                'Teachers Course Completion List'
                                            )
                                        }
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    /> */}

                                    <Button
                                        onClick={handleDownload}
                                        label={'Download Report'}
                                        // label={

                                        //     isDownload
                                        //         ? 'Downloading'
                                        //         : 'Download Report'
                                        // }
                                        btnClass="primary mx-3"
                                        size={'small'}
                                        shape="btn-square"
                                        type="submit"
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        // disabled={isDownload}
                                    />
                                </Col>
                            </Row>
                            <div className="chart">
                                <div>
                                    {getData.length > 0 ? (
                                        <div className="mt-5">
                                            <div className="d-flex align-items-center mb-3">
                                                {/* <h3>OVERVIEW</h3> */}
                                                <h2>{distName} </h2>
                                                {/* <Button
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
                                                /> */}
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 mx-10 px-10">
                                                    <div
                                                        className="bg-white"
                                                        style={{
                                                            overflowX: 'auto'
                                                        }}
                                                    >
                                                        {/* <div
                                                        className="table-wrapper bg-white "
                                                        style={{
                                                            overflowX: 'auto'
                                                        }}
                                                    > */}
                                                        <Table
                                                            id="dataTable"
                                                            className="table table-striped table-bordered responsive"
                                                        >
                                                            <thead
                                                                style={{
                                                                    textAlign:
                                                                        'center'
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>
                                                                        Institution
                                                                        Code
                                                                    </th>
                                                                    <th>
                                                                        Institution
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Place
                                                                    </th>
                                                                    <th>
                                                                        Block
                                                                    </th>
                                                                    <th>
                                                                        District
                                                                    </th>
                                                                    <th>
                                                                        Principal
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Principal
                                                                        Mobile
                                                                    </th>
                                                                    <th>
                                                                        {' '}
                                                                        Principal
                                                                        Email
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        Email
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        Mobile
                                                                    </th>
                                                                    <th>
                                                                        Team
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Student
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Which
                                                                        theme
                                                                        are you
                                                                        targeting
                                                                        with
                                                                        your
                                                                        solution
                                                                        ?
                                                                    </th>
                                                                    <th>
                                                                        Idea
                                                                        Title
                                                                    </th>
                                                                    <th>
                                                                        Description
                                                                        of the
                                                                        Problem
                                                                        Statement
                                                                        ?
                                                                    </th>
                                                                    <th>
                                                                        Solution
                                                                        Statement
                                                                    </th>
                                                                    <th>
                                                                        Detailed
                                                                        Solution
                                                                    </th>
                                                                    <th>
                                                                        Do you
                                                                        already
                                                                        have a
                                                                        prototype
                                                                        built?
                                                                    </th>
                                                                    <th>
                                                                        If yes,
                                                                        Prototype
                                                                        File
                                                                        Upload
                                                                        (Only
                                                                        JPG/PNG)
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            whiteSpace:
                                                                                'pre-wrap',
                                                                            wordWrap:
                                                                                'break-word'
                                                                        }}
                                                                    >
                                                                        Is this
                                                                        idea
                                                                        submitted
                                                                        by you
                                                                        or your
                                                                        team
                                                                        members
                                                                        in any
                                                                        other
                                                                        Forum or
                                                                        Programs
                                                                        or
                                                                        Publications
                                                                        as on
                                                                        date?
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody
                                                                style={{
                                                                    textAlign:
                                                                        'center'
                                                                }}
                                                            >
                                                                {getData.map(
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
                                                                                    item.institution_code
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.institution_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.place_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.block_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.district_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.principal_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.principal_mobile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.principal_email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.mentor_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.mentor_email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.mentor_mobile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.team_name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.students_names
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word',
                                                                                    width: '30px'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.theme_name
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word',
                                                                                  
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.idea_title
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.problem_statement
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.problem_statement_description
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.solution_statement
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.detailed_solution
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.prototype_available
                                                                                }
                                                                            </td>{' '}
                                                                            <td
                                                                                style={{
                                                                                    whiteSpace:
                                                                                        'pre-wrap',
                                                                                    wordWrap:
                                                                                        'break-word'
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item.Prototype_file
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.idea_available
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                                {/* <tr>
                                                                <td>{}</td>
                                                                <td>
                                                                    {
                                                                        'Total Count'
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalSubmited
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.ATL_Count
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.NonATL_Count
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        totalCount.Agriculture
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.DisasterManagement
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.EducationSkillDevelopment
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Health
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Inclusivity
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Mobility
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.OTHERS
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Space
                                                                    }
                                                                </td>
                                                            </tr> */}
                                                            </tbody>
                                                        </Table>
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        dataCount == '0' && 'No Data'
                                    )}
                                </div>
                                {combinedArray.length > 0 && (
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
                                            <div className="col-md-12 mx-10 px-10">
                                                <div className=" bg-white">
                                                    {/* <div
                                                        className="table-wrapper bg-white "
                                                        style={{
                                                            overflowX: 'auto'
                                                        }}
                                                    > */}
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            <tr>
                                                                <th>No</th>
                                                                <th>
                                                                    District
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Pending For
                                                                    <br />
                                                                    Approval
                                                                    Ideas
                                                                </th>
                                                                <th>
                                                                    Submitted
                                                                    <br />
                                                                    Ideas
                                                                </th>
                                                                <th>
                                                                    Draft <br />{' '}
                                                                    Ideas
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            {combinedArray.map(
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
                                                                                item.district_name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.PFACount
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item.submittedCount
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item.draftCount
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                            {/* <tr>
                                                                <td>{}</td>
                                                                <td>
                                                                    {
                                                                        'Total Count'
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalSubmited
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.ATL_Count
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.NonATL_Count
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        totalCount.Agriculture
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.DisasterManagement
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.EducationSkillDevelopment
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Health
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Inclusivity
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Mobility
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.OTHERS
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.Space
                                                                    }
                                                                </td>
                                                            </tr> */}
                                                        </tbody>
                                                    </Table>
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                            <div className="col-md-5 mt-5">
                                                <div className="row">
                                                    <Row>
                                                        {/* <Col>
                                                            <div className="col-md-6 text-center mt-3">
                                                                <p>
                                                                    <b>
                                                                        Overall
                                                                        ATL
                                                                        Ideas vs
                                                                        Non ATL
                                                                        Ideas As
                                                                        of{' '}
                                                                        {
                                                                            newFormat
                                                                        }
                                                                    </b>
                                                                </p>
                                                            </div>
                                                            <div className="col-md-6 doughnut-chart-container">
                                                                {registeredChartData && (
                                                                    <Doughnut
                                                                        data={
                                                                            registeredChartData
                                                                        }
                                                                        options={
                                                                            chartOption
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </Col> */}
                                                        {/* <Col>
                                                            <div className="col-md-6 text-center mt-3">
                                                                <p>
                                                                    <b>
                                                                        Ideas
                                                                        Theme As
                                                                        of{' '}
                                                                        {
                                                                            newFormat
                                                                        }
                                                                    </b>
                                                                </p>
                                                            </div>
                                                            <div className="col-md-6 doughnut-chart-container">
                                                                {registeredGenderChartData && (
                                                                    <Doughnut
                                                                        data={
                                                                            registeredGenderChartData
                                                                        }
                                                                        options={
                                                                            chartOptions
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </Col> */}
                                                    </Row>
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
                                        filename={`Submitted Ideas_SummaryTable_${newFormat}.csv`}
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
                                {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={teacherDetailsHeaders}
                                        filename={`${distEx}_IdeasDetails_Report_${newFormat}.csv`}
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
export default ReportsRegistration;
