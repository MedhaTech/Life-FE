/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import './Student.scss';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardText,
    Label
} from 'reactstrap';
import Layout from '../Layout.jsx';
import 'sweetalert2/src/sweetalert2.scss';
import { getCurrentUser } from '../../helpers/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentByIdData } from '../../redux/studentRegistration/actions';
import axios from 'axios';

const MyProfile = () => {
    const currentUser = getCurrentUser('current_user');
    const { teamMember } = useSelector((state) => state.studentRegistration);
    const [data, setData] = useState('');
    const [showMentorCard, setshowMentorCard] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStudentByIdData(currentUser?.data[0]?.student_id));
    }, [dispatch, currentUser?.data[0]?.student_id]);
    // useEffect(() => {
    //     if (teamMember && teamMember?.team?.moc_name !== null) {
    //         setshowMentorCard(true);
    //     }
    // }, [teamMember]);
    return (
        <Layout title="My Profile">
            <Container className="MyProfile pt-3 pt-xl-5 mb-50">
                {/* <UsersPage /> */}
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <Label>My Profile</Label>
                        <Row>
                            <Col md={12}>
                                <Card className="w-100  mb-5 p-4">
                                    <CardBody>
                                        <Row>
                                            <Col
                                                md={12}
                                                className="my-auto profile-detail "
                                            >
                                                <CardText>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Name</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.student_full_name
                                                                    ? teamMember?.student_full_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Course</b>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        // md={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember
                                                                    ?.stream
                                                                    ?.stream_name
                                                                    ? teamMember
                                                                        ?.stream
                                                                        ?.stream_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Year of Study</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
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
                                                            // md={8}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.year_of_study
                                                                    ? teamMember?.year_of_study
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Age</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
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
                                                            // md={8}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.Age
                                                                    ? teamMember?.Age
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Gender</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.Gender
                                                                    ? teamMember?.Gender
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Date of Birth</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.date_of_birth
                                                                    ? teamMember?.date_of_birth
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Email Id</b>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        // md={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.email
                                                                    ? teamMember?.email
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Mobile Number</b>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        // md={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember?.mobile
                                                                    ? teamMember?.mobile
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                </CardText>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card className="w-100  mb-5 p-4">
                                    <CardBody>
                                        <Row>
                                            <Col
                                                md={12}
                                                className="my-auto profile-detail"
                                            >
                                                <CardText>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                Institution
                                                                Unique Code
                                                            </b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.institution_code
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.institution_code
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                Institution Name
                                                            </b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.institution_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.institution_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                Institution Type
                                                            </b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.institution_type
                                                                    ?.institution_type
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.institution_type
                                                                        ?.institution_type
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Place</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.place
                                                                    ?.place_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.place
                                                                        ?.place_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Block</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.place
                                                                    ?.taluk
                                                                    ?.block
                                                                    ?.block_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.place
                                                                        ?.taluk
                                                                        ?.block
                                                                        ?.block_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Taluk</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.place
                                                                    ?.taluk
                                                                    ?.taluk_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.place
                                                                        ?.taluk
                                                                        ?.taluk_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>District</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.place
                                                                    ?.taluk
                                                                    ?.block
                                                                    ?.district
                                                                    ?.district_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.place
                                                                        ?.taluk
                                                                        ?.block
                                                                        ?.district
                                                                        ?.district_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>State</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.institution
                                                                    ?.place
                                                                    ?.taluk
                                                                    ?.block
                                                                    ?.district
                                                                    ?.state
                                                                    ?.state_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.institution
                                                                        ?.place
                                                                        ?.taluk
                                                                        ?.block
                                                                        ?.district
                                                                        ?.state
                                                                        ?.state_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Team Name</b>
                                                        </Col>
                                                        <Col
                                                            //  md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.team_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.team_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>

                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            // md={3}
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>Mentor Name</b>
                                                        </Col>
                                                        <Col
                                                            // md={1}
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            // md={8}
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <b>
                                                                {teamMember.team
                                                                    ?.mentor
                                                                    ?.mentor_name
                                                                    ? teamMember
                                                                        .team
                                                                        ?.mentor
                                                                        ?.mentor_name
                                                                    : '-'}
                                                            </b>
                                                        </Col>
                                                    </Row>
                                                </CardText>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                {/* {showMentorCard && ( */}
                                {/* // <Card className="w-100  mb-5 p-4"> */}
                                {/* <CardBody> */}
                                {/* <Row> */}
                                {/* <Col
                                                    md={12}
                                                    className="my-auto profile-detail "
                                                >
                                                    <CardText>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                // md={3}
                                                                xs={12}
                                                                sm={12}
                                                                md={12}
                                                                xl={12}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '20px'
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    Mentor
                                                                    Details
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                // md={3}
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {' '}
                                                                    Mentor Name
                                                                </b>
                                                            </Col>
                                                            <Col
                                                                // md={1}
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                // md={8}
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {teamMember
                                                                        .team
                                                                        ?.moc_name
                                                                        ? teamMember
                                                                              .team
                                                                              ?.moc_name
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>

                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                // md={3}
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>Email Id</b>
                                                            </Col>
                                                            <Col
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                                // md={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                // md={8}
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {teamMember
                                                                        .team
                                                                        ?.moc_email
                                                                        ? teamMember
                                                                              .team
                                                                              ?.moc_email
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>

                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                // md={3}
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>Mobile No</b>
                                                            </Col>
                                                            <Col
                                                                // md={1}
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
                                                                // md={8}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {teamMember
                                                                        .team
                                                                        ?.moc_phone
                                                                        ? teamMember
                                                                              .team
                                                                              ?.moc_phone
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>

                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                // md={3}
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>Gender</b>
                                                            </Col>
                                                            <Col
                                                                // md={1}
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                // md={8}
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {teamMember
                                                                        .team
                                                                        ?.moc_gender
                                                                        ? teamMember
                                                                              .team
                                                                              ?.moc_gender
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                    </CardText>
                                                </Col> */}
                                {/* </Row> */}
                                {/* </CardBody> */}
                                {/* </Card> */}
                                {/* )} */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default MyProfile;
