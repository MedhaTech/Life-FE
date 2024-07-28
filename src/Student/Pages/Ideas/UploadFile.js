/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React ,{useState}from 'react';
import Layout from '../../Layout';
import {
   
    
    Card,Row,Label,FormGroup,Col,Form
   
} from 'reactstrap';
import { getCurrentUser, openNotificationWithIcon,setCurrentUser } from '../../../helpers/Utils';

import { Button } from '../../../stories/Button';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function UploadFile() {
  const { t } = useTranslation();
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
    const currentUser = getCurrentUser('current_user');
  const fileHandler = (e) => {
    let file = e.target.files[0];

    if (!file) {
        return;
    }

    let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const isValidFileName = pattern.test(fileName);

    const maxFileSize = 10000000;
    const isOverMaxSize = file.size > maxFileSize;

    const allowedTypes = [
        'image/jpeg',
        'image/png'
    ];
    if (!allowedTypes.includes(file.type)) {
        openNotificationWithIcon(
            'error',
            t('Accepting only png,jpg,jpeg,pdf,doc,docx Only')
        );
        return;
    }

    if (isOverMaxSize) {
        openNotificationWithIcon('error', t('student.less_10MB'));
        return;
    }

    if (!isValidFileName) {
        openNotificationWithIcon(
            'error',
            "Only alphanumeric and '_' are allowed"
        );
        return;
    }

    formik.setFieldValue('id_card', file);
};


const formik = useFormik({
  initialValues: {
      
      id_card: ''
  },

  validationSchema: Yup.object({
      
      
      id_card: Yup.mixed().required("Upload Id Card"),

     
  }),

  onSubmit: async (values) => {
      if (values.id_card !== '') {
          const fileData = new FormData();
          fileData.append('file', values.id_card);

          const response = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/students/idcardUpload`,
              fileData,
              {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization:
                          'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
                  }
              }
          );
          values.id_card = response?.data?.data[0].attachments[0];

          currentUser.data[0].id_card = values.id_card;
          setCurrentUser(currentUser);
          if (response.status === 200) {
            history.push('/instructions');
            openNotificationWithIcon(
                'success',
                'Id Card Uploaded Successfully'
            );
        } else {
            openNotificationWithIcon('error', 'Opps! Something Wrong');
        }

          
         
        
      }
  }
});
const handleCheckboxChange = (e) => {
  setIsChecked(e.target.checked);
};
const isButtonDisabled =isChecked && formik.values.id_card;
console.log(isChecked,"check");
  return (
        <Layout title="Idea Submission">
         <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mt-5 mb-5 ">
                            {' '}
                            Upload Id Card
                        </h3>
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                      
                                      

                                       
                                            <>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="attachments"
                                                >
                                                   Upload File
                                                </Label>
                                                <div className="d-flex align-items-center">
                                                <input
                                                            type="file"
                                                            id="id_card"
                                                            name="id_card"
                                                            style={{
                                                                display: 'none'
                                                            }}
                                                            accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                            onChange={(e) =>
                                                                fileHandler(e)
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                        />
                                                    <Button
                                                            label="Upload File "
                                                            btnClass="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                document
                                                                    .getElementById(
                                                                        'id_card'
                                                                    )
                                                                    .click();
                                                            }}
                                                        />
                                                    {formik.values
                                                            .id_card &&
                                                            formik.values.id_card
                                                                .name ? (
                                                            <span className="ml-2">
                                                                {
                                                                    formik
                                                                        .values
                                                                        .id_card
                                                                        .name
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="ml-2">
                                                                {formik
                                                                    .initialValues
                                                                    .id_card &&
                                                                    formik
                                                                        .initialValues
                                                                        .id_card
                                                                        .name}
                                                            </span>
                                                        )}
                                                         {formik.touched.id_card &&
                                                        formik.errors
                                                            .id_card && (
                                                            <small className="error-cls">
                                                                {
                                                                    formik
                                                                        .errors
                                                                        .id_card
                                                                }
                                                            </small>
                                                        )}
                                                </div>
                                                <Row>
                                                <div>

          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
           
          <label>I confirm that the uploading is a valid Institution ID Card and Freezing Team</label>
        </div>
        </Row>
                                            </>
                                     

                                       
                                </div>

                                <Row>
                                  
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                        <Button
                                            label="Submit details"
                                            type="submit"
                                           
                                            size="small"
                                            // btnClass="primary"
                                            btnClass={isButtonDisabled ? 'primary' : 'default'}
                                            disabled={!isButtonDisabled}
                                        />
                                        
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
     </Layout>
  );
}

export default UploadFile;
