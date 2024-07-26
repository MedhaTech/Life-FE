/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardText } from 'reactstrap';
import { Tabs } from 'antd';
import Layout from '../Layout';
import { BsPlusLg } from 'react-icons/bs';
import { Button } from '../../stories/Button';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    getAdminTeamMembersList,
    studentResetPassword
} from '../../redux/actions';
import axios from 'axios';
import { openNotificationWithIcon, getCurrentUser } from '../../helpers/Utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/media/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useTranslation } from 'react-i18next';
import DoubleBounce from '../../components/Loaders/DoubleBounce';
import Select from '../../Admin/Challenges/pages/Select';
import { Modal } from 'react-bootstrap';
import { encryptGlobal } from '../../constants/encryptDecrypt';
// const { TabPane } = Tabs;

const ViewTeamMember = (props) => {
    // console.log(props.teamsMembersList, 'props');
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const teamID = JSON.parse(localStorage.getItem('teamId'));

    const dispatch = useDispatch();
    const history = useHistory();
    const [button, setButton] = useState('');
    const teamId =
        (history &&
            history.location &&
            history.location.item &&
            history.location.item.team_id) ||
        teamID.team_id;
    const StudentCount =
        (history &&
            history.location &&
            history.location.item &&
            history.location.item.StudentCount) ||
        teamID.StudentCount;
    const mentorId =
        (history && history.location && history.location.mentorid) ||
        teamID.mentorid;
    const [count, setCount] = useState(0);
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-unused-vars
    const [pending, setPending] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [show, setShow] = useState(false);
    const [teamlist, setteamlist] = useState([]);
    const [value, setvalue] = useState('');
    const [teamchangeobj, setteamchangeObj] = useState({});
    const [selectedstudent, setselectedstudent] = useState();
    const [IdeaStatus, setIdeaStatus] = useState('No Idea');
    const [data, setData] = useState('');
    const [showMentorCard, setshowMentorCard] = useState(false);
    useEffect(async () => {
        props.getAdminTeamMembersListAction(teamId);
        ideaStatusfun();
        // here teamId = team id //
    }, [teamId, count]);

    const teamListbymentorid = () => {
        const teamListbymentorparam = encryptGlobal(
            JSON.stringify({
                mentor_id: mentorId
            })
        );

        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/listwithideaStatus?Data=${teamListbymentorparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response, 'response');
                    const teamlistobj = {};
                    const listofteams = response.data.data
                        .map((item) => {
                            if (
                                item.StudentCount < 4 &&
                                item.ideaStatus === null
                            ) {
                                teamlistobj[item.team_name] = item.team_id;
                                return item.team_name;
                            }
                        })
                        .filter(Boolean);
                    if (Object.keys(teamlistobj).length > 0) {
                        let index = listofteams.indexOf(teamID.team_name);

                        if (index >= 0) {
                            listofteams.splice(index, 1);
                        }
                    }

                    setteamlist(listofteams);
                    setteamchangeObj(teamlistobj);
                    setShow(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const ideaStatusfun = () => {
        const ideaStatusparam = encryptGlobal(
            JSON.stringify({
                team_id: teamId
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/ideas/ideastatusbyteamId?Data=${ideaStatusparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setIdeaStatus(response.data.data[0].ideaStatus);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    useEffect(() => {
        mentorsData();
    }, []);
    const mentorsData = () => {
        const mentorsparam = encryptGlobal(
            JSON.stringify({
                team_id: teamId
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/teamMentor?Data=${mentorsparam}`,
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
                    if (response.data.data[0].moc_name !== null) {
                        setshowMentorCard(true);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleDelete = (id) => {
        // here we can delete the team //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'You are attempting to delete Team.',
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Delete',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const paramId = encryptGlobal(JSON.stringify(id));
                    var config = {
                        method: 'delete',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/teams/' +
                            paramId,
                        headers: {
                            'Content-Type': 'application/json',
                            // Accept: "application/json",
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                openNotificationWithIcon(
                                    'success',
                                    'Team Deleted Successfully'
                                );
                                history.push({
                                    pathname: '/mentor/teamlist'
                                });
                            } else {
                                openNotificationWithIcon(
                                    'error',
                                    'Opps! Something Wrong'
                                );
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Team not Deleted',
                        'error'
                    );
                }
            });
    };

    const handleSwitchTeam = (item) => {
        if (props.teamsMembersList.length > 2) {
            teamListbymentorid();
            setselectedstudent(item);
        } else {
            openNotificationWithIcon('error', 'Opps! Something Wrong');
        }
    };
    const handleChangeStudent = (name) => {
        const body = {
            team_id: teamchangeobj[name].toString(),
            student_full_name: selectedstudent.student_full_name
        };
        const stuparamId = encryptGlobal(
            JSON.stringify(selectedstudent.student_id)
        );
        var config = {
            method: 'PUT',
            url: process.env.REACT_APP_API_BASE_URL + '/students/' + stuparamId,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setvalue('');
                    openNotificationWithIcon(
                        'success',
                        t('student team switch success')
                    );
                    history.push({
                        pathname: '/mentor/teamlist'
                    });
                } else {
                    openNotificationWithIcon('error', 'Opps! Something Wrong');
                }
            })

            .catch(function (error) {
                console.log(error);
                if (error.message === 'Request failed with status code 400') {
                    openNotificationWithIcon(
                        'error',
                        'Same Name student already existed in seleted team'
                    );
                }
            });
        setShow(false);
    };

    const handleResetPassword = (data) => {
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
                            user_id: data.user_id.toString()
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

    var adminTeamMembersList = {
        data: props.teamsMembersList.length > 0 && props.teamsMembersList,
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                width: '6rem'
            },
            {
                name: 'User Id',
                selector: (row) => row.user.username,
                // width: '35rem',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.user.username}
                    </div>
                )
            },
            {
                name: 'Password',
                selector: (row) => row.mobile,
                // width: '15rem'
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.mobile}
                    </div>
                )
            },
            {
                name: t('teacher_teams.student_name'),
                selector: (row) => row.student_full_name,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.student_full_name}
                    </div>
                )
                // width: '16rem'
            },

            {
                name: 'Course',
                selector: (row) => row.course_name,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.course_name}
                    </div>
                )
                // width: '12rem'
            },
            {
                name: 'Year of Study',
                selector: (row) => row.year_of_study,
                width: '15rem'
            },
            {
                name: 'Email Id',
                selector: (row) => row.email,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.email}
                    </div>
                ),
                width: '15rem'
                // selector: (row) => row.email,
            },
            {
                name: 'Mobile',
                selector: (row) => row.mobile,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.mobile}
                    </div>
                )
            },
            {
                name: 'Date of Birth',
                // selector: (row) => row.date_of_birth,
                selector: (row) => row.date_of_birth,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.date_of_birth}
                    </div>
                )
            },
            {
                name: t('teacher_teams.age'),
                selector: (row) => row.Age,
                width: '7rem'
            },

            {
                name: t('teacher_teams.gender'),
                selector: (row) => row.Gender,
                width: '10rem'
            },
            {
                name: t('teacher_teams.actions'),
                cell: (params) => {
                    return [
                        <a onClick={() => handleEditTeamMember(params)}>
                            <i
                                key={params.team_id}
                                className="fa fa-edit"
                                style={{ marginRight: '10px' }}
                            />
                        </a>,

                        <a onClick={() => handleDeleteTeamMember(params)}>
                            {props.teamsMembersList &&
                                props.teamsMembersList.length > 3 &&
                                IdeaStatus === 'No Idea' && (
                                    <i
                                        key={params.team_id}
                                        className="fa fa-trash"
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                        </a>,
                        <a onClick={() => handleResetPassword(params)}>
                            <i key={params.team_id} className="fa fa-key" />
                        </a>,
                        props.teamsMembersList.length > 3 &&
                            IdeaStatus === 'No Idea' && ( // <-- Updated condition
                                <a onClick={() => handleSwitchTeam(params)}>
                                    <i
                                        key={params.team_id}
                                        className="fa fa-user-circle"
                                        style={{ paddingLeft: '10px' }}
                                    />
                                </a>
                            )
                    ];
                },
                width: '12rem',
                center: true
            }
        ]
    };
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(adminTeamMembersList.data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const handleEditTeamMember = (item) => {
        // here we can edit team member details //
        // here item = student_id //
        history.push({
            pathname: '/mentor/edit-team-member',
            item: item
        });
    };

    const handleDeleteTeamMember = (item) => {
        // here we can delete the team member details //
        // here item = student_id //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: t('teacher_teams.delete_member_warning'),
                text: t('teacher_teams.sure'),
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: t('teacher_teams.delete'),
                showCancelButton: true,
                cancelButtonText: t('general_req.btn_cancel'),
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const delparamId = encryptGlobal(
                        JSON.stringify(item.student_id)
                    );
                    var config = {
                        method: 'delete',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/students/' +
                            delparamId,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                setCount(count + 1);
                                openNotificationWithIcon(
                                    'success',
                                    t('teacher_teams.delete_success')
                                );
                                history.push({
                                    pathname: '/mentor/teamlist'
                                });
                            } else {
                                openNotificationWithIcon(
                                    'error',
                                    'Opps! Something Wrong'
                                );
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        t('teacher_teams.delete_cancelled'),
                        t('teacher_teams.delete_member_cancel'),
                        'error'
                    );
                }
            });
    };
    const handleEdit = () => {
        // alert('hii');
        history.push({
            pathname: '/mentor/edit',
            item: {
                moc_name: data?.moc_name,
                moc_gender: data?.moc_gender,
                moc_email: data?.moc_email,
                moc_phone: data?.moc_phone,
                team_name: data?.team_name,
                team_id: data?.team_id
            }
        });
    };
    const handleAdd = () => {
        // alert('hii');
        history.push({
            pathname: '/mentor/add',
            item: {
                // moc_name: data?.moc_name,
                // moc_gender: data?.moc_gender,
                // moc_email: data?.moc_email,
                // moc_phone: data?.moc_phone,
                team_name: data?.team_name,
                team_id: data?.team_id
            }
        });
    };
    return (
        <Layout title="Teams">
            <Container className="ticket-page mt-5 mb-50 userlist">
                <Row className="pt-5">
                    {/* <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0"> */}
                    <Col className="col-auto">
                        <h3>
                            {' '}
                            <span
                                required
                                className="p-1"
                                style={{ color: 'blue' }}
                            >
                                {data?.team_name ? data?.team_name : '-'}{' '}
                            </span>
                            Team Members Details
                        </h3>
                    </Col>

                    {/* <Col className="ticket-btn col ml-auto ">
                            {button !== null ? (
                                <div className="d-flex justify-content-end">
                                    <Button
                                        label="Edit Mentor Details"
                                        btnClass="primary ml-2 m-5"
                                        size="small"
                                        shape="btn-square"
                                        Icon={BsPlusLg}
                                        onClick={handleEdit}
                                    />
                                </div>
                            ) : (
                                <div className="d-flex justify-content-end">
                                    <Button
                                        label="Add  Mentor Details"
                                        btnClass="primary ml-2 m-5"
                                        size="small"
                                        shape="btn-square"
                                        Icon={BsPlusLg}
                                        onClick={
                                            handleAdd
                                            // () =>
                                            // history.push('/mentor/add')
                                        }
                                    />
                                </div>
                            )}
                        </Col> */}
                    <Col className="ticket-btn col ml-auto ">
                        <div className="d-flex justify-content-end">
                            <Button
                                label={t('teacher_teams.back')}
                                btnClass="primary ml-2 m-5"
                                size="small"
                                shape="btn-square"
                                Icon={BsPlusLg}
                                onClick={() => history.push('/mentor/teamlist')}
                            />
                            {/* </div> */}
                            {/* <div className="d-flex justify-content-end"> */}
                        </div>
                    </Col>
                    {/* {showMentorCard && (
                            <Col md={12}>
                                {/* {button( */}
                    {/* <Card className="w-100  mb-5 p-4">
                                    <CardBody>
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
                                                                        Mentor
                                                                        Name
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
                                                                    <b>
                                                                        Gender
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
                                                                    <b>
                                                                        Mobile
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
                                </Card> */}
                    {/* )} */}
                    {/* </Col> */}
                    {/* )} */}
                    {/* </Row> */}
                    <div
                        className="ticket-data"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        <Tabs defaultActiveKey="1">
                            {props.teamsMembersList &&
                            !props.teamsMembersList.length > 0 ? (
                                <DoubleBounce />
                            ) : (
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...adminTeamMembersList}
                                    >
                                        <DataTable
                                            data={rows}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            )}
                        </Tabs>
                    </div>
                    {StudentCount <= 3 && IdeaStatus === 'No Idea' && (
                        <div className="p-5">
                            <Button
                                label={t('teacher_teams.delete')}
                                btnClass="primary ml-2"
                                size="small"
                                shape="btn-square"
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: 'red'
                                }}
                                Icon={BsPlusLg}
                                onClick={() => handleDelete(teamId)}
                            />
                        </div>
                    )}
                </Row>
            </Container>
            {show && (
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    //{...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="assign-evaluator ChangePSWModal teacher-register-modal"
                    backdrop="static"
                    scrollable={true}
                >
                    <Modal.Header closeButton onHide={() => setShow(false)}>
                        <Modal.Title
                            id="contained-modal-title-vcenter"
                            className="w-100 d-block text-center"
                        >
                            Teams Change
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="my-3 text-center w-50%">
                            <h3 className="mb-sm-4 mb-3">
                                Please select Team to switch student
                            </h3>
                            <Select
                                list={teamlist}
                                setValue={setvalue}
                                placeHolder={'Please Select team'}
                                value={value}
                            />
                        </div>

                        <div className="text-center">
                            <Button
                                label={'Submit'}
                                btnClass={!value ? 'default' : 'primary'}
                                size="small "
                                onClick={() => handleChangeStudent(value)}
                                disabled={!value}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </Layout>
    );
};

const mapStateToProps = ({ teams }) => {
    const { teamsMembersList } = teams;
    return { teamsMembersList };
};

export default connect(mapStateToProps, {
    getAdminTeamMembersListAction: getAdminTeamMembersList
})(ViewTeamMember);
