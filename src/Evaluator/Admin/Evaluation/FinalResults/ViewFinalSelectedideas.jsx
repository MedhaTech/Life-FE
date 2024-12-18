/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import './ViewFinalSelectedideas.scss';
import Layout from '../../Pages/Layout';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import ViewDetail from './ViewFinalDetail';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { KEY, URL } from '../../../../constants/defaultValues';
import { Button } from '../../../../stories/Button';
import Select from '../Pages/Select';
import { Col, Container, Row } from 'reactstrap';
import { cardData } from '../../../../Student/Pages/Ideas/SDGData.js';
import { useSelector } from 'react-redux';
import Selects from '../../../../Admin/Challenges/Select.js';
import {
    getDistrictData,
    getFetchDistData,
    getStateData
} from '../../../../redux/studentRegistration/actions';
import { useDispatch } from 'react-redux';
import { getCurrentUser, getNormalHeaders } from '../../../../helpers/Utils';
import { Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import TableDetailPdf from './TableDetailPdf';
import { useReactToPrint } from 'react-to-print';
import DetailToDownload from '../../Challenges/DetailToDownload';
import { encryptGlobal } from '../../../../constants/encryptDecrypt.js';
import {
    stateList,
    districtList,
    themesList
} from '../../../../RegPage/OrgData';

const ViewSelectedIdea = () => {
    const { search } = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');
    const title = new URLSearchParams(search).get('title');
    const level = new URLSearchParams(search).get('level');
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState({});
    const [tableData, settableData] = React.useState({});
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');

    const [sdg, setsdg] = React.useState('');
    const [currentRow, setCurrentRow] = React.useState(1);
    const [tablePage, setTablePage] = React.useState(1);
    const [showspin, setshowspin] = React.useState(false);

    const SDGDate = cardData.map((i) => {
        return i.goal_title;
    });
    SDGDate.unshift('All Themes');
    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const filterParamsfinal =
        (state && state !== 'All States' ? '&state=' + state : '') +
        (sdg && sdg !== 'All Themes' ? '&sdg=' + sdg : '');
    // useEffect(() => {
    //     // dispatch(getDistrictData());
    //     dispatch(getFetchDistData());
    //     // dispatch(getStateData());
    // }, []);

    const handlePromotelFinalEvaluated = async (item) => {
        await promoteapi(item.student_id,item.idea_id);
    };

    async function promoteapi(id,idea_id) {
        const body = JSON.stringify({ final_result: '1', student_id: id,idea_id:idea_id });
        // const promPram = encryptGlobal(JSON.stringify(id));
        var config = {
            method: 'put',
            url: `${process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate'
                // +
                // promPram
                }`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        await axios(config)
            .then(async function (response) {
                if (response.status === 200) {
                    await handleclickcall();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleclickcall = async () => {
        setshowspin(true);
        await handleideaList();
    };

    async function handleideaList() {
        settableData({});
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const apiParam = encryptGlobal(
            JSON.stringify({
                key: title == '0' ? '0' : '1',
                state: state !== 'All States' ? state : '',
                theme_problem_id: sdg !== "0" ? sdg : '',
                district: district !== 'All Districts' ? district : '',
                // sdg : sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
            .get(`${URL.getFinalEvaluation}?Data=${apiParam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey =
                        response.data &&
                        response.data.data.map((item, i) => {
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
    // console.log(tableData, 'data');
    const evaluatedIdeafinal = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                cellExport: (row) => row.key,
                sortable: true,
                width: '10rem'
            },
            {
                name: 'State',
                selector: (row) => row.state,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.state}
                    </div>
                ),
                width: '15rem'
            },
            // {
            //     name: 'Institution Code',
            //     selector: (row) => row.institution_code,
            //     width: '18rem'
            // },
            // {
            //     name: 'Team Name',
            //     selector: (row) => row.team_name,
            //     cellExport: (row) => row.team_name,
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
            // {
            //     name: 'Category',
            //     selector: (row) => row.category,
            //     width: '15rem'
            // },
            // {
            //     name: 'Theme',
            //     cellExport: (row) => row.sdg,
            //     cell: (row) => (
            //         <div
            //             style={{
            //                 whiteSpace: 'pre-wrap',
            //                 wordWrap: 'break-word'
            //             }}
            //         >
            //             {row?.theme_name}
            //         </div>
            //     ),
            //     width: '20rem'
            // },
            // {
            //     name: 'Problem Statement',
            //     cellExport: (row) => row?.themes_problem?.problem_statement,

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
                // sortable: true,
                cellExport: (row) => row?.idea_title || '',
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
                width: '20rem'
            },
            // {
            //     name: 'District',
            //     selector: (row) => row.district,
            //     width: '15rem'
            // },
            // {
            //     name: 'Team Name',
            //     selector: (row) => row?.team_name || '',
            //     sortable: true
            // },
            // {
            //     name: 'SDG',
            //     selector: (row) => row?.sdg,
            //     width: '10%'
            // },

            {
                name: 'Innovative Potential',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_1_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_1_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '13rem'
            },
            {
                name: 'Feasability',
                cellExport: (row) => row.sub_category,
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_2_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '13rem'
            },
            {
                name: 'Impact',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_3_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_3_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '13rem'
            },
            {
                name: 'Scalability',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_4_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_4_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '13rem'
            },
            {
                name: 'Sustainability',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_5_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_5_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '16rem'
            },
            {
                name: 'Overall',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].overall_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].overall_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '12rem'
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
                                    console.warn(params);
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
                            <div className="mx-2 pointer d-flex align-items-center">
                                {/* {!pdfLoader ? (
                                    <FaDownload
                                        size={22}
                                        onClick={async() => {
                                            await downloadPDF(params);
                                        }}
                                        className="text-danger"
                                    />
                                ) : (
                                    <FaHourglassHalf
                                        size={22}
                                        className="text-info"
                                    />
                                )} */}
                                {/* <FaDownload
                                    size={22}
                                    onClick={() => {
                                        handleDownpdf(params);
                                    }}
                                /> */}
                            </div>
                            {params.final_result === '0' && (
                                <div
                                    onClick={() =>
                                        handlePromotelFinalEvaluated(params)
                                    }
                                    style={{ marginRight: '12px' }}
                                >
                                    <div className="btn btn-info btn-lg mx-2">
                                        Promote
                                    </div>
                                </div>
                            )}
                        </div>
                    ];
                },
                width: '23rem',
                left: true
            }
            //       {params.final_result === '0' ?
            //       (
            //     {
            //         name: 'Final Evaluation',
            //         cell: (params) => {
            //             return [
            //                 <div className="d-flex" key={params}>
            //                     {params.final_result === '0' && (
            //                         <div
            //                             onClick={() =>
            //                                 handlePromotelFinalEvaluated(params)
            //                             }
            //                             style={{ marginRight: '12px' }}
            //                         >
            //                             <div className="btn btn-info btn-lg mx-2">
            //                                 Promote
            //                             </div>
            //                         </div>
            //                     )}
            //                 </div>
            //             ];
            //         },
            //         width: '15%',
            //         left: true
            //     } )
            // : ""}
        ]
    };
    const [sortid, setsortid] = useState();
    const handlesortid = (e) => {
        setsortid(e.id);
    };

    const showbutton = state && sdg; 

    const handleNext = () => {
        if (tableData && currentRow < tableData?.length) {
            setIdeaDetails(tableData[currentRow]);
            setIsDetail(true);
            setCurrentRow(currentRow + 1);
        }
    };
    const handlePrev = () => {
        if (tableData && currentRow >= 1) {
            setIdeaDetails(tableData[currentRow - 2]);
            setIsDetail(true);
            setCurrentRow(currentRow - 1);
        }
    };

    const [pdfLoader, setPdfLoader] = React.useState(false);
    const [teamResponse, setTeamResponse] = React.useState([]);
    const [details, setDetails] = React.useState();
    const downloadPDF = async (params) => {
        await setDetails(params);
        if (params?.response) {
            await setTeamResponse(
                Object.entries(params?.response).map((e) => e[1])
            );

            setPdfLoader(true);
            const domElement = document.getElementById('pdfIdd');
            await html2canvas(domElement, {
                onclone: (document) => {
                    document.getElementById('pdfIdd').style.display = 'block';
                },
                scale: 1.13
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'px', [2580, 3508]);
                pdf.addImage(
                    imgData,
                    'JPEG',
                    20,
                    20,
                    2540,
                    pdf.internal.pageSize.height,
                    undefined,
                    'FAST'
                );
                pdf.save(`${new Date().toISOString()}.pdf`);
            });
            setPdfLoader(false);
        }
    };

    ////////////////pdf////////////////
    const componentRef = useRef();
    const [pdfIdeaDetails, setPdfIdeaDetails] = useState('');
    const [pdfTeamResponse, setpdfTeamResponse] = useState('');
    const handleDownpdf = (params) => {
        setPdfIdeaDetails(params);
        if (params?.response) {
            setpdfTeamResponse(
                Object.entries(params?.response).map((e) => e[1])
            );
        }
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${pdfIdeaDetails?.team_name ? pdfIdeaDetails?.team_name : 'temp'
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

            <Layout>
                <div className="container evaluated_idea_wrapper pt-5 mb-50">
                    {/* <div id="pdfIdd" style={{ display: 'none' }}>
                    <TableDetailPdf
                        ideaDetails={details}
                        teamResponse={teamResponse}
                        level={level}
                    />
                </div> */}
                    <div className="row">
                        <div className="col-12 p-0">
                            {!isDetail && (
                                <div>
                                    <h2 className="ps-2 pb-3">
                                        {title == '0'
                                            ? 'Final Evaluated'
                                            : 'Final Winners'}{' '}
                                        Challenges
                                    </h2>

                                    <Container fluid className="px-0">
                                        <Row className="align-items-center">
                                            <Col md={2}>
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
                                                <Selects
                                                    list={themesList}
                                                    setValue={setsdg}
                                                    placeHolder={
                                                        'Select Themes'
                                                    }
                                                    value={sdg}
                                                />
                                            </Col>
                                            {/* <Col md={2}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={districtList[
                                                            state
                                                        ] || []}
                                                        setValue={setdistrict}
                                                        placeHolder={
                                                            'Select District'
                                                        }
                                                        value={district}
                                                    />
                                                </div>
                                            </Col> */}
                                            {/* <Col md={2}>
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
                                            <Col md={5}>
                                                <div className="text-right">
                                                    <Button
                                                        btnClass="primary"
                                                        size="small"
                                                        label="Back"
                                                        onClick={() =>
                                                            history.goBack()
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
                                            {...evaluatedIdeafinal}
                                        >
                                            <DataTable
                                                data={tableData || []}
                                                defaultSortFieldId={sortid}
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
                                                onSort={(e) => handlesortid(e)}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                ) : (
                                    <ViewDetail
                                        ideaDetails={ideaDetails}
                                        setIsDetail={setIsDetail}
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
