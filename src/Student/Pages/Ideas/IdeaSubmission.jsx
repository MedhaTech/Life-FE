/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonPage from '../../../components/CommonPage';
import { getCurrentUser } from '../../../helpers/Utils';
import { getStudentChallengeSubmittedResponse } from '../../../redux/studentRegistration/actions';
import Layout from '../../Layout';
import IdeasPageNew from './IdeasPageCopy';
import NewIdeaSubmission from './NewIdeaSubmission';

import SDG from './SDG';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
const IdeaSubmission = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const challengesSubmittedResponse = useSelector(
        (state) => state?.studentRegistration.challengesSubmittedResponse
    );
    const currentUser = getCurrentUser('current_user');
    const [showChallenges, setShowChallenges] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [view, setView] = useState(false);
    const [isideadisable, setIsideadisable] = useState(false);
    const StudentId = currentUser?.data[0]?.student_id;
    const [ideaSubmittedData, setIdeaSubmittedData] = useState({});
    useEffect(() => {
        const Param = encryptGlobal(
            JSON.stringify({
                student_id: StudentId
            })
        );
        var configidea = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/ideas/submittedDetails?Data=${Param}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(configidea)
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response);
                    if (response.data.data !== null) {
                        setIdeaSubmittedData(response.data.data);
                        // setIsideadisable(true);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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
                    // console.log(response, '2');
                    if (response.data.data[0]?.on_off === '1') {
                        // setIsideadisable(true);
                    } else {
                        // setIsideadisable(false);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [showCompleted]);

    useLayoutEffect(() => {
        dispatch(
            getStudentChallengeSubmittedResponse(
                currentUser?.data[0]?.student_id,
                language
            )
        );
    }, [dispatch, language, currentUser?.data[0]?.student_id]);
    useLayoutEffect(() => {
        if (ideaSubmittedData && ideaSubmittedData.length > 0) {
            ideaSubmittedData[0].status === 'DRAFT'
                ? setShowChallenges(true)
                : view
                ? setShowChallenges(true)
                : setShowCompleted(true);
        } else {
            setShowChallenges(false);
        }
    }, [ideaSubmittedData, view]);
    const commonPageText = t('student.idea_submitted_desc');
    const handleView = () => {
        // here we can see the idea submission //
        setShowChallenges(true);
        setShowCompleted(false);
        setView(true);
    };
    const handleShow = () => {
        // here we can see the idea submission //
        // setShowChallenges(true);
        setShowCompleted(true);
        // setView(true);
    };
    return showCompleted ? (
        <Layout title="Idea Submission">
            <CommonPage
                text={commonPageText}
                showButton={true}
                showChallenges={handleView}
            />
        </Layout>
    ) : (
        // isideadisable ?
        // <IdeasPageNew />
        <NewIdeaSubmission
            submitedData={ideaSubmittedData[0]}
            showChallenges={handleShow}
        />
        // )
        // : (
        //     ''
        //  isideadisable ? (
        //     <SDG setShowChallenges={setShowChallenges} />
        // ) :
        // <Layout title="Idea Submission">
        //     <CommonPage
        //         // text={t('student_course.idea_submission_date_com_desc')}
        //         ideaSubmissionComButton={true}
        //     />
        // </Layout>
    );
};
export default IdeaSubmission;
