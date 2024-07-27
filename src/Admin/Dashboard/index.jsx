/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Descriptions, Input } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { Col, Row } from 'reactstrap';
import { Button } from '../../stories/Button';
import Layout from '../Layout';
import {
    deleteTempMentorById,
    teacherResetPassword
} from '../store/admin/actions';
import { Col, Container, Row, CardBody, CardText } from 'reactstrap';
import './dashboard.scss';
import { useHistory } from 'react-router-dom';
import jsPDF from 'jspdf';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { URL, KEY } from '../../constants/defaultValues';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/media/logout.svg';
import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { useSelector } from 'react-redux';
import Select from '../../Admin/Reports/Helpers/Select';

import {
    getCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';
import { Card } from 'react-bootstrap';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../redux/studentRegistration/actions';
const Dashboard = () => {
    // here we can see the registration details //
    const history = useHistory();
    const dispatch = useDispatch();
    const pdfRef = React.useRef(null);
    const inputField = {
        type: 'text',
        className: 'defaultInput'
    };
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');

    const currentUser = getCurrentUser('current_user');
    const [diesCode, setDiesCode] = useState('');
    const [orgData, setOrgData] = useState({});
    const [mentorId, setMentorId] = useState('');
    const [SRows, setSRows] = React.useState([]);
    const [mentorTeam, setMentorTeam] = useState([]);
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');
    const [multiOrgData, setMultiOrgData] = useState({});
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    useEffect(() => {
        dispatch(getFetchDistData());
    }, []);
    // const teacherId = mentorTeam[0]?.team_id;
    const [isideadisable, setIsideadisable] = useState(false);
    const handleOnChange = (e) => {
        // we can give diescode as input //
        //where organization_code = diescode //
        localStorage.removeItem('institution_code');
        setCount(0);
        setDiesCode(e.target.value);
        setOrgData({});
        setError('');
    };
    useEffect(async () => {
        // where list = diescode //
        //where organization_code = diescode //
        const list = JSON.parse(localStorage.getItem('institution_code'));
        setDiesCode(list);
        await apiCall(list);
    }, []);
    async function apiCall(list) {
        // Dice code list API //
        // where list = diescode //
        const body = JSON.stringify({
            institution_code: list
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

        await axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    setOrgData(response?.data?.data);
                    // console.log(orgData);
                    setCount(count + 1);
                    // setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    setError('');
                    // setMultiOrgData(response?.data?.data);
                    // setOrgData(response?.data?.data[0]);
                    // setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    // // console.log(orgData);
                    // // setCount(count + 1);
                    // setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    // setError('');

                    // if (response?.data?.data[0]?.mentor.mentor_id) {
                    //     await getMentorIdApi(
                    //         response?.data?.data[0]?.mentor.mentor_id
                    //     );
                    // }
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 404) {
                    setError('Entered Invalid Institution Unique Code');
                }
                setOrgData({});
            });
    }

    const handleSearch = (e) => {
        //where we can search through diescode //
        // we can see Registration Details & Mentor Details //

        const body = JSON.stringify({
            institution_code: diesCode
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
            .then(async function (response) {
                if (response.status == 200) {
                    if (response.status == 200) {
                        setMultiOrgData(response?.data?.data);
                        setCount(count + 1);
                    }
                    if (response?.data?.count === 0) {
                        setError('Entered Invalid Institution Unique Code');
                    }
                    // setMultiOrgData(response?.data?.data);
                    // setOrgData(response?.data?.data[0]);
                    // setMentorId(response?.data?.data[0]?.mentor.mentor_id);

                    // setCount(count + 1);
                    // setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    // setError('');
                    // if (response?.data?.data[0]?.mentor.mentor_id) {
                    //     await getMentorIdApi(
                    //         response?.data?.data[0]?.mentor.mentor_id
                    //     );
                    // }
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 404) {
                    setError('Entered Invalid Institution Unique Code');
                }
                setOrgData({});
            });
        e.preventDefault();
    };

    const handleEdit = () => {
        //  here  We can edit the Registration details //
        // Where data = orgData //
        history.push({
            pathname: '/admin/MentorEdit',
            data: {
                mentor_name: orgData.mentor?.mentor_name,
                mentor_mobile: orgData.mentor?.mentor_mobile,
                mentor_whatapp_mobile: orgData.mentor?.mentor_whatapp_mobile,
                mentor_id: orgData.mentor?.mentor_id,
                where: 'Dashbord',
                mentor_title: orgData.mentor?.mentor_title,
                username: orgData.mentor?.mentor_mobile,
                date_of_birth: orgData.mentor?.date_of_birth,
                mentor_email: orgData.mentor?.mentor_email,
                gender: orgData.mentor.gender,
                institution_code: orgData.institution_code
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
                            // organization_code: data.organization_code,
                            username: orgData.mentor.mentor_mobile,
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
            pathname: '/admin/View-More-details',
            data: orgData
        });
        localStorage.setItem('orgData', JSON.stringify(orgData));
        // localStorage.setItem('teacherId', JSON.stringify(teacherId));
    };
    useEffect(() => {
        const popParam = encryptGlobal('2');
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
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data.data[0]?.on_off === '1') {
                        setIsideadisable(true);
                    } else {
                        setIsideadisable(false);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
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
            // {
            //     name: 'Mobile No',
            //     selector: (row) => row?.mentor?.mentor_mobile,
            //     center: true
            // },
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
    const MentorsData = {
        data: mentorTeam,
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                width: '12%'
            },
            {
                name: 'Team Name',
                selector: (row) => row.team_name,
                sortable: true,
                center: true,
                width: '25%'
            },
            {
                name: 'Student Count',
                selector: (row) => row.student_count,
                center: true,
                width: '20%'
            },
            {
                name: 'Idea Sub Status',
                selector: (row) => row.ideaStatus,
                center: true,
                width: '25%'
            },
            {
                name: 'Mentor Approval',
                selector: (row) =>
                    row.PFAStatus === null
                        ? ''
                        : row.PFAStatus === 'Pending'
                        ? 'PENDING'
                        : 'APPROVED',
                center: true,
                width: '20%'
            }
            //     name: 'Actions',
            //     cell: (params) => {
            //         return [
            //             <>
            //                 {params.ideaStatus == 'SUBMITTED' && params.evaluation_status === null && (
            //                     <Button
            //                         key={params}
            //                         className={
            //                             isideadisable
            //                                 ? `btn btn-success btn-lg mr-5 mx-2`
            //                                 : `btn btn-lg mr-5 mx-2`
            //                         }
            //                         label={'REVOKE'}
            //                         size="small"
            //                         shape="btn-square"
            //                         onClick={() =>
            //                             handleRevoke(
            //                                 params.challenge_response_id,
            //                                 params.ideaStatus
            //                             )
            //                         }
            //                         disabled={!isideadisable}
            //                     />
            //                 )}
            //             </>
            //         ];
            //     },
            //     width: '20%',
            //     center: true
            // }
        ]
    };
    const handleRevoke = async (id, type) => {
        const idParam = encryptGlobal(JSON.stringify(id));
        // where id = challenge response id //
        // here we  can see the Revoke button when ever idea is submitted //
        // where type = ideaStatus //
        let submitData = {
            status: type == 'DRAFT' ? 'SUBMITTED' : 'DRAFT'
        };
        var config = {
            method: 'put',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/challenge_response/updateEntry/' +
                idParam,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: submitData
        };
        axios(config)
            .then(async function (response) {
                if (response.status === 200) {
                    openNotificationWithIcon(
                        'success',
                        'Idea Submission Status Successfully Update!',
                        ''
                    );
                    await getMentorIdApi(mentorId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

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
                title: 'You are Delete Organization',
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
        adminTeamsCount();
        adminSudentCount();
        adminideasCount();
        adminMentorCount();
        adminSudentbygenderCount();
        adminSchoolCount();
        regInstitutions();
        adminInvalidInst();
        // adminmentorCourseCount();
        // adminStudentCourseCount();
        // nonAtlCount();
    }, []);

    const [totalteamsCount, setTotalteamsCount] = useState('-');
    const [totalStudentCount, setTotalStudentCount] = useState('-');
    const [totalideasCount, setTotalideasCount] = useState('-');
    const [totalPfa, setTotalPfa] = useState('-');

    const [totalSubmittedideasCount, setTotalSubmittedideasCount] =
        useState('-');
    const [totalMentorCount, setTotalMentorCount] = useState('-');
    const [totalMentorMaleCount, setTotalMentorMaleCount] = useState('-');
    const [totalStudentMaleCount, setTotalStudentMaleCount] = useState('-');
    const [totalStudentFemaleCount, setTotalStudentFemaleCount] = useState('-');
    const [totalSchoolCount, setTotalSchoolCount] = useState('-');
    const [invalidInst, setInvalidInst] = useState('-');
    // const [nonAtl, setNonAtl] = useState('-');
    const [regInst, setRegInst] = useState('-');
    const [atl, setAtl] = useState('-');
    const [mentorCoursesCompletedCount, setMentorCoursesCompletedCount] =
        useState('-');
    const [studentCoursesCompletedCount, setStudentCoursesCompletedCount] =
        useState('-');
    const [totalstudentCoursesCount, setTotalstudentCoursesCount] =
        useState('-');

    const regInstitutions = () => {
        const listParam = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/schoolRegCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${listParam}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response, 'Reg');
                    setRegInst(response.data.data[0].RegSchools);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminTeamsCount = () => {
        const adminTeam = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/teamCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${adminTeam}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalteamsCount(response.data.data[0].teams_count);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminSudentCount = () => {
        const stu = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/studentCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${stu}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalStudentCount(response.data.data[0].student_count);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminideasCount = () => {
        const idea = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/ideasCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${idea}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalideasCount(response.data.data[0].initiated_ideas);
                    setTotalPfa(response.data.data[0].PFACount);
                    setTotalSubmittedideasCount(
                        response.data.data[0].submitted_ideas
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminMentorCount = () => {
        const ment = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/mentorCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${ment}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalMentorCount(response.data.data[0].mentorCount);
                    setTotalMentorMaleCount(response.data.data[0].mentorMale);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminSudentbygenderCount = () => {
        const stuG = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/studentCountbygender${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${stuG}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalStudentMaleCount(response.data.data[0].studentMale);
                    setTotalStudentFemaleCount(
                        response.data.data[0].studentFemale
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminSchoolCount = () => {
        const school = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/schoolCount${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${school}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTotalSchoolCount(response.data.data[0].schoolCount);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const adminInvalidInst = () => {
        const invalid = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/invalidInst${
                    RegTeachersdistrict === 'All Districts'
                        ? ''
                        : `?Data=${invalid}`
                }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response, 'invalid');
                    setInvalidInst(response.data.data[0].InvalidInstitutions);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const [districtName, setDistrictName] = useState('TAMIL NADU STATE');
    const getDetails = () => {
        if (!RegTeachersdistrict) {
            openNotificationWithIcon('error', 'Please select district', '');
            return;
        }
        const dist =
            RegTeachersdistrict === 'All Districts'
                ? 'TAMIL NADU STATE'
                : RegTeachersdistrict || 'TAMIL NADU STATE';
        setDistrictName(dist);
        // console.log(RegTeachersdistrict, 'ee');

        adminTeamsCount(RegTeachersdistrict);
        adminSudentCount(RegTeachersdistrict);
        adminideasCount(RegTeachersdistrict);
        adminMentorCount(RegTeachersdistrict);
        adminSudentbygenderCount(RegTeachersdistrict);
        adminSchoolCount(RegTeachersdistrict);
        regInstitutions(RegTeachersdistrict);
        adminInvalidInst(RegTeachersdistrict);
        return dist;
    };

    // const dist =
    //     RegTeachersdistrict === 'All Districts'
    //         ? 'TAMIL NADU STATE'
    //         : RegTeachersdistrict;
    // const dist =
    //     RegTeachersdistrict === 'All Districts'
    //         ? 'TAMIL NADU STATE'
    //         : RegTeachersdistrict || 'TAMIL NADU STATE';

    // const adminStudentCourseCount = () => {
    //     var config = {
    //         method: 'get',
    //         url:
    //             process.env.REACT_APP_API_BASE_URL +
    //             `/dashboard/studentCourseCount`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setStudentCoursesCompletedCount(
    //                     response.data.data[0].StudentCoursesCompletedCount
    //                 );
    //                 setTotalstudentCoursesCount(response.data.data[0].started);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };
    return (
        <Layout title="Dashboard">
            <div className="dashboard-wrapper pb-5 my-5 px-5">
                {/* <h2 className="mb-5">Dashboard </h2> */}
                <Row className="align-items-center m-5">
                    <Col md={2}>
                        <div className="justify-content-center">
                            <Select
                                list={fiterDistData}
                                setValue={setRegTeachersdistrict}
                                placeHolder={'Select District'}
                                value={RegTeachersdistrict}
                            />
                        </div>
                    </Col>

                    <Col
                        md={2}
                        className="align-items-center justify-content-center"
                    >
                        <Button
                            label={'Get Details'}
                            onClick={getDetails}
                            btnClass="primary mx-3"
                            size="small"
                            shape="btn-square"
                            type="submit"
                        />
                    </Col>
                </Row>
                <div className="dashboard p-5 mb-5">
                    <div className="row " style={{ overflow: 'hidden' }}>
                        <div className=" row col-xs-12 col-md-7">
                            <h2 className="text-left">
                                {/* {dist} / SPECIFIC DISTRICT NAME OVERALL Ideas4Life STATS{' '} */}
                                <span>
                                     Ideas4Life Stats
                                </span>
                            </h2>
                            <Row
                                style={{
                                    paddingRight: '20px',
                                    paddingTop: '1rem',
                                    paddingLeft: '1rem'
                                }}
                            >
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px',
                                            width: '300px'
                                        }}
                                    >
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '5px'
                                                }}
                                            >
                                                {totalSchoolCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center p-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Total <br /> Institutions
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{ height: '150px' }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Registered Students
                                            </label>
                                            <Card.Text
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '15px'
                                                }}
                                            >
                                                {totalMentorCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center p-3"
                                            >
                                                Registered Mentors
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {regInst}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Reg <br /> Institutions
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Teams Submitted Ideas
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalSubmittedideasCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '15px'
                                                }}
                                            >
                                                {totalteamsCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center  mt-5 "
                                                // style={{ textAlign: 'center' }}
                                            >
                                                No.of Teams
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {invalidInst}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Invalid <br />
                                                Institutions
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* <Row>
                                    <Card
                                        bg="light"
                                        text="dark"
                                        className="mb-4"
                                        style={{ height: '150px' }}
                                    >
                                        <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Teachers Course Completed
                                            </label>
                                            <Card.Text
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {mentorCoursesCompletedCount}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Row> */}
                            </Row>
                            <Row
                                style={{
                                    paddingRight: '20px',
                                    paddingTop: '1rem'
                                }}
                            >
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px',
                                            width: '300px'
                                        }}
                                    >
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '15px'
                                                }}
                                            >
                                                {totalMentorCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center p-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Registered <br /> Mentors
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Teams Ideas In Draft
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalideasCount -
                                                    totalSubmittedideasCount -
                                                    totalPfa}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                            >
                                                Registered Students
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '20px',
                                                    textAlign: 'center',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                {totalMentorMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Male <br /> Mentors
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{ height: '150px' }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Teams
                                            </label>
                                            <Card.Text
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalteamsCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorCount -
                                                    totalMentorMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Female <br /> Mentors
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            {/* <Col
                                style={{
                                    paddingRight: '20px',
                                    paddingTop: '1rem'
                                }}
                            > */}

                            {/* <Row>
                                    <Card
                                        bg="light"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Students course completed
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {studentCoursesCompletedCount}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Row> */}
                            {/* <Row>
                                    <Card
                                        bg="light"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Students course in progress
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalstudentCoursesCount -
                                                    studentCoursesCompletedCount}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Row> */}
                            {/* <Row>
                                    <Card
                                        bg="light"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Students Course not started
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentCount -
                                                    totalstudentCoursesCount}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Row> */}
                            {/* </Col> */}
                            <Row
                                style={{
                                    paddingRight: '20px',
                                    paddingTop: '1rem',
                                    paddingLeft: '1rem'
                                    // height: '150px'
                                }}
                            >
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{ height: '150px' }}
                                    >
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '15px'
                                                }}
                                            >
                                                {totalteamsCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                                // style={{ textAlign: 'center' }}
                                            >
                                                No.of <br /> Teams
                                            </label>
                                        </Card.Body>
                                        {/* <Card.Body>
                                            <Card.Text
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {invalidInst}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                            >
                                                Invalid Institutions
                                            </label>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Registered Mentors
                                            </label>
                                            <Card.Text
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Ideas Pending For Approval
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalPfa}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                            >
                                                Male Mentors
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Registered <br /> Students
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Female Mentors
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorCount -
                                                    totalMentorMaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Male <br /> Students
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Female Students
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentFemaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalSubmittedideasCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3 pb-2"
                                            >
                                                Submitted Ideas Count
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '20px',
                                                    textAlign: 'center',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                {totalStudentFemaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Female <br /> Students
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row
                                style={{
                                    paddingRight: '20px',
                                    paddingTop: '1rem',
                                    paddingLeft: '1rem'
                                    // height: '150px'
                                }}
                            >
                                {/* <Row>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{ height: '150px' }}
                                    > */}
                                {/* <Card.Body>
                                            <Card.Text
                                                style={{
                                                    fontSize: '50px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {invalidInst}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-5 pb-2"
                                            >
                                                Invalid Institutions
                                            </label>
                                        </Card.Body> */}
                                {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Registered Mentors
                                            </label>
                                            <Card.Text
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                {/* </Card> */}
                                {/* </Row> */}
                                {/* <Row> */}
                                {/* <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    > */}
                                {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Ideas Pending For Approval
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalPfa}
                                            </Card.Text>
                                        </Card.Body> */}
                                {/* <Card.Body>
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '50px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-5 pb-2"
                                            >
                                                Male Mentors
                                            </label>
                                        </Card.Body> */}
                                {/* </Card> */}
                                {/* </Row> */}

                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Male Mentors
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorMaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '15px'
                                                }}
                                            >
                                                {totalideasCount -
                                                    totalSubmittedideasCount -
                                                    totalPfa}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3 "
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                In Draft Ideas <br />
                                                Count
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Male Students
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentMaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '15px',
                                                    textAlign: 'center',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                {totalPfa}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-2 pb-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Pending for Approval
                                                <br /> Ideas Count
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Female Mentors
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalMentorCount -
                                                    totalMentorMaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '50px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentMaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-5 pb-2"
                                            >
                                                Male Students
                                            </label>
                                        </Card.Body> */}
                                        {/* <Card.Body>
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '35px',
                                                    fontWeight: 'bold',
                                                    marginTop: '75px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentFemaleCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                            >
                                                Female Students
                                            </label>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '25px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalSubmittedideasCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3 pb-2"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Submitted Ideas <br /> Count
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px'
                                        }}
                                    >
                                        {/* <Card.Body>
                                            <label htmlFor="teams" className="">
                                                Total Female Students
                                            </label>

                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '10px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalStudentFemaleCount}
                                            </Card.Text>
                                        </Card.Body> */}
                                        <Card.Body
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Card.Text
                                                className="left-aligned"
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    marginTop: '20px',
                                                    textAlign: 'center',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                {totalteamsCount -
                                                    totalideasCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3 "
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Not Initiated <br />
                                                Ideas Count
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* <div>
                                <Card bg="light" text="dark" className="mb-4">
                                    <Card.Body>
                                        <Row style={{ marginRight: '3rem' }}>
                                            <Col md={3} style={{}}>
                                                <label htmlFor="teams">
                                                    Total Male Teachers
                                                </label>
                                                <Card.Text
                                                    className="left-aligned"
                                                    style={{
                                                        fontSize: '30px',
                                                        fontWeight: 'bold',
                                                        marginTop: '10px',
                                                        marginBottom: '20px'
                                                    }}
                                                >
                                                    {totalMentorMaleCount}
                                                </Card.Text>
                                            </Col>
                                            <Col md={3}>
                                                <label htmlFor="teams">
                                                    Total Female Teachers
                                                </label>
                                                <Card.Text
                                                    className="left-aligned"
                                                    style={{
                                                        fontSize: '30px',
                                                        fontWeight: 'bold',
                                                        marginTop: '10px',
                                                        marginBottom: '20px'
                                                    }}
                                                >
                                                    {totalMentorCount -
                                                        totalMentorMaleCount}
                                                </Card.Text>
                                            </Col>

                                            <Col md={3}>
                                                <label htmlFor="teams">
                                                    Total Male Students
                                                </label>
                                                <Card.Text
                                                    className="left-aligned"
                                                    style={{
                                                        fontSize: '30px',
                                                        fontWeight: 'bold',
                                                        marginTop: '10px',
                                                        marginBottom: '20px'
                                                    }}
                                                >
                                                    {totalStudentMaleCount}
                                                </Card.Text>
                                            </Col>
                                            <Col md={3}>
                                                <label htmlFor="teams">
                                                    Total Female Students
                                                </label>
                                                <Card.Text
                                                    className="left-aligned"
                                                    style={{
                                                        fontSize: '30px',
                                                        fontWeight: 'bold',
                                                        marginTop: '10px',
                                                        marginBottom: '20px'
                                                    }}
                                                >
                                                    {totalStudentFemaleCount}
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </div> */}
                            {/* <div style={{ flex: 1 }} className="col-lg-12">
                            Data__
                        </div> */}
                        </div>
                        <div
                            className=" row  col-xs-12 col-md-5 "
                            style={{ marginTop: '46px' }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}
                                className="bg-white rounded px-5 py-3 col-lg-12 disc-card-search col-12"
                            >
                                <h2 className="mt-3">
                                    Search Registration Details
                                </h2>
                                <Row className="text-center justify-content-md-center my-4">
                                    <Col md={9} lg={12}>
                                        <Row>
                                            <Col md={9} className="my-auto">
                                                <Input
                                                    {...inputField}
                                                    id="organization_code"
                                                    onChange={(e) =>
                                                        handleOnChange(e)
                                                    }
                                                    value={diesCode}
                                                    name="organization_code"
                                                    placeholder="Enter Institution Unique Code"
                                                    className="w-100 mb-3 mb-md-0"
                                                    style={{
                                                        borderRadius: '60px',
                                                        padding: '9px 11px'
                                                    }}
                                                />
                                            </Col>
                                            <Col md={3} className="partner-btn">
                                                <Button
                                                    label={'Search'}
                                                    btnClass="primary tex-center my-0 py-0 mx-3 px-3"
                                                    style={{
                                                        fontSize: '15px',
                                                        height: '35px'
                                                    }}
                                                    size="small"
                                                    onClick={(e) =>
                                                        handleSearch(e)
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <Row className="md-4"> */}
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
                                orgData?.mentor !== null ? (
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
                                                    {/* <Row className="pt-3 pb-3">
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
                                                    </Row>{' '} */}
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
                                                                        .mentor_title
                                                                }{' '}
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
                                                            orgData.mentor
                                                                .mentor_mobile
                                                        // organization_code:
                                                        //     orgData.organization_code
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

                                            <button
                                                onClick={viewDetails}
                                                className="btn btn-success rounded-pill px-4 mt-2 mt-md-0 ml-md-2"
                                            >
                                                View Details
                                            </button>

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
                                                    <h2 className="text-center mt-3 text-primary">
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
                                ) : (
                                    multiOrgData[0]?.mentor === null && (
                                        // <Card className="mt-3 p-4">
                                        <div className="text-success fs-highlight d-flex justify-content-center align-items-center">
                                            <span>
                                                Still No Teacher Registered
                                            </span>
                                        </div>
                                    )
                                    // ) : (
                                    // count != 0 && (
                                    //     <div className="text-success fs-highlight d-flex justify-content-center align-items-center">
                                    //         <span>
                                    //             Still No Teacher Registered
                                    //         </span>
                                    //     </div>
                                    // )
                                    // )
                                )}
                                {error && diesCode && (
                                    <div className="text-danger mt-3 p-4 fs-highlight d-flex justify-content-center align-items-center">
                                        <span>{error}</span>
                                    </div>
                                )}
                                {!diesCode && (
                                    <div className="d-flex  mt-3 p-4 justify-content-center align-items-center">
                                        <span className="text-primary fs-highlight">
                                            Enter Institution Unique Code
                                        </span>
                                    </div>
                                )}
                                {/* </Row> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
//export default Dashboard;
