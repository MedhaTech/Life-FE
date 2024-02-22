/* eslint-disable indent */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Layout from '../Layout';
import './dashboard.scss';
import { Col, Container, Row, CardBody, CardText } from 'reactstrap';
import axios from 'axios';
import { getCurrentUser, getNormalHeaders } from '../../helpers/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getSchoolByID } from '../../School/store/school/actions';
import { useHistory } from 'react-router-dom';
import { URL, KEY } from '../../constants/defaultValues';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { Button } from '../../stories/Button';

import {
    deleteTempMentorById,
    teacherResetPassword
} from '../../Admin/store/admin/actions';
import logout from '../../assets/media/logout.svg';
import Swal from 'sweetalert2/dist/sweetalert2';
import jsPDF from 'jspdf';

import { Card } from 'react-bootstrap';
import TeacherLatestScroll from './TeacherLatestScroll';
import StudentLatestScroll from './StudentLatestScroll';
// import './style.css';
import DoughnutChart from '../../Teachers/Dashboard/DoughnutChart';
import { encryptGlobal } from '../../constants/encryptDecrypt';
const DashboardSchool = (props) => {
    const [orgData, setOrgData] = useState({});
    const [mentorId, setMentorId] = useState('');
    const [userId, setUserId] = useState('');
    const [mentorTeam, setMentorTeam] = useState([]);
    const [mentorArrayId, setMentorArrayId] = useState([]);
    const [mentorData, setMentorData] = useState({});
    const [userData, setUserData] = useState({});

    const [diesCode, setDiesCode] = useState('');

    // const [course, setCourse] = useState([]);
    const [multiOrgData, setMultiOrgData] = useState({});
    const [teamsCount, setTeamsCount] = useState('-');
    const [ideaCount, setIdeaCount] = useState('-');
    const [studentCount, setStudentCount] = useState('-');
    const [coursepercentage, setCoursepercentage] = useState('-');
    const [score, setScore] = useState('-');
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const school = useSelector((state) => state.school);
    const [error, setError] = useState('');
    const pdfRef = React.useRef(null);
    const [isideadisable, setIsideadisable] = useState(false);

    const dispatch = useDispatch();
    // useLayoutEffect(() => {
    //     if (currentUser?.data[0]?.institution_id) {
    //     }
    // }, [currentUser?.data[0]?.institution_id]);
    useEffect(() => {
        // if (school.school.institution_code) {
        const body = JSON.stringify({
            institution_code: currentUser?.data[0]?.institution_code
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/institutions/checkOrg',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };

        axios(config)
            .then(function (response) {
                if (response.status == 200) {
                    if (response.status == 200) {
                        // console.log(response, '++++');

                        setMultiOrgData(response?.data?.data);
                        // setCount(count + 1);
                    }
                    // setOrgData(response?.data?.data[0]);
                    setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    // setMentorData(response?.data?.data[0]?.mentor);
                    // setUserData(response?.data?.data[0]?.mentor?.user);
                    // setUserId(response?.data?.data[0]?.mentor.user_id);
                    // var array = [];
                    // array.push({
                    //     mentor_id: response?.data?.data[0]?.mentor.mentor_id,
                    //     user_id: response?.data?.data[0]?.mentor.user_id
                    // });
                    // setMentorArrayId(array);
                }
            })
            .catch(function (error) {});
        // }
    }, [currentUser?.data[0]?.institution_code]);
    const handleAlert = (id) => {
        // where id = mentor.userid //
        // we can delete the userid //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'You are Deleting this Registration',
                text: 'Are you sure?',
                showCloseButton: true,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (result.isConfirmed) {
                        await deleteTempMentorById(id);
                        setOrgData({});
                        setDiesCode('');
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', '', 'error');
                }
            });
    };
    useEffect(() => {
        if (currentUser?.data[0]?.institution_id) {
            mentorTeamsCount();
            mentorIdeaCount();
            mentorStudentCount();
            // mentorcoursepercentage();
        }
    }, [currentUser?.data[0]?.institution_id]);
    // useEffect(() => {
    //     if (userId) {
    //         mentorcoursepercentage();
    //         mentorScore();
    //     }
    // }, [userId]);

    const mentorTeamsCount = () => {
        const mentId = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser?.data[0]?.institution_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/teamCount?Data=${mentId}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTeamsCount(response.data.data[0].teamCount);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const mentorIdeaCount = () => {
        const IdeaId = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser?.data[0]?.institution_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/ideaCount?Data=${IdeaId}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setIdeaCount(response.data.data[0].idea_count);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const mentorStudentCount = () => {
        const StuId = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser?.data[0]?.institution_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/studentCount?Data=${StuId}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setStudentCount(response.data.data[0].student_count);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const mentorcoursepercentage = () => {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/mentorpercentage?user_id=${userId}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    const per = Math.round(
                        (response.data.data[0].currentProgress /
                            response.data.data[0].totalProgress) *
                            100
                    );
                    setCoursepercentage(per);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // useEffect(() => {
    const mentorScore = () => {
        const userIdParam = encryptGlobal(
            JSON.stringify({
                user_id: userId,
                role: 'MENTOR'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/quizscores?Data=${userIdParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // setCourse(response.data.data);
                    setScore(response.data.data[0].scores[0].score);
                    // console.log(response);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    async function getMentorIdApi(id) {
        // Mentor Id  Api//
        // id = Mentor Id //
        let axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let enParamData = encryptGlobal(
            JSON.stringify({
                mentor_id: id,
                status: 'ACTIVE',
                ideaStatus: true
            })
        );
        axiosConfig['params'] = {
            Data: enParamData
        };

        await axios
            .get(`${URL.getTeamMembersList}`, axiosConfig)
            .then((res) => {
                if (res?.status == 200) {
                    var mentorTeamArray = [];
                    res &&
                        res.data &&
                        res.data.data[0] &&
                        res.data.data[0].dataValues.length > 0 &&
                        res.data &&
                        res.data.data[0].dataValues.map((teams, index) => {
                            var key = index + 1;
                            return mentorTeamArray.push({ ...teams, key });
                        });
                    setMentorTeam(mentorTeamArray);
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handelSelectentor = (data) => {
        setOrgData(data);
        setMentorId(data.mentor.mentor_id);
        setError('');
        if (data.mentor.mentor_id) {
            getMentorIdApi(data.mentor.mentor_id);
        }
    };
    const MultipleMentorsData = {
        data: multiOrgData,
        columns: [
            {
                name: 'Mentor Name',
                selector: (row) => row?.mentor?.mentor_name,
                center: true
            },
            {
                name: 'Actions',
                cell: (params) => {
                    return [
                        <div
                            key={params}
                            onClick={() => handelSelectentor(params)}
                        >
                            <div className="btn btn-primary btn-lg mr-5 mx-2">
                                view
                            </div>
                        </div>
                    ];
                },
                center: true
            }
        ]
    };
    // const handleEdit = () => {
    //     //  here  We can edit the Registration details //
    //     // Where data = orgData //
    //     history.push({
    //         pathname: '/school/edit-user-profile',
    //         data: {
    //             full_name: orgData.mentor?.mentor_name,
    //             // mobile: orgData.mentor?.mobile,
    //             username: orgData.mentor?.user?.username,
    //             mentor_id: orgData.mentor?.mentor_id,
    //             where: 'Dashbord',
    //             organization_code: orgData.organization_code
    //         }
    //     });
    // };
    const handleEdit = () => {
        history.push({
            pathname: '/SchoolEditTeacherProfile',
            item: {
                mentor_name: orgData.mentor?.mentor_name,
                mentor_id: orgData.mentor?.mentor_id,
                mentor_email: orgData.mentor?.mentor_email,
                mentor_title: orgData.mentor?.mentor_title,
                username: orgData.mentor?.mentor_mobile,
                mentor_mobile: orgData.mentor?.mentor_mobile,

                gender: orgData.mentor?.gender,
                mentor_whatapp_mobile: orgData.mentor?.mentor_whatapp_mobile,
                date_of_birth: orgData.mentor?.date_of_birth,
                mentor_name_vernacular: orgData.mentor?.mentor_name_vernacular
            }
        });
    };
    const handleresetpassword = (data) => {
        //  here we can reset the password as disecode //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'You are attempting to reset the password',
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Reset Password',
                showCancelButton: true,
                cancelButtonText: 'cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    dispatch(
                        teacherResetPassword({
                            username: data.username,
                            mentor_id: data.mentor_id,
                            otp: false
                        })
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Reset password is cancelled',
                        'error'
                    );
                }
            })
            .catch((err) => console.log(err.response));
    };
    const downloadPDF = () => {
        // where we can download the Registration Details //
        const content = pdfRef.current;
        const doc = new jsPDF('p', 'px', [1280, 1020]);
        doc.html(content, {
            callback: function (doc) {
                doc.save('Detail.pdf');
            }
        });
        console.warn(content);
    };
    const viewDetails = () => {
        // where we can see all details //
        // where orgData = orgnization details , Mentor details //
        history.push({
            pathname: '/school/View-More-details',
            data: orgData
        });
        localStorage.setItem('orgData', JSON.stringify(orgData));
    };
    const MentorsData = {
        data: mentorTeam,
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                width: '12%'
            },
            {
                name: 'Team Name',
                // selector: 'team_name',
                selector: (row) => row?.team_name,
                sortable: true,
                center: true,
                width: '25%'
            },
            {
                name: 'Student Count',
                // selector: 'student_count',
                selector: (row) => row?.student_count,

                center: true,
                width: '20%'
            },
            {
                name: 'Idea Sub Status',
                // selector: 'ideaStatus',
                selector: (row) => row?.ideaStatus,

                center: true,
                width: '25%'
            }
            // {
            //     name: 'Actions',
            //     cell: (params) => {
            //         return [
            //             <>
            //                 {/* {params.ideaStatus == 'SUBMITTED' &&
            //                     params.evaluation_status === null && (
            //                         <Button
            //                             key={params}
            //                             className={
            //                                 isideadisable
            //                                     ? `btn btn-success btn-lg mr-5 mx-2`
            //                                     : `btn btn-lg mr-5 mx-2`
            //                             }
            //                             label={'REVOKE'}
            //                             size="small"
            //                             shape="btn-square"
            //                             onClick={() =>
            //                                 handleRevoke(
            //                                     params.challenge_response_id,
            //                                     params.ideaStatus
            //                                 )
            //                             }
            //                             disabled={!isideadisable}
            //                         />
            //                     )} */}
            //             </>
            //         ];
            //     },
            //     width: '20%',
            //     center: true
            // }
        ]
    };
    // }, []);

    // console.log(mentorArrayId);

    const hi = false;
    return (
        <Layout>
            <Container>
                <Row className="ticket-btn col ml-auto mb-3">
                    <h2 className="mt-5  text-center ">
                        <strong> Institution Dashboard</strong>
                    </h2>
                    <div className="d-flex justify-content-end">
                        <Button
                            label="Add/Register Mentor "
                            btnClass="m-5 btn btn-success"
                            size="small"
                            shape="btn-square"
                            // Icon={BsPlusLg}
                            onClick={() => history.push('/school/register')}
                        />
                    </div>
                </Row>
                {/* <Row className="m-5"> */}
                <div className=" row  col-xs-12 col-md-12 ">
                    <Row className="md-12">
                        <Row>
                            <Col md={4}>
                                <Card
                                    bg="light"
                                    text="dark"
                                    className="p-2"
                                    // className="md-3 xs-12 mb-4 "
                                    // style={{ width: '350px' }}
                                    style={{ height: '16rem' }}
                                >
                                    <Card.Body>
                                        <label htmlFor="teams" className="">
                                            Number of Teams
                                        </label>

                                        <Card.Text
                                            style={{
                                                fontSize: '48px',
                                                fontWeight: 'bold',
                                                marginTop: '10px',
                                                marginBottom: '20px'
                                            }}
                                        >
                                            {teamsCount}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card
                                    bg="light"
                                    text="dark"
                                    className="p-2"
                                    // style={{ height: '200px' }}
                                    // className="md-3 xs-12 mb-4 "
                                    style={{ height: '16rem' }}
                                >
                                    <Card.Body>
                                        <label htmlFor="teams" className="">
                                            Total Students
                                        </label>
                                        <Card.Text
                                            style={{
                                                fontSize: '48px',
                                                fontWeight: 'bold',
                                                marginTop: '10px',
                                                marginBottom: '20px'
                                            }}
                                        >
                                            {studentCount}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card
                                    bg="light"
                                    text="dark"
                                    className="p-2"
                                    // style={{ height: '200px' }}
                                    // className="md-3 xs-12 mb-4 "
                                    style={{ height: '16rem' }}
                                >
                                    <Card.Body>
                                        <label htmlFor="teams" className="">
                                            Total Ideas
                                        </label>
                                        <Card.Text
                                            style={{
                                                fontSize: '48px',
                                                fontWeight: 'bold',
                                                marginTop: '10px',
                                                marginBottom: '20px'
                                            }}
                                        >
                                            {ideaCount}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Row>

                    <div
                        style={{ flex: 1, overflow: 'auto' }}
                        className="bg-white mt-5 rounded px-5 py-3 col-lg-12 disc-card-search col-12"
                    >
                        {/* <h2 className="mt-3">Search Registration Details</h2> */}

                        <Row className="md-12">
                            {multiOrgData.length !== undefined &&
                                multiOrgData.length !== 0 &&
                                multiOrgData[0]?.mentor !== null && (
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...MultipleMentorsData}
                                    >
                                        <DataTable
                                            data={multiOrgData}
                                            noHeader
                                            highlightOnHover
                                        />
                                    </DataTableExtensions>
                                )}
                            {orgData &&
                                orgData?.institution_name &&
                                orgData?.mentor !== null && (
                                    <>
                                        {/* <div className="mb-5 p-3" >  */}
                                        {/* <div
                                                className="container-fluid card shadow border" ref={pdfRef}
                                                // style={{
                                                //     width: '300px',
                                                //     height: '300px'
                                                // }}
                                            > */}
                                        <div ref={pdfRef}>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className="text-center m-3 text-primary ">
                                                        Registration Details
                                                    </h2>
                                                    <hr />
                                                </div>
                                            </div>
                                            <div className="row ">
                                                <div className="col">
                                                    {}
                                                    {/* <ul className="p-0">
                                                            <li className="d-flex justify-content-between">
                                                                School:
                                                                <p>
                                                                    {
                                                                        orgData.organization_name
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                City:{' '}
                                                                <p>
                                                                    {
                                                                        orgData.city
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                District:{' '}
                                                                <p>
                                                                    {
                                                                        orgData.district
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                Mentor Name:{' '}
                                                                <p>
                                                                    {
                                                                        orgData
                                                                            .mentor
                                                                            ?.full_name
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                Mentor Mobile No
                                                                :{' '}
                                                                <p>
                                                                    {
                                                                        orgData
                                                                            .mentor
                                                                            ?.user
                                                                            ?.username
                                                                    }
                                                                </p>
                                                            </li>
                                                        </ul> */}
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Institution</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData.institution_name
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                Institution Type
                                                            </p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        ?.institution_type
                                                                        ?.institution_type
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Title</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        .mentor_title
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>{' '}
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Mentor Name</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.mentor_name
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                Mentor Mobile No
                                                            </p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.mentor_mobile
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                WhatsApp Mobile
                                                                No
                                                            </p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.mentor_whatapp_mobile
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Date of Birth</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.date_of_birth
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Email Id</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.mentor_email
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>{' '}
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Gender</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        .gender
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                        {/* <div className="d-flex justify-content-between"> */}
                                        <div className="d-flex justify-content-between flex-column flex-md-row">
                                            <button
                                                className="btn  rounded-pill px-4  text-white mt-2 mt-md-0 ml-md-2"
                                                style={{
                                                    backgroundColor: '#ffcb34'
                                                }}
                                                onClick={handleEdit}
                                                //className="btn btn-warning btn-lg  px-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleresetpassword({
                                                        mentor_id:
                                                            orgData.mentor
                                                                .mentor_id,
                                                        username:
                                                            orgData?.mentor
                                                                ?.mentor_mobile
                                                    })
                                                }
                                                className="btn btn-info rounded-pill px-4  text-white mt-2 mt-md-0 ml-md-2"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                onClick={() => {
                                                    downloadPDF();
                                                }}
                                                className="btn btn-primary rounded-pill px-4 mt-2 mt-md-0 ml-md-2"
                                            >
                                                Download
                                            </button>

                                            {/* <button
                                                    onClick={viewDetails}
                                                    className="btn btn-success rounded-pill px-4 mt-2 mt-md-0 ml-md-2"
                                                >
                                                    View Details
                                                </button> */}

                                            <button
                                                onClick={() => {
                                                    handleAlert(
                                                        orgData.mentor?.user_id
                                                    );
                                                }}
                                                className="btn  btn-lg  rounded-pill mt-2 mt-md-0 ml-md-2"
                                                style={{
                                                    backgroundColor: '#dc3545'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* <div className="mb-5 p-3"> */}
                                        {/* <div className="container-fluid card shadow border"> */}
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className="text-center m-3 text-primary">
                                                        Teams Registered
                                                    </h2>
                                                    <hr />
                                                </div>
                                            </div>
                                            <div>
                                                <DataTableExtensions
                                                    print={false}
                                                    export={false}
                                                    {...MentorsData}
                                                >
                                                    <DataTable
                                                        noHeader
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        highlightOnHover
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </>
                                    // ) : (
                                    //     // count != 0 && (
                                    //     //     <div className="text-success fs-highlight d-flex justify-content-center align-items-center">
                                    //     //         <span>
                                    //     //             Still No Teacher Registered
                                    //     //         </span>
                                    //     //     </div>
                                    //     // )
                                    //     multiOrgData[0]?.mentor === null && (
                                    //         // <Card className="mt-3 p-4">
                                    //         <div className="text-success fs-highlight d-flex justify-content-center align-items-center">
                                    //             <span>Still No Teacher Registered</span>
                                    //         </div>
                                    //     )
                                )}
                        </Row>
                    </div>
                </div>
                {/* </Row> */}
                {/* <Row className="p-3">
                    <Col className="md-5 ">
                        <Col>
                            <Card
                                bg="light"
                                text="dark"
                               
                            >
                                <Card.Body style={{ overflowX: 'auto' }}>
                                    <TeacherLatestScroll
                                        usersdata={currentUser?.data}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Col>
                    <Col className="md-5">
                        <Col>
                            <Card
                                bg="light"
                                text="dark"
                                // className=" md-3 xs-12 mb-5"
                            >
                                <Card.Body style={{ overflowX: 'auto' }}>
                                    <StudentLatestScroll
                                        usersdata={currentUser?.data}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Col>
                </Row> */}
                <Row className="p-3">
                    {/* <Col md={6}>
                        <Card
                            bg="light"
                            text="dark"
                           
                            style={{ height: '16rem' }}
                        >
                            <Card.Body>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '24px'
                                    }}
                                >
                                    Guide Teacher Details
                                </label>

                                <Card.Text
                                    className="left-aligned"
                                    style={{
                                       
                                        marginTop: '10px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <span className="mx-3">
                                        <b>Mentor Name :</b>
                                    </span>
                                    <b>{mentorData.full_name}</b>
                                    <br />
                                    <span className="mx-3">
                                        <b>Teacher Mobile No : </b>
                                    </span>
                                    <b>{userData.username}</b>
                                    <br />
                                    <span className="mx-3">
                                        <b>Course Completion : </b>
                                    </span>
                                    <b> {coursepercentage + '%'}</b>
                                    <br />
                                    <span className="mx-3">
                                        <b> Quiz Score :</b>
                                    </span>
                                    <b>
                                        {score ? score : 0 + '/15'}
                                       
                                    </b>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> */}
                    {/* <Col md={2}>
                        <Card
                            bg="light"
                            text="dark"
                            className="p-2"
                            // className="md-3 xs-12 mb-4 "
                            // style={{ width: '350px' }}
                            style={{ height: '16rem' }}
                        >
                            <Card.Body>
                                <label htmlFor="teams" className="">
                                    Number of Teams
                                </label>

                                <Card.Text
                                    style={{
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        marginTop: '10px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    {teamsCount}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> */}
                    {/* <Col md={2}>
                        <Card
                            bg="light"
                            text="dark"
                            className="p-2"
                            // style={{ height: '200px' }}
                            // className="md-3 xs-12 mb-4 "
                            style={{ height: '16rem' }}
                        >
                            <Card.Body>
                                <label htmlFor="teams" className="">
                                    Total Students
                                </label>
                                <Card.Text
                                    style={{
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        marginTop: '10px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    {studentCount}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> */}
                    {/* <Col md={2}>
                        <Card
                            bg="light"
                            text="dark"
                            className="p-2"
                            // style={{ width: '350px' }}
                            // className="md-3 xs-12 mb-4 "
                            style={{ height: '16rem' }}
                        >
                            <Card.Body>
                                <label htmlFor="teams" className="">
                                    Number of Ideas
                                </label>

                                <Card.Text
                                    className="left-aligned"
                                    style={{
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        marginTop: '10px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    {ideaCount}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> */}
                </Row>
                {/* <p>Teacher Name :{orgData.mentor.full_name}</p> */}
                {/* <Col>
                    <Card bg="light" text="dark" className="md-3 xs-12 mb-5">
                        <Card.Body style={{ overflowX: 'auto' }}>
                            <TeacherLatestScroll
                                usersdata={currentUser?.data}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="light" text="dark" className=" md-3 xs-12 mb-5">
                        <Card.Body style={{ overflowX: 'auto' }}>
                            <StudentLatestScroll
                                usersdata={currentUser?.data}
                            />
                        </Card.Body>
                    </Card>
                </Col> */}
                {/* <Row className="teacher-statistics p-3">
                    {' '}
                    <Row className="">
                        <Col>
                            <div className="d-flex flex-wrap">
                                {mentorArrayId.length > 0 && (
                                    <DoughnutChart user={mentorArrayId} />
                                )}
                            </div>
                        </Col>
                    </Row>
                </Row> */}
            </Container>
        </Layout>
    );
};

export default DashboardSchool;
