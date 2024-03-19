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
import ClipLoader from 'react-spinners/ClipLoader';

import axios from 'axios';
import '../reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
// import { categoryValue } from '../../Schools/constentText';

const InstDetailsReport = () => {
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
            label: 'Type of institution',
            key: 'Type of Institution'
        },
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
            label: 'Principal Name',
            key: 'principal_name'
        },
        {
            label: 'Principal Email',
            key: 'principal_email'
        },
        {
            label: 'Principal Mobile number',
            key: 'principal_mobile'
        },
        {
            label: 'Principal Whatsapp number',
            key: 'principal_whatsapp_mobile'
        }
    ];
    const handleDownload = () => {
        fetchChartTableData();
        setIsDownloading(true);
    };
    const fetchChartTableData = () => {
        setFetchData(true);
        const config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/reports/institutionReport',
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
                    csvLinkRefTable.current.link.click();

                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };

    return (
        <>
            <Layout title="Reports">
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>Institution Details Report</h2>
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
                            <Button
                                label={
                                    isDownloading ? 'Downloading' : 'Download '
                                }
                                btnClass="primary mx-2"
                                size="small"
                                shape="btn-square"
                                onClick={handleDownload}
                                style={{
                                    width: '150px',
                                    whiteSpace: 'nowrap'
                                }}
                                disabled={isDownloading}
                            />

                            {downloadTableData && (
                                <CSVLink
                                    data={downloadTableData}
                                    headers={summaryHeaders}
                                    filename={`InstitutionSummaryTable_${newFormat}.csv`}
                                    className="hidden"
                                    ref={csvLinkRefTable}
                                    onDownloaded={() => {
                                        setIsDownloading(false);
                                        setDownloadComplete(true);
                                    }}
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
export default InstDetailsReport;
