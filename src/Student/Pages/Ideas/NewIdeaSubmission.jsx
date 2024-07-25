/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import Layout from '../../Layout';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextArea } from '../../../stories/TextArea/TextArea';
import CommonPage from '../../../components/CommonPage';
import IdeaSubmission from '../../Pages/Ideas/IdeaSubmission';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import moment from 'moment';
import a from '../../../assets/media/Themes/1.png';
import b from '../../../assets/media/Themes/2.png';
import c from '../../../assets/media/Themes/3.png';
import d from '../../../assets/media/Themes/4.png';
import e from '../../../assets/media/Themes/5.png';
import f from '../../../assets/media/Themes/6.png';
import g from '../../../assets/media/Themes/7.png';
import h from '../../../assets/media/Themes/8.png';

import { Button } from '../../../stories/Button';
import { getCurrentUser, getNormalHeaders } from '../../../helpers/Utils';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { openNotificationWithIcon } from '../../../helpers/Utils';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { KEY } from '../../../constants/defaultValues';
const LinkComponent = ({ original, item, url, removeFileHandler, i }) => {
    let a_link;
    let count;
    if (url) {
        a_link = item.split('/');
        count = a_link.length - 1;
    }
    return (
        <>
            {original ? (
                <div className="badge mb-2 bg-info ms-3">
                    <span className="p-2">{item.name}</span>
                    {original && (
                        <span
                            className="pointer"
                            onClick={() => removeFileHandler(i)}
                        >
                            <AiOutlineCloseCircle size={20} />
                        </span>
                    )}
                </div>
            ) : (
                <a
                    className="badge mb-2 bg-info p-3 ms-3"
                    href={item}
                    target="_blank"
                    rel="noreferrer"
                >
                    {a_link[count]}
                </a>
            )}
        </>
    );
};
function NewIdeaSubmission(props) {
    const history = useHistory();
    const { t } = useTranslation();
    const FirstInitiaData =
        (history && history.location && history.location.data) || false;
    // const NewIdeaid =
    //     (history && history.location && history.location.data.idea);
    console.log(props, history);
    const currentUser = getCurrentUser('current_user');
    const StudentId = currentUser?.data[0]?.student_id;
    const userId = currentUser?.data[0]?.user_id;
    const district = currentUser?.data[0]?.district;
    const state = currentUser?.data[0]?.state;
    const condition1 = localStorage.getItem('condition') === 'true';
    const [condition, setCondition] = useState(condition1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [files, setFiles] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const showPage = false;
    const comingSoonText = t('dummytext.student_idea_sub');
    const initialLoadingStatus = { draft: false, submit: false };
    const [loading, setLoading] = useState(initialLoadingStatus);
    const [submitedData, setSubmittedData] = useState({});
    const [theme, setTheme] = useState(
        props?.submitedData?.themes_problem?.theme_name
    );
    // const [theme, setTheme] = useState('');
    // console.log(submitedData?.themes_problem?.theme_name, '111');
    const [finalPage, setFinalPage] = useState(false);
    const [othersTheme, setOthersTheme] = useState('');
    const [othersPStatment, setOthersPStatment] = useState('');

    const [ideaIntiation, setIdeaIntiation] = useState('');
    console.log(props?.submitedData?.idea_id,"props?.submitedData");
    const [probStatment, setProbStatment] = useState(
        props?.submitedData?.themes_problem?.problem_statement
            ? props?.submitedData?.themes_problem?.problem_statement
            : ''
    );
    const [description, setDescription] = useState(
        props?.submitedData?.themes_problem?.problem_statement_description
    );
    console.log(history.location.data);
    const [ideaTitle, setIdeaTitle] = useState(props?.submitedData?.idea_title);
    // const [solStatement, setSolStatement] = useState(
    //     submitedData?.solution_statement
    // );
    const [detailSol, setDetailSol] = useState(
        props?.submitedData?.detailed_solution
    );
    const [protoType, setProtoType] = useState(
        props?.submitedData?.prototype_available
    );
    const question = ['YES', 'NO'];
    const ideaSubmitted = ['YES', 'NO'];
    const [ideaPublication, setIdeaPublication] = useState(
        props?.submitedData?.idea_available
    );
    const [selfCheck, setSelfCheck] = useState(
        props?.submitedData?.self_declaration === 'YES' ? true : false
    );
    const [themesList, setThemesList] = useState([]);
    const [submitedFile, setSubmitedFile] = useState(
        props?.submitedData?.Prototype_file
            ? props?.submitedData?.Prototype_file.split(', ')
            : []
    );
    const [statementList, setStatementList] = useState([]);
    const [listofproblemsandID, setListofproblemsandID] = useState([]);
    const [themeProId, setThemeProId] = useState(
        props?.submitedData?.theme_problem_id
            ? props?.submitedData?.theme_problem_id
            : '0'
    );
    const [youtubeLink, setYoutubeLink] = useState('');
    const [fppdetails, setFppdetails] = useState('');
    const imagesList = [a, b, c, d, e, f, g, h];
    const leftThemes = themesList.slice(0, 4);
    const leftImages = imagesList.slice(0, 4);
    const rightThemes = themesList.slice(4);
    const rightImages = imagesList.slice(4);
    let idea_id = 0;

    useEffect(() => {
        if (theme === 'Others') {
            setProbStatment('');
        }
    }, [theme]);

    useEffect(() => {
        themeApi();
        setThemeProId(
            props?.submitedData?.theme_problem_id
                ? props?.submitedData?.theme_problem_id
                : '0'
        );
        setTheme(
            props?.submitedData?.themes_problem?.theme_name
                ? props?.submitedData?.themes_problem?.theme_name
                : ''
        );
        setProbStatment(
            props?.submitedData?.themes_problem?.problem_statement
                ? props?.submitedData?.themes_problem?.problem_statement
                : ''
        );

        setIdeaTitle(props?.submitedData?.idea_title);
        setDetailSol(props?.submitedData?.detailed_solution);
        setProtoType(props?.submitedData?.prototype_available);
        setIdeaPublication(props?.submitedData?.idea_available);
        setSelfCheck(
            props?.submitedData?.self_declaration === 'YES' ? true : false
        );
        setSubmitedFile(
            props?.submitedData?.Prototype_file
                ? props?.submitedData?.Prototype_file.split(', ')
                : []
        );
    }, [props?.submitedData]);
    useEffect(() => {
        // console.log(submitedData);
        if (props?.submitedData?.status === 'SUBMITTED') {
            setCondition(true);
            localStorage.setItem('condition', true);
        }
        if (
            props?.submitedData?.status !== 'SUBMITTED' &&
            props?.submitedData?.initiated_by !== currentUser?.data[0]?.user_id
        ) {
            setCondition(true);
        }
        if (FirstInitiaData) {
            setCondition(false);
        }
    }, [props?.submitedData]);
    useEffect(() => {
        setIsDisabled(true);
    }, []);
    useEffect(() => {
        themeApi();
    }, []);
    useEffect(() => {
        if (theme) {
            statemtsApi();
        }
    }, [theme]);
    useEffect(() => {
        if (themeProId) {
            listofproblemsandID.length > 0 &&
                setProbStatment(
                    listofproblemsandID[themeProId]?.problem_statement
                );
            setDescription(
                listofproblemsandID[themeProId]?.problem_statement_description
            );
        }
    }, [themeProId]);
    const themeApi = () => {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/themes_problems/getthemes`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setThemesList([...response.data.data]);
                    if (
                        props?.submitedData?.themes_problem &&
                        props?.submitedData?.themes_problem?.status === 'MANUAL'
                    ) {
                        if (
                            response.data.data.includes(
                                props?.submitedData?.themes_problem?.theme_name
                            )
                        ) {
                            setTheme(
                                props?.submitedData?.themes_problem?.theme_name
                            );
                        } else {
                            setTheme('Others');
                            setOthersTheme(
                                props?.submitedData?.themes_problem?.theme_name
                            );
                        }
                        setProbStatment('Others');
                        setOthersPStatment(
                            props?.submitedData?.themes_problem
                                ?.problem_statement
                        );
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const statemtsApi = () => {
        const Param = encryptGlobal(
            JSON.stringify({
                theme_name: theme
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/themes_problems/getproblemstatement?Data=${Param}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    const otherArray = {
                        problem_statement: 'Others',
                        problem_statement_description: '',
                        theme_problem_id: 0
                    };
                    const otherList = [...response.data.data, otherArray];
                    setStatementList(otherList);
                    let decandId = [];
                    otherList.map((itea, i) => {
                        decandId[itea.theme_problem_id] = {
                            problem_statement_description:
                                itea.problem_statement_description,
                            problem_statement: itea.problem_statement
                        };
                    });
                    setListofproblemsandID(decandId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // const scroll = () => {
    //     const section = document.querySelector('#start');
    //     section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // };
    const handleEdit = () => {
        setIsDisabled(false);
        //scroll();
        localStorage.setItem('condition', false);
        setCondition(false);
    };

    async function apiCall(file) {
        let attachmentsList = '';
        if (file) {
            attachmentsList = file.join(', ');
        }
        // Dice code list API //
        const body = {
            student_id: StudentId,
            initiated_by: userId,
            district: district,
            state: state,
            theme_name: theme === 'Others' ? othersTheme : theme,
            problem_statement_id: themeProId,
            problem_statement:
                theme === 'Others'
                    ? othersPStatment
                    : probStatment === 'Others'
                    ? othersPStatment
                    : probStatment,
            problem_statement_description: description,
            idea_title: ideaTitle,
            youtubelink:youtubeLink,
            fpp:fppdetails,
            // solution_statement: solStatement,
            detailed_solution: detailSol,
            prototype_available: protoType,
            idea_available: ideaPublication,
            self_declaration: selfCheck ? 'YES' : 'NO',
            status: 'DRAFT'
        };
        if (attachmentsList !== '') {
            body['Prototype_file'] = attachmentsList;
        }

        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/ideas/initiate',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: JSON.stringify(body)
        };

        await axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    console.log(condition, 'condition 1');

                    setIdeaIntiation(response?.data.data[0].initiated_by);
                    idea_id = response?.data.data[0].idea_id;
                    setSubmittedData(response?.data.data[0]);
                    console.log(submitedData);
                    openNotificationWithIcon(
                        'success',
                        'Idea Initiated Successfully'
                    );
                    localStorage.setItem('condition', true);
                    setCondition(true);
                    setIsDisabled(true);
                    console.log(condition, 'condition 2');

                    setPageEnable(false);
                    history.push({
                        data: {
                            idea: idea_id,
                            submitedData: response?.data.data[0]
                        }
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSubmit = async (item, stats) => {
        // console.log(submitedData, 'before api call condition');
        if (!Object.keys(submitedData).length && props?.submitedData?.idea_id === undefined) {
            console.log('Api Call');
            if (files.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    let fieldName = 'file' + i ? i : '';
                    formData.append(fieldName, files[i]);
                }
                const axiosConfig = getNormalHeaders(KEY.User_API_Key);
                const subId = encryptGlobal(
                    JSON.stringify({
                        student_id: currentUser?.data[0]?.student_id
                    })
                );
                const result = await axios
                    .post(
                        `${
                            process.env.REACT_APP_API_BASE_URL +
                            '/ideas/fileUpload'
                        }?Data=${subId}`,
                        formData,
                        axiosConfig
                    )
                    .then((res) => res)
                    .catch((err) => {
                        return err.response;
                    });
                if (result && result.status === 200) {
                    setImmediateLink(result.data?.data[0]?.attachments);
                    setSubmitedFile(result.data?.data[0]?.attachments);
                    await apiCall(result.data?.data[0]?.attachments);
                } else {
                    openNotificationWithIcon(
                        'error',
                        `${result?.data?.message}`
                    );
                    return;
                }

            } else {
                await apiCall();
            }
            
            setCondition(true);
            console.log(condition, 'condition 3');
            //scroll();
        } else {
            setSubmittedData(props?.submitedData);
            console.log(submitedData, 'After api call condition');
            if (files.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    let fieldName = 'file' + i ? i : '';
                    formData.append(fieldName, files[i]);
                }
                const axiosConfig = getNormalHeaders(KEY.User_API_Key);
                const subId = encryptGlobal(
                    JSON.stringify({
                        student_id: currentUser?.data[0]?.student_id
                    })
                );
                const result = await axios
                    .post(
                        `${
                            process.env.REACT_APP_API_BASE_URL +
                            '/ideas/fileUpload'
                        }?Data=${subId}`,
                        formData,
                        axiosConfig
                    )
                    .then((res) => res)
                    .catch((err) => {
                        return err.response;
                    });
                if (result && result.status === 200) {
                    setImmediateLink(result.data?.data[0]?.attachments);
                    setSubmitedFile(result.data?.data[0]?.attachments);
                    handleSubmitAll(
                        item,
                        stats,
                        result.data?.data[0]?.attachments
                    );
                } else {
                    openNotificationWithIcon(
                        'error',
                        `${result?.data?.message}`
                    );
                    return;
                }
            } else {
                handleSubmitAll(item, stats);
            }
        }
    };

    const handleSubmitAll = async (item, stats, file) => {
        let attachmentsList = '';
        if (file) {
            attachmentsList = file.join(', ');
        }
        const body = {
            student_id: StudentId,
            idea_id: props?.submitedData?.idea_id === undefined ? submitedData?.idea_id : props?.submitedData?.idea_id,
            // idea_id : NewIdeaid,
            theme_name: theme === 'Others' ? othersTheme : theme,
            problem_statement_id: themeProId,
            problem_statement:
                theme === 'Others'
                    ? othersPStatment
                    : probStatment === 'Others'
                    ? othersPStatment
                    : probStatment,
            problem_statement_description: description,
            youtubelink:youtubeLink,
            fpp: fppdetails,
            idea_title: ideaTitle,
            // solution_statement: solStatement,
            detailed_solution: detailSol,
            prototype_available: protoType,
            idea_available: ideaPublication,
            self_declaration: selfCheck ? 'YES' : 'NO',
            status: stats
        };
        if (attachmentsList !== '') {
            body['Prototype_file'] = attachmentsList;
        }
        var allques = true;
        if (stats === 'SUBMITTED') {
            if (
                // theme !== '' &&
                // themeProId !== '' &&
                // probStatment !== '' &&
                // description !== '' &&
                // ideaTitle !== '' &&
                // solStatement !== '' &&
                // detailSol !== '' &&
                // protoType !== '' &&
                // ideaPublication !== '' &&
                // selfCheck !== false
                theme === '' ||
                themeProId === '' ||
                probStatment === '' ||
                typeof probStatment === 'undefined' ||
                description === '' ||
                ideaTitle === '' ||
                // solStatement === '' ||
                detailSol === '' ||
                protoType === '' ||
                ideaPublication === '' ||
                selfCheck === false
            ) {
                allques = false;
            }

            if (
                protoType === 'YES' &&
                attachmentsList.length === 0 &&
                submitedFile.length === 0
            ) {
                allques = false;
            }
        }
        if (allques || stats === 'DRAFT') {
            var config = {
                method: 'put',
                url: `${
                    process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate'
                }`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: JSON.stringify(body)
            };
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        localStorage.setItem('condition', true);
                        setCondition(true);
                        setCurrentStep(1);
                        if (stats === 'SUBMITTED') {
                            openNotificationWithIcon(
                                'success',
                                'Idea submission successful'
                            );
                            history.push('/List');
                            // setFinalPage(true);
                            // props.showChallenges();
                        } else {
                            openNotificationWithIcon(
                                'success',
                                'Save as Draft success'
                            );
                            setIsDisabled(true);
                            //scroll();
                        }
                    }
                })
                .catch(function (error) {
                    // openNotificationWithIcon(
                    //     'error',
                    //     error?.response?.data?.message
                    // );
                    console.log(error);
                });
        } else {
            openNotificationWithIcon('error', 'Please fill all the questions');
        }
    };

    const [immediateLink, setImmediateLink] = useState(null);
    const handleUploadFiles = (addedFiles) => {
        const upload = [...files];
        addedFiles.some((item) => {
            if (upload.findIndex((i) => i.name === item.name) === -1)
                upload.push(item);
        });
        setFiles(upload);
        setImmediateLink(null);
    };
    const removeFileHandler = (i) => {
        const fileAdded = [...files];
        fileAdded.splice(i, 1);
        setFiles(fileAdded);
    };
    let maxFileSize = 10000000;
    const fileHandler = (e) => {
        let choosenFiles = Array.prototype.slice.call(e.target.files);
        e.target.files = null;
        let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
        const checkPat = choosenFiles.filter((item) => {
            let pat = item.name.split('.');
            pat.pop();
            return pat.join().search(pattern);
        });
        if (checkPat.length > 0) {
            openNotificationWithIcon(
                'error',
                "Only alphanumeric and '_' are allowed "
            );
            return;
        }
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        if (
            choosenFiles.filter(
                (item) => allowedTypes.includes(item.type) === false
            ).length > 0
        ) {
            openNotificationWithIcon(
                'error',
                t('Accepting only png,jpg,jpeg,pdf,doc,docx Only')
            );
            return;
        }
        if (choosenFiles.filter((item) => item.size > maxFileSize).length > 0) {
            openNotificationWithIcon('error', t('student.less_10MB'));
            return;
        }
        handleUploadFiles(choosenFiles);
    };
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    return (
        <Layout title="Idea Submission">
            {finalPage ? (
                <CommonPage
                    text={t('student.idea_submitted_desc')}
                    showButton={true}
                />
            ) : (
                <Container className="presuervey mb-50 mt-5 " id="start">
                    <h2>{t('student_course.idea_submission')}</h2>
                    <Col>
                        <Row className=" justify-content-center">
                            <div className="aside  mb-5 p-4">
                                <CardBody>
                                    <Form
                                        className="form-row row mb-5"
                                        isSubmitting
                                    >
                                        <Row>
                                            <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                <div className="question quiz mb-0">
                                                    <b
                                                        style={{
                                                            fontSize: '1.6rem'
                                                        }}
                                                    >
                                                        {/* {1}.{' '} */}
                                                        {t(
                                                            'student_course.ques1'
                                                        )}
                                                    </b>
                                                </div>

                                                <div className=" answers row flex-column p-4">
                                                    {/* <fieldset disabled={condition}>
                                                        {themesList.map((item, i) => (
                                                            <div key={i} style={{ // Adjust this padding value
                                                                lineHeight : "3rem"
                                                            }} >
                                                                
                                                                <label htmlFor={`theme-${i}`}
                                                                    style={{
                                                                        fontSize:
                                                                            '1.4rem',
                                                                        display:
                                                                            'flex', 
                                                                        alignItems:
                                                                            'center'
                                                                     }} 
                                                                >
                                                                <input
                                                                    type="radio"
                                                                    id={`theme-${i}`}
                                                                    name="theme"
                                                                    value={item}
                                                                    checked={item === theme}
                                                                    onChange={() => setTheme(item)}
                                                                    style={{
                                                                        marginRight: '1rem', 
                                                                        lineHeight : "1rem"
                                                                    }} 
                                                                />
                                                                <img
                                                                    src={imagesList[i]}
                                                                    alt={`${item} theme`}
                                                                    className="theme-image"
                                                                    style={{
                                                                        width : "10%",
                                                                        height : "10%"
                                                                    }} 
                                                                />
                                                                    {item}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </fieldset> */}
                                                    <div className="theme-container row">
                                                        <div className="theme-column col-6">
                                                            {leftThemes.map(
                                                                (item, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="theme-option"
                                                                    >
                                                                        <label
                                                                            htmlFor={`theme-left-${i}`}
                                                                            style={{
                                                                                fontSize:
                                                                                    '1.4rem',
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center'
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                id={`theme-left-${i}`}
                                                                                name="theme"
                                                                                value={
                                                                                    item
                                                                                }
                                                                                disabled={
                                                                                    condition
                                                                                }
                                                                                checked={
                                                                                    item ===
                                                                                    theme
                                                                                }
                                                                                onChange={() => {
                                                                                    setTheme(
                                                                                        item
                                                                                    );
                                                                                    handleNextStep();
                                                                                }}
                                                                                style={{
                                                                                    marginRight:
                                                                                        '1rem',
                                                                                    lineHeight:
                                                                                        '1rem'
                                                                                }}
                                                                            />

                                                                            <img
                                                                                src={
                                                                                    leftImages[
                                                                                        i
                                                                                    ]
                                                                                }
                                                                                alt={`${item} theme`}
                                                                                className="theme-image"
                                                                                style={{
                                                                                    width: '15%',
                                                                                    height: '15%'
                                                                                }}
                                                                            />
                                                                            {
                                                                                item
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="theme-column col-6">
                                                            {rightThemes.map(
                                                                (item, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="theme-option"
                                                                    >
                                                                        <label
                                                                            htmlFor={`theme-right-${i}`}
                                                                            style={{
                                                                                fontSize:
                                                                                    '1.4rem',
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center'
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                id={`theme-right-${i}`}
                                                                                name="theme"
                                                                                value={
                                                                                    item
                                                                                }
                                                                                disabled={
                                                                                    condition
                                                                                }
                                                                                checked={
                                                                                    item ===
                                                                                    theme
                                                                                }
                                                                                onChange={() => {
                                                                                    setTheme(
                                                                                        item
                                                                                    );
                                                                                    handleNextStep();
                                                                                }}
                                                                                //onClick={handleNextStep()}
                                                                                style={{
                                                                                    marginRight:
                                                                                        '1rem',
                                                                                    lineHeight:
                                                                                        '1rem'
                                                                                }}
                                                                            />

                                                                            <img
                                                                                src={
                                                                                    rightImages[
                                                                                        i
                                                                                    ]
                                                                                }
                                                                                alt={`${item} theme`}
                                                                                className="theme-image"
                                                                                style={{
                                                                                    width: '15%',
                                                                                    height: '15%'
                                                                                }}
                                                                            />
                                                                            {
                                                                                item
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* <select
                                                        disabled={condition}
                                                        onChange={(e) =>
                                                            setTheme(
                                                                e.target.value
                                                            )
                                                        }
                                                        name="teams"
                                                        id="teams"
                                                    >
                                                        <option value={''}>
                                                            Please select the
                                                            Theme
                                                        </option>
                                                        {themesList.map(
                                                            (item, i) => (
                                                                <option
                                                                    key={i}
                                                                    value={item}
                                                                    selected={
                                                                        item ===
                                                                        theme
                                                                    }
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select> */}
                                                </div>
                                            </Row>
                                            <div>
                                                {theme && theme === 'Others' && (
                                                    <>
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'student_course.ques1other'
                                                                    )}
                                                                </b>
                                                            </div>
                                                            <FormGroup
                                                                check
                                                                className="answers"
                                                            >
                                                                <Label
                                                                    check
                                                                    style={{
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    <TextArea
                                                                        disabled={
                                                                            condition
                                                                        }
                                                                        placeholder="Enter your Theme Name"
                                                                        value={
                                                                            othersTheme
                                                                        }
                                                                        maxLength={
                                                                            100
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setOthersTheme(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                            handleNextStep();
                                                                        }}
                                                                    />
                                                                </Label>
                                                            </FormGroup>
                                                            <div className="text-end">
                                                                {t(
                                                                    'student_course.chars'
                                                                )}{' '}
                                                                :
                                                                {100 -
                                                                    (othersTheme
                                                                        ? othersTheme.length
                                                                        : 0)}
                                                            </div>
                                                        </Row>

                                                        {othersTheme.length >
                                                            2 && (
                                                            <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                                <div className="question quiz mb-0">
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '1.6rem'
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'student_course.ques2others'
                                                                        )}
                                                                    </b>
                                                                </div>
                                                                <FormGroup
                                                                    check
                                                                    className="answers"
                                                                >
                                                                    <Label
                                                                        check
                                                                        style={{
                                                                            width: '100%'
                                                                        }}
                                                                    >
                                                                        <TextArea
                                                                            disabled={
                                                                                condition
                                                                            }
                                                                            placeholder="Enter your Problem statement"
                                                                            value={
                                                                                othersPStatment
                                                                            }
                                                                            maxLength={
                                                                                1000
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setOthersPStatment(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                                handleNextStep();
                                                                            }}
                                                                        />
                                                                    </Label>
                                                                </FormGroup>
                                                                <div className="text-end">
                                                                    {t(
                                                                        'student_course.chars'
                                                                    )}{' '}
                                                                    :
                                                                    {1000 -
                                                                        (othersPStatment
                                                                            ? othersPStatment.length
                                                                            : 0)}
                                                                </div>
                                                            </Row>
                                                        )}
                                                    </>
                                                )}
                                                {theme && theme !== 'Others' && (
                                                    <>
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'student_course.ques2'
                                                                    )}
                                                                </b>
                                                            </div>

                                                            <div className=" answers row flex-column p-4">
                                                                {statementList.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <>
                                                                            <label
                                                                                key={
                                                                                    i
                                                                                }
                                                                                style={{
                                                                                    margin: '1rem',
                                                                                    fontSize:
                                                                                        '1.6rem'
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        condition
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        item.theme_problem_id
                                                                                    }
                                                                                    checked={
                                                                                        item.problem_statement ===
                                                                                        probStatment
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        setThemeProId(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />{' '}
                                                                                {
                                                                                    item.problem_statement
                                                                                }
                                                                            </label>
                                                                            <br />
                                                                        </>
                                                                    )
                                                                )}
                                                            </div>
                                                        </Row>
                                                    </>
                                                )}
                                                {probStatment &&
                                                    probStatment ===
                                                        'Others' && (
                                                        <>
                                                            <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                                <div className="question quiz mb-0">
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '1.6rem'
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'student_course.ques2others'
                                                                        )}
                                                                    </b>
                                                                </div>
                                                                <FormGroup
                                                                    check
                                                                    className="answers"
                                                                >
                                                                    <Label
                                                                        check
                                                                        style={{
                                                                            width: '100%'
                                                                        }}
                                                                    >
                                                                        <TextArea
                                                                            disabled={
                                                                                condition
                                                                            }
                                                                            placeholder="Enter your Problem statement"
                                                                            value={
                                                                                othersPStatment
                                                                            }
                                                                            maxLength={
                                                                                1000
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setOthersPStatment(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    </Label>
                                                                </FormGroup>
                                                                <div className="text-end">
                                                                    {t(
                                                                        'student_course.chars'
                                                                    )}{' '}
                                                                    :
                                                                    {1000 -
                                                                        (othersPStatment
                                                                            ? othersPStatment.length
                                                                            : 0)}
                                                                </div>
                                                            </Row>
                                                        </>
                                                    )}

                                                {/* {probStatment &&
                                                    probStatment !=
                                                        'Others' && (
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                {theme ===
                                                                'Others' ? (
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '1.6rem'
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'student_course.ques3description'
                                                                        )}
                                                                    </b>
                                                                ) : theme !==
                                                                      'Others' &&
                                                                  probStatment ===
                                                                      'Others' ? (
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '1.6rem'
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'student_course.ques3description'
                                                                        )}
                                                                    </b>
                                                                ) : (
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '1.6rem'
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'student_course.ques3description'
                                                                        )}
                                                                    </b>
                                                                )}
                                                            </div>
                                                            <FormGroup
                                                                check
                                                                className="answers"
                                                            >
                                                                <Label
                                                                    check
                                                                    style={{
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    <TextArea
                                                                        disabled={
                                                                            condition ||
                                                                            (theme !==
                                                                                'Others' &&
                                                                                probStatment !==
                                                                                    'Others')
                                                                        }
                                                                        placeholder="Enter the Problem statement"
                                                                        value={
                                                                            description
                                                                        }
                                                                        maxLength={
                                                                            1000
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setDescription(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </Label>
                                                            </FormGroup>
                                                            <div className="text-end">
                                                                {t(
                                                                    'student_course.chars'
                                                                )}{' '}
                                                                :
                                                                {1000 -
                                                                    (description
                                                                        ? description.length
                                                                        : 0)}
                                                            </div>
                                                        </Row>
                                                    )} */}

                                                {(probStatment ||
                                                    othersTheme.length > 2) && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {t(
                                                                    'student_course.ques4ideatitile'
                                                                )}
                                                            </b>
                                                        </div>
                                                        <FormGroup
                                                            check
                                                            className="answers"
                                                        >
                                                            <Label
                                                                check
                                                                style={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <TextArea
                                                                    disabled={
                                                                        condition
                                                                    }
                                                                    placeholder="Enter your Idea Title Name"
                                                                    value={
                                                                        ideaTitle
                                                                    }
                                                                    maxLength={
                                                                        200
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setIdeaTitle(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                        <div className="text-end">
                                                            {t(
                                                                'student_course.chars'
                                                            )}{' '}
                                                            :
                                                            {200 -
                                                                (ideaTitle
                                                                    ? ideaTitle.length
                                                                    : 0)}
                                                        </div>
                                                    </Row>
                                                )}
                                                {(probStatment ||
                                                    othersTheme.length > 2) && (<Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            {/* {theme ===
                                                            'Others' ? (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {7}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            ) : probStatment ===
                                                              'Others' ? (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {7}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            ) : (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {6}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            )} */}
                                                             <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                        </div>
                                                        <FormGroup
                                                            check
                                                            className="answers"
                                                        >
                                                            <Label
                                                                check
                                                                style={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <TextArea
                                                                    disabled={
                                                                        condition
                                                                    }
                                                                    placeholder="Enter your Detailed solution "
                                                                    value={
                                                                        detailSol
                                                                    }
                                                                    maxLength={
                                                                        5000
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setDetailSol(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                        <div className="text-end">
                                                            {t(
                                                                'student_course.chars'
                                                            )}{' '}
                                                            :
                                                            {5000 -
                                                                (detailSol
                                                                    ? detailSol.length
                                                                    : 0)}
                                                        </div>
                                                    </Row>)}
                                                

                                                {(probStatment ||
                                                    othersTheme.length > 2) && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {t(
                                                                    'student_course.ques7Prototype'
                                                                )}
                                                            </b>
                                                        </div>

                                                        <div className=" answers row flex-column p-4">
                                                            <div>
                                                                {question.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <>
                                                                            <label
                                                                                key={
                                                                                    i
                                                                                }
                                                                                style={{
                                                                                    margin: '1rem',
                                                                                    fontSize:
                                                                                        '1.6rem'
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        condition
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        item
                                                                                    }
                                                                                    checked={
                                                                                        item ===
                                                                                        protoType
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        setProtoType(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />{' '}
                                                                                {
                                                                                    item
                                                                                }
                                                                            </label>
                                                                            <br />
                                                                        </>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Row>
                                                )}
                                                {/* <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            {theme ===
                                                            'Others' ? (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {7}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            ) : probStatment ===
                                                              'Others' ? (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {7}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            ) : (
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {6}.{' '}
                                                                    {t(
                                                                        'student_course.ques6detailsol'
                                                                    )}
                                                                </b>
                                                            )}
                                                        </div>
                                                        <FormGroup
                                                            check
                                                            className="answers"
                                                        >
                                                            <Label
                                                                check
                                                                style={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <TextArea
                                                                    disabled={
                                                                        condition
                                                                    }
                                                                    placeholder="Enter your Detailed solution "
                                                                    value={
                                                                        detailSol
                                                                    }
                                                                    maxLength={
                                                                        5000
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setDetailSol(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                        <div className="text-end">
                                                            {t(
                                                                'student_course.chars'
                                                            )}{' '}
                                                            :
                                                            {5000 -
                                                                (detailSol
                                                                    ? detailSol.length
                                                                    : 0)}
                                                        </div>
                                                    </Row> */}
                                                
                                                
                                                {(protoType === 'YES') && (
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    Please
                                                                    Upload File
                                                                </b>
                                                            </div>
                                                            <div className=" answers row flex-column p-4">
                                                                <FormGroup
                                                                    check
                                                                    className="answers"
                                                                >
                                                                    <div className="wrapper my-3 common-flex">
                                                                        {!condition && (
                                                                            <Button
                                                                                type="button"
                                                                                btnClass={`${
                                                                                    condition
                                                                                        ? 'secondary'
                                                                                        : 'primary'
                                                                                } me-3 pointer `}
                                                                                size="small"
                                                                                label={t(
                                                                                    'student.upload_file'
                                                                                )}
                                                                            />
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            name="file"
                                                                            disabled={
                                                                                condition
                                                                            }
                                                                            accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                                                            multiple
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                fileHandler(
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </FormGroup>
                                                                <div className="mx-4">
                                                                    {immediateLink &&
                                                                        immediateLink.length >
                                                                            0 &&
                                                                        immediateLink.map(
                                                                            (
                                                                                item,
                                                                                i
                                                                            ) => (
                                                                                <LinkComponent
                                                                                    item={
                                                                                        item
                                                                                    }
                                                                                    url={
                                                                                        true
                                                                                    }
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                    {!immediateLink &&
                                                                        files.length >
                                                                            0 &&
                                                                        files.map(
                                                                            (
                                                                                item,
                                                                                i
                                                                            ) => (
                                                                                <LinkComponent
                                                                                    original={
                                                                                        true
                                                                                    }
                                                                                    item={
                                                                                        item
                                                                                    }
                                                                                    i={
                                                                                        i
                                                                                    }
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    removeFileHandler={
                                                                                        removeFileHandler
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}

                                                                    {!immediateLink &&
                                                                        files.length ===
                                                                            0 &&
                                                                        submitedFile.map(
                                                                            (
                                                                                item,
                                                                                i
                                                                            ) => (
                                                                                <LinkComponent
                                                                                    item={
                                                                                        item
                                                                                    }
                                                                                    url={
                                                                                        true
                                                                                    }
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </Row>
                                                )}
                                               {(protoType === 'YES') && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {t(
                                                                    'student_course.youtube'
                                                                )}
                                                            </b>
                                                        </div>
                                                        <FormGroup
                                                            check
                                                            className="answers"
                                                        >
                                                            <Label
                                                                check
                                                                style={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <TextArea
                                                                    disabled={
                                                                        condition
                                                                    }
                                                                    placeholder="Please Enter YouTube Link"
                                                                    value={
                                                                        youtubeLink
                                                                    }
                                                                    maxLength={
                                                                        5000
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setYoutubeLink(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                        <div className="text-end">
                                                            {t(
                                                                'student_course.chars'
                                                            )}{' '}
                                                            :
                                                            {5000 -
                                                                (youtubeLink
                                                                    ? youtubeLink.length
                                                                    : 0)}
                                                        </div>
                                                    </Row>
                                                )}

                                                {(probStatment ||
                                                    othersTheme.length > 2) && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {t(
                                                                    'student_course.ques9publication'
                                                                )}
                                                            </b>
                                                        </div>

                                                        <div className=" answers row flex-column p-4">
                                                            <div>
                                                                {ideaSubmitted.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <>
                                                                            <label
                                                                                key={
                                                                                    i
                                                                                }
                                                                                style={{
                                                                                    margin: '1rem',
                                                                                    fontSize:
                                                                                        '1.6rem'
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        condition
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        item
                                                                                    }
                                                                                    checked={
                                                                                        item ===
                                                                                        ideaPublication
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        setIdeaPublication(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />{' '}
                                                                                {
                                                                                    item
                                                                                }
                                                                            </label>
                                                                            <br />
                                                                        </>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Row>
                                                )}
                                                {(ideaPublication === 'YES') && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {t(
                                                                    'student_course.FPP_details'
                                                                )}
                                                            </b>
                                                        </div>
                                                        <FormGroup
                                                            check
                                                            className="answers"
                                                        >
                                                            <Label
                                                                check
                                                                style={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <TextArea
                                                                    disabled={
                                                                        condition
                                                                    }
                                                                    placeholder="Please Enter Forum/Programs/Publications Details"
                                                                    value={
                                                                        fppdetails
                                                                    }
                                                                    maxLength={
                                                                        5000
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setFppdetails(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </Label>
                                                        </FormGroup>
                                                        <div className="text-end">
                                                            {t(
                                                                'student_course.chars'
                                                            )}{' '}
                                                            :
                                                            {5000 -
                                                                (fppdetails
                                                                    ? fppdetails.length
                                                                    : 0)}
                                                        </div>
                                                    </Row>
                                                )}

                                                {(probStatment ||
                                                    othersTheme.length > 2) && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <Label
                                                            check
                                                            style={{
                                                                fontSize:
                                                                    '1.8rem'
                                                            }}
                                                        >
                                                            <Input
                                                                style={{
                                                                    margin: '1rem'
                                                                }}
                                                                type="checkbox"
                                                                name="self confirm"
                                                                disabled={
                                                                    condition
                                                                }
                                                                id="self confirm"
                                                                checked={
                                                                    selfCheck
                                                                }
                                                                onChange={(e) =>
                                                                    setSelfCheck(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                            {
                                                                ' I confirm that the Idea Submitted now submitted is not copied or plagiarized version.'
                                                            }
                                                        </Label>
                                                    </Row>
                                                )}
                                            </div>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </div>
                        </Row>
                        {!condition && submitedData?.status !== 'SUBMITTED' && (
                            <Row>
                                <Col className="d-flex justify-content-between">
                                    <div>
                                        <Button
                                            type="button"
                                            btnClass="me-3 text-white"
                                            backgroundColor="#067DE1"
                                            onClick={(e) =>
                                                handleSubmit(e, 'DRAFT')
                                            }
                                            size="small"
                                            label={`${
                                                loading.draft
                                                    ? t('teacher_teams.loading')
                                                    : t('teacher_teams.draft')
                                            }`}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {submitedData?.status !== 'SUBMITTED' &&
                        submitedData?.initiated_by ===
                            currentUser?.data[0]?.user_id ? (
                            <div className="text-right">
                                {condition && (
                                    <>
                                        <Button
                                            type="button"
                                            btnClass="me-3 text-white"
                                            backgroundColor="#067DE1"
                                            onClick={handleEdit}
                                            size="small"
                                            label={t('teacher_teams.edit_idea')}
                                        />
                                        <Button
                                            type="button"
                                            btnClass="primary"
                                            onClick={(e) =>
                                                handleSubmit(e, 'SUBMITTED')
                                            }
                                            size="small"
                                            label={t('teacher_teams.submit')}
                                        />
                                    </>
                                )}
                            </div>
                        ) : null}
                    </Col>
                </Container>
            )}
        </Layout>
    );
}

export default NewIdeaSubmission;
