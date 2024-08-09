/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import Layout from '../../Admin/Layout';
import { useHistory, withRouter } from 'react-router-dom';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { Button } from '../../stories/Button';
import { useDispatch } from 'react-redux';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { Modal } from 'react-bootstrap';

import {
    getStudentDashboardStatus,
    getStudentDashboardTeamProgressStatus
} from '../../redux/studentRegistration/actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import logout from '../../assets/media/logout.svg';
import { studentResetPassword } from '../../redux/actions';
const GreetingModal = (props) => {
    return (
        <Modal
            show={props.show}
            size="lg"
            centered
            className="modal-popup text-center"
            onHide={props.handleClose}
            backdrop={true}
        >
            <Modal.Header closeButton></Modal.Header>

            <Modal.Body>
                <figure>
                    <img
                        src={props.imgUrl}
                        alt="popup image"
                        className="img-fluid"
                    />
                </figure>
            </Modal.Body>
        </Modal>
    );
};
const CommonUserProfile = (props) => {
    const [showsPopup, setShowsPopup] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const history = useHistory();
    const { t } = useTranslation();
    const [button, setButton] = useState('');
    const [data, setData] = useState('');
    const currentUser = getCurrentUser('current_user');

    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
    const [course, setCourse] = useState([]);
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const dashboardStatus = useSelector(
        (state) => state?.studentRegistration.dashboardStatus
    );

    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser) {
            // dispatch(getStudentDashboardStatus(StudentsDaTa.user_id, language));
            // dispatch(
            //     getStudentDashboardTeamProgressStatus(
            //         currentUser?.data[0]?.user_id,
            //         language
            //     )
            // );
        }
    }, [currentUser?.data[0]?.user_id, language]);
    // useEffect(() => {
    //     const stuParam = encryptGlobal(
    //         JSON.stringify({
    //             user_id: StudentsDaTa.user_id
    //         })
    //     );
    //     var config = {
    //         method: 'get',
    //         url:
    //             process.env.REACT_APP_API_BASE_URL +
    //             `/dashboard/quizscores?Data=${stuParam}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setCourse(response.data.data[0]?.scores);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, []);
    const dashboardTeamProgressStatus = useSelector(
        (state) => state?.studentRegistration.dashboardTeamProgressStatus
    );
    const handleViewBack = () => {
        history.push({
            pathname: '/admin/userlist'
        });
        localStorage.setItem('dist', props.location.dist);
        localStorage.setItem('num', props.location.num);
    };

    const handleReset = () => {
        // here we can reset password as  user_id //
        // here data = student_id //
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
                cancelButtonText: t('general_req.btn_cancel'),
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    dispatch(
                        studentResetPassword({
                            user_id: StudentsDaTa.user_id.toString()
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
    useEffect(() => {
        // mentorsData();
    }, []);
    const mentorsData = () => {
        const mentorsParam = encryptGlobal(
            JSON.stringify({
                team_id: StudentsDaTa.team_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/teamMentor?Data=${mentorsParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setData(response?.data?.data[0]);
                    setButton(response.data.data[0].moc_name);
                    // if (response.data.data[0].moc_name !== null) {
                    //     setshowMentorCard(true);
                    // }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // const handleReset = () => {
    //     // where we can reset the password  as diesCode //

    //     const body = JSON.stringify({
    //         organization_code:
    //             StudentsDaTa?.team?.mentor?.organization.organization_code,
    //         mentor_id: StudentsDaTa?.team?.mentor.mentor_id,
    //         otp: false
    //     });
    //     var config = {
    //         method: 'put',
    //         url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 202) {
    //                 openNotificationWithIcon(
    //                     'success',
    //                     'Reset Password Successfully Update!',
    //                     ''
    //                 );
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    // const handleEdit = () => {
    //     // where we can edit  the users data //
    //     history.push({
    //         pathname: '/admin/student/edit-user-profile',
    //         data: {
    //             username: props.location.data && props.location.data.username,
    //             full_name: props.location.data && props.location.data.full_name,
    //             organization_code:
    //                 props.location.data &&
    //                 props.location.data?.organization_code,
    //             mentor_id: props.location.data && props.location.data.mentor_id
    //         }
    //     });
    // };
    const handleEdit = () => {
        history.push({
            pathname: '/admin/student/edit-user-profile',
            data: {
                Age: StudentsDaTa.Age,
                Gender: StudentsDaTa.Gender,
                email: StudentsDaTa.email,
                student_id: StudentsDaTa.student_id,
                team_id: StudentsDaTa?.team_id,
                student_full_name: StudentsDaTa.student_full_name,
                date_of_birth: StudentsDaTa.date_of_birth,
                mobile: StudentsDaTa?.mobile,
                year_of_study: StudentsDaTa?.year_of_study,
                institution_id: StudentsDaTa?.institution_id,
                course_name: StudentsDaTa?.course_name
            }
        });
    };
    const CourseData = {
        data: course && course.length > 0 ? course : [],
        columns: [
            {
                name: 'No',
                selector: (row) => key + 1,
                // sortable: true,
                width: '10rem'
            },
            {
                name: 'Quiz',
                // sortable: true,
                selector: (row) => row.quiz_id,
                sortable: true,
                width: '10rem'
            },

            {
                name: 'Attempts',
                // sortable: true,
                selector: (row) => row.attempts,
                sortable: true,
                width: '15rem'
            },
            {
                name: 'Score',
                selector: (row) => (row.score ? row.score : '-'),
                width: '20rem'
            }
        ]
    };
    const handleClose = () => {
        setShowsPopup(false);
    };
    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB'); 
        }
        return '-';
    };
    return (
        <Layout title="UserList">
             <GreetingModal
                handleClose={handleClose}
                show={showsPopup}
                imgUrl={imgUrl}
            ></GreetingModal>
            <Container className="mt-5 pt-5 dynamic-form">
                <Row>
                    <div className="col-6">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h3 className="mt-5"> Student Details</h3>
                    </div>
                    <div className="col-6 text-end">
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Edit"
                            onClick={handleEdit}
                        />
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Reset"
                            onClick={handleReset}
                        />
                        <Button
                            btnClass={'primary'}
                            size="small"
                            label="Back"
                            onClick={handleViewBack}
                        />
                    </div>
                </Row>
                <Row>
                    <Card className="py-5">
                        <CardBody>
                        <CardText>
                                <span className="mx-3">
                                    <b>Applicant Category :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.year_of_study}
                                    {/* {props.location.data &&
                                    props.location.data.full_name
                                        ? props.location.data &&
                                          props.location.data.full_name
                                        : '-'}{' '} */}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Applicant Name :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.student_full_name}
                                    {/* {props.location.data &&
                                    props.location.data.full_name
                                        ? props.location.data &&
                                          props.location.data.full_name
                                        : '-'}{' '} */}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Email Address:</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.email
                                        ? StudentsDaTa?.email
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Mobile Number :</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.mobile
                                        ? StudentsDaTa?.mobile
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Date Of Birth :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.date_of_birth ? formatDate(StudentsDaTa.date_of_birth) : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Age :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.Age ? StudentsDaTa.Age : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b> Gender :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.Gender
                                        ? StudentsDaTa.Gender
                                        : '-'}
                                </b>
                            </CardText>

                           
                            <CardText>
                                <span className="mx-3">
                                    <b>State :</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.state
                                        ? StudentsDaTa?.state
                                        : '_'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>District :</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.district
                                        ? StudentsDaTa?.district
                                        : '-'}
                                </b>
                            </CardText>

                            <CardText>
                                <span className="mx-3">
                                    <b>City :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.city
                                        ? StudentsDaTa.city
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Institution Name :</b>
                                </span>
                                <b>{StudentsDaTa?.institution_name}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Institution Type :</b>
                                </span>

                                <b>{StudentsDaTa?.group}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b> Reg. Number (as per ID Card) :</b>
                                </span>
                                <b>
                                    {StudentsDaTa.reg_no
                                        ? StudentsDaTa.reg_no
                                        : '-'}
                                </b>
                                <Button
                                            size="small"
                                            label="View ID Card"
                       btnClass="primary col-3 m-2"
                       onClick={()=>{
                           setImgUrl(teamMember?.id_card);
                           setShowsPopup(true);
                       }}
                   />
                            </CardText>
                        </CardBody>
                    </Card>
                </Row>
                {/* <Row className="my-5"> */}
                    {/* <Card className="py-5"> */}
                        {/* <CardBody> */}
                            {/* <h2 className="mb-4">Institution Details</h2> */}
                           
                           
                            {/* <CardText>
                                <span className="mx-3">
                                    <b>Place:</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.place_name
                                        ? StudentsDaTa?.place_name
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Block:</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.block_name
                                        ? StudentsDaTa?.block_name
                                        : '-'}
                                </b>
                            </CardText> */}
                            {/* <CardText>
                                <span className="mx-3">
                                    <b>Taluk:</b>
                                </span>
                                <b>
                                    {StudentsDaTa?.taluk_name
                                        ? StudentsDaTa?.taluk_name
                                        : '-'}
                                </b>
                            </CardText>{' '} */}
                          
                           
                            {/* <CardText> */}
                            {/* <span className="mx-3">
                                    <b>Category :</b>
                                </span> */}
                            {/* <b> */}
                            {/* {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .category
                                    } */}
                            {/* {props.location.data &&
                                    props.location.data.team &&
                                    props.location.data.team.mentor &&
                                    props.location.data.team.mentor.organization
                                        .category
                                        ? props.location.data &&
                                          props.location.data.team &&
                                          props.location.data.team.mentor &&
                                          props.location.data.team.mentor
                                              .organization.category
                                        : '-'} */}
                            {/* </b> */}
                            {/* </CardText> */}
                        {/* </CardBody> */}
                    {/* </Card> */}
                {/* </Row> */}
                {/* <Row className="my-5">
                    <Card className="py-5">
                        <CardBody>
                            <h2 className="mb-4">Course Details</h2>

                            <CardText>
                                <span className="mx-3">
                                    <b>Completed Videos :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.videos_completed_count
                                        ? dashboardStatus?.videos_completed_count
                                        : '-'}
                                </b>
                            </CardText>

                            <CardText>
                                <span className="mx-3">
                                    <b>Completed Quiz :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.quiz_completed_count
                                        ? dashboardStatus?.quiz_completed_count
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Course Completion :</b>
                                </span>
                                <b>
                                    {dashboardStatus?.topics_completed_count !==
                                    undefined
                                        ? `${
                                              Math.round(
                                                  (dashboardStatus?.topics_completed_count /
                                                      dashboardStatus?.all_topics_count) *
                                                      100
                                              ) + '%'
                                          }`
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Earned Badges :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.badges_earned_count
                                        ? dashboardStatus?.badges_earned_count
                                        : '-'}
                                </b>
                            </CardText>
                        </CardBody>
                    </Card>
                </Row> */}
                {/* <Row className="my-5">
                    {button ? (
                        <Col md={12}>
                            <Card className="w-100  mb-5 p-4">
                                <CardBody>
                                    <h2 className="mb-4">Mentor Details</h2>
                                    <Row>
                                        <Col
                                            md={8}
                                            className="border-right my-auto "
                                        >
                                            <Row>
                                                <Col
                                                    md={7}
                                                    className="my-auto profile-detail w-100"
                                                >
                                                    <CardText>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    Mentor Name
                                                                </b>
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
                                                                <b>
                                                                    {data?.moc_name
                                                                        ? data?.moc_name
                                                                        : '-'}
                                                                </b>
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
                                                                <b>
                                                                    Email
                                                                    Address
                                                                </b>
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
                                                                <b>
                                                                    {data?.moc_email
                                                                        ? data?.moc_email
                                                                        : '-'}
                                                                </b>
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
                                                                <b>Gender</b>
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
                                                                <b>
                                                                    {data?.moc_gender
                                                                        ? data?.moc_gender
                                                                        : '-'}
                                                                </b>
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
                                                                <b>Mobile</b>
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
                                                                <b>
                                                                    {data?.moc_phone
                                                                        ? data?.moc_phone
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    ) : (
                        <div>
                            <Row className="py-5">
                                <Card className="py-5">
                                    <CardBody>
                                        <h2 className="mb-4 ">
                                            No Mentor assigned yet
                                        </h2>
                                    </CardBody>
                                </Card>
                            </Row>
                        </div>
                    )}
                </Row>
                <Row>
                    <Card className="py-5">
                        <CardBody>
                            <h2 className="mb-4">Quiz Details Table Format</h2>
                        </CardBody>
                        <div className="my-2">
                            <DataTableExtensions
                                {...CourseData}
                                exportHeaders
                                print={false}
                            >
                                <DataTable
                                    data={setCourse}
                                    defaultSortField="id"
                                    defaultSortAsc={false}
                                    pagination
                                    highlightOnHover
                                    fixedHeader
                                    subHeaderAlign={Alignment.Center}
                                />
                            </DataTableExtensions>
                        </div>
                    </Card>
                </Row> */}
            </Container>
        </Layout>
    );
};

export default withRouter(CommonUserProfile);
