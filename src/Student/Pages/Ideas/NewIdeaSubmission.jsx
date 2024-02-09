/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import Layout from '../../Layout';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextArea } from '../../../stories/TextArea/TextArea';
import CommonPage from '../../../components/CommonPage';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
import { Button } from '../../../stories/Button';
import { getCurrentUser } from '../../../helpers/Utils';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { openNotificationWithIcon } from '../../../helpers/Utils';

function NewIdeaSubmission() {
    const history = useHistory();
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const [isDisabled, setIsDisabled] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadQId, setuploadQId] = useState(null);
    const showPage = false;
    const comingSoonText = t('dummytext.student_idea_sub');
    const initialLoadingStatus = { draft: false, submit: false };
    const [loading, setLoading] = useState(initialLoadingStatus);
    const [theme, setTheme] = useState('');
    const [others, setOthers] = useState('');
    const [probStatment, setProbStatment] = useState('');
    const [description, setDescription] = useState('');
    const [ideaTitle, setIdeaTitle] = useState('');
    const [solStatement, setSolStatement] = useState('');
    const [detailSol, setDetailSol] = useState('');
    const [protoType, setProtoType] = useState('');
    const question = ['YES', 'NO'];
    const ideaSubmitted = ['YES', 'NO'];
    const [ideaPublication, setIdeaPublication] = useState('');
    const [themesList, setThemesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [statementList, setStatementList] = useState([]);
    const TeamId = currentUser?.data[0]?.team_id;
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
        if (probStatment !== 'Others') {
            setDescription(probStatment);
        }
    }, [probStatment]);
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
                    setThemesList([...response.data.data, 'Others']);
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
                    setStatementList([...response.data.data, otherArray]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const scroll = () => {
        const section = document.querySelector('#start');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const handleEdit = () => {
        setIsDisabled(false);
        scroll();
    };
    // const handleSubmit = (item, stats) => {
    //     const body = JSON.stringify({
    //         team_id: TeamId,
    //         theme_name: theme,
    //         problem_statement_id: '',
    //         problem_statement: probStatment,
    //         problem_statement_description: description,
    //         idea_title: ideaTitle,
    //         solution_statement: solStatement,
    //         detailed_solution: detailSol,
    //         prototype_available: 1,
    //         idea_available: '1',
    //         self_declaration: '1',
    //         status: stats ? 'DRAFT' : 'SUBMITTED'
    //     });
    //     console.log(body, 'body');
    //     var config = {
    //         method: 'put',
    //         url: `${process.env.REACT_APP_API_BASE_URL + '/ideas/ideaUpdate'}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             console.log(response);
    //             // openNotificationWithIcon(
    //             //     'success',
    //             //     response?.data?.message == 'OK'
    //             //         ? 'Idea processed successfully!'
    //             //         : response?.data?.message
    //             // );
    //         })
    //         .catch(function (error) {
    //             openNotificationWithIcon(
    //                 'error',
    //                 error?.response?.data?.message
    //             );
    //         });
    // };

    return (
        <Layout title="Idea Submission">
            {showPage ? (
                <CommonPage text={comingSoonText} />
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
                                        {isDisabled ? (
                                            <>
                                                <Button
                                                    type="button"
                                                    btnClass="me-3 text-white"
                                                    backgroundColor="#067DE1"
                                                    onClick={handleEdit}
                                                    size="small"
                                                    label={t(
                                                        'teacher_teams.edit_idea'
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    btnClass="primary"
                                                    // disabled={
                                                    //     answerResponses &&
                                                    //     answerResponses.length ===
                                                    //         0
                                                    // }
                                                    // onClick={handleSubmit}
                                                    size="small"
                                                    label={t(
                                                        'teacher_teams.submit'
                                                    )}
                                                />
                                            </>
                                        ) : (
                                            <Row>
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {1}.{' '}
                                                            {t(
                                                                'student_course.ques1'
                                                            )}
                                                        </b>
                                                    </div>

                                                    <div className=" answers row flex-column p-4">
                                                        <select
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            onChange={(e) =>
                                                                setTheme(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            name="teams"
                                                            id="teams"
                                                        >
                                                            {themesList.map(
                                                                (item, i) => (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            item
                                                                        }
                                                                        selected={
                                                                            item ===
                                                                            theme
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </Row>

                                                {theme === 'Others' && (
                                                    <>
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {2}.{' '}
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
                                                                            isDisabled
                                                                        }
                                                                        placeholder="Enter your Theme Name"
                                                                        value={
                                                                            others
                                                                        }
                                                                        maxLength={
                                                                            100
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setOthers(
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
                                                                {100 -
                                                                    (others
                                                                        ? others.length
                                                                        : 0)}
                                                            </div>
                                                        </Row>
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {2}.{' '}
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
                                                                            isDisabled
                                                                        }
                                                                        placeholder="Enter your Problem statement"
                                                                        value={
                                                                            others
                                                                        }
                                                                        maxLength={
                                                                            100
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setOthers(
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
                                                                {100 -
                                                                    (others
                                                                        ? others.length
                                                                        : 0)}
                                                            </div>
                                                        </Row>
                                                    </>
                                                )}
                                                {theme !== 'Others' && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {2}.{' '}
                                                                {t(
                                                                    'student_course.ques2'
                                                                )}
                                                            </b>
                                                        </div>

                                                        <div className=" answers row flex-column p-4">
                                                            <select
                                                                disabled={
                                                                    isDisabled
                                                                }
                                                                onChange={(e) =>
                                                                    setProbStatment(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                name="teams"
                                                                id="teams"
                                                            >
                                                                {statementList.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                i
                                                                            }
                                                                            value={
                                                                                theme !==
                                                                                'Others'
                                                                                    ? item.problem_statement_description
                                                                                    : // : item.problem_statement
                                                                                      ''
                                                                            }
                                                                            selected={
                                                                                item.problem_statement ===
                                                                                probStatment
                                                                            }
                                                                        >
                                                                            {
                                                                                item.problem_statement
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    </Row>
                                                )}
                                                {theme !== 'Others' &&
                                                    probStatment ===
                                                        'Others' && (
                                                        <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {2}.{' '}
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
                                                                            isDisabled
                                                                        }
                                                                        placeholder="Enter your Problem statement"
                                                                        value={
                                                                            others
                                                                        }
                                                                        maxLength={
                                                                            100
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setOthers(
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
                                                                    (others
                                                                        ? others.length
                                                                        : 0)}
                                                            </div>
                                                        </Row>
                                                    )}
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {3}.{' '}
                                                            {t(
                                                                'student_course.ques3description'
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
                                                                    isDisabled
                                                                }
                                                                placeholder="Enter the Problem statement"
                                                                value={
                                                                    description
                                                                }
                                                                maxLength={100}
                                                                onChange={(e) =>
                                                                    setDescription(
                                                                        e.target
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
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {4}.{' '}
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
                                                                    isDisabled
                                                                }
                                                                placeholder="Enter your Idea Title Name"
                                                                value={
                                                                    ideaTitle
                                                                }
                                                                maxLength={100}
                                                                onChange={(e) =>
                                                                    setIdeaTitle(
                                                                        e.target
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
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {5}.{' '}
                                                            {t(
                                                                'student_course.ques5solution'
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
                                                                    isDisabled
                                                                }
                                                                placeholder="Enter your Solution statement"
                                                                value={
                                                                    solStatement
                                                                }
                                                                maxLength={100}
                                                                onChange={(e) =>
                                                                    setSolStatement(
                                                                        e.target
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
                                                            (solStatement
                                                                ? solStatement.length
                                                                : 0)}
                                                    </div>
                                                </Row>
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
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
                                                                    isDisabled
                                                                }
                                                                placeholder="Enter your Detailed solution "
                                                                value={
                                                                    detailSol
                                                                }
                                                                maxLength={100}
                                                                onChange={(e) =>
                                                                    setDetailSol(
                                                                        e.target
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
                                                </Row>
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {7}.{' '}
                                                            {t(
                                                                'student_course.ques7Prototype'
                                                            )}
                                                        </b>
                                                    </div>

                                                    <div className=" answers row flex-column p-4">
                                                        <div>
                                                            {question.map(
                                                                (item, i) => (
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
                                                                                    isDisabled
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
                                                {protoType === 'YES' && (
                                                    <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                        <div className="question quiz mb-0">
                                                            <b
                                                                style={{
                                                                    fontSize:
                                                                        '1.6rem'
                                                                }}
                                                            >
                                                                {8}.{' '}
                                                                {t(
                                                                    'student_course.ques8file'
                                                                )}
                                                            </b>
                                                        </div>
                                                        <div className=" answers row flex-column p-4">
                                                            <div>
                                                                <Button
                                                                    type="button"
                                                                    // btnClass={
                                                                    //     'primary'
                                                                    // }
                                                                    btnClass={`${
                                                                        isDisabled
                                                                            ? 'secondary'
                                                                            : 'primary'
                                                                    } me-3 pointer `}
                                                                    size="small"
                                                                    label={t(
                                                                        'student.upload_file'
                                                                    )}
                                                                />
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    disabled={
                                                                        isDisabled
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
                                                        </div>
                                                    </Row>
                                                )}
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {8}.{' '}
                                                            {t(
                                                                'student_course.ques9publication'
                                                            )}
                                                        </b>
                                                    </div>

                                                    <div className=" answers row flex-column p-4">
                                                        <div>
                                                            {ideaSubmitted.map(
                                                                (item, i) => (
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
                                                                                    isDisabled
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
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <Label
                                                        check
                                                        style={{
                                                            fontSize: '1.8rem'
                                                            // margin: '1rem'
                                                        }}
                                                    >
                                                        <Input
                                                            style={{
                                                                // fontSize: '1.8rem',
                                                                margin: '1rem'
                                                            }}
                                                            type="checkbox"
                                                            name="self confirm"
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            id="self confirm"
                                                            value="yes"
                                                        />
                                                        {
                                                            ' I confirm that the Idea Submitted now submitted is not copied or plagiarized version.'
                                                        }
                                                    </Label>
                                                </Row>
                                            </Row>
                                        )}
                                    </Form>
                                </CardBody>
                            </div>
                        </Row>
                        {!isDisabled && (
                            <Row>
                                <Col className="d-flex justify-content-between">
                                    <div>
                                        <Button
                                            type="button"
                                            btnClass="me-3 text-white"
                                            backgroundColor="#067DE1"
                                            // onClick={(e) =>
                                            //     handleSubmit(e, 'DRAFT')
                                            // }
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
                    </Col>
                </Container>
            )}
        </Layout>
    );
}

export default NewIdeaSubmission;
