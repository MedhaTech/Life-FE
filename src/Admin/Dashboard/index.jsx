/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Descriptions, Input } from 'antd';
import axios from 'axios';
import React, { useState, useEffect ,useRef} from 'react';
// import { Col, Row } from 'reactstrap';
import { Button } from '../../stories/Button';
import Layout from '../Layout';
import {
    deleteTempMentorById,
    teacherResetPassword
} from '../store/admin/actions';
import { Col, Container, Row, CardBody, CardText,Table } from 'reactstrap';
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
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

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
import { propTypes } from 'react-bootstrap/esm/Image';
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
    const [isDownload, setIsDownload] = useState(false);
    const csvLinkRef = useRef();

    const [chartTableData, setChartTableData] = useState([]);
    const [chartTableData1, setChartTableData1] = useState([]);
    const [chartTableData2, setChartTableData2] = useState([]);
    const [chartTableData3, setChartTableData3] = useState([]);

    const [barChart1Data, setBarChart1Data] = useState("");
    const tableHeaders = [
        {
            label: 'State Name',
            key: 'state'
        },
        {
            label: 'Total Enrolled Students',
            key: 'total enrolled'
        },
        {
            label: 'Reg Students',
            key: 'reg_student'
        },
        {
            label: 'Team Members',
            key: 'team members'
        },
        {
            label: 'Male',
            key: 'male_count'
        },
        {
            label: 'Female',
            key: 'female_count'
        }, {
            label: 'Others',
            key: 'others_count'
        },
        {
            label: 'Ayurveda',
            key: 'Ayurveda_count'
        },
        {
            label: 'Engineering',
            key: 'Engineering_count'
        },
        {
            label: 'Law',
            key: 'Law_count'
        },
        {
            label: 'Life Sciences',
            key: 'Life_Sciences_count'
        },
        {
            label: 'Medical',
            key: 'Medical_count'
        },
        {
            label: 'Faculty',
            key: 'faculty_count'
        },
        {
            label: 'Research Scholars',
            key: 'Medical_count'
        },
        {
            label: 'Others',
            key: 'Others_count'
        }
    ];


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
    const chartOption = {
        maintainAspectRatio: false,
        // legend: {
        //     position: 'bottom',
        //     labels: {
        //         fontColor: 'black'
        //     }
        // },
        plugins: {
            legend: {
                labels: {
                    position: 'bottom',
                    labels:{
                        fontColor: 'black',
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
                }
            }
        }
    };
    const chartOption1 = {
        maintainAspectRatio: false,
        // legend: {
        //     position: 'bottom',
        //     labels: {
        //         fontColor: 'black'
        //     }
        // },
        plugins: {
            legend: {
                labels: {
                    position: 'bottom',
                    labels:{
                        fontColor: 'black',
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
                }
            }
        }
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                },
                title: {
                    display: true,
                    // text: 'Number of Registered ATL and Non ATL Schools',
                    color: 'blue'
                }
            },
            x: {
                grid: {
                    display: true,
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.2)',
                    lineWidth: 0.5
                },
                // title: {
                //     display: true,
                //     text: 'States',
                //     color: 'blue'
                // },
                ticks: {
                    maxRotation: 80,
                    autoSkip: false
                    //maxTicksLimit: 10,
                }
            }
        }
    };
    const [overallStu,setOverallStu]=useState("-");
    const [overallIdea,setOverallIdea]=useState("-");
    const [applicantCount,setApplicantCount]=useState(null);
    const [newFormat, setNewFormat] = useState('');
    const [newFormat1, setNewFormat1] = useState('');
    const [newFormat2, setNewFormat2] = useState('');
