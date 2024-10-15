/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import './ViewSelectedChallenges.scss';
import Layout from '../Pages/Layout';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import ViewDetail from './ViewDetail';
import axios from 'axios';
import { KEY, URL } from '../../../constants/defaultValues';
import { Button } from '../../../stories/Button';
import Select from './pages/Select';
import { Col, Container, Row } from 'reactstrap';
import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';
import { useSelector } from 'react-redux';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { useDispatch } from 'react-redux';
import { getNormalHeaders } from '../../../helpers/Utils';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { FaDownload } from 'react-icons/fa';
import DetailToDownload from './DetailToDownload';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
import {
    stateList,
    districtList
} from '../../../RegPage/OrgData';

const ViewSelectedIdea = () => {
    // here we can see the selected ideas in district wise and sdg //
    const dispatch = useDispatch();
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState({});
    const [tableData, settableData] = React.useState([]);
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');

    const [sdg, setsdg] = React.useState('');
    //---for handle next idea---
    const [currentRow, setCurrentRow] = React.useState(1);
    const [tablePage, setTablePage] = React.useState(1);
    // eslint-disable-next-line no-unused-vars
    const [btnDisabler, setBtnDisabler] = React.useState(false);
    const [showspin, setshowspin] = React.useState(false);
    const SDGDate = cardData.map((i) => {
        return i.goal_title;
    });
    SDGDate.unshift('All Themes');
   
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const { search } = useLocation();
    const status = new URLSearchParams(search).get('status');
    // const filterParams =
    //     (district && district !== 'All Districts'
    //         ? '&district=' + district
    //         : '') + (sdg && sdg !== 'ALL SDGs' ? '&sdg=' + sdg : '');
    const filterParams =
        (state && state !== 'All States' ? '&state=' + state : '') +
        (district && district !== 'All Districts'
            ? '&district=' + district
            : '') +
        (sdg && sdg !== 'All Themes' ? '&sdg=' + sdg : '');
    // useEffect(() => {
    //     dispatch(getDistrictData());
    // }, []);
    // useEffect(() => {
    //     dispatch(getStateData());
    // }, []);
    // useEffect(() => {
    //     // if (state !== '') {
    //     dispatch(getFetchDistData());
    //     // }
    //     // setdistrict('');
    // }, []);

    const handleclickcall = async () => {
        // where we can select district and sdg //
        // where we can see list of challenges districtwise //
        setshowspin(true);
        await handleideaList();
    };
    // useEffect(() => {
    //     handleideaList();
    // }, []);
    async function handleideaList() {
        // handleideaList api //
        //where we can see all ideas in districtwise //
        settableData([]);
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const stat = status ? status : 'ALL';
        const newParam = encryptGlobal(
            JSON.stringify({
                status: stat,
                state: state !== 'All States' ? state : '',
                district: district !== 'All Districts' ? district : ''
                // sdg: sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
            .get(`${URL.getidealist}Data=${newParam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey =
                        response.data &&
                        response.data.data[0] &&
                        response.data.data[0].dataValues.map((item, i) => {
                            const upd = { ...item };
                            upd['key'] = i + 1;
                            return upd;
                        });
                    settableData(updatedWithKey);
                    setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setshowspin(false);
            });
    }

    const evaluatedIdeaforsub = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                cellExport: (row) => row.key,
                width: '10rem'
            },
            {
                name: 'District',
                selector: (row) => row.district,
                width: '18rem'
            },
            // {
            //     name: 'Institution Code',
            //     selector: (row) => row.institution_code,
            //     width: '18rem'
            // },
            // {
            //     name: 'Team Name',
            //     selector: (row) => row.team_name,
            //     width: '15rem'
            // },
            {
                name: 'CID',
                selector: (row) => row.idea_id,
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <a
                                href="#"
                                style={{ color: 'black' }}
                                // className="btn btn-primary btn-lg mr-5 mx-2"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent the default behavior of anchor tag
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index = 0;
                                    // tableData?.forEach((item, i) => {
                                    //     if (
                                    //         item?.challenge_response_id ==
                                    //         params?.challenge_response_id
                                    //     ) {
                                    //         index = i;
                                    //     }
                                    // });
                                    setCurrentRow(index + 1);
                                }}
                            >
                                {params.idea_id}
                            </a>
                            {/* <FaDownload
                                size={22}
                                onClick={() => {
                                    handleDownpdf(params);
                                }}
                            /> */}
                        </div>
                    ];
                },
                width: '10rem'
            },
            {
                name: 'Theme',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.themes_problem?.theme_name}
                    </div>
                ),
                width: '20rem'
            },
            // {
            //     name: 'Problem Statement',
            //     cell: (row) => (
            //         <div
            //             style={{
            //                 whiteSpace: 'pre-wrap',
            //                 wordWrap: 'break-word'
            //             }}
            //         >
            //             {row?.themes_problem?.problem_statement}
            //         </div>
            //     ),
            //     width: '25rem'
            // },
            {
                name: 'Idea Name',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.idea_title}
                    </div>
                ),
                width: '25rem'
            },

            // {
            //     name: 'SDG',
            //     selector: (row) => row.sdg,
            //     width: '15%'
            // },
            // {
            //     name: 'District',
            //     selector: (row) => row.district,
            //     width: '10rem'
            // },
            {
                name: 'Status',
                selector: (row) => row.status,
                cellExport: (row) => row.status,

                // cell: (row) => row.status,
                width: '18rem'
            },
            {
                name: 'Actions',
                cellExport: (row) => '',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary btn-lg mr-5 mx-2"
                                onClick={() => {
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index = 0;
                                    // tableData?.forEach((item, i) => {
                                    //     if (
                                    //         item?.challenge_response_id ==
                                    //         params?.challenge_response_id
                                    //     ) {
                                    //         index = i;
                                    //     }
                                    // });
                                    setCurrentRow(index + 1);
                                }}
                            >
                                View
                            </div>
                            {/* <FaDownload
                                size={22}
                                onClick={() => {
                                    handleDownpdf(params);
                                }}
                            /> */}
                        </div>
                    ];
                },
                width: '9rem',
                center: true
                // left: true
            }
        ]
    };
    // console.log(tableData, 'tableData');
    const showbutton = district;

    const handleNext = () => {
        // here we can go for next page //
        if (tableData && currentRow < tableData?.length) {
            setIdeaDetails(tableData[currentRow]);
            setIsDetail(true);
            setCurrentRow(currentRow + 1);
        }
    };
    const handlePrev = () => {
        // here we can go for previous page //
        if (tableData && currentRow >= 1) {
            setIdeaDetails(tableData[currentRow - 2]);
            setIsDetail(true);
            setCurrentRow(currentRow - 1);
        }
    };

    ////////////////pdf////////////////
    const componentRef = useRef();
    const [pdfIdeaDetails, setPdfIdeaDetails] = useState('');
    const [pdfTeamResponse, setpdfTeamResponse] = useState('');
    const handleDownpdf = (params) => {
        setPdfIdeaDetails(params);
        setpdfTeamResponse(params);

        // if (params?.response) {
        //     setpdfTeamResponse(
        //         Object.entries(params?.response).map((e) => e[1])
        //     );
        // }
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${
            pdfIdeaDetails?.team_name ? pdfIdeaDetails?.team_name : 'temp'
        }_IdeaSubmission`
    });
    useEffect(() => {
        if (pdfIdeaDetails !== '' && pdfTeamResponse !== '') {
            handlePrint();
        }
    }, [pdfIdeaDetails, pdfTeamResponse]);

    /////////////////
    return (
        <>
            <div style={{ display: 'none' }}>
                <DetailToDownload
                    ref={componentRef}
                    ideaDetails={pdfIdeaDetails}
                    teamResponse={pdfTeamResponse}
                    level={'Draft'}
                />
            </div>
            <Layout title="Challenges">
                <div className="container evaluated_idea_wrapper pt-5 mb-50">
                    <div className="row">
                        <div className="col-12 p-0">
                            {!isDetail && (
                                <div>
                                    <h2 className="ps-2 pb-3">Challenges</h2>

                                    <Container fluid className="px-0">
                                        <Row className="align-items-center">
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
                                            <Col md={3}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={ districtList[
                                                            state
                                                            ] || []}
                                                        setValue={setdistrict}
                                                        placeHolder={
                                                            'Select District'
                                                        }
                                                        value={district}
                                                    />
                                                </div>
                                            </Col>
                                            {/* <Col md={3}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={SDGDate}
                                                        setValue={setsdg}
                                                        placeHolder={
                                                            'Select Themes'
                                                        }
                                                        value={sdg}
                                                    />
                                                </div>
                                            </Col> */}
                                            <Col md={2}>
                                                <div className="text-center">
                                                    <Button
                                                        btnClass={
                                                            showbutton
                                                                ? 'primary'
                                                                : 'default'
                                                        }
                                                        size="small"
                                                        label="Search"
                                                        disabled={!showbutton}
                                                        onClick={() =>
                                                            handleclickcall()
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            )}
                            {showspin && (
                                <div className="text-center mt-5">
                                    <Spinner
                                        animation="border"
                                        variant="secondary"
                                    />
                                </div>
                            )}
                            {!showspin &&
                                (!isDetail ? (
                                    <div className="bg-white border card pt-3 mt-5">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...evaluatedIdeaforsub}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={tableData || []}
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                                                subHeaderAlign={
                                                    Alignment.Center
                                                }
                                                paginationRowsPerPageOptions={[
                                                    10, 25, 50, 100
                                                ]}
                                                paginationPerPage={10}
                                                onChangePage={(page) =>
                                                    setTablePage(page)
                                                }
                                                paginationDefaultPage={
                                                    tablePage
                                                }
                                            />
                                        </DataTableExtensions>
                                    </div>
                                ) : (
                                    <ViewDetail
                                        ideaDetails={ideaDetails}
                                        setIsDetail={setIsDetail}
                                        settableData={settableData}
                                        setdistrict={setdistrict}
                                        setsdg={setsdg}
                                        handleNext={handleNext}
                                        handlePrev={handlePrev}
                                        currentRow={currentRow}
                                        dataLength={
                                            tableData && tableData?.length
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ViewSelectedIdea;
