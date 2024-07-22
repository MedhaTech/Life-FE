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
import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
// import logout from '../../assets/media/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useTranslation } from 'react-i18next';
import DoubleBounce from '../../../components/Loaders/DoubleBounce';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
const TicketsPage = () => {
    const history = useHistory();
    const { t } = useTranslation();
    localStorage.setItem('teamId', JSON.stringify(''));
    const [count, setCount] = useState(0);
    const [teamsArray, setTeamsArray] = useState([]);
    const currentUser = getCurrentUser('current_user');
    const [loading, setLoading] = React.useState(false);
    const [teamsList, setTeamsList] = useState([]);
    const [limit, setLimit] = useState(false);
    const [btn, setBtn] = useState('');
    const [stuList, setStuList] = useState([]);
    const [totalCount, setTotalCount] = useState({});
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
                    console.log(response, 'aaaaa');

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
    const adminTeamsList = {
        data: teamsArray,
        columns: [
            {
                name: t('teacher_teams.s_no'),
                selector: (row) => row.key,
                width: '6rem'
            },
            {
                name: 'Stream',
                // name: t('teacher_teams.team_name'),
                selector: (row) => row.team_name,
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
                name: 'Mobile Number',
                selector: (row) => row.student_mobile,
                width: '20rem'
            },
            {
                name: 'Email',
                selector: (row) => row.student_email,
                width: '30rem'
            }
            ,
            {
                name: 'ID Card',
                selector: (row) => '',
                width: '10rem'
            }
            // {
            //     name: 'Gender',
            //     selector: 'moc_gender',
            //     width: '10rem'
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
            pathname: `/team-creation/${item.team_id}/${
                item.StudentCount ? item.StudentCount : 'new'
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
        <Layout title="Teams ">
            <Container className="ticket-page mt-5 mb-50 userlist">
                <Row className="pt-5">
                    <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                        <Col className="col-auto" style={centerTitleMobile}>
                            <h2>Team Members</h2>
                        </Col>

                        <Col className="ticket-btn col ml-auto ">
                            <div className="d-flex justify-content-end">
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
                            </div>
                        </Col>
                    </Row>
                    <div className="ticket-data">
                        <Tabs defaultActiveKey="1">
                            {loading && teamsArray && !teamsArray.length > 0 ? (
                                <DoubleBounce />
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
                        </Tabs>
                    </div>
                </Row>
            </Container>
        </Layout>
    );
};

export default TicketsPage;
