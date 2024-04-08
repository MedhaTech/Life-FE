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

const InstTypePerformanceReport = () => {
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');
    const [category, setCategory] = useState('');
    const [isDownload, setIsDownload] = useState(false);
    const [instType, setInstType] = useState([]);

    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
    const [mentorDetailedReportsData, setmentorDetailedReportsData] = useState(
        []
    );
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

    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );

    useEffect(() => {
        dispatch(getFetchDistData());

        // fetchChartTableData();
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
    const summaryHeaders = [
        {
            label: 'District',
            key: 'district_name'
        },
        {
            label: 'Institution Type',
            key: 'district_name'
        },
        {
            label: ' Total No Of Institutions',
            key: 'totalRegInstitutions'
        },
        {
            label: ' No Of Participating Institutions',
            key: 'totalReg'
        },
        {
            label: ' No Of Mentors Registered',
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
            label: ' Ideas In Draft',
            key: 'maleStudents'
        },
        {
            label: ' Ideas In Pending For Approval',
            key: 'femaleStudents'
        },
        {
            label: 'Ideas Submitted',
            key: 'femaleStudents'
        }
    ];

    const handleDownload = () => {
        // if (
        //     // !state ||
        //     !district
        //     // !category
        // ) {
        //     notification.warning({
        //         message: 'Please select a district before Downloading Reports.'
        //     });
        //     return;
        // }
        // csvLinkRef.current.link.click();

        setIsDownload(true);
        fetchData();
    };
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

    return (
        <>
            <Layout title="Reports">
                <Container className="RegReports mt-4 mb-30 userlist">
                    <Row className="mt-0 pt-2">
                        <Col>
                            <h2>Institution Type wise Performance Report</h2>
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
                                        label={
                                            isDownload
                                                ? 'Downloading'
                                                : 'Download Report'
                                        }
                                        btnClass="primary mx-3"
                                        size={'small'}
                                        shape="btn-square"
                                        type="submit"
                                        style={{
                                            width: '150px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        disabled={isDownload}
                                    />
                                </Col>
                            </Row>
                            <div className="reports-data  mt-4 mb-5 bg-white">
                                <div className="chart">
                                    {instType.length > 0 && (
                                        <div className="row">
                                            <div className="col-md-12 ">
                                                <div className="bg-white ">
                                                    <Table
                                                        id="dataTable"
                                                        className="table table-striped table-bordered responsive just"
                                                    >
                                                        <thead
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                margin: '20px'
                                                            }}
                                                        >
                                                            <tr>
                                                                {' '}
                                                                <th>S.No</th>
                                                                <th>
                                                                    Institution
                                                                    Type
                                                                </th>
                                                                <th>
                                                                    Total No Of
                                                                    Institutions
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Participating
                                                                    Institutions
                                                                </th>
                                                                <th>
                                                                    No Of
                                                                    Mentors
                                                                    Registered
                                                                </th>
                                                                <th>
                                                                    No Of Teams
                                                                    Registered
                                                                </th>{' '}
                                                                <th>
                                                                    No Of
                                                                    Students
                                                                    Enrolled In
                                                                    Teams
                                                                </th>{' '}
                                                                <th>
                                                                    Ideas In
                                                                    Draft
                                                                </th>{' '}
                                                                <th>
                                                                    Ideas In
                                                                    Pending For
                                                                    Approval
                                                                </th>
                                                                <th>
                                                                    Ideas
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
                                                            {' '}
                                                            {instType.map(
                                                                (
                                                                    {
                                                                        institution_type_id,
                                                                        institution_type
                                                                    },
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {typeof index ===
                                                                            'number'
                                                                                ? index +
                                                                                  1
                                                                                : ''}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                institution_type
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {' '}
                                                                        </td>
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
                                                                        </td>{' '}
                                                                        <td>
                                                                            {' '}
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
                            </div>
                        </div>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};
export default InstTypePerformanceReport;
