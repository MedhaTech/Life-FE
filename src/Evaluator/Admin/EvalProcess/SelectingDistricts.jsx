/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import Layout from '../Pages/Layout';
import { Row, Col, Label, Container, Card } from 'reactstrap';
import { Button } from '../../../stories/Button';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils';
import axios from 'axios';
import { URL, KEY } from '../../../constants/defaultValues';
import Check from './Pages/Check';
import { useDispatch, useSelector } from 'react-redux';
import {
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { encryptGlobal } from '../../../constants/encryptDecrypt';

const EditEvalProcess = (props) => {
    const evalID = JSON.parse(localStorage.getItem('eavlId'));
    console.log(evalID, '1');
    //  where evalID= evaluation_process_id //
    const dispatch = useDispatch();
    const [clickedValue, setclickedValue] = useState({});
    const [selectedStates, setselectedStates] = useState([]);

    useEffect(() => {
        dispatch(getFetchDistData());
    }, []);
    const fiterDistData = useSelector(
        (state) => state?.studentRegistration?.fetchdist
    );
    const fullStatesNames = useSelector(
        (state) => state?.studentRegistration?.regstate
    );

    useEffect(() => {
        // evalID && evalID.state
        //     ? evalID.state.split(',').length ===
        //           fullStatesNames.length - 1 &&
        //       !evalID.state.includes('All Districts')
        //         ? setselectedStates(fullStatesNames)
        //         : setselectedStates(evalID.state.split(','))
        //     : '';
        if (evalID && evalID.district) {
            if (
                evalID.district.split(',').length ===
                    fullStatesNames.length - 1 &&
                !evalID.district.includes('All Districts')
            ) {
                setselectedStates(fullStatesNames);
            } else {
                setselectedStates(evalID.district.split(','));
            }
        }
    }, []);

    useEffect(() => {
        if (clickedValue.name === 'All Districts') {
            if (selectedStates.includes('All Districts')) {
                setselectedStates(fullStatesNames);
            } else {
                setselectedStates([]);
            }
        } else if (
            clickedValue.name &&
            clickedValue.name !== 'All Districts' &&
            selectedStates.length === fullStatesNames.length - 1 &&
            !selectedStates.includes('All Districts')
        ) {
            setselectedStates(fullStatesNames);
        } else if (clickedValue.name && clickedValue.name !== 'All Districts') {
            setselectedStates(
                selectedStates?.filter((item) => item !== 'All Districts')
            );
        }
    }, [clickedValue]);

    async function handleStates(value) {
        //  handleStates Api where value = state //
        // where we can update the state //
        if (value.district === '') {
            value.district = '-';
        }
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const evalid = encryptGlobal(
            JSON.stringify(evalID.evaluation_process_id)
        );
        await axios
            .put(
                `${URL.updateEvalProcess + evalid}`,
                JSON.stringify(value, null, 2),
                axiosConfig
            )
            .then((response) => {
                if (response.status == 200) {
                    openNotificationWithIcon(
                        'success',
                        'Districts Updated Successfully'
                    );
                    props.history.push('/eadmin/evaluationProcess');
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handleclick = async () => {
        // where we can select  the States //
        const value = { district: '' };
        selectedStates.includes('All Districts')
            ? (value.district = selectedStates
                  ?.filter((item) => item !== 'All Districts')
                  .toString())
            : (value.district = selectedStates.toString());
        await handleStates(value);
    };

    return (
        <Layout title="Evaluation Config">
            <Container>
                <Card className="p-5 m-5">
                    <Row>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                                Level Name :{' '}
                                <span className="text-muted">
                                    {evalID && evalID.level_name}
                                </span>{' '}
                            </Label>
                        </Col>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                                No Of Evaluation :{' '}
                                <span className="text-muted">
                                    {evalID && evalID.no_of_evaluation}
                                </span>
                            </Label>
                        </Col>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                                Evaluation Schema :{' '}
                                <span className="text-muted">
                                    {evalID && evalID.eval_schema}
                                </span>
                            </Label>
                        </Col>
                    </Row>
                    <Row>
                        <Label className="mb-2">Districts:</Label>
                        <Check
                            list={fiterDistData}
                            value={selectedStates}
                            setValue={setselectedStates}
                            selValue={setclickedValue}
                        />
                    </Row>
                </Card>
                <Row>
                    <Col className="col-xs-12 col-sm-6">
                        <Button
                            label="Discard"
                            btnClass="secondary"
                            size="small"
                            onClick={() =>
                                props.history.push('/eadmin/evaluationProcess')
                            }
                        />
                    </Col>
                    <Col className="submit-btn col-xs-12 col-sm-6 text-right">
                        <Button
                            label="Save"
                            onClick={() => handleclick()}
                            btnClass={'primary'}
                            size="small"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};
export default EditEvalProcess;
