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

const IdeaEvaluationReport = () => {
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
    const [downloadTableData, setDownloadTableData] = useState(null);
    const [fetchData, setFetchData] = useState(false);
    const [instType, setInstType] = useState([]);
    const [combinedArray, setCombinedArray] = useState([]);

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
            label: 'No of ideas submitted',
            key: 'No of ideas submitted'
        },
        {
            label: 'No of Ideas Level - 1 Evaluation Completed',
            key: 'L1'
        },

        {
            label: 'No of Ideas Level - 2 Evaluation Completed',
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

    const handleDownload = (institution_type_id) => {
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

                    const combinedArray = summary.map((summaryItem) => {
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
                                : "0",
                            L1: ideasCountItem ? ideasCountItem.L1 : "0",
                            L2: ideasCountItem ? ideasCountItem.L2 : "0"
                        };
                    });
                    var array = combinedArray;
                    const filteredData = array.filter(entry => entry["No of ideas submitted"] !== "0");
                    setCombinedArray(filteredData);
                    setDownloadTableData(filteredData);
                    csvLinkRefTable.current.link.click();
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
                            <h2>Idea Evaluation Details Report</h2>
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
                                                <thead>
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
                                                                width: '300rem',
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            S.no
                                                        </th>
                                                        <th
                                                            style={{
                                                                whiteSpace:
                                                                    'nowrap',
                                                                marginLeft:
                                                                    '10px',
                                                                marginRight:
                                                                    '10px',
                                                                width: '700rem',
                                                                textAlign:
                                                                    'center'
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
                                                                width: '500rem',
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            Download
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {' '}
                                                    {instType.map(
                                                        ({
                                                            institution_type_id,
                                                            institution_type
                                                        }) => (
                                                            <tr
                                                                key={
                                                                    institution_type_id
                                                                }
                                                            >
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {
                                                                        institution_type_id
                                                                    }
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {
                                                                        institution_type
                                                                    }
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            'center'
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    <FaDownload
                                                                        size={
                                                                            22
                                                                        }
                                                                        onClick={() => {
                                                                            handleDownload(
                                                                                institution_type_id
                                                                            );
                                                                        }}
                                                                    />
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
                                filename={`IdeaEvaluationDetailedSummaryReport_${newFormat}.csv`}
                                className="hidden"
                                ref={csvLinkRefTable}
                            >
                                Download Table CSV
                            </CSVLink>
                        )}
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default IdeaEvaluationReport;
