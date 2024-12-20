/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef } from 'react';
import { Card } from 'reactstrap';
import Layout from '../Layout';
import { Button } from '../../stories/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInstructions } from '../store/evaluator/action';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import TCertificate from './Certificates';
import { Link } from 'react-router-dom';

const Instructions = () => {
    // here we can start the evaluator  journey //
    const history = useHistory();
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');

    const instructiondata = useSelector(
        (state) => state?.evaluator.instructionsData
    );

    React.useEffect(() => {
        dispatch(getInstructions());
    }, []);
    const handleCertificateDownload = () => {
        handlePrintCertificate();
    };
    const componentRef = useRef();
    const handlePrintCertificate = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${currentUser?.data[0]?.full_name}`
    });

    return (
        <>
            <div style={{ display: 'none' }}>
                <TCertificate
                    ref={componentRef}
                    full_name={currentUser?.data[0]?.full_name}
                />
            </div>

            <Layout title="Instructions">
                <Card
                    className="m-5 p-5"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <p className="text-center">
                            🎉 Congratulations! Thank you for successfully
                            completing the evaluation process.
                            <br />
                            We greatly appreciate your dedication and effort in
                            contributing to this initiative.
                            <br />
                            Your certificate of participation/achievement is now
                            available for download.
                            <br />
                            👉 Download Certificate
                            {/* <div className="text-right"> */}
                            <Link
                                to="#"
                                // className="btn btn-primary btn-lg"
                                style={{ margin: '1rem' }}
                                onClick={handleCertificateDownload}
                            >
                                Download Certificate
                            </Link>
                            {/* </div> */}
                        </p>
                    </div>

                    <div className="text-center mt-5">
                        {/* <Button
                        label={'L1-Round Evaluator'}
                        btnClass="primary mx-3"
                        size="small"
                        onClick={() =>
                            history.push('/evaluator/submitted-ideas')
                        }
                    /> */}
                        {/* <Button
                        label={'L2-Round Evaluator'}
                        btnClass="primary mx-3"
                        size="small"
                        onClick={() =>
                            history.push('/evaluator2/submitted-ideas')
                        }
                    /> */}
                    </div>
                </Card>
            </Layout>
        </>
    );
};

export default Instructions;
