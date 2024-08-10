export const adminRoot = '/admin';

export const UserRole = {
    // USER ROLE //
};

export const URL = {
    // Post //
    schoolLogin: process.env.REACT_APP_API_BASE_URL + '/institutions/login',
    coordinatorLogin:
        process.env.REACT_APP_API_BASE_URL + '/state_coordinators/login',
    reportLogin: process.env.REACT_APP_API_BASE_URL + '/admins/login?',

    login: process.env.REACT_APP_API_BASE_URL + '/students/login',
    adminLogin: process.env.REACT_APP_API_BASE_URL + '/admins/login',
    eadminLogin: process.env.REACT_APP_API_BASE_URL + '/admins/login?',
    adminRegister: process.env.REACT_APP_API_BASE_URL + '/admins/register',
    evaluatorLogin: process.env.REACT_APP_API_BASE_URL + '/evaluators/login',
    // evaluatorRegister: `${process.env.REACT_APP_API_BASE_URL}/evaluators/register`,
    teacherLogin: process.env.REACT_APP_API_BASE_URL + '/mentors/login',
    addMentor: process.env.REACT_APP_API_BASE_URL + '/mentors/create',
    addAdminCourses: process.env.REACT_APP_API_BASE_URL + '/course',
    submitChallengeResponse:
        process.env.REACT_APP_API_BASE_URL + '/challenge_response',
    initiateChallenge:
        process.env.REACT_APP_API_BASE_URL + '/challenge_response/',
    postAdminRefQuizResponce:
        process.env.REACT_APP_API_BASE_URL + '/reflectiveQuiz/',
    createMentorSupportTickets:
        process.env.REACT_APP_API_BASE_URL + '/supportTickets',
    createMentorSupportTicketResponse:
        process.env.REACT_APP_API_BASE_URL + '/supportTicketsReply',
    createOrganization:
        process.env.REACT_APP_API_BASE_URL + '/organizations/createOrg',
    createEvalProcess:
        process.env.REACT_APP_API_BASE_URL + '/evaluationProcess',
    updateOrganization: process.env.REACT_APP_API_BASE_URL + '/organizations/',
    updateinstitution:
        process.env.REACT_APP_API_BASE_URL + '/institutions/edit/',

    updateEvalProcess:
        process.env.REACT_APP_API_BASE_URL + '/evaluationProcess/',

    createMultiStudent:
        process.env.REACT_APP_API_BASE_URL + '/students/bulkCreateStudent',
    uploadFile:
        process.env.REACT_APP_API_BASE_URL + '/challenge_response/fileUpload',
    updatepromote:
        process.env.REACT_APP_API_BASE_URL + '/challenge_response/updateEntry/',

    //Put//
    changePassword: process.env.REACT_APP_API_BASE_URL + '/auth/changePassword',
    studentResetPwd:
        process.env.REACT_APP_API_BASE_URL + '/students/resetPassword',
    updatePassword:
        process.env.REACT_APP_API_BASE_URL + '/mentors/updatePassword',
    updateMobile: process.env.REACT_APP_API_BASE_URL + '/mentors/updateMobile',
    updateMentor: process.env.REACT_APP_API_BASE_URL + '/mentors/update',
    updateMentorStatus: process.env.REACT_APP_API_BASE_URL + '/mentors',
    updateAdminStatus: process.env.REACT_APP_API_BASE_URL + '/admins',
    updateStudentStatus: process.env.REACT_APP_API_BASE_URL + '/students',
    putAdminQuizResponce: process.env.REACT_APP_API_BASE_URL + '/quiz/',
    //
    putResetPassword:
        process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',

    updateSupportTicketResponse:
        process.env.REACT_APP_API_BASE_URL + '/supportTickets',

    //Delete//
    deleteMentor: process.env.REACT_APP_API_BASE_URL + '/mentor/delete',
    deleteTempMentor: process.env.REACT_APP_API_BASE_URL + '/mentors/',

    //Get//
    logOut: process.env.REACT_APP_API_BASE_URL + '/auth/logout',
    schoolLogOut: process.env.REACT_APP_API_BASE_URL + '/organizations/logout',
    coordinatorLogOut:
        process.env.REACT_APP_API_BASE_URL + '/state_coordinators/logout',

    adminLogOut: process.env.REACT_APP_API_BASE_URL + '/auth/logout',
    teacherLogOut: process.env.REACT_APP_API_BASE_URL + '/auth/logout',
    reportLogOut: process.env.REACT_APP_API_BASE_URL + '/auth/logout',

    getMentors: process.env.REACT_APP_API_BASE_URL + '/mentors',
    getModules: process.env.REACT_APP_API_BASE_URL + '/modules/list',
    getAdminCouses: process.env.REACT_APP_API_BASE_URL + '/courses',
    getAdminCousesDetails: process.env.REACT_APP_API_BASE_URL + '/courses/',
    getAdminEvaluator: process.env.REACT_APP_API_BASE_URL + '/evaluators',
    getNotificationsList:
        process.env.REACT_APP_API_BASE_URL + '/notifications/tome',
    getAdminQstList: process.env.REACT_APP_API_BASE_URL + '/quiz/',
    getAdminRefQizList: process.env.REACT_APP_API_BASE_URL + '/reflectiveQuiz/',
    getSchoolRegistrationBulkupload:
        process.env.REACT_APP_API_BASE_URL + '/institutions?',
    getFaqCategoryList: `${process.env.REACT_APP_API_BASE_URL}/faqCategories`,
    getFaqByCategoryId: `${process.env.REACT_APP_API_BASE_URL}/faqCategories`,
    getFaqList: `${process.env.REACT_APP_API_BASE_URL}/faqs`,
    checkOrg: `${process.env.REACT_APP_API_BASE_URL}/organizations/checkOrg`,
    mentorRegister: `${process.env.REACT_APP_API_BASE_URL}/mentors/register`,
    mentorOTP: `${process.env.REACT_APP_API_BASE_URL}/mentors/validateOtp`,
    mentorChangePwd: `${process.env.REACT_APP_API_BASE_URL}/mentors/changePassword`,
    schoolChangePwd: `${process.env.REACT_APP_API_BASE_URL}/organizations/changePassword`,
    getTeamsList: `${process.env.REACT_APP_API_BASE_URL}/teams`,
    getTeamMembersList: `${process.env.REACT_APP_API_BASE_URL}/teams/`,
    getReportsView: `${process.env.REACT_APP_API_BASE_URL}/reports/challengesDistrictCount`,
    getPreSurveyList: `${process.env.REACT_APP_API_BASE_URL}/quizSurveys`,
    getStudentPreSurveyList: `${process.env.REACT_APP_API_BASE_URL}/quizSurveys/2`,
    getPostSurveyList: `${process.env.REACT_APP_API_BASE_URL}/quizSurveys`,
    getStudentPostSurveyList: `${process.env.REACT_APP_API_BASE_URL}/quizSurveys/`,

    getTeacherCousesDetails:
        process.env.REACT_APP_API_BASE_URL + '/mentorCourses/',
    getStudents: process.env.REACT_APP_API_BASE_URL + '/students',
    stuForget: process.env.REACT_APP_API_BASE_URL + '/students/forgotPassword',

    getDistrictsOnly:
        process.env.REACT_APP_API_BASE_URL + '/institutions/districtNames',
    getPinCodesOnly:
        process.env.REACT_APP_API_BASE_URL + '/organizations/pinCode?',
    getAtlCodesOnly:
        process.env.REACT_APP_API_BASE_URL + '/organizations/ATLCode?',
    getFetchDistsOnly:
        process.env.REACT_APP_API_BASE_URL + '/organizations/districts?',
    getFetchInstDistsOnly:
        process.env.REACT_APP_API_BASE_URL + '/institutions/districts',
    getBlocksOnly: process.env.REACT_APP_API_BASE_URL + '/institutions/blocks?',
    getInstTalukOnly:
        process.env.REACT_APP_API_BASE_URL + '/institutions/taluks?',
    getInstPlacesOnly:
        process.env.REACT_APP_API_BASE_URL + '/institutions/places?',

    getStatesOnly: process.env.REACT_APP_API_BASE_URL + '/organizations/states',
    getStudentBadges: process.env.REACT_APP_API_BASE_URL + '/students/',
    getStudentById: process.env.REACT_APP_API_BASE_URL + '/students/',
    getAdmin: process.env.REACT_APP_API_BASE_URL + '/admins/',
    getChallengeList: `${process.env.REACT_APP_API_BASE_URL}/challenge_response/customFilter`,

    getStudentDashboardStatusCommonById:
        process.env.REACT_APP_API_BASE_URL + '/dashboard/studentStats/',
    getTeacherById: process.env.REACT_APP_API_BASE_URL + '/mentors/',
    getSchoolById: process.env.REACT_APP_API_BASE_URL + '/organizations/',
    // getDistrictByName:
    //     process.env.REACT_APP_API_BASE_URL + '/district_coordinators/',

    getTeacherDashboardStatesById:
        process.env.REACT_APP_API_BASE_URL + '/dashboard/mentorStats/',
    getChallengeQuestions: process.env.REACT_APP_API_BASE_URL + '/challenge',
    getChallengeSubmittedResponse:
        process.env.REACT_APP_API_BASE_URL + '/ideas/submittedDetails?',
    getMentorSupportTickets:
        process.env.REACT_APP_API_BASE_URL + '/supportTickets',
    getMentorSupportTicketsById:
        process.env.REACT_APP_API_BASE_URL + '/supportTickets/',
    getMentorSupportTicketResponsesById:
        process.env.REACT_APP_API_BASE_URL + '/supportTicketsReply',
    getMentorAttachments:
        process.env.REACT_APP_API_BASE_URL + '/mentorAttachments',
    getDistricts: process.env.REACT_APP_API_BASE_URL + '/dashboard/mapStats',
    // getDistrictsLive:
    //     process.env.REACT_APP_API_BASE_URL + '/dashboard/refreshMapStatsLive',
    getScheduleDates: process.env.REACT_APP_API_BASE_URL + '/auth/roadMap',
    getAdminReports: process.env.REACT_APP_API_BASE_URL + '/quizSurveys/',
    getAdminMentorRegStatusReports:
        process.env.REACT_APP_API_BASE_URL + '/mentors/regStatus',
    getAdminMentorReports:
        process.env.REACT_APP_API_BASE_URL + '/reports/allMentorReports',
    getTeamMemberStatusEndpoint:
        process.env.REACT_APP_API_BASE_URL + '/dashboard/teamStats/',
    getidealist: process.env.REACT_APP_API_BASE_URL + '/ideas?',
    getidealistfinal:
        process.env.REACT_APP_API_BASE_URL +
        '/challenge_response/evaluationResult',
    getFinalEvaluation:
        process.env.REACT_APP_API_BASE_URL + '/ideas/finalEvaluation',
    gettotalcount:
        process.env.REACT_APP_API_BASE_URL + '/dashboard/evaluatorStats',
    getlogout: process.env.REACT_APP_API_BASE_URL + '/students/logout'
};
const API = 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870';

export const KEY = {
    User_API_Key: API
};

export const isAuthGuardActive = true;
