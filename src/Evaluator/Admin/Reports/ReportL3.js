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

const ReportL3 = () => {
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
    // console.log(downloadData, '1');
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
            label: 'Score Type',
            key: 'name'
        },
        {
            label: '1to3',
            key: '1to3'
        },
        {
            label: '3to5',
            key: '3to5'
        },
        {
            label: '5to6',
            key: '5to6'
        },
        {
            label: '6to7',
            key: '6to7'
        },
        {
            label: '7to8',
            key: '7to8'
        },
        {
            label: '8to9',
            key: '8to9'
        },
        {
            label: '9to10',
            key: '9to10'
        }
    ];
    const summaryHeaders2 = [
        {
            label: 'State Name',
            key: 'state'
        },
        // {
        //     label: ' No of Ideas Shortlistedfor L3',
        //     key: 'shortedlisted'
        // },
        {
            label: 'No of Ideas Promoted(Winners)',
            key: 'winners'
        },

        {
            label: 'No of Ideas Not Promoted(Runners)',
            key: 'runners'
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
            label: 'Overall Score',
            key: 'overall_score'
        },
        {
            label: 'L3 Status (Promoted/Not Promoted)',
            key: 'final_result'
        }
        // {
        //     label: 'Promoted/Not Promoted',
        //     key: 'final_result'
        // }
    ];

    useEffect(() => {
        dispatch(getFetchDistData());
        fetchChartTableData();
        fetchChartTableData2();
    }, []);
    // useEffect(() => {
    //     if (RegTeachersState !== '') {
    //         dispatch(getFetchDistData(RegTeachersState));
    //     }
    //     setRegTeachersdistrict('');
    //     fetchChartTableData();
    //     fetchChartTableData2();
    // }, [RegTeachersState]);

    // useEffect(() => {
    //     dispatch(getDistrictData());
    //     fetchChartTableData();
    // }, []);

    const fetchData = () => {
        const distApi =
            RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
        const variables = encryptGlobal(
            JSON.stringify({
                status: 'ACTIVE',
                // state: RegTeachersState,
                state: state
                // category: category,
                // sdg: sdg
            })
        );
        const url = `/reports/L3deatilreport?Data=${variables}`;

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
                            final_result:
                                entry.final_result === '0'
                                    ? 'Runner-Not Promoted'
                                    : 'Winner-Promoted',

                            overall_score: parseFloat(
                                entry.overall
                            ).toFixed(2),
                            quality_score: parseFloat(
                                entry.quality_score
                            ).toFixed(2),

                            feasibility_score: parseFloat(
                                entry.feasibility_score
                            ).toFixed(2),
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
                            `L3 Status Detailed Reports Downloaded Successfully`
                        );
                        setIsDownloading(false);
                    }
                    // const transformedData = (response.data.data || []).map(
                    //     (item) => ({
                    //         ...item,
                    //         final_result:
                    //             item.final_result === '0'
                    //                 ? 'Runner-Not Promoted'
                    //                 : 'Winner-Promoted',

                    //         overall_score: parseFloat(
                    //             item.overall_score
                    //         ).toFixed(2),
                    //         quality_score: parseFloat(
                    //             item.quality_score
                    //         ).toFixed(2),

                    //         feasibility_score: parseFloat(
                    //             item.feasibility_score
                    //         ).toFixed(2)
                    //     })
                    // );
                    // const transformedData = response.data.data.map((entry) => {
                    //     const { response, final_result, ...rest } = entry;
                    //     const parsedResponse = JSON.parse(response);
                    //     entry['final_result'] =
                    //         final_result === '0'
                    //             ? 'Runner-Not Promoted'
                    //             : 'Winner-Promoted';
                    //     entry['Overall score'] = parseFloat(
                    //         entry['Overall score']
                    //     ).toFixed(2);
                    //     entry['Quality score'] = parseFloat(
                    //         entry['Quality score']
                    //     ).toFixed(2);
                    //     entry['Feasibility score'] = parseFloat(
                    //         entry['Feasibility score']
                    //     ).toFixed(2);
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
                    // setDownloadData(transformedData);
                    // // console.log(transformedData, 'Data');

                    // csvLinkRef.current.link.click();
                    // openNotificationWithIcon(
                    //     'success',
                    //     `L3 Status Detailed Reports Downloaded Successfully`
                    // );
                    // setIsDownloading(false);
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
            url: process.env.REACT_APP_API_BASE_URL + '/reports/L3ReportTable1',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const countData = {
                        overall: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        },
                        Quality: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        },
                        Feasibility: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        }
                    };
                    response.data.data.forEach((item) => {
                        ['overall', 'Quality', 'Feasibility'].forEach((key) => {
                            const rating = parseFloat(item[key]);
                            if (rating >= 1 && rating <= 3) {
                                countData[key]['1to3']++;
                            } else if (rating > 3 && rating <= 5) {
                                countData[key]['3to5']++;
                            } else if (rating > 5 && rating <= 6) {
                                countData[key]['5to6']++;
                            } else if (rating > 6 && rating <= 7) {
                                countData[key]['6to7']++;
                            } else if (rating > 7 && rating <= 8) {
                                countData[key]['7to8']++;
                            } else if (rating > 8 && rating <= 9) {
                                countData[key]['8to9']++;
                            } else if (rating > 9 && rating <= 10) {
                                countData[key]['9to10']++;
                            }
                        });
                    });
                    const overallObj = {
                        name: 'Overall',
                        '1to3': countData.overall['1to3'],
                        '3to5': countData.overall['3to5'],
                        '5to6': countData.overall['5to6'],
                        '6to7': countData.overall['6to7'],
                        '7to8': countData.overall['7to8'],
                        '8to9': countData.overall['8to9'],
                        '9to10': countData.overall['9to10']
                    };
                    const QualityObj = {
                        name: 'Quality',
                        '1to3': countData.Quality['1to3'],
                        '3to5': countData.Quality['3to5'],
                        '5to6': countData.Quality['5to6'],
                        '6to7': countData.Quality['6to7'],
                        '7to8': countData.Quality['7to8'],
                        '8to9': countData.Quality['8to9'],
                        '9to10': countData.Quality['9to10']
                    };
                    const FeasibilityObj = {
                        name: 'Feasibility',
                        '1to3': countData.Feasibility['1to3'],
                        '3to5': countData.Feasibility['3to5'],
                        '5to6': countData.Feasibility['5to6'],
                        '6to7': countData.Feasibility['6to7'],
                        '7to8': countData.Feasibility['7to8'],
                        '8to9': countData.Feasibility['8to9'],
                        '9to10': countData.Feasibility['9to10']
                    };
                    const combineNewarry = [
                        overallObj,
                        // QualityObj,
                        // FeasibilityObj
                    ];
                    setChartTableData(combineNewarry);
                    setDownloadTableData(combineNewarry);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    const fetchChartTableData2 = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/reports/L3ReportTable2',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const chartTableData2 = response?.data?.data || [];
                    const total = chartTableData2.reduce(
                        (acc, item) => {
                            // (acc.shortedlisted += item.shortedlisted),
                            // (acc.state += item.state);
                            (acc.winners += item.winners),
                                (acc.runners += item.runners);

                            return acc;
                        },
                        {
                            // state: 0,
                            // shortedlisted: 0,
                            winners: 0,
                            runners: 0
                        }
                    );

                    var array = chartTableData2;
                    array.push({ district_name: 'Total Count', ...total });
                    setChartTableData2(array);

                    // setChartTableData2(chartTableData2);
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
                            <h2>L3 Status</h2>
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
                                            list={categoryData}
                                            setValue={setCategory}
                                            placeHolder={'Select Category'}
                                            value={category}
                                        />
                                    </div>
                                </Col> */}
                                {/* <Col md={2}> */}
                                {/* <div className="my-3 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={SDGDate}
                                            setValue={setsdg}
                                            placeHolder={'Select Themes'}
                                            value={sdg}
                                        /> */}
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
                                            <div className="col-md">
                                                <div className="bg-white">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                {/* <th>No</th> */}
                                                                <th>
                                                                    Score Type
                                                                </th>
                                                                <th>1 to 3</th>
                                                                <th>3 to 5</th>
                                                                <th>5 to 6</th>
                                                                <th>6 to 7</th>
                                                                <th>7 to 8</th>
                                                                <th>8 to 9</th>
                                                                <th>9 to 10</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {chartTableData.map(
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
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '1to3'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '3to5'
                                                                                ]
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '5to6'
                                                                                ]
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '6to7'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '7to8'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '8to9'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '9to10'
                                                                                ]
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
                                                                        totalCount.shortedlisted
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.winners
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.runners
                                                                    }
                                                                </td>
                                                            </tr> */}
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
                                            <h3>L3 Overview</h3>
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
                                                                {/* <th>
                                                                    No of Ideas
                                                                    Shortlisted
                                                                    for L3
                                                                </th> */}
                                                                <th>
                                                                    No of Ideas
                                                                    Promoted
                                                                    (Winners)
                                                                </th>
                                                                <th>
                                                                    No of Ideas
                                                                    Not Promoted
                                                                    (runners)
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
                                                                                item.state
                                                                            }
                                                                        </td>
                                                                        {/* <td>
                                                                            {
                                                                                item.shortedlisted
                                                                            }
                                                                        </td> */}
                                                                        <td>
                                                                            {
                                                                                item.winners
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.runners
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
                                        filename={`L3StatuSummaryTable_${newFormat}.csv`}
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
                                        filename={`L3EvaluatorSummaryTable_${newFormat}.csv`}
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
                                        filename={`L3StatusDetailedSummaryReport_${newFormat}.csv`}
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
export default ReportL3;
