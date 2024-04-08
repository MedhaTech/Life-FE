/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../Layout';
import { Container, Row, Col, Table } from 'reactstrap';
import { Button } from '../../../stories/Button';
import { CSVLink } from 'react-csv';
import { getCurrentUser } from '../../../helpers/Utils';
import { useHistory } from 'react-router-dom';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Helpers/Select';
import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { categoryValue } from '../../Schools/constentText';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';

const TeacherDetailed = () => {
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');
    const [category, setCategory] = useState('');
    const [isDownload, setIsDownload] = useState(false);
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
    const [mentorDetailedReportsData, setmentorDetailedReportsData] = useState(
        []
    );
    const [dataCount, setDataCount] = useState('');
    const [doughnutChartData, setDoughnutChartData] = useState(null);
    const currentUser = getCurrentUser('current_user');
    const history = useHistory();
    const csvLinkRef = useRef();
    const csvLinkRefTable = useRef();
    const dispatch = useDispatch();
    const [combinedArray, setCombinedArray] = useState([]);
    const [downloadTableData, setDownloadTableData] = useState([]);
    const [newFormat, setNewFormat] = useState('');
    const [atl, setAtl] = useState('');
    const [nonAtl, setNonAtl] = useState('');
    const [getData, setGetData] = useState([]);
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [barChart3Data, setBarChart3Data] = useState({
        labels: [],
        datasets: []
    });
    const [barChart2Data, setBarChart2Data] = useState({
        labels: [],
        datasets: []
    });
    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    // useEffect(() => {
    //     dispatch(getStateData());
    // }, []);
    // useEffect(() => {
    //     if (state !== '') {
    //         dispatch(getFetchDistData(state));
    //     }
    //     setdistrict('');
    //     fetchChartTableData();
    //     const newDate = new Date();
    //     const formattedDate = `${newDate.getUTCDate()}/${
    //         1 + newDate.getMonth()
    //     }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    //     setNewFormat(formattedDate);
    // }, [state]);
    useEffect(() => {
        dispatch(getFetchDistData(state));

        fetchChartTableData();
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, [state]);
    const [totalCount, setTotalCount] = useState([]);
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const [fecDist, setFecDist] = useState('');
    const tableHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        {
            label: 'Total Registered Institutions',
            key: 'totalRegInstitutions'
        },
        {
            label: 'Total Registered Mentors',
            key: 'totalReg'
        },
        {
            label: 'Total No.of Teams created',
            key: 'totalTeams'
        },
        {
            label: 'Total No.of Students enrolled',
            key: 'totalStudents'
        },
        {
            label: 'No.of Female Students',
            key: 'femaleStudents'
        },
        {
            label: 'No.of Male Students',
            key: 'maleStudents'
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
        // {
        //     label: 'School Type/Category',
        //     key: 'category'
        // },
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
            label: 'Principal Whatsapp Number',
            key: 'principal_whatsapp_mobile'
        },
        {
            label: 'Principal Email',
            key: 'principal_email'
        },
        {
            label: 'Title',
            key: 'mentor_title'
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
            label: 'Mentor Gender',
            key: 'gender'
        },
        {
            label: 'Mentor Mobile Number',
            key: 'mentor_mobile'
        },
        {
            label: 'Mentor WhatsApp Number',
            key: 'mentor_whatapp_mobile'
        },
        // {
        //     label: 'Course Status',
        //     key: 'Course Status'
        // },
        // {
        //     label: 'Post Survey Status',
        //     key: 'Post Survey Status'
        // },
        {
            label: 'NO.of Teams Created',
            key: 'team_count'
        },
        {
            label: 'No.of Students Enrolled',
            key: 'student_count'
        },
        // {
        //     label: 'No.of Students Course Completed',
        //     key: 'countop'
        // },
        // {
        //     label: 'No.of Students Course Inprogress',
        //     key: 'courseinprogess'
        // },
        // {
        //     label: 'No.of Students Course Not Started',
        //     key: 'courseNotStarted'
        // },
        {
            label: 'No.of Teams Idea Submitted',
            key: 'submittedcout'
        },
        {
            label: 'No.of Teams Idea in Drafted',
            key: 'draftcout'
        },
        {
            label: 'No.of Teams Idea NOt Initiated',
            key: 'ideanotIN'
        },
        {
            label: 'Pending For Approval',
            key: 'PFACount'
        }
    ];

    // useEffect(() => {
    //     dispatch(getDistrictData());
    //     fetchChartTableData();
    //     const newDate = new Date();
    //     const formattedDate = `${newDate.getUTCDate()}/${
    //         1 + newDate.getMonth()
    //     }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    //     setNewFormat(formattedDate);
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
                    text: 'Number of Students & Teams',
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
                    text: 'Districts',
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
    const stackedBarChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'States',
                    color: 'blue'
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 85
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                stepSize: 10,
                title: {
                    display: true,
                    text: 'Number of Teachers',
                    color: 'blue'
                },
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                }
            }
        }
    };
    const optionsStudent = {
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
                    text: 'Number of ATL v/s Non ATl Students ',
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
    useEffect(() => {
        // nonAtlCount();
    }, []);
    const nonAtlCount = () => {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/studentATLnonATLcount`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (res) {
                if (res.status === 200) {
                    var mentorStuArray = [];
                    res &&
                        res.data &&
                        res.data.data &&
                        res.data.data.map((students, index) => {
                            var key = index + 1;
                            return mentorStuArray.push({ ...students, key });
                        });
                    setAtl(mentorStuArray);

                    // setAtl(response.data.data);
                    const barStudentData = {
                        labels: mentorStuArray.map(
                            (item) => item.district_name
                        ),
                        datasets: [
                            {
                                label: 'No.of  ATL Students',
                                data: mentorStuArray.map(
                                    (item) => item.ATL_Student_Count
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'No.of Non ATL Students',
                                data: mentorStuArray.map(
                                    (item) => item.NONATL_Student_Count
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };
                    setBarChart3Data(barStudentData);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleDownload = () => {
        if (
            // !state ||
            !district
            // !category
        ) {
            notification.warning({
                message: 'Please select a district before Downloading Reports.'
            });
            return;
        }
        // csvLinkRef.current.link.click();

        setIsDownload(true);
        fetchData();
    };
    const fetchData = () => {
        const apiRes = encryptGlobal(
            JSON.stringify({
                // state: state,
                district_name: district === '' ? 'All Districts' : district
                // category: category
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/mentordetailsreport?Data=${apiRes}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    const newdatalist = response.data.data.map((item) => {
                        const dataList = { ...item };
                        // dataList['presurveyNotStarted'] =
                        //     item['student_count'] - item['preSur_cmp'];
                        // dataList['courseNotStarted'] =
                        //     item['student_count'] -
                        //     (item['countop'] + item['courseinprogess']);
                        dataList['ideanotIN'] =
                            item['team_count'] -
                            (item['submittedcout'] + item['draftcout']);
                        return dataList;
                    });

                    setmentorDetailedReportsData(newdatalist);
                    csvLinkRef.current.link.click();
                    setIsDownload(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setIsDownload(false);
            });
    };
    const distName = district === '' ? 'All Districts' : district;
    const handleDownloadView = () => {
        if (
            // !state ||
            !district
            // !category
        ) {
            notification.warning({
                message: 'Please select a district before Downloading Reports.'
            });
            return;
        }
        // csvLinkRef.current.link.click();

        setIsDownload(true);
        fetchDataView();
    };
    const fetchDataView = () => {
        setDataCount();
        const apiRes = encryptGlobal(
            JSON.stringify({
                // state: state,
                district_name: district === '' ? 'All Districts' : district
                // category: category
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/mentordetailsreport?Data=${apiRes}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setDataCount(response?.data?.count);
                    const newdatalist = response.data.data.map((item) => {
                        const dataList = { ...item };
                        // dataList['presurveyNotStarted'] =
                        //     item['student_count'] - item['preSur_cmp'];
                        // dataList['courseNotStarted'] =
                        //     item['student_count'] -
                        //     (item['countop'] + item['courseinprogess']);
                        dataList['ideanotIN'] =
                            item['team_count'] -
                            (item['submittedcout'] + item['draftcout']);
                        return dataList;
                    });

                    setmentorDetailedReportsData(newdatalist);
                    setGetData(newdatalist);
                    // csvLinkRef.current.link.click();
                    setIsDownload(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setIsDownload(false);
            });
    };
    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/reports/mentordetailstable',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const teamCount = response.data.data[0].teamCount;
                    const regSchools = response.data.data[0].Regschool;
                    const studentCountDetails =
                        response.data.data[0].studentCountDetails;
                    // const courseCompleted =
                    //     response.data.data[0].courseCompleted;
                    // const courseINcompleted =
                    //     response.data.data[0].courseINcompleted;

                    const combinedArray = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const teamCountItem = teamCount.find(
                            (item) => item.district_name === district_name
                        );
                        const regSchoolsItem = regSchools.find(
                            (item) => item.district_name === district_name
                        );

                        const studentCountItem = studentCountDetails.find(
                            (item) => item.district_name === district_name
                        );
                        // const courseCompletedItem = courseCompleted.find(
                        //     (item) => item.district_name === district_name
                        // );
                        // const courseINcompletedItem = courseINcompleted.find(
                        //     (item) => item.district_name === district_name
                        // );
                        // const courseNotStarted =
                        //     summaryItem.totalReg -
                        //     ((courseCompletedItem
                        //         ? courseCompletedItem.courseCMP
                        //         : 0) +
                        //         (courseINcompletedItem
                        //             ? courseINcompletedItem.courseIN
                        //             : 0));

                        return {
                            district_name,
                            totalReg: summaryItem.totalReg,

                            totalRegInstitutions: regSchoolsItem
                                ? regSchoolsItem.totalRegInstitutions
                                : 0,
                            totalTeams: teamCountItem
                                ? teamCountItem.totalTeams
                                : 0,
                            // totalRegInst: RegschoolItem
                            //     ? RegschoolItem.totalRegInst
                            //     : 0,
                            totalStudents: studentCountItem
                                ? studentCountItem.totalstudent
                                : 0,
                            maleStudents: studentCountItem
                                ? parseInt(studentCountItem.male)
                                : 0,
                            femaleStudents: studentCountItem
                                ? parseInt(studentCountItem.female)
                                : 0
                            // courseCompleted: courseCompletedItem
                            //     ? courseCompletedItem.courseCMP
                            //     : 0,
                            // courseINcompleted: courseINcompletedItem
                            //     ? courseINcompletedItem.courseIN
                            //     : 0,
                            // courseNotStarted
                        };
                    });
                    const total = combinedArray.reduce(
                        (acc, item) => {
                            acc.totalReg += item.totalReg;
                            acc.totalRegInstitutions +=
                                item.totalRegInstitutions;

                            acc.totalTeams += item.totalTeams;
                            acc.totalStudents += item.totalStudents;
                            acc.maleStudents += item.maleStudents;
                            acc.femaleStudents += item.femaleStudents;
                            // acc.courseCompleted += item.courseCompleted;
                            // acc.courseINcompleted += item.courseINcompleted;
                            return acc;
                        },
                        {
                            totalReg: 0,

                            totalRegInstitutions: 0,

                            totalTeams: 0,
                            totalStudents: 0,
                            maleStudents: 0,
                            femaleStudents: 0
                            // courseCompleted: 0,
                            // courseINcompleted: 0
                        }
                    );
                    const doughnutData = {
                        labels: ['Male', 'Female'],
                        datasets: [
                            {
                                data: [
                                    total.maleStudents,
                                    total.femaleStudents
                                ],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384']
                            }
                        ]
                    };

                    const barData = {
                        labels: combinedArray.map((item) => item.district_name),
                        datasets: [
                            {
                                label: 'No.of Students Enrolled',
                                data: combinedArray.map(
                                    (item) => item.totalStudents
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'No. of Teams created',
                                data: combinedArray.map(
                                    (item) => item.totalTeams
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };

                    // const stackedBarChartData = {
                    //     labels: combinedArray.map((item) => item.district_name),
                    //     datasets: [
                    //         {
                    //             label: 'No. of Teachers not started course',
                    //             data: combinedArray.map(
                    //                 (item) => item.courseNotStarted
                    //             ),
                    //             backgroundColor: 'rgba(255, 0, 0, 0.6)'
                    //         },
                    //         {
                    //             label: 'No. of Teachers course IN progress',
                    //             data: combinedArray.map(
                    //                 (item) => item.courseINcompleted
                    //             ),
                    //             backgroundColor: 'rgba(255, 255, 0, 0.6)'
                    //         },
                    //         {
                    //             label: 'No. of teachers Completed Course',
                    //             data: combinedArray.map(
                    //                 (item) => item.courseCompleted
                    //             ),
                    //             backgroundColor: 'rgba(0, 128, 0, 0.6)'
                    //         }
                    //     ]
                    // };
                    var array = combinedArray;
                    array.push({ district_name: 'Total Count', ...total });
                    setCombinedArray(array);

                    // setCombinedArray(combinedArray);
                    setDownloadTableData(combinedArray);
                    setDoughnutChartData(doughnutData);
                    setBarChart1Data(barData);
                    setBarChart2Data(stackedBarChartData);
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
                            <h2>Institution Progress Detailed Report</h2>
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
                                            setValue={setdistrict}
                                            placeHolder={'Select District'}
                                            value={district}
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
                                {getData.length > 0 ? (
                                    <>
                                        <h2> {distName} Status</h2>
                                        <div className="mt-5">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div
                                                        className=" bg-white"
                                                        style={{
                                                            overflowX: 'auto'
                                                        }}
                                                    >
                                                        <Table
                                                            id="dataTable"
                                                            className="table table-striped table-bordered responsive"
                                                        >
                                                            <thead
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
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
                                                                        Principal
                                                                        Whatsapp
                                                                    </th>
                                                                    <th>
                                                                        Principal
                                                                        Email
                                                                    </th>
                                                                    <th>
                                                                        Mentor
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Email Id
                                                                    </th>{' '}
                                                                    <th>
                                                                        Gender
                                                                    </th>{' '}
                                                                    <th>
                                                                        Mobile
                                                                        Number
                                                                    </th>
                                                                    <th>
                                                                        WhatsApp
                                                                        Number
                                                                    </th>
                                                                    <th>
                                                                        Number
                                                                        Of Teams
                                                                        Created
                                                                    </th>{' '}
                                                                    <th>
                                                                        Number
                                                                        Of
                                                                        Students
                                                                        Enrolled
                                                                    </th>{' '}
                                                                    <th>
                                                                        Number
                                                                        Of Teams
                                                                        Ideas
                                                                        Submitted
                                                                    </th>{' '}
                                                                    <th>
                                                                        Number
                                                                        Of Teams
                                                                        Idea in
                                                                        Drafted
                                                                    </th>{' '}
                                                                    <th>
                                                                        Number
                                                                        of Teams
                                                                        Idea NOt
                                                                        Initiated
                                                                    </th>
                                                                    <th>
                                                                        Pending
                                                                        For
                                                                        Approval
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '20px'
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
                                                                                    item.principal_whatsapp_mobile
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.principal_email
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_title
                                                                                }

                                                                                .{' '}
                                                                                {
                                                                                    item.mentor_name
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.gender
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.mentor_mobile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.mentor_whatapp_mobile
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.team_count
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.student_count
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.submittedcout
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.draftcout
                                                                                }
                                                                            </td>{' '}
                                                                            <td>
                                                                                {
                                                                                    item.ideanotIN
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.PFACount
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
                                    </>
                                ) : (
                                    dataCount == '0' && 'No Data'
                                )}
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
                                            <div className="col-md-12">
                                                <div className=" bg-white">
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
                                                                    <br />
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Total
                                                                    Registered
                                                                    Institution
                                                                </th>
                                                                <th>
                                                                    Total
                                                                    Registered
                                                                    Mentors
                                                                </th>
                                                                <th>
                                                                    Total of
                                                                    No.of Teams
                                                                    Created
                                                                </th>
                                                                <th>
                                                                    Total of
                                                                    No.of
                                                                    Students
                                                                    Enrolled
                                                                </th>
                                                                <th>
                                                                    No.of Female
                                                                    Students
                                                                </th>
                                                                <th>
                                                                    No.of Male
                                                                    Students
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
                                                                                item.totalRegInstitutions
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalReg
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalTeams
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalStudents
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.femaleStudents
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.maleStudents
                                                                            }
                                                                        </td>
                                                                        {/* <td>
                                                                            {
                                                                                item.courseCompleted
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseINcompleted
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.courseNotStarted
                                                                            }
                                                                        </td> */}
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
                                                                        totalCount.totalRegInstitutions
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalReg
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalTeams
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.totalStudents
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.femaleStudents
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        totalCount.maleStudents
                                                                    }
                                                                </td>
                                                               
                                                            </tr> */}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="row">
                                                        <div className="col-md-3 text-center mt-1">
                                                            <p
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    paddingLeft:
                                                                        '10px'
                                                                }}
                                                            >
                                                                <b>
                                                                    Students
                                                                    Male vs
                                                                    Female As of{' '}
                                                                    {newFormat}
                                                                </b>
                                                            </p>
                                                        </div>
                                                        <div className="col-md-3 doughnut-chart-container">
                                                            {doughnutChartData && (
                                                                <Doughnut
                                                                    data={
                                                                        doughnutChartData
                                                                    }
                                                                    options={
                                                                        chartOption
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="col-md-9 chart-container mt-5"
                                                    style={{
                                                        // width: '100%',
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
                                                                    Teams,
                                                                    Students
                                                                    Enrolled As
                                                                    of{' '}
                                                                    {newFormat}
                                                                </b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div
                                                className="col-md-6 chart-container mt-3"
                                                style={{
                                                    width: '100%',
                                                    height: '370px'
                                                }}
                                            >
                                                <div className="chart-box">
                                                    <Bar
                                                        data={barChart2Data}
                                                        options={
                                                            stackedBarChartOptions
                                                        }
                                                    />
                                                    <div className="chart-title">
                                                        <p>
                                                            <b>
                                                                Teacher Course
                                                                Status As of{' '}
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* <div
                                                className="col-md-6 chart-container mt-5"
                                                style={{
                                                    width: '100%',
                                                    height: '370px'
                                                }}
                                            >
                                                <div className="chart-box">
                                                    <Bar
                                                        data={barChart3Data}
                                                        options={optionsStudent}
                                                    />
                                                    <div className="chart-title">
                                                        <p>
                                                            <b>
                                                                No.of Students
                                                                Enrolled in ATL
                                                                v/s Non ATL
                                                                Schools{' '}
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                )}
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={tableHeaders}
                                        filename={`InstitutionDetailedSummaryReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}

                                {mentorDetailedReportsData && (
                                    <CSVLink
                                        headers={teacherDetailsHeaders}
                                        data={mentorDetailedReportsData}
                                        filename={`InstitutionProgressDetailedReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                    >
                                        Download Not Registered CSV
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
export default TeacherDetailed;
