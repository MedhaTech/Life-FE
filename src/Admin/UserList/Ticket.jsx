/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { Tabs } from 'antd';
import Layout from '../../Admin/Layout';
import { BsUpload } from 'react-icons/bs';
import { Button } from '../../stories/Button';
import { connect } from 'react-redux';
import {
    getAdmin,
    getAdminEvalutorsList,
    getAdminMentorsList,
    getAdminMentorsListSuccess,
    updateMentorStatus
} from '../../redux/actions';
import axios from 'axios';
import { URL, KEY } from '../../constants/defaultValues.js';

import { getNormalHeaders } from '../../helpers/Utils';
import { useHistory } from 'react-router-dom';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/media/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import {
    getDistrictData,
    getStateData,
    getStudentListSuccess,
    getStudentRegistationData,
    updateStudentStatus
} from '../../redux/studentRegistration/actions';
import { Badge } from 'react-bootstrap';
import CommonPage from '../../components/CommonPage';
import { updateEvaluator } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import Register from '../../Evaluator/Register';
import dist from 'react-data-table-component-extensions';
import AddADmins from './AddAdmins';
import ClipLoader from 'react-spinners/ClipLoader';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList } from '../../RegPage/OrgData.js';
const { TabPane } = Tabs;

const SelectDists = ({
    // stateList,
    getDistrictsListAction,
    getStateDataListAction,
    dists,
    tab,
    setDist,
    newDist,
    drop
}) => {
    const [loading, setLoading] = useState(false);
    // console.log(stateList, 'id');
    // useEffect(() => {
    //     if (tab && (tab == 1 || tab == 2)) getDistrictsListAction();
    // }, [tab]);
    // console.log();
    const handleDists = (e) => {
        // console.log(e,"e");
        // setNewDist(e.target.value);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        setDist(e.target.value);
        localStorage.setItem('dist', e.target.value);
    };
        // console.log(dist,"e");

    return (
        <select
            onChange={handleDists}
            name="districts"
            id="districts"
            value={newDist}
            className="text-capitalize"
        >
            <option value="">Select State</option>

            {stateList && stateList.length > 0 ? (
                stateList.map((item, i) => (
                    <option key={i} value={item}>
                        {item}
                    </option>
                ))
            ) : (
                <option value="">There are no District</option>
            )}
        </select>
    );
};
const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const district = localStorage.getItem('dist');
    const [menter, activeMenter] = useState(false);
    const [loading, setLoading] = useState(false);

    const [evaluater, activeEvaluater] = useState(false);
    const [tab, setTab] = useState('1');
    const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
    const [newDist, setNewDists] = useState('');
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    let State = localStorage.getItem('state');

    useEffect(() => {
        if (tab === 3) {
            props.getEvaluatorListAction();
        } else if (tab === 4) {
            props.getAdminListAction();
        }
    }, [tab]);

    useEffect(() => {
        if (Number(tab) === 1 && studentDist !== '') {
            setLoading(true);
            props.getStudentListAction(studentDist);
            // const timeout = setTimeout(() => {
            //     // setLoading(false);
            // }, 2000);
        }
    }, [tab, studentDist]);
    useEffect(() => {
        if (Number(tab) === 2 && mentorDist !== '') {
            setLoading(true);
            props.getAdminMentorsListAction('All', mentorDist);
            // const timeout = setTimeout(() => {
            //     // setLoading(false);
            //     // props.getStudentListAction(mentorDist);
            // }, 2000);
        }
    }, [tab, mentorDist]);
    useEffect(() => {
        return () => {
            localStorage.removeItem('dist');
        };
    }, []);
    const [rows, setRows] = React.useState([]);
    const [mentorRows, setMentorRows] = React.useState([]);

    useEffect(() => {
        setLoading(true);
        const mentorTimeout = setTimeout(() => {
            // setLoading(false);
            setMentorRows(TableMentorsProps.data);
        }, 2000);
        return () => clearTimeout(mentorTimeout);
    }, []);
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            // setLoading(false);
            setRows(StudentsData.data);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        if (props.mentorsList.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [props.mentorsList]);
    useEffect(() => {
        if (props.studentList.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [props.studentList]);
    const changeTab = (e) => {
        // here we can see 4 tabs //
        // here e = students / teachers / evaluators / admins //
        setmentorDist('');
        setNewDists('');
        setstudentDist('');
        localStorage.setItem('tab', e);
        if (e === '4') {
            activeMenter(false);
            activeEvaluater(false);
            props.getAdminListAction();
        } else if (e === '3') {
            activeEvaluater(!evaluater);
            props.getEvaluatorListAction();
            activeMenter(false);

            activeEvaluater(true);
        } else if (e === '2') {
            dispatch(getAdminMentorsListSuccess([], 0));
            activeMenter(!menter);

            activeEvaluater(false);
        } else {
            activeEvaluater(false);
            activeMenter(false);
            dispatch(getStudentListSuccess([]));
        }
    };
    useEffect(() => {
        if (localStorage.getItem('tab')) {
            setTab(localStorage.getItem('tab'));
        }
    }, [localStorage.getItem('tab')]);

    useEffect(() => {
        // here dist = district //
        if (localStorage.getItem('dist')) {
            const number = localStorage.getItem('num');
            if (number == '2') {
                let dist = localStorage.getItem('dist');
                setmentorDist(dist);
                // setNewDists(dist);
                props.getAdminMentorsListAction('ALL', mentorDist);
            } else {
                let dist = localStorage.getItem('dist');
                setstudentDist(dist);
                props.getStudentListAction(studentDist);
            }
        }
    }, [localStorage.getItem('dist')]);

    const handleSelect = (item, num) => {
        // where item = student id / mentor id //
        localStorage.removeItem('dist');
        localStorage.removeItem('num');
        if (num == '1') {
            props.history.push({
                pathname: `/admin/userprofile`,
                data: item,
                dist: studentDist,
                num: num
            });
            localStorage.setItem('studentId', item.user_id);
            localStorage.setItem('studentData', JSON.stringify(item));
        } else {
            props.history.push({
                pathname: `/admin/userprofile`,
                data: item,
                dist: mentorDist,
                num: num
            });
        }
        localStorage.setItem('mentor', JSON.stringify(item));
    };
    const viewDetail = (item) => {
        props.history.push({
            pathname: '/admin/teacher/dashboard',
            data: item
        });
        // localStorage.setItem(
        //     'institution_code',
        //     JSON.stringify(item.institution_code)
        // );
    };

    const handleEdit = (item) => {
        // where we can edit user details  //
        // where item = mentor id //
        props.history.push({
            pathname: `/admin/edit-user-profile`,
            data: item
        });
        localStorage.setItem('mentor', JSON.stringify(item));
    };

    // const handleReset = (item) => {
    //     const body = JSON.stringify({
    //         organization_code: item.organization_code,
    //         otp: false,
    //         mentor_id: item.mentor_id
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
    // const handleDelete = () => {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: 'btn btn-success',
    //             cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //     });

    //     swalWithBootstrapButtons
    //         .fire({
    //             title: 'You are attempting to delete Evalauaor.',
    //             text: 'Are you sure?',
    //             imageUrl: `${logout}`,
    //             showCloseButton: true,
    //             confirmButtonText: 'Delete',
    //             showCancelButton: true,
    //             cancelButtonText: 'Cancel',
    //             reverseButtons: false
    //         })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Loged out!',
    //                     'Successfully deleted.',
    //                     'success'
    //                 );
    //             } else if (result.dismiss === Swal.DismissReason.cancel) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Cancelled',
    //                     'You are Logged in',
    //                     'error'
    //                 );
    //             }
    //         });
    // };
    const handleStatusUpdateInAdmin = async (data, id) => {
        // where we can update the admin status //
        // where id = admin id //
        // where data = status //
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const upad = encryptGlobal(JSON.stringify(id));
        await axios
            .put(`${URL.updateMentorStatus + '/' + upad}`, data, axiosConfig)
            .then((user) => console.log(user))
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleStatus = (status, id, type, all) => {
        // where we can update the status Active to InActive //
        // where id = student id / mentor id  / admin id / evaluator  id//
        // where status = status //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: `You are attempting to ${
                    status.toLowerCase() === 'active'
                        ? 'activate'
                        : 'inactivate'
                } ${
                    type && type === 'student'
                        ? 'Student'
                        : type && type === 'evaluator'
                        ? 'evaluator'
                        : type && type === 'admin'
                        ? 'Admin'
                        : 'Mentor'
                }.`,
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: status,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (type && type === 'student') {
                        props.studentStatusUpdate({ status }, id);
                        setTimeout(() => {
                            props.getStudentListAction(studentDist);
                        }, 500);
                    } else if (type && type === 'evaluator') {
                        console.warn(status, id, type);
                        dispatch(
                            updateEvaluator(
                                {
                                    status,
                                    full_name: all.user.full_name,
                                    username: all.user.username
                                },
                                id
                            )
                        );
                        setTimeout(() => {
                            props.getEvaluatorListAction();
                        }, 500);
                    } else if (type && type === 'admin') {
                        const obj = {
                            full_name: all.full_name,
                            username: all.username,
                            // mobile: all.mobile,
                            status
                        };
                        await handleStatusUpdateInAdmin({ obj }, id);

                        setTimeout(() => {
                            props.getAdminListAction();
                        }, 500);
                    } else {
                        const obj = {
                            full_name: all.full_name,
                            username: all.username,
                            // mobile: all.mobile,
                            status
                        };
                        props.mentorStatusUpdate(obj, id);
                        setTimeout(() => {
                            props.getAdminMentorsListAction('ALL', mentorDist);
                        }, 500);
                    }
                    swalWithBootstrapButtons.fire(
                        `${
                            type && type === 'student'
                                ? 'Student'
                                : type && type === 'evaluator'
                                ? 'evaluator'
                                : type && type === 'admin'
                                ? 'Admin'
                                : 'Mentor'
                        } Status has been changed!`,
                        'Successfully updated.',
                        'success'
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Not updated successfully',
                        'error'
                    );
                }
            });
    };

    const TableMentorsProps = {
        data:
            props.mentorsList && props.mentorsList.length > 0
                ? props.mentorsList
                : [],
        // totalItems: props.totalItems,
        columns: [
            {
                name: 'No',
                // selector: (row) => row.id,
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,

                width: '6rem'
            },
            // {
            //     name: 'Institution Code',
            //     selector: (row) => row?.institution_code,
            //     cellExport: (row) => row?.institution_code,
            //     width: '19rem'
            // },
            {
                name: 'District',
                selector: (row) => row?.district,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.district}
                    </div>
                ),
                cellExport: (row) => row?.district,
                width: '13rem'
            },
            // {
            //     name: 'Category',
            //     selector: (row) => row.organization.category,
            //     cellExport: (row) => row.organization.category,
            //     width: '15rem'
            // },
            {
                name: 'Institution Name',
                selector: (row) => row?.institution_name,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.institution_name}
                    </div>
                ),
                // selector: (row) => row.institution?.institution_name,
                cellExport: (row) => row?.institution_name,
                width: '23rem'
            },

            // {
            //     name: 'Mentor Name',
            //     selector: (row) => row.mentor_name,
            //     cellExport: (row) => row.mentor_name,
            //     width: '18rem'
            // },

            {
                name: 'Mobile No',
                selector: (row) => row.mobile,
                cellExport: (row) => row.mobile,
                width: '15rem'
            },

            // {
            //     name: 'Status',
            //     cell: (row) => [
            //         <Badge
            //             key={row.mentor_id}
            //             bg={`${
            //                 row.status === 'ACTIVE' ? 'secondary' : 'danger'
            //             }`}
            //         >
            //             {row.status}
            //         </Badge>
            //     ],
            //     width: '9rem'
            // },
            {
                name: 'Actions',
                width: '10rem',
                cell: (record) => [
                    // <div
                    //
                    //     key={record.id}
                    //     onClick={() => handleReset(record)}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-success btn-lg">RESET</div>
                    // </div>,
                    <div
                        key={record.id}
                        // onClick={() => handleSelect(record, '2')}
                        // onClick={viewDetail}
                        onClick={() => viewDetail(record)}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary ">VIEW</div>
                    </div>
                    // <div
                    //
                    //     key={record.id}
                    //     onClick={() => handleEdit(record)}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-warning btn-lg">EDIT</div>
                    // </div>,
                    // <div
                    //     key={record.id}
                    //     className="mr-5"
                    //     onClick={() => {
                    //         let status =
                    //             record?.status === 'ACTIVE'
                    //                 ? 'INACTIVE'
                    //                 : 'ACTIVE';
                    //         handleStatus(
                    //             status,
                    //             record?.mentor_id,
                    //             undefined,
                    //             record
                    //         );
                    //     }}
                    // >
                    //     {record?.status === 'ACTIVE' ? (
                    //         <div className="btn btn-danger">INACTIVE</div>
                    //     ) : (
                    //         <div className="btn btn-success">ACTIVE</div>
                    //     )}
                    // </div>
                    // <div
                    //     key={record.id}
                    //     onClick={() => handleAdd(record)}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-warning btn-lg">Add</div>
                    // </div>
                ]
            }
        ]
    };
    const StudentsData = {
        data: props.studentList,
        columns: [
            {
                name: 'No',
                // selector: (row) => row.id,
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,
                width: '6rem'
            },

            {
                name: 'District',
                selector: (row) => row.district,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.district}
                    </div>
                ),
                cellExport: (row) => row.district,
                width: '10rem'
            },
            {
                name: 'Inst Type',
                selector: (row) => row?.group,
                cellExport: (row) => row?.group,
                width: '15rem'
            },
            // {
            //     name: 'Category',
            //     // selector: (row) => row.team.mentor.organization.category,
            //     // cellExport: (row) => row.team.mentor.organization.category,
            //     width: '13rem'
            // },
            {
                name: 'Institution Name',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.institution_name}
                    </div>
                ),
                selector: (row) => row.institution_name,
                cellExport: (row) => row.institution_name,
                width: '20rem'
            },

            {
                name: 'Student Name',
                selector: (row) => row.student_full_name,
                cellExport: (row) => row.student_full_name,
                width: '15rem'
            },
            {
                name: 'Age',
                selector: (row) => row.Age,
                width: '8rem'
            },

            {
                name: 'Gender',
                selector: (row) => row.Gender,
                width: '10rem'
            },
            {
                name: 'Email Id',
                selector: (row) => row.email,
                width: '16rem'
            },

            {
                name: 'Mobile No',
                selector: (row) => row.mobile,
                width: '16rem'
            },
            // {
            //     name: 'Status',
            //     cell: (row) => [
            //         <Badge
            //             key={row.mentor_id}
            //             bg={`${
            //                 row.status === 'ACTIVE' ? 'secondary' : 'danger'
            //             }`}
            //         >
            //             {row.status}
            //         </Badge>
            //     ],
            //     width: '8rem'
            // },
            {
                name: 'Actions',
                sortable: false,
                width: '10rem',
                cell: (record) => [
                    <div
                        key={record.id}
                        onClick={() => handleSelect(record, '1')}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary  mr-5">VIEW</div>
                    </div>
                    // <div
                    //     key={record.id}
                    //     style={{ marginRight: '10px' }}
                    //     onClick={() => {
                    //         let status =
                    //             record?.status === 'ACTIVE'
                    //                 ? 'INACTIVE'
                    //                 : 'ACTIVE';
                    //         handleStatus(status, record?.student_id, 'student');
                    //     }}
                    // >
                    //     {record?.status === 'ACTIVE' ? (
                    //         <div className="btn btn-danger ">INACTIVE</div>
                    //     ) : (
                    //         <div className="btn btn-warning ">ACTIVE</div>
                    //     )}
                    // </div>
                ]
            }
        ]
    };
    const evaluatorsData = {
        data: props.evalutorsList,
        columns: [
            {
                name: 'No',
                selector: (row) => row.id,
                width: '6rem'
            },
            {
                name: 'Evaluator Name',
                selector: (row) => row.user.full_name,
                width: '20rem'
            },
            {
                name: 'Email',
                selector: (row) => row.user.username,
                width: '25rem'
            },
            {
                name: 'Mobile No',
                selector: (row) => row.mobile,
                width: '20rem'
            },
            // {
            //     name: 'District',
            //     selector: (row) => row.district,
            //     width: '11rem'
            // },
            {
                name: 'Status',
                cell: (row) => [
                    <Badge
                        key={row.mentor_id}
                        bg={`${
                            row.status === 'ACTIVE' ? 'secondary' : 'danger'
                        }`}
                    >
                        {row.status}
                    </Badge>
                ],
                width: '18rem'
            },
            {
                name: 'Actions',
                sortable: false,
                width: '25rem',
                cell: (record) => [
                    // <div
                    //     key={record.id}
                    //
                    //     onClick={() => handleSelect(record)}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-primary btn-lg mr-5">View</div>
                    // </div>,
                    <div
                        key={record.id}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary btn-lg">EDIT</div>
                    </div>,
                    <div
                        key={record.id}
                        className="mr-5"
                        onClick={() => {
                            let status =
                                record?.status === 'ACTIVE'
                                    ? 'INACTIVE'
                                    : 'ACTIVE';
                            handleStatus(
                                status,
                                record?.evaluator_id,
                                'evaluator',
                                record
                            );
                        }}
                    >
                        {record?.status === 'ACTIVE' ? (
                            <div className="btn btn-danger ">INACTIVE</div>
                        ) : (
                            <div className="btn btn-warning ">ACTIVE</div>
                        )}
                    </div>
                ]
            }
        ]
    };
    const adminData = {
        data:
            props.adminData && props.adminData.length > 0
                ? props.adminData
                : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row?.id,

                width: '6rem'
            },
            {
                name: 'Admin Name',
                selector: (row) => row?.user?.full_name,
                cellExport: (row) => row?.user?.full_name,

                width: '17rem'
            },
            {
                name: 'Email',
                selector: (row) => row?.user?.username,
                cellExport: (row) => row?.user?.username,

                width: '27rem'
            },
            {
                name: 'Role',
                selector: (row) => row?.user?.role,
                width: '15rem',
                cell: (params) => [
                    params.user.role === 'ADMIN' ? (
                        <span className="py-2 px-4 rounded-pill bg-danger bg-opacity-25 text-danger fw-bold">
                            ADMIN
                        </span>
                    ) : params.user.role === 'EADMIN' ? (
                        <span className="py-2 px-4 rounded-pill bg-success bg-opacity-25 text-info fw-bold">
                            EADMIN
                        </span>
                    ) : params.user.role === 'STUDENT' ? (
                        <span className="bg-success bg-opacity-25 px-4 py-2 rounded-pill text-success fw-bold">
                            STUDENT
                        </span>
                    ) : (
                        ''
                    )
                ]
            },
            {
                name: 'Status',
                cell: (row) => [
                    <Badge
                        key={row.mentor_id}
                        bg={`${
                            row.status === 'ACTIVE' ? 'secondary' : 'danger'
                        }`}
                    >
                        {row.status}
                    </Badge>
                ],
                width: '10rem'
            }
            // {
            //     name: 'Actions',
            //     sortable: false,
            //     width: '25rem',
            //     cell: (record) => [
            //         <div
            //             className="mr-5"
            //             key={record?.id}
            //             onClick={() => handleEdit(record)}
            //             style={{ marginRight: '10px' }}
            //         >
            //             <div className="btn btn-primary ">EDIT</div>
            //         </div>,
            //         <div
            //             key={record.id}
            //             style={{ marginRight: '10px' }}
            //             onClick={() => {
            //                 let status =
            //                     record?.status === 'ACTIVE'
            //                         ? 'INACTIVE'
            //                         : 'ACTIVE';
            //                 handleStatus(
            //                     status,
            //                     record?.admin_id,
            //                     'admin',
            //                     record
            //                 );
            //             }}
            //         >
            //             {record?.status === 'ACTIVE' ? (
            //                 <div className="btn btn-danger">INACTIVE</div>
            //             ) : (
            //                 <div className="btn btn-secondary ">ACTIVE</div>
            //             )}
            //         </div>
            //         // <div
            //         //     key={record?.id}
            //         //
            //         //     onClick={() => handleSelect(record)}
            //         //     style={{ marginRight: '10px' }}
            //         // >
            //         //     <div className="btn btn-primary btn-lg mr-5">View</div>
            //         // </div>,
            //     ]
            // }
        ]
    };

    return (
        <Layout title="UserList">
            <Container className="ticket-page mt-5 mb-50 userlist">
                <Row className="mt-0 pt-3">
                    <h2>Reg. Students List</h2>
                    <Row className="mt-0">
                        <Col className="ticket-btn col ml-auto  ">
                            <div
                                className={`d-flex ${
                                    tab == 1 || tab == 2
                                        ? ''
                                        : 'justify-content-end'
                                }`}
                            >
                                {tab && tab == 1 && (
                                    <>
                                        <SelectDists
                                            getDistrictsListAction={
                                                props.stateList
                                            }
                                            list={stateList}
                                            setDist={setstudentDist}
                                            newDist={studentDist}
                                            dists={props.dists}
                                            tab={tab}
                                            // drop={1}
                                        />
                                        {studentDist && (
                                            <Card className="ms-3 p-3">
                                                Total Students :{' '}
                                                {props.studentList.length}
                                            </Card>
                                        )}
                                    </>
                                )}
                                {tab && tab == 2 && (
                                    <>
                                        <SelectDists
                                            getDistrictsListAction={
                                                props.getDistrictsListAction
                                            }
                                            setDist={setmentorDist}
                                            newDist={mentorDist}
                                            dists={props.dists}
                                            tab={tab}
                                            // drop={1}
                                        />
                                        {mentorDist && (
                                            <Card className="ms-3 p-3">
                                                Total Mentors :{' '}
                                                {props.mentorsList.length}
                                            </Card>
                                        )}
                                        {/* <div className="m-5 "> */}
                                        {/* <div className="d-flex justify-content-end">
                                            <Button
                                                label="Add "
                                                btnClass="m-5 btn btn-success"
                                                size="small"
                                                shape="btn-square"
                                                // Icon={BsPlusLg}
                                                onClick={() =>
                                                    history.push(
                                                        '/admin/teacher/register'
                                                    )
                                                }
                                            />
                                        </div> */}
                                    </>
                                )}
                                {/* {tab && tab == 2 && (
                                    <>
                                        <Col className="ticket-btn col ml-auto ">
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    label="Register Mentor"
                                                    btnClass="m-5 btn btn-success"
                                                    size="small"
                                                    shape="btn-square"
                                                    onClick={() =>
                                                        history.push(
                                                            '/admin/mentor/register'
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Col>
                                    </>
                                )} */}

                                {tab && (tab == 3 || tab == 4) && (
                                    <Button
                                        label={
                                            tab == 3
                                                ? 'Add New Evaluator'
                                                : 'Add New Admin'
                                        }
                                        btnClass="primary"
                                        size="small"
                                        shape="btn-square"
                                        Icon={BsUpload}
                                        onClick={() =>
                                            setRegisterModalShow(true)
                                        }
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>

                    <div className="ticket-data">
                        <Tabs
                            defaultActiveKey={
                                localStorage.getItem('tab')
                                    ? localStorage.getItem('tab')
                                    : '1'
                            }
                            onChange={(key) => changeTab(key)}
                        >
                            <Row></Row>
                            <TabPane
                                tab="Students"
                                key="1"
                                className="bg-white p-3 mt-2 sub-tab"
                                tabId="1"
                            >
                                {studentDist === '' ? (
                                    <CommonPage text="Please select a district" />
                                ) : loading ? (
                                    <ClipLoader
                                        loading={loading}
                                        // color={color}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-5">
                                        <DataTableExtensions
                                            {...StudentsData}
                                            exportHeaders
                                            print={false}
                                            export={false}
                                        >
                                            <DataTable
                                                data={rows}
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                                                subHeaderAlign={
                                                    Alignment.Center
                                                }
                                            />
                                        </DataTableExtensions>
                                    </div>
                                )}
                            </TabPane>
                            {/* <TabPane
                                tab="Mentors"
                                key="2"
                                className="bg-white p-3 mt-2 sub-tab"
                                tabId="2"
                            >
                                {mentorDist === '' ? (
                                    <CommonPage text="Please select a district" />
                                ) : loading ? (
                                    <ClipLoader loading={loading} size={20} />
                                ) : (
                                    <div className="my-5">
                                        <DataTableExtensions
                                            {...TableMentorsProps}
                                            exportHeaders
                                            print={false}
                                            export={false}
                                        >
                                            <DataTable
                                                data={mentorRows}
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                                                subHeaderAlign={
                                                    Alignment.Center
                                                }
                                            />
                                        </DataTableExtensions>
                                    </div>
                                )}
                            </TabPane> */}
                            {/* <TabPane
                                tab="Evaluators"
                                key="3"
                                className="bg-white p-3 mt-2 sub-tab"
                                tabId="3"
                            >
                                <div className="my-5">
                                    <DataTableExtensions
                                        {...evaluatorsData}
                                        exportHeaders
                                        print={false}
                                        export={false}
                                    >
                                        <DataTable
                                            responsive={true}
                                            data={props.evalutorsList}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane> */}
                            {/* <TabPane
                                tab="Admins"
                                key="4"
                                className="bg-white p-3 mt-2 sub-tab"
                                tabId="4"
                            >
                                <div className="my-5">
                                    <DataTableExtensions
                                        {...adminData}
                                        exportHeaders
                                        print={false}
                                        export={false}
                                    >
                                        <DataTable
                                            data={props.adminData}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane> */}
                        </Tabs>
                    </div>
                </Row>
            </Container>
            {registerModalShow &&
                (tab == 4 ? (
                    <AddADmins
                        show={registerModalShow}
                        setShow={setRegisterModalShow}
                        onHide={() => setRegisterModalShow(false)}
                    />
                ) : (
                    <Register
                        show={registerModalShow}
                        setShow={setRegisterModalShow}
                        onHide={() => setRegisterModalShow(false)}
                    />
                ))}
        </Layout>
    );
};

const mapStateToProps = ({
    adminEvalutors,
    adminMentors,
    studentRegistration,
    admin
}) => {
    const { evalutorsList } = adminEvalutors;
    const { adminData } = admin;
    const { mentorsList, totalItems } = adminMentors;
    const { studentList, dists, regstate } = studentRegistration;
    return {
        evalutorsList,
        adminData,
        mentorsList,
        totalItems,
        studentList,
        dists,
        regstate
    };
};
export default connect(mapStateToProps, {
    getAdminMentorsListAction: getAdminMentorsList,
    getStudentListAction: getStudentRegistationData,
    getDistrictsListAction: getDistrictData,
    getStateDataListAction: getStateData,
    getEvaluatorListAction: getAdminEvalutorsList,
    getAdminListAction: getAdmin,
    mentorStatusUpdate: updateMentorStatus,
    studentStatusUpdate: updateStudentStatus
})(TicketsPage);
