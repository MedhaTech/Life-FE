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
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import Select from '../Helpers/Select';
import { Bar } from 'react-chartjs-2';
import ClipLoader from 'react-spinners/ClipLoader';

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
// import { categoryValue } from '../../Schools/constentText';

const IdeaSubmittedReport = () => {
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
    const csvLinkRefTable1 = useRef();

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
    const [downloadTableData, setDownloadTableData] = useState(null);
    const [downloadTableData1, setDownloadTableData1] = useState(null);

    const [fetchData, setFetchData] = useState(false);
    const [instType, setInstType] = useState([]);
    const [combinedArray, setCombinedArray] = useState([]);
    const [combinedArray1, setCombinedArray1] = useState([]);

    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        // {
        //     label: 'Total Eligible ATL Schools',
        //     key: 'ATL_Count'
        // },
        // {
        //     label: 'Type of institution',
        //     key: 'Type of Institution'
        // },
        {
            label: ' Institution code',
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
            label: 'Number Of Teams Formed',
            key: 'numberOfTeamsFormed'
        },
        {
            label: 'No Of Ideas Drafted',
            key: 'No of ideas draft'
        },
        {
            label: 'No Of Ideas Submitted',
            key: 'No of ideas submitted'
        },
        {
            label: 'No Of Ideas Pending For Approval',
            key: 'No of ideas Pending For Approval'
        }
    ];
    const summaryHeaders1 = [
        {
            label: 'District Name',
            key: 'district_name'
        },
        // {
        //     label: 'Total Eligible ATL Schools',
        //     key: 'ATL_Count'
        // },
        // {
        //     label: 'Type of institution',
        //     key: 'Type of Institution'
        // },
        {
            label: 'Institution code',
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
            label: 'No Of Ideas Submitted',
            key: 'No of ideas submitted'
        },
        {
            label: 'No Of Ideas Level - 1 Evaluation Completed',
            key: 'L1'
        },

        {
            label: 'No Of Ideas Level - 2 Evaluation Completed',
            key: 'L2'
        }
    ];

    useEffect(() => {
        InstitutionApi();
    }, []);
    const InstitutionApi = () => {
        const newparam = encryptGlobal(
            JSON.stringify({
                status: 'ALL'
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/institutionTypes?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const InstData = response?.data?.data || [];
                    setInstType(InstData);
                    // console.log(instituions, '1111');
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    const handleDownload = (institution_type_id, institution_type) => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_type_id: institution_type_id
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/ideaSubmissionReport?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const ideaCountsSUBDRAFT =
                        response.data.data[0].ideaCountsSUBDRAFT;

                    const combinedArray = summary.map((summaryItem) => {
                        const institution_id = summaryItem.institution_id;

                        const district_name = summaryItem.district_name;
                        const block_name = summaryItem.block_name;
                        const institution_code = summaryItem.institution_code;
                        const institution_name = summaryItem.institution_name;
                        const place_name = summaryItem.place_name;
                        const numberOfTeamsFormed =
                            summaryItem['Number of teams formed'];

                        const ideasCountItem = ideaCountsSUBDRAFT.find(
                            (item) => item.institution_id === institution_id
                        );

                        return {
                            institution_id,
                            block_name,
                            numberOfTeamsFormed,
                            district_name,
                            institution_code,
                            institution_name,

                            place_name,
                            'No of ideas draft': ideasCountItem
                                ? ideasCountItem['No of ideas draft']
                                : 0,
                            'No of ideas Pending For Approval': ideasCountItem
                                ? ideasCountItem[
                                      'No of ideas Pending For Approval'
                                  ]
                                : 0,
                            'No of ideas submitted': ideasCountItem
                                ? ideasCountItem['No of ideas submitted']
                                : 0
                        };
                    });
                    var array = combinedArray;
                    setCombinedArray(array);
                    setDownloadTableData(combinedArray);
                    const filename = `${institution_type}_Ideas Submitted Report_${newFormat}.csv`;
                    csvLinkRefTable.current.link.setAttribute(
                        'download',
                        filename
                    );
                    csvLinkRefTable.current.link.click();
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    const handleDownloadEval = (institution_type_id, institution_type) => {
        const newparam = encryptGlobal(
            JSON.stringify({
                institution_type_id: institution_type_id
            })
        );
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/reports/ideaEvaluationReport?Data=${newparam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const summary = response.data.data[0].summary;
                    const ideaCountsSUBDRAFT =
                        response.data.data[0].ideaCountsSUBDRAFT;

                    const combinedArray1 = summary.map((summaryItem) => {
                        const district_name = summaryItem.district_name;
                        const block_name = summaryItem.block_name;
                        const institution_code = summaryItem.institution_code;
                        const institution_name = summaryItem.institution_name;
                        const place_name = summaryItem.place_name;
                        // const numberOfTeamsFormed =
                        //     summaryItem['Number of teams formed'];

                        const institution_id = summaryItem.institution_id;
                        const ideasCountItem = ideaCountsSUBDRAFT.find(
                            (item) => item.institution_id === institution_id
                        );

                        return {
                            institution_id,
                            block_name,
                            // numberOfTeamsFormed,
                            district_name,
                            institution_code,
                            institution_name,

                            place_name,
                            'No of ideas submitted': ideasCountItem
                                ? ideasCountItem['No of ideas submitted']
                                : '0',
                            L1: ideasCountItem ? ideasCountItem.L1 : '0',
                            L2: ideasCountItem ? ideasCountItem.L2 : '0'
                        };
                    });
                    var array = combinedArray1;
                    const filteredData = array.filter(
                        (entry) => entry['No of ideas submitted'] !== '0'
                    );
                    setCombinedArray1(filteredData);
                    setDownloadTableData1(filteredData);
                    const filename = `${institution_type}_Ideas Evaluated Report_${newFormat}.csv`;
                    csvLinkRefTable1.current.link.setAttribute(
                        'download',
                        filename
                    );
                    csvLinkRefTable1.current.link.click();
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    return (
        <>
            <Layout title="Reports">
                <Container
                    className="RegReports mt-4 mb-30 userlist "
                    style={{
                        height: '650px'
                    }}
                >
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>Institution Type Wise Ideas Report</h2>
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
                                {instType.length > 0 && (
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
                                                                    width: '40rem',
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
                                                                    width: '200rem',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                Institution Type
                                                            </th>
                                                            <th
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    marginLeft:
                                                                        '10px',
                                                                    marginRight:
                                                                        '10px',
                                                                    width: '100rem',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                Ideas Submitted
                                                                Report
                                                            </th>
                                                            <th
                                                                style={{
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                    marginLeft:
                                                                        '10px',
                                                                    marginRight:
                                                                        '10px',
                                                                    width: '100rem',
                                                                    textAlign:
                                                                        'left'
                                                                }}
                                                            >
                                                                Ideas Evaluated
                                                                Report
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {' '}
                                                        {instType.map(
                                                            (
                                                                {
                                                                    institution_type_id,
                                                                    institution_type
                                                                },
                                                                index
                                                            ) => (
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
                                                                        {
                                                                            institution_type
                                                                        }
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
                                                                                    institution_type_id,
                                                                                    institution_type
                                                                                )
                                                                            }
                                                                            className="btn btn-info"
                                                                            style={{
                                                                                fontSize:
                                                                                    '14px',
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
                                                                                style={{
                                                                                    color: 'red'
                                                                                }}
                                                                            />{' '}
                                                                        </button>
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
                                                                                handleDownloadEval(
                                                                                    institution_type_id,
                                                                                    institution_type
                                                                                )
                                                                            }
                                                                            className="btn btn-info"
                                                                            style={{
                                                                                fontSize:
                                                                                    '14px',
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
                                                                                style={{
                                                                                    color: 'red'
                                                                                }}
                                                                            />{' '}
                                                                        </button>
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
                            </div>
                            {downloadTableData && (
                                <CSVLink
                                    data={downloadTableData}
                                    headers={summaryHeaders}
                                    filename={`IdeaSubmittedDetailedSummaryReport_${newFormat}.csv`}
                                    className="hidden"
                                    ref={csvLinkRefTable}
                                >
                                    Download Table CSV
                                </CSVLink>
                            )}
                            {downloadTableData1 && (
                                <CSVLink
                                    data={downloadTableData1}
                                    headers={summaryHeaders1}
                                    filename={`IdeaEvaluationDetailedSummaryReport_${newFormat}.csv`}
                                    className="hidden"
                                    ref={csvLinkRefTable1}
                                >
                                    Download Table CSV
                                </CSVLink>
                            )}
                        </div>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default IdeaSubmittedReport;
