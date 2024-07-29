/* eslint-disable react/no-unescaped-entities */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, List, Label, Card } from 'reactstrap';
import { Tabs } from 'antd';
import Layout from '../../Layout';
import { BsPlusLg } from 'react-icons/bs';
import { Button } from '../../../stories/Button';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Badge } from 'react-bootstrap';
import { format } from 'date-fns';

import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import teams from '../../../assets/media/4067321.jpg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useTranslation } from 'react-i18next';
import DoubleBounce from '../../../components/Loaders/DoubleBounce';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentByIdData } from '../../../redux/studentRegistration/actions';

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
const TicketsPage = (props) => {
    // console.log(props.location.ideasCout, "props");
    const currentUser = getCurrentUser('current_user');

    const history = useHistory();
    const { t } = useTranslation();
    localStorage.setItem('teamId', JSON.stringify(''));
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStudentByIdData(currentUser?.data[0]?.student_id));
    }, [dispatch, currentUser?.data[0]?.student_id]);
    const { teamMember } = useSelector((state) => state.studentRegistration);
    // consi
    const [count, setCount] = useState(0);
    const [teamsArray, setTeamsArray] = useState([]);
    const idData = teamMember?.id_card;
    // console.log(idData,"11");

    const [loading, setLoading] = React.useState(false);
    const [teamsList, setTeamsList] = useState([]);
    const [limit, setLimit] = useState(false);
    const [btn, setBtn] = useState('');
    const [stuList, setStuList] = useState([]);
    const [totalCount, setTotalCount] = useState({});
    const [stuCont, setStuCount] = useState('');
    const [showsPopup, setShowsPopup] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const handleClose = () => {
        setShowsPopup(false);
    };
    useEffect(() => {
        if (currentUser?.data[0]?.student_id) {
            teamListbymentorid(currentUser?.data[0]?.student_id);
        }
    }, [currentUser?.data[0]?.student_id]);

    const teamListbymentorid = (student_id) => {
        const teamparam = encryptGlobal(
            JSON.stringify({
                student_id: student_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL + `/teams?Data=${teamparam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                const stuList = response?.data?.data || [];
                const total = stuList.reduce(
                    (acc, item) => {
                        acc.StudentsCount += item.StudentCount;

                        return acc;
                    },
                    {
                        StudentsCount: 0
                    }
                );
                setTotalCount(total);
                if (response.status === 200) {
                    // console.log(response, 'aaaaa');
                    setStuCount(response.data.count);
                    setTeamsList(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        setLoading(true);
        var teamsArrays = [];
        teamsList.map((teams, index) => {
            var key = index + 1;
            return teamsArrays.push({ ...teams, key });
        });
        setTeamsArray(teamsArrays);
        setLoading(false);
    }, [teamsList]);
    const getFileName = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };
    const adminTeamsList = {
        data: teamsArray,
        columns: [
            {
                name: t('teacher_teams.s_no'),
                selector: (row) => row.key,
                width: '6rem'
            },
            {
                name: 'Member Category',
                // name: t('teacher_teams.team_name'),
                selector: (row) => row.member_category,
                sortable: true,
                // maxlength: '5',
                width: '20rem'
            },
            {
                name: 'Member Name',
                selector: (row) => row.student_name,
                width: '20rem'
            },
            {
                name: 'DOB',
                selector: (row) => format(new Date(row.dob), 'dd/MM/yyyy'), // Format date
                width: '20rem'
            },
            {
                name: 'Age',
                selector: (row) => row.age,
                width: '8rem'
            },
            {
                name: 'Gender',
                selector: (row) => row.gender,
                width: '10rem'
            },
            {
                name: 'Institution Name',
                selector: (row) => row.
                    institution_name,
                width: '18rem'
            },
            // {
            //     name: 'Institution Name',
            //     selector: (row) => 'row.id_card',
            //     cell: (row) => [
            //         <Badge
            //             key={row.id_card}
            //             bg={`${
            //                 row.id_card === row.id_card ? 'primary' : 'danger'
            //             }`}
            //             onClick={()=>{
            //                 setImgUrl(row.id_card);
            //                 setShowsPopup(true);
            //             }}
            //         >
            //             {row.id_card && getFileName(row.id_card)}
            //         </Badge>
            //     ],
            //     width: '10rem'
            // }
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


            // {
            //     name: 'Mobile No',
            //     selector: 'moc_phone',
            //     width: '20rem'
            // },
            // {
            //     name: 'Email Id',
            //     selector: 'moc_email',
            //     width: '20rem'
            // },
        ]
    };

    const handleCreate = (item) => {
        // where item = team name //
        // where we can add team member details //
        history.push({
            pathname: `/team-creation/${item.team_id}/${item.StudentCount ? item.StudentCount : 'new'
                }`
        });
    };
    const handleEditTeam = (item) => {
        // item = student //
        // here we can edit the team member details //
        history.push({
            pathname: '/mentor/edit-team',
            item: item
        });
        localStorage.setItem('teamId', JSON.stringify(item));
    };
    const handleView = (item) => {
        // here item = team member details  //
        item['mentorid'] = currentUser?.data[0]?.mentor_id;
        history.push({
            pathname: '/mentor/view-team-member',
            item: item,
            // date_of_birth: item.date_of_birth,
            mentorid: currentUser?.data[0]?.mentor_id
        });
        localStorage.setItem('teamId', JSON.stringify(item));
    };

    const centerTitleMobile = {
        '@media (max-width: 768px)': {
            marginLeft: '2rem'
        }
    };

    return (
        <Layout title="Teams">
            <GreetingModal
                handleClose={handleClose}
                show={showsPopup}
                imgUrl={imgUrl}
            ></GreetingModal>
            <Container>
                <Row className='my-3'>
                    <Col className="col-auto" style={centerTitleMobile}>
                        <h3 className='title-head'>Team Members <span className='title-caption'> (You can add up to 4 team members)</span></h3>
                    </Col>
                    <Col className="ticket-btn col ml-auto ">
                        <div className="d-flex justify-content-end">
                        {/* {idData !== null && stuCont < 4 && ( */}
                            {stuCont < 4 && (
                                <Button
                                    label="ADD MEMBER"
                                    btnClass="primary ml-2"
                                    size="small"
                                    shape="btn-square"
                                    Icon={BsPlusLg}
                                    onClick={() =>
                                        history.push('/team-creation')
                                    }
                                />
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className='card'>
                        {loading && teamsArray && !teamsArray.length > 0 ? (
                            <DoubleBounce />
                        ) : teamsArray.length === 0 ? (
                            <div className="m-5">
                                <div className="no-data-message text-center">
                                    <img
                                        src={teams}
                                        alt="popup image"
                                        className="img-fluid h-300"
                                    />
                                    <h3 className='font-bold'>If you don't have any team members; <br /> proceed to submit your solution.</h3>
                                  {idData === null &&   <Button
                                        label="Proceed"
                                        btnClass="primary ml-2"
                                        size="small"
                                        shape="btn-square"
                                        Icon={BsPlusLg}
                                        onClick={() =>
                                            history.push('/upload-file')
                                        }
                                    />
}
                                </div>
                            </div>
                        ) : (
                            <div className="my-2">
                                <DataTableExtensions
                                    print={false}
                                    export={false}
                                    {...adminTeamsList}
                                >
                                    <DataTable
                                        data={teamsArray}
                                        defaultSortField="id"
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                        fixedHeader
                                        subHeaderAlign={Alignment.Center}
                                        paginationRowsPerPageOptions={[
                                            25, 50, 100
                                        ]}
                                        paginationPerPage={25}
                                    />
                                </DataTableExtensions>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default TicketsPage;
