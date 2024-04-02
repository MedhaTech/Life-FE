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

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
// import { categoryValue } from '../../Schools/constentText';

const DistAbstractReport = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');

    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const filterOptions = ['Registered', 'Not Registered'];
    const categoryData = ['All Categorys', 'ATL', 'Non ATL'];
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
    const [combinedArray, setCombinedArray] = useState([]);

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
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    const [totalCount, setTotalCount] = useState([]);

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
    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        // {
        //     label: 'Total Eligible ATL Schools',
        //     key: 'ATL_Count'
        // },
        {
            label: ' Total Number Of Institutions In District',
            key: 'totalInstitutions'
        },
        {
            label: 'Number Of Institutions Registered Till Now By Filing Ideas',
            key: 'totalRegInstitutions'
        },
        {
            label: '% Of Participating Institutions',
            key: 'ideaSubmissionPercentage'
        },
        {
            label: ' No Of Mentors  Enrolled',
            key: 'totalReg'
        },
        {
            label: '  No Of Teams Registered',
            key: 'totalTeams'
        },
        {
            label: ' No Of Students Enrolled In Teams',
            key: 'totalstudent'
        },
        {
            label: '  No Of Ideas In Draft',
            key: 'draftCount'
        },
        {
            label: '  No Of Ideas In Pending Approval',
            key: 'PFACount'
        },

        {
            label: '  No Of Ideas Submitted',
            key: 'submittedCount'
        }
    ];

    useEffect(() => {
        fetchChartTableData();
    }, []);

    useEffect(() => {
        if (filteredData.length > 0) {
            setDownloadData(filteredData);
        }
    }, [filteredData, downloadNotRegisteredData]);

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
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
                '/reports/Districtwiseabstract',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response, '22');
                    const summary = response.data.data[0].summary;
                    const PFACount = response.data.data[0].PFACount;
                    const RegInst = response.data.data[0].RegInst;
                    const RegMentor = response.data.data[0].RegMentor;
                    const TeamsCount = response.data.data[0].TeamsCount;
                    const draftCount = response.data.data[0].draftCount;
                    const submittedCount = response.data.data[0].submittedCount;
                    const studentCountDetails =
                        response.data.data[0].studentCountDetails;
                    const combinedArray = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const totalInstitutions = summaryItem.totalInstitutions;

                        // const numberOfTeamsFormed =
                        //     summaryItem['Number of teams formed'];

                        const PFACountItem = PFACount.find(
                            (item) => item.district_name === district_name
                        );

                        const RegInstCountItem = RegInst.find(
                            (item) => item.district_name === district_name
                        );
                        const RegMentorCountItem = RegMentor.find(
                            (item) => item.district_name === district_name
                        );
                        const TeamsCountItem = TeamsCount.find(
                            (item) => item.district_name === district_name
                        );
                        const draftCountItem = draftCount.find(
                            (item) => item.district_name === district_name
                        );
                        const submittedCountItem = submittedCount.find(
                            (item) => item.district_name === district_name
                        );
                        const studentCountDetailsItem =
                            studentCountDetails.find(
                                (item) => item.district_name === district_name
                            );
                        // const ideaSubmissionPercentage = Math.round(
                        //     (RegInstCountItem
                        //         ? RegInstCountItem.totalRegInstitutions
                        //         : 0 / totalInstitutions) * 100
                        // );
                        const ideaSubmissionPercentage = Math.round(
                            ((RegInstCountItem
                                ? RegInstCountItem.totalRegInstitutions
                                : 0) /
                                totalInstitutions) *
                                100
                        );

                        return {
                            totalInstitutions,
                            district_name,
                            totalRegInstitutions: RegInstCountItem
                                ? RegInstCountItem.totalRegInstitutions
                                : 0,
                            submittedCount: submittedCountItem
                                ? submittedCountItem.submittedCount
                                : 0,
                            totalstudent: studentCountDetailsItem
                                ? studentCountDetailsItem.totalstudent
                                : 0,
                            draftCount: draftCountItem
                                ? draftCountItem.draftCount
                                : 0,
                            totalTeams: TeamsCountItem
                                ? TeamsCountItem.totalTeams
                                : 0,
                            totalReg: RegMentorCountItem
                                ? RegMentorCountItem.totalReg
                                : 0,
                            PFACount: PFACountItem ? PFACountItem.PFACount : 0,
                            ideaSubmissionPercentage
                        };
                    });

                    const total = combinedArray.reduce(
                        (acc, item) => {
                            acc.totalRegInstitutions +=
                                item.totalRegInstitutions;
                            acc.submittedCount += item.submittedCount;
                            acc.totalTeams += item.totalTeams;
                            acc.totalReg += item.totalReg;
                            acc.PFACount += item.PFACount;

                            acc.totalInstitutions += item.totalInstitutions;
                            acc.draftCount += item.draftCount;
                            acc.totalstudent += item.totalstudent;
                            acc.ideaSubmissionPercentage = (
                                (acc.totalRegInstitutions /
                                    acc.totalInstitutions) *
                                100
                            ).toFixed(2);
                            return acc;
                        },
                        {
                            totalRegInstitutions: 0,
                            totalTeams: 0,
                            totalstudent: 0,

                            submittedCount: 0,
                            draftCount: 0,

                            totalReg: 0,
                            PFACount: 0,
                            totalInstitutions: 0,
                            ideaSubmissionPercentage: 0
                        }
                    );
                    var array = combinedArray;

                    array.push({ district_name: 'Total Count', ...total });
                    setCombinedArray(array);
                    console.log(combinedArray, 'array');
                    setDownloadTableData(combinedArray);
                    // setTotalCount(total);

                    // setCombinedArray1(filteredData);
                    // setDownloadTableData1(filteredData);
                    // const filename = `${institution_type}_Ideas Evaluated Report_${newFormat}.csv`;
                    // csvLinkRefTable1.current.link.setAttribute(
                    //     'download',
                    //     filename
                    // );
                    // csvLinkRefTable1.current.link.click();
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
                        {/* <Col>
                            <h2>District Wise Abstract Status {newFormat}</h2>
                        </Col> */}
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
                            <Col>
                                <h2>
                                    District wise Abstract Status As of &nbsp;
                                    {newFormat}
                                </h2>
                            </Col>
                            <div className="chart">
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
                                            <div className="col-md-12">
                                                <div className=" bg-white">
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
                                                                    District
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Total Number
                                                                    Of
                                                                    Institutions
                                                                    In District
                                                                </th>
                                                                <th>
                                                                    Number Of
                                                                    Institutions
                                                                    Registered
                                                                    Till Now By
                                                                    Filing Ideas
                                                                </th>
                                                                <th>
                                                                    % Of
                                                                    Participating
                                                                    Institutions
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Mentors
                                                                    Enrolled
                                                                </th>
                                                                <th>
                                                                    No Of Teams
                                                                    Registered
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Students
                                                                    Enrolled In
                                                                    Teams
                                                                </th>
                                                                <th>
                                                                    No Of Ideas
                                                                    In Draft
                                                                </th>{' '}
                                                                <th>
                                                                    No Of Ideas
                                                                    In Pending
                                                                    Approval
                                                                </th>{' '}
                                                                <th>
                                                                    No Of Ideas
                                                                    Submitted
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
                                                                                item.totalInstitutions
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.totalRegInstitutions
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.ideaSubmissionPercentage
                                                                            }
                                                                            %
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
                                                                                item.totalstudent
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.draftCount
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.PFACount
                                                                            }
                                                                        </td>{' '}
                                                                        <td>
                                                                            {
                                                                                item.submittedCount
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
                                                        Registered vs Not
                                                        Registered Institutions
                                                        As of{newFormat}
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
                                        filename={`District_SummaryTable_${newFormat}.csv`}
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
                            </div>
                        </div>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default DistAbstractReport;
