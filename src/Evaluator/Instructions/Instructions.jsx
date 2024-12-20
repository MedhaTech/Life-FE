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
import jsPDF from 'jspdf';
import TeacherCertificate from '../../assets/media/Evaluator.jpg';
import { Link } from 'react-router-dom';

const Instructions = () => {
    const pdfRef = useRef(null);
    const currentUser = getCurrentUser('current_user');
    
    const handleCertificateDownload = () => {
        const content = pdfRef.current;
        const fullName = currentUser?.data[0]?.full_name;
        const doc = new jsPDF('l', 'mm', [298, 211]);

        doc.addImage(TeacherCertificate, 'JPEG', 0, 0, 298, 211);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(133, 38, 0); 

        const textWidth =
            (doc.getStringUnitWidth(fullName) * doc.getFontSize()) /
            doc.internal.scaleFactor;
        const x = 298 / 2;
        const y = 110;

        doc.text(fullName, x, y, { align: 'center' });

        // Save the certificate as a PDF
        const certName = `${fullName.replace(/\s+/g, '_')}.pdf`;
        doc.save(certName);
    };

    // here we can start the evaluator  journey //
    const history = useHistory();
    const dispatch = useDispatch();
    const currentUser1 = getCurrentUser('current_user');

    const instructiondata = useSelector(
        (state) => state?.evaluator.instructionsData
    );

    React.useEffect(() => {
        dispatch(getInstructions());
    }, []);
    const handleCertificateDownload1 = () => {
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
                            textAlign: 'left'
                        }}
                    >
                        <h6 className="font-bold" style={{ color: '#2196F3' }}>
                            🎉 Congratulations! 🎉
                        </h6>
                        <p>
                            Thank you for successfully completing the evaluation
                            process.{' '}
                        </p>
                        <p>
                            We greatly appreciate your dedication and effort in
                            contributing to this initiative.{' '}
                        </p>
                        <p>
                            Your certificate of participation is now available
                            for download.
                        </p>

                        {/* <div className="text-right"> */}
                        <Link
                            to="#"
                            className="btn btn-lg text-bold"
                            style={{
                                backgroundColor: '#007e33',
                                color: '#fff',
                                padding: '1rem',
                                borderRadius: '20px'
                            }}
                            onClick={handleCertificateDownload}
                        >
                            👉 DOWNLOAD CERTIFICATE
                        </Link>
                        {/* </div> */}
                        <p>
                            Thank you for being an integral part of this
                            journey.
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
