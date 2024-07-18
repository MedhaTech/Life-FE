/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import Layout from '../../Layout.jsx';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../../../helpers/Utils.js';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import axios from 'axios';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
// import AvatarImg from '../../../assets/media/img/Avatar.png';
// import topCard1 from '../../../assets/media/img/admin-card-1.png';
// import topCard2 from '../../../assets/media/img/admin-card-2.png';
// import vector from '../../../assets/media/img/vector.png';
// import vector1 from '../../../assets/media/img/Vector-1.png';
// import vector2 from '../../../assets/media/img/Vector-2.png';
// import vector3 from '../../../assets/media/img/Vector-3.png';
import './dashboard.scss';
// import TopSectionCard from './sections/TopSectionCard.jsx';
// import DashboardOverviewCard from './DashboardOverviewCard.jsx';
import { Table } from 'antd';
import { Progress } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {
    getStudentByIdData,
    getStudentDashboardStatus,
    getStudentDashboardTeamProgressStatus
} from '../../../redux/studentRegistration/actions.js';
import LanguageSelectorComp from '../../../components/LanguageSelectorComp/index.js';
// import LatestNews from './LatestNews.js';
import LatestScrollNew from './LatestScrollNew.jsx';
import { Modal } from 'react-bootstrap';

import { Card } from 'react-bootstrap';
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

