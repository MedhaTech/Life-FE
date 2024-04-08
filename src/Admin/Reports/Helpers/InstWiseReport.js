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

const InstWiseReport = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');

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
            label: 'District',
            key: 'district_name'
        },
        {
            label: 'Institution Name',
            key: 'district_name'
        },
        {
            label: 'Institution Type',
            key: 'district_name'
        },
        {
            label: ' No Of Mentors Enrolled',
            key: 'totalTeams'
        },
        {
            label: ' No Of Teams Registered',
            key: 'totalStudents'
        },
        {
            label: '  No Of Students Enrolled In Teams',
            key: 'femaleStudents'
        },

        {
            label: 'No Of Ideas In Draft',
            key: 'maleStudents'
        },
        // {
        //     label: ' Ideas In Pending For Approval',
        //     key: 'femaleStudents'
        // },
        {
            label: ' No Of Ideas Submitted',
            key: 'femaleStudents'
        }
    ];

    useEffect(() => {
        dispatch(getFetchDistData());

        fetchChartTableData();
    }, [RegTeachersState]);

    useEffect(() => {
        if (filteredData.length > 0) {
            setDownloadData(filteredData);
        }
    }, [filteredData, downloadNotRegisteredData]);

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);
            setRegTeachersState('');

            setRegTeachersdistrict('');

            setFilterType('');
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
            url: process.env.REACT_APP_API_BASE_URL + '/reports/mentorsummary',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const chartTableData = response?.data?.data || [];
                    setChartTableData(chartTableData);
                    setDownloadTableData(chartTableData);

                    const lastRow = chartTableData[chartTableData.length - 1];
                    const maleCount = lastRow?.male_mentor_count || 0;
                    const femaleCount = lastRow?.female_mentor_count || 0;
                    const ATLregCount = lastRow?.uniqueRegInstitution || 0;
                    const NONATLregNotCount =
                        lastRow?.total_not_registered_mentor || 0;

                    setRegisteredGenderChartData({
                        labels: ['Male', 'Female'],
                        datasets: [
                            {
                                data: [maleCount, femaleCount],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384']
                            }
                        ]
                    });

                    setRegisteredChartData({
                        labels: ['Registered ', 'Not Registered '],
                        datasets: [
                            {
                                data: [ATLregCount, NONATLregNotCount],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384']
                            }
                        ]
                    });
                    const barData = {
                        labels: chartTableData.map(
                            (item) => item.district_name
                        ),
                        datasets: [
                            {
                                label: 'Registered ',
                                data: chartTableData.map(
                                    (item) => item.uniqueRegInstitution
                                ),
                                backgroundColor: 'rgba(255, 0, 0, 0.6)'
                            },
                            {
                                label: 'Not Registered ',
                                data: chartTableData.map(
                                    (item) => item.total_not_registered_mentor
                                ),
                                backgroundColor: 'rgba(75, 162, 192, 0.6)'
                            }
                        ]
                    };
                    setBarChart1Data(barData);
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
                            <h2>Mentor Registration Status</h2>
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
                                            <div className="col-md-12">
                                                <div className=" bg-white">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive "
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
                                                                    <br />
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Institution
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Institution
                                                                    Type
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
                                                                </th>
                                                                <th>
                                                                    No Of Ideas
                                                                    Submitted
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                                // margin: '20px'
                                                            }}
                                                        >
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
                                                                            {index +
                                                                                1}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.district_name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {}
                                                                        </td>

                                                                        <td>
                                                                            {}
                                                                        </td>
                                                                        <td>
                                                                            {}
                                                                        </td>
                                                                        <td>
                                                                            {}
                                                                        </td>

                                                                        <td>
                                                                            {}
                                                                        </td>
                                                                        <td>
                                                                            {}
                                                                        </td>
                                                                        <td>
                                                                            {}
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

                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={summaryHeaders}
                                        filename={`MentorSummaryTable_${newFormat}.csv`}
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
export default InstWiseReport;