const[protoCount,setProtoCount]=useState("");
const [combinedArray, setCombinedArray] = useState([]);
const [tableData,setTableDat]=useState([]);
    const [genders,setGenders]=useState(null);
    const [downloadData,setDownloadData]=useState(null);
  const [proCount,setProCount]=useState("");
    useEffect(()=>{
overallStudent();
overallIdeas();
applicantCategory();
overallGender();
allInstitutions();
propTypeApi();
fetchStateWiseStudentsTableApi();
const newDate = new Date();
const formattedDate = `${newDate.getUTCDate()}/${
    1 + newDate.getMonth()
}/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
setNewFormat(formattedDate);
setNewFormat1(formattedDate);
setNewFormat2(formattedDate);
    },[]);
    const fetchStateWiseStudentsTableApi = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/dashboard/StudentStateWise',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                //    console.log(response,"table");
                   setCombinedArray(response?.data?.data || []);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    const propTypeApi= () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/HavingPrototype`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response,"11");
                    setProCount(response?.data?.data[0]?.["Having Prototype"]
                    );
                    // const chartTableData3 = response?.data?.data || [];
                    // setChartTableData3(chartTableData3);
                   
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const barChartOptions = {
        maintainAspectRatio: true,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 2,
                },
            },
        },
    };
    const barChartData = {
        labels: ['Ayurveda', 'Engineering', 'Law', 'Life Sciences','Medical','Others'],
        datasets: [
            {
                label: 'All Institutions ',
                data: [
                    Number(chartTableData2.Ayurveda_count),
                    Number(chartTableData2.Engineering_count),
                    Number(chartTableData2.Law_count),
                    Number(chartTableData2.Life_Sciences_count),
                    Number(chartTableData2.Medical_count),
                    Number(chartTableData2.Others_count),
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0','#4cbb17','#990000'],
                barThickness: 40,
            },
        ],
    };
    const allInstitutions= () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/allInstitutions`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    setChartTableData2(response?.data?.data[0] || []);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const overallGender= () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/allGenders`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    const chartTableData1 = response?.data?.data || [];
                    setChartTableData1(chartTableData1);
                    const lastRow = chartTableData1[chartTableData1.length - 1];
                    const maleCount = lastRow?.
                    male_count
                    || 0;
                    const femaleCount = lastRow?.female_count
                     || 0;
                    const othersCount = lastRow?.
                    others_count

                     || 0;
                 
                     setGenders({
                        labels: ['Female', 'Male',"Others"],
                        datasets: [
                            {
                                data: [maleCount, femaleCount,othersCount],
                                backgroundColor: ["#6a5acd", '#FF6384',"#ee82ee"],
                                hoverBackgroundColor: ["#6a5acd", '#FF6384',"#ee82ee"]
                            }
                        ]
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const applicantCategory = () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/allCategorys`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    const chartTableData = response?.data?.data || [];
                    setChartTableData(chartTableData);
                    const lastRow = chartTableData[chartTableData.length - 1];
                    const researchCount = lastRow?.RS_count
                    || 0;
                    const studentCount = lastRow?.
                    student_count
                     || 0;
                    const facultyCount = lastRow?.
                    faculty_count
                     || 0;
                    const othersCount = lastRow?.
                    others_count
                     || 0;
                     setApplicantCount({
                        labels: ['Research Scholars', 'Faculty',"Students","Others"],
                        datasets: [
                            {
                                data: [researchCount, studentCount,facultyCount,othersCount],
                                backgroundColor: ['#36A2EB', '#FF6384',"#ffa500","#ee82ee"],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384',"#ffa500","#ee82ee"]
                            }
                        ]
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const overallIdeas = () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/Overallideas`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    setOverallIdea(response?.data?.data[0]?.['overall ideas']
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const overallStudent = () => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/dashboard/OverallStudent
`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    setOverallStu(response?.data?.data[0]?.['overall students']
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
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
    const handleDownload=()=>{
        // alert("hii");
        fetchData();
        setIsDownload(true);

    };
    const fetchData = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/dashboard/detailsStudents',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                   console.log(response,"down");
                   setDownloadData(response?.data?.data || []);
                   setIsDownload(false);
                   csvLinkRef.current.link.click();
                //    setCombinedArray(response?.data?.data || []);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    return (
        <Layout title="Dashboard">
            <div className="dashboard-wrapper pb-5 my-5 px-5">
               
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
                                  {combinedArray.length > 0 && (
                               <div className="mt-5">
                               <div className="d-flex align-items-center mb-3">
                                   <h3>OVERVIEW</h3>
                                   <Button
                                       label="Download Table"
                                       btnClass="primary mx-2"
                                       size="small"
                                       shape="btn-square"
                                       onClick={handleDownload
                                          
                                       }
                                       style={{
                                           width: '150px',
                                           whiteSpace: 'nowrap'
                                       }}
                                   />
                               </div>
                               <div className="row">
                                   <div className="col-md-12 mx-10 px-10">
                                       <div
                                           className="table-wrapper bg-white "
                                           style={{
                                               overflowX: 'auto'
                                           }}
                                       >
                                           <Table
                                               id="dataTable"
                                               className="table table-striped table-bordered responsive"
                                           >
                                               <thead>
                                                   <tr>
                                                       <th>No</th>
                                                       <th>
                                                          State
                                                           Name
                                                       </th>
                                                       <th>
                                                           Students
                                                       </th>
                                                      
                                                   </tr>
                                               </thead>
                                               <tbody>
                                                   {combinedArray.map(
                                                       (
                                                           item,
                                                           index
                                                       ) => (
                                                           <tr
                                                               key={
                                                                   index
                                                               }
                                                           >
                                                               <td>
                                                                   {index +
                                                                       1}
                                                               </td>
                                                               <td>
                                                                   {
                                                                       item.state
                                                                   }
                                                               </td>
                                                               <td>
                                                                   {
                                                                       item.state_count

                                                                   }
                                                               </td>
                                                              
                                                              
                                                           </tr>
                                                       )
                                                   )}

                                               </tbody>
                                           </Table>
                                       </div>
                                   </div>
                               </div>
                           </div>   
                            )}
                             {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={tableHeaders}
                                        filename={`StatewiseDemographicReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRef}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                                <Col>
                                    <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        style={{
                                            height: '150px',
                                            // width: '300px'
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
                                                {overallStu}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center p-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Overall <br /> Students
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
                                                {overallIdea}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                                Overall <br /> Ideas
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
                                                {proCount}
                                            </Card.Text>
                                            <label
                                                htmlFor="teams"
                                                className="text-center mt-3"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '20px'
                                                }}
                                            >
                                               Prototype <br/>Ideas Count
                                            </label>
                                        </Card.Body>
                                    </Card>
                                </Col>

                               
                            </Row>
                            <Row>
                            <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                        // style={{ height: '150px' }}
                                    >
                            <div className="row">
                                                <div className="col">
                                                    <div className="col-md-12 text-center mt-3">
                                                        <p>
                                                            <b>
                                                            Applicant Category wise Students Count
                                                                 <br/>
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-12 doughnut-chart-container">
                                                        {applicantCount && (
                                                            <Doughnut
                                                                data={
                                                                    applicantCount
                                                                }
                                                                options={
                                                                    chartOption
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    </div>
                                                   <div className='col'>
                                                    <div className="col-md-12 text-center mt-3">
                                                        <p>
                                                            <b>
                                                           Gender wise Status Count
                                                                 <br/>
                                                                {newFormat1}
                                                            </b>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-12 doughnut-chart-container">
                                                        {genders && (
                                                            <Doughnut
                                                                data={
                                                                    genders
                                                                }
                                                                options={
                                                                    chartOption1
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                    <div
                                        className="col-md-12 chart-container mt-5"
                                        style={{
                                            width: '100%',
                                            height: '370px'
                                        }}
                                    >
                                        <div className="chart-box">
                                        <div className="chart">
                                <div className="col-md-7 mt-5 d-flex align-items-center justify-content-center">
                                    <Bar data={barChartData} options={options} />
                                </div>
                            </div>
                                            <div className="chart-title">
                                                <p>
                                                    <b>
                                                        Institution Type wise students count
                                                        {newFormat2}
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                        </Card>

                                        {/* <Col>
                            <Card
                                        bg="white"
                                        text="dark"
                                        className="mb-4"
                                    >
                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-12 text-center mt-3">
                                                        <p>
                                                            <b>
                                                            Applicant Category wise Students Count
                                                                 <br/>
                                                                {newFormat}
                                                            </b>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-12 doughnut-chart-container">
                                                        {applicantCount && (
                                                            <Doughnut
                                                                data={
                                                                    applicantCount
                                                                }
                                                                options={
                                                                    chartOption
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                        </Card>
                                        </Col> */}
                                        </Row>
                            {/* <Row
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
                            </Row> */}
                           

                           
                            {/* <Row
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
                                            >
                                                No.of <br /> Teams
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
                            </Row> */}
                            {/* <Row
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
                                            height: '150px'
                                        }}
                                    >
                                       
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
                            </Row> */}

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