const Dashboard = () => {
    // here we can see all the details of student //
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const dashboardStatus = useSelector(
        (state) => state?.studentRegistration.dashboardStatus
    );
    const [showPopup, setShowPopup] = useState(false);
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        const popParam = encryptGlobal('1');
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/popup/${popParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (res) {
                if (res.status === 200 && res.data.data[0]?.on_off === '1') {
                    setShowPopup(true);
                    setImgUrl(res?.data?.data[0]?.url);
                }
            })
            .catch(function (error) {
                setShowPopup(false);
                console.log(error);
            });
    }, []);

    // const dashboardChallengesStatus = useSelector(
    //     (state) => state?.studentRegistration.dashboardChallengesStatus
    // );
    const dashboardTeamProgressStatus = useSelector(
        (state) => state?.studentRegistration.dashboardTeamProgressStatus
    );
    // const teamMember = useSelector(
    //     (state) => state?.studentRegistration.teamMember
    // );

    // const presuveyStatusGl = useSelector(
    //     (state) => state?.studentRegistration.presuveyStatusGl
    // );

    const history = useHistory();
    useEffect(() => {
        if (currentUser) {
            dispatch(
                getStudentDashboardStatus(
                    currentUser?.data[0]?.user_id,
                    language
                )
            );
            dispatch(
                getStudentDashboardTeamProgressStatus(
                    currentUser?.data[0]?.user_id,
                    language
                )
            );
        }
    }, [currentUser?.data[0]?.user_id, language]);

    // useEffect(() => {
    //     if (currentUser) dispatch(getStudentDashboardTutorialVideos(language));
    // }, [language]);

    useEffect(() => {
        if (currentUser)
            dispatch(getStudentByIdData(currentUser?.data[0]?.student_id));
    }, [dispatch, currentUser?.data[0]?.student_id]);

    // useLayoutEffect(() => {
    //     if (presuveyStatusGl !== 'COMPLETED')
    //         history.push('/student/pre-survey');
    // }, [presuveyStatusGl]);

    // const cardData = {
    //     idea: {
    //         heading: 'Notice Board',
    //         deadline: `${
    //             dashboardChallengesStatus
    //                 ? dashboardChallengesStatus?.end_date
    //                 : '-'
    //         }`,
    //         subHeading: 'Idea  Submission',
    //         footerText: 'With Team Members',
    //         teamImages: [AvatarImg, AvatarImg, AvatarImg],
    //         rightImage: topCard1,
    //         position: 1
    //     },
    //     profile: {
    //         heading: 'User Profile',
    //         rightImage: topCard2,
    //         position: 2,
    //         footerLabels: {
    //             heading: 'Badges',
    //             value:
    //                 dashboardStatus && dashboardStatus?.badges_earned_count
    //                     ? dashboardStatus?.badges_earned_count
    //                     : 0
    //         }
    //     },
    //     teacher: {
    //         heading: 'Institute Details',
    //         rightImage: topCard2,
    //         position: 2,
    //         footerLabels: {
    //             heading: 'Team Count',
    //             value: 5
    //         }
    //     }
    // };
    const handleClose = () => {
        setShowPopup(false);
    };

    const percentageBWNumbers = (a, b) => {
        // here a = all_topics_count ; b= topics_completed_count //
        return (((a - b) / a) * 100).toFixed(2);
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'student_full_name',
            width: '15%',
            render: (_, record) =>
                record.student_full_name ===
                currentUser?.data[0]?.student_full_name ? (
                    <div className="self-decor">
                        {record.student_full_name}*
                    </div>
                ) : (
                    record.student_full_name
                )
        },
        {
            title: 'Mentor Approval',
            dataIndex: 'idea_submission',
            align: 'center',
            width: '15%',
            render: (_, record) =>
                record?.idea_submission === 1 ? (
                    <FaCheckCircle size={20} color="green" />
                ) : (
                    <FaTimesCircle size={20} color="red" />
                )
        },
        {
            title: 'Idea Submission',
            dataIndex: 'PendingForApproval',
            align: 'center',
            render: (_, record) =>
                record?.PendingForApproval === 1 ? (
                    <FaCheckCircle size={20} color="green" />
                ) : (
                    <FaTimesCircle size={20} color="red" />
                ),
            width: '15%'
        }
        // {
        //     title: 'Send for Approval',
        //     dataIndex: 'PendingForApproval',
        //     width: '15%',
        //     render: (_, record) =>
        //         record.PendingForApproval ===
        //         currentUser?.data[0]?.PendingForApproval ? (
        //             <div className="self-decor">
        //                 {record.PendingForApproval}
        //             </div>
        //         ) : (
        //             record.PendingForApproval
        //         )
        // },
        // {
        //     title: 'Pre Survey',
        //     dataIndex: 'pre_survey_status',
        //     align: 'center',
        //     width: '10%',
        //     render: (_, record) =>
        //         record?.pre_survey_status ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // },
        // {
        //     title: 'Lesson Progress',
        //     dataIndex: 'address',
        //     width: '30%',
        //     align: 'center',
        //     render: (_, record) => {
        //         let percent =
        //             100 -
        //             percentageBWNumbers(
        //                 record.all_topics_count,
        //                 record.topics_completed_count
        //             );
        //         return (
        //             <div className="d-flex">
        //                 <div style={{ width: '80%' }}>
        //                     <Progress
        //                         key={'25'}
        //                         className="progress-height"
        //                         animated
        //                         color={
        //                             percent
        //                                 ? percent <= 25
        //                                     ? 'danger'
        //                                     : percent > 25 && percent <= 50
        //                                     ? 'info'
        //                                     : percent > 50 && percent <= 75
        //                                     ? 'warning'
        //                                     : 'sucess'
        //                                 : 'danger'
        //                         }
        //                         value={percent}
        //                     />
        //                 </div>
        //                 <span className="ms-2">
        //                     {Math.round(percent) ? Math.round(percent) : '0'}%
        //                 </span>
        //             </div>
        //         );
        //     }
        // },

        // {
        //     title: 'Post Survey',
        //     dataIndex: 'post_survey_status',
        //     align: 'center',
        //     width: '10%',
        //     render: (_, record) =>
        //         record?.post_survey_status ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // },
        // {
        //     title: 'Certificate',
        //     dataIndex: 'certificate',
        //     align: 'center',
        //     width: '10%',
        //     render: (_, record) =>
        //         record?.certificate ? (
        //             <FaCheckCircle size={20} color="green" />
        //         ) : (
        //             <FaTimesCircle size={20} color="red" />
        //         )
        // }
    ];

    // return (
    //         <Layout>
    //             <Container className="dashboard-wrapper">
    //                 <div className="d-flex justify-content-between align-items-center">
    //                     <h2>Dashboard</h2>
    //                     <div
    //                         className="bg-white rounded p-3 d-flex align-items-center"
    //                         style={{ width: 'max-content' }}
    //                     >
    //                         <p>Preferred Language : </p>
    //                         <LanguageSelectorComp module="student" />
    //                     </div>
    //                 </div>
    //                 <hr />
    //                 <Row className="d-flex flex-start mb-5" style={{ gap: '1rem' }}>
    //                     <TopSectionCard
    //                         heading={cardData.idea.heading}
    //                         deadline={cardData.idea.deadline}
    //                         subHeading={cardData.idea.subHeading}
    //                         footerText={cardData.idea.footerText}
    //                         rightImage={cardData.idea.rightImage}
    //                         position={cardData.idea.position}
    //                     />
    //                     <TopSectionCard
    //                         heading={cardData.profile.heading}
    //                         footerLabels={cardData.profile.footerLabels}
    //                         rightImage={cardData.profile.rightImage}
    //                         position={cardData.profile.position}
    //                         name={
    //                             currentUser && currentUser?.data[0]?.full_name
    //                                 ? currentUser?.data[0]?.full_name
    //                                 : '-'
    //                         }
    //                         email={
    //                             currentUser && currentUser?.data[0]?.team_name
    //                                 ? currentUser?.data[0]?.team_name
    //                                 : '-'
    //                         }
    //                         mentorData={
    //                             teamMember && teamMember?.team?.mentor
    //                                 ? teamMember?.team?.mentor
    //                                 : null
    //                         }
    //                     />
    //                     <TopSectionCard
    //                         heading={cardData.teacher.heading}
    //                         footerLabels={cardData.teacher.footerLabels}
    //                         rightImage={cardData.teacher.rightImage}
    //                         position={cardData.teacher.position}
    //                         type="teacher"
    //                         organiZation={
    //                             teamMember && teamMember?.team?.mentor
    //                                 ? teamMember?.team?.mentor?.organization
    //                                 : null
    //                         }
    //                     />
    //                 </Row>
    //                 <Row className="flex-start mb-5" style={{ gap: '1rem' }}>
    //                     <DashboardOverviewCard
    //                         title={'Completed Videos'}
    //                         count={
    //                             dashboardStatus &&
    //                             dashboardStatus?.videos_completed_count
    //                                 ? dashboardStatus?.videos_completed_count
    //                                 : 0
    //                         }
    //                         image={vector2}
    //                     />
    //                     <DashboardOverviewCard
    //                         title={'Completed Quiz'}
    //                         count={
    //                             dashboardStatus &&
    //                             dashboardStatus?.quiz_completed_count
    //                                 ? dashboardStatus?.quiz_completed_count
    //                                 : 0
    //                         }
    //                         image={vector1}
    //                     />

    //                     <DashboardOverviewCard
    //                         title={'Completed Worksheets'}
    //                         count={
    //                             dashboardStatus &&
    //                             dashboardStatus?.worksheet_completed_count
    //                                 ? dashboardStatus?.worksheet_completed_count
    //                                 : 0
    //                         }
    //                         image={vector3}
    //                     />
    //                     <DashboardOverviewCard
    //                         title={'Overall Progress'}
    //                         count={
    //                             Math.round(
    //                                 100 -
    //                                     percentageBWNumbers(
    //                                         dashboardStatus?.all_topics_count,
    //                                         dashboardStatus?.topics_completed_count
    //                                     )
    //                             ) + ' %'
    //                         }
    //                         image={vector}
    //                     />
    //                 </Row>
    //                 <Row>
    //                     <Col>
    //                         <div>
    //                             <LatestNews usersdata={currentUser?.data} />
    //                         </div>
    //                     </Col>
    //                 </Row>
    //                 <Row
    //                     className="course-team flex-start mb-5"
    //                     style={{ gap: '1rem' }}
    //                 >
    //                     <Col md={12} className="flex-2 team-progress">
    //                         <h2>Team Progress</h2>
    //                         <div className="bg-white team-progress rounded  p-3">
    //                             <div className="row flex-column p-2">
    //                                 <label
    //                                     htmlFor="teams"
    //                                     className="mb-3 text-capitalize"
    //                                 >
    //                                     <span>
    //                                         {currentUser?.data[0]?.team_name}
    //                                     </span>
    //                                 </label>
    //                             </div>
    //                             <Table
    //                                 bordered
    //                                 pagination={false}
    //                                 dataSource={dashboardTeamProgressStatus}
    //                                 columns={columns}
    //                             />
    //                         </div>
    //                     </Col>
    //                 </Row>
    //             </Container>
    //         </Layout>
    //    );
    // };
    //export default Dashboard;
    return (
        <Layout title="Dashboard">
            <GreetingModal
                handleClose={handleClose}
                show={showPopup}
                imgUrl={imgUrl}
            ></GreetingModal>
            <Container style={{ paddingBottom: '18rem' }}>
                <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ margin: '3rem 0' }}
                >
                    <h2>Dashboard</h2>
                    <div
                        className="bg-white rounded p-3 d-flex align-items-center"
                        style={{ width: 'max-content' }}
                    >
                        {/* <p style={{ marginBottom: '0' }}>
                            Preferred Language :{' '}
                        </p>
                        <LanguageSelectorComp module="student" /> */}
                    </div>
                </div>
                <Row>
                    {/* <Row
                        className="course-team flex-start mb-5"
                        style={{ gap: '1rem' }}
                    > */}
                    {/* <Col md={6} className="flex-2 team-progress">
                        <label htmlFor="teams" className="">
                            Team Progres:
                        </label>
                        <div
                            className="bg-white team-progress rounded  p-3"
                            style={{ overflowX: 'auto' }}
                        >
                            <div className="row flex-column p-2">
                                <label
                                    htmlFor="teams"
                                    className="mb-3 text-capitalize"
                                >
                                    <span>
                                        {currentUser?.data[0]?.team_name}
                                    </span>
                                </label>
                            </div>
                            <Table
                                bordered
                                pagination={false}
                                dataSource={dashboardTeamProgressStatus}
                                columns={columns}
                            />
                        </div>
                    </Col> */}
                    {/* </Row> */}
                    {/* <Col style={{ paddingRight: '15px', marginBottom: '20px' }}>
                        <Row>
                            <Card
                                bg="light"
                                text="dark"
                                className="mb-2"
                                style={{ height: '120px', weight: '100px' }}
                            >
                                <Card.Body>
                                    <label htmlFor="teams" className="">
                                        Completed Videos
                                    </label>

                                    <Card.Text
                                        style={{
                                            fontSize: '48px',
                                            fontWeight: 'bold',
                                            marginTop: '10px',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        {dashboardStatus &&
                                        dashboardStatus?.videos_completed_count
                                            ? dashboardStatus?.videos_completed_count
                                            : 0}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row>
                            <Card
                                bg="light"
                                text="dark"
                                className="mb-2"
                                style={{ height: '120px', weight: '100px' }}
                            >
                                <Card.Body>
                                    <label htmlFor="teams" className="">
                                        Course Completion
                                    </label>
                                    <Card.Text
                                        style={{
                                            fontSize: '40px',
                                            fontWeight: 'bold',
                                            marginTop: '10px',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        {Math.round(
                                            100 -
                                                percentageBWNumbers(
                                                    dashboardStatus?.all_topics_count,
                                                    dashboardStatus?.topics_completed_count
                                                )
                                        ) + '%'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                    <Col style={{ paddingRight: '15px', marginBottom: '20px' }}>
                        <Row>
                            <Card
                                bg="light"
                                text="dark"
                                className="mb-2"
                                style={{ height: '120px', weight: '100px' }}
                            >
                                <Card.Body>
                                    <label htmlFor="teams" className="">
                                        Completed Quiz
                                    </label>
                                    <Card.Text
                                        style={{
                                            fontSize: '48px',
                                            fontWeight: 'bold',
                                            marginTop: '10px',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        {dashboardStatus &&
                                        dashboardStatus?.quiz_completed_count
                                            ? dashboardStatus?.quiz_completed_count
                                            : 0}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row>
                            <Card
                                bg="light"
                                text="dark"
                                className="mb-2"
                                style={{ height: '120px', weight: '100px' }}
                            >
                                <Card.Body>
                                    <label htmlFor="teams" className="">
                                        Earned Badges
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
                                        {dashboardStatus &&
                                        dashboardStatus?.badges_earned_count
                                            ? dashboardStatus?.badges_earned_count
                                            : 0}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col> */}

                    <Col md={6}>
                        <Card
                            bg="white"
                            text="dark"
                            className="mt-5 md-3 xs-12 "
                            style={{ height: '300px' }}
                        >
                            <Card.Body style={{ overflowX: 'auto' }}>
                                {/* <LatestNews usersdata={currentUser?.data} /> */}
                                <LatestScrollNew
                                    usersdata={currentUser?.data}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* <Row
                    className="course-team flex-start mb-5"
                    style={{ gap: '1rem' }}
                >
                    <Col md={12} className="flex-2 team-progress">
                        <label htmlFor="teams" className="">
                            Team Progress:
                        </label>
                        <div
                            className="bg-white team-progress rounded  p-3"
                            style={{ overflowX: 'auto' }}
                        >
                            <div className="row flex-column p-2">
                                <label
                                    htmlFor="teams"
                                    className="mb-3 text-capitalize"
                                >
                                    <span>
                                        {currentUser?.data[0]?.team_name}
                                    </span>
                                </label>
                            </div>
                            <Table
                                bordered
                                pagination={false}
                                dataSource={dashboardTeamProgressStatus}
                                columns={columns}
                            />
                        </div>
                    </Col>
                </Row> */}
            </Container>
        </Layout>
    );
};
export default Dashboard;
