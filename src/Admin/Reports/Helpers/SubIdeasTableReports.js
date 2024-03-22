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
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
// import { categoryValue } from '../../Schools/constentText';

const SubIdeasTableReports = () => {
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
        // fetchChartTableData();
    }, []);

    const handleDownload = (item) => {
        setIsDownloading(true);

        const IdeaPram = encryptGlobal(
            JSON.stringify({
                status: 'ACTIVE',
                // state: RegTeachersState,
                district_name: item === '' ? 'All Districts' : item
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
                        const filename = `${item}_Submitted Ideas Report_${newFormat}.csv`;
                        csvLinkRef.current.link.setAttribute(
                            'download',
                            filename
                        );
                        csvLinkRef.current.link.click();
                        openNotificationWithIcon(
                            'success',
                            `Submitted Ideas Report Downloaded Successfully`
                        );
                    }

                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };
    // const distEx = item === '' ? 'All Districts' : item;
    // const handleDownload = () => {
    //     // alert('hii');
    //     // if (
    //     //     !RegTeachersState ||
    //     //     // !RegTeachersdistrict ||
    //     //     // !filterType ||
    //     //     !category ||
    //     //     !sdg
    //     // ) {
    //     //     notification.warning({
    //     //         message:
    //     //             'Please select a state,category and Theme type before Downloading Reports.'
    //     //     });
    //     //     return;
    //     // }
    //     setIsDownloading(true);
    //     fetchData();
    // };

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
                            <div className="chart">
                                {fiterDistData.length > 0 && (
                                    <div className="row">
                                        <div
                                            className="col-md-12 mx-10 px-10"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'left',
                                                marginTop: '2rem'
                                            }}
                                        >
                                            <div
                                                className="bg-white "
                                                style={{ maxWidth: '1300px' }}
                                            >
                                                <Table
                                                    id="dataTable"
                                                    className="table table-striped table-bordered responsive just"
                                                >
                                                    <thead
                                                        style={{
                                                            height: '40px'
                                                            // marginBottom: '30px'
                                                        }}
                                                    >
                                                        <tr>
                                                            {' '}
                                                            <th
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    marginLeft:
                                                                        '10px',
                                                                    marginRight:
                                                                        '10px',
                                                                    width: '20px',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                S.No
                                                            </th>
                                                            <th
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    marginLeft:
                                                                        '10px',
                                                                    marginRight:
                                                                        '10px',
                                                                    width: '600px',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                District Name
                                                            </th>
                                                            <th
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    marginLeft:
                                                                        '10px',
                                                                    marginRight:
                                                                        '10px',
                                                                    width: '300px',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                Download Report
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {' '}
                                                        {fiterDistData.map(
                                                            (item, index) => (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                'left'
                                                                        }}
                                                                    >
                                                                        {typeof index ===
                                                                        'number'
                                                                            ? index +
                                                                              1
                                                                            : ''}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                'left'
                                                                        }}
                                                                    >
                                                                        {item}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                'left'
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDownload(
                                                                                    item
                                                                                )
                                                                            }
                                                                            style={{
                                                                                // padding:
                                                                                //     '1rem',
                                                                                backgroundColor:
                                                                                    'blue',
                                                                                color: 'white',
                                                                                padding:
                                                                                    '2px 3px',
                                                                                border: 'none',
                                                                                borderRadius:
                                                                                    '5px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            Download
                                                                            &nbsp;
                                                                            <FaDownload
                                                                                size={
                                                                                    22
                                                                                }
                                                                            />{' '}
                                                                        </button>
                                                                        {/* <FaDownload
                                                                        size={
                                                                            22
                                                                        }
                                                                        onClick={() => {
                                                                            handleDownload(
                                                                                institution_type_id,
                                                                                institution_type
                                                                            );
                                                                        }}
                                                                    /> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </Table>
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={teacherDetailsHeaders}
                                        filename={`Submitted Ideas Report${newFormat}.csv`}
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
export default SubIdeasTableReports;
