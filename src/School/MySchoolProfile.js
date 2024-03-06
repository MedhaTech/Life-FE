/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable indent */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardText } from 'reactstrap';
import 'sweetalert2/src/sweetalert2.scss';
import Layout from './Layout.jsx';
import { getCurrentUser, openNotificationWithIcon } from '../helpers/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getSchoolByID } from '../School/store/school/actions';
import { Button } from '../stories/Button';
import { useHistory } from 'react-router-dom';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2';
import { encryptGlobal } from '../constants/encryptDecrypt.js';
import logout from '../assets/media/logout.svg';

const MySchoolProfile = () => {
    // here we can see all the details of details of teacher //
    const history = useHistory();
    const currentUser = getCurrentUser('current_user');
    const school = useSelector((state) => state.school);
    const [resList, setResList] = useState([]);
    const [profile, setProfile] = useState([]);
    const [telphone, setTelphone] = useState([]);

    const dispatch = useDispatch();
    // console.log(school);
    // useLayoutEffect(() => {
    //     if (currentUser?.data[0]?.organization_id) {
    //         dispatch(getSchoolByID(currentUser?.data[0]?.organization_id));
    //     }
    // }, [currentUser?.data[0]?.organization_id]);
    const handleEdit = () => {
        history.push({
            pathname: '/EditinstitutionProfile',
            item: {
                principal_name: profile?.principal_name,
                principal_mobile: profile?.principal_mobile,
                principal_whatsapp_mobile: profile?.principal_whatsapp_mobile,
                principal_email: profile?.principal_email,
                institution_name: currentUser?.data[0]?.institution_name,
                place_name: profile?.place?.place_id,
                block: profile?.place?.block?.block_id,
                taluk: profile?.place?.block?.district?.taluk?.taluk_id,
                district: profile?.place?.block?.district?.district_id
                // city: profile
                // ?.place
                // ?.place_name,
                // category: school?.school.category,
                // district: school?.school.district,
                // organization_code: school?.school.organization_code,
                // organization_id: school?.school.organization_id,

                // state: school?.school.state
            }
        });
    };
    useEffect(() => {
        handleResList();
    }, []);
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
                title: 'Are you deleting the Course',
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const delparamId = encryptGlobal(
                        JSON.stringify(item.institution_course_id)
                    );
                    var config = {
                        method: 'delete',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/institutions/delectinstCourse/' +
                            delparamId,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                // console.log(response, '44');
                                openNotificationWithIcon(
                                    'success',
                                    'Course deleted successfully'
                                );
                                handleResList();
                                // history.push({
                                //     pathname: '/mentor/teamlist'
                                // });
                            }
                            // if (response.status === 406)
                        })
                        .catch(function (error) {
                            if (error?.response?.data?.status === 406) {
                                openNotificationWithIcon(
                                    'error',
                                    error?.response?.data?.message
                                );
                            }
                            console.log(error.message);
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
    async function handleResList() {
        const userIdParam = encryptGlobal(
            JSON.stringify({
                institution_id: currentUser?.data[0]?.institution_id
            })
        );
        let config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/institutions/Myprofile?Data=${userIdParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setResList(
                        response.data && response.data.data[0].courses_list
                    );
                    setProfile(response.data && response.data.data[0].profile);
                    setTelphone(
                        response.data && response.data.data[0].telePhoneMsg
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const resData = {
        data: resList && resList.length > 0 ? resList : [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                width: '7%'
            },
            {
                name: 'Institution Type',
                selector: (row) => row?.institution_type,
                sortable: true,
                center: true,
                width: '25%'
            },
            {
                name: 'Stream Name',
                selector: (row) => row?.stream_name,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.stream_name}
                    </div>
                ),
                width: '25%'
            },
            {
                name: 'Program Name',
                // selector: 'ideaStatus',
                selector: (row) => row?.program_name,
                center: true,
                width: '25%'
            },
            {
                name: 'Delete',
                // cell: (params) => {
                //     return [
                //         <button
                //             style={{ background: 'red', text: 'white' }}
                //             onClick={() => handleDeleteTeamMember(params)}
                //         >
                //             Delete
                //         </button>
                //     ];
                // },
                cell: (params) => {
                    return [
                        <div
                            key={params}
                            onClick={() => handleDeleteTeamMember(params)}
                        >
                            <div className="btn btn-danger btn-lg mr-5 mx-2">
                                Delete
                            </div>
                        </div>
                    ];
                },
                width: '18%',
                center: true
            }
        ]
    };
    console.log(profile, 'p');
    return (
        <Layout title="My Profile">
            <Container className="MyProfile pt-3 pt-xl-5 mb-50">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <div className="d-flex justify-content-between mb-3">
                            <h2>My Profile</h2>
                            <Button
                                onClick={() => handleEdit()}
                                size="small"
                                label={'Edit'}
                                btnClass={'primary'}
                            ></Button>
                        </div>
                        <Row>
                            <Col md={12}>
                                <Card className="w-100  mb-5 p-4">
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
                                                                        Institution
                                                                        Unique
                                                                        Code
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
                                                                        {currentUser
                                                                            ?.data[0]
                                                                            ?.institution_code
                                                                            ? currentUser
                                                                                  ?.data[0]
                                                                                  ?.institution_code
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
                                                                        Institution
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
                                                                        {currentUser
                                                                            ?.data[0]
                                                                            ?.institution_name
                                                                            ? currentUser
                                                                                  ?.data[0]
                                                                                  ?.institution_name
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
                                                                        Principal
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
                                                                        {profile?.principal_name
                                                                            ? profile?.principal_name
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
                                                                        Principal
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
                                                                        {profile?.principal_mobile
                                                                            ? profile?.principal_mobile
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
                                                                        Principal
                                                                        Whatsapp
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
                                                                        {profile?.principal_whatsapp_mobile
                                                                            ? profile?.principal_whatsapp_mobile
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
                                                                        Principal
                                                                        Email
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
                                                                        {profile?.principal_email
                                                                            ? profile?.principal_email
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
                                                                        Place
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
                                                                        {profile
                                                                            ?.place
                                                                            ?.place_name
                                                                            ? profile
                                                                                  ?.place
                                                                                  ?.place_name
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
                                                                        Block
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
                                                                        {profile
                                                                            ?.place
                                                                            ?.block
                                                                            ?.block_name
                                                                            ? profile
                                                                                  ?.place
                                                                                  ?.block
                                                                                  ?.block_name
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
                                                                        Taluk
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
                                                                        {profile
                                                                            ?.place
                                                                            ?.block
                                                                            ?.district
                                                                            ?.taluk
                                                                            ?.taluk_name
                                                                            ? profile
                                                                                  ?.place
                                                                                  ?.block
                                                                                  ?.district
                                                                                  ?.taluk
                                                                                  ?.taluk_name
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
                                                                        District
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
                                                                        {profile
                                                                            ?.place
                                                                            ?.block
                                                                            ?.district
                                                                            ?.district_name
                                                                            ? profile
                                                                                  ?.place
                                                                                  ?.block
                                                                                  ?.district
                                                                                  ?.district_name
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
                                                                        State
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
                                                                        {profile
                                                                            ?.place
                                                                            ?.block
                                                                            ?.district
                                                                            ?.state
                                                                            ?.state_name
                                                                            ? profile
                                                                                  ?.place
                                                                                  ?.block
                                                                                  ?.district
                                                                                  ?.state
                                                                                  ?.state_name
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
                                <h2>List of Courses</h2>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        label="Add Courses"
                                        btnClass=" btn btn-success"
                                        size="small"
                                        shape="btn-square"
                                        // Icon={BsPlusLg}
                                        onClick={() =>
                                            history.push(
                                                '/instituion/addCourse'
                                            )
                                        }
                                    />
                                </div>
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...resData}
                                        exportHeaders
                                    >
                                        <DataTable
                                            data={setResList}
                                            // noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default MySchoolProfile;
