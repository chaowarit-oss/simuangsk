document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const loginSection = document.getElementById('login-section');
    const studentDashboardSection = document.getElementById('student-dashboard-section');
    const adminDashboardSection = document.getElementById('admin-dashboard-section');
    const adminLoginIcon = document.getElementById('admin-login-icon');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const studentLogoutBtn = document.getElementById('student-logout-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminLoginCancelBtn = document.getElementById('admin-login-cancel');
    const studentLoginForm = document.getElementById('student-login-form');
    const messageBox = document.getElementById('message-box');

    // --- Student Dashboard Elements ---
    const studentNameDisplay = document.getElementById('student-name-display');
    const studentInfoId = document.getElementById('student-info-id');
    const studentInfoName = document.getElementById('student-info-name');
    const studentInfoClass = document.getElementById('student-info-class');
    const studentInfoRoom = document.getElementById('student-info-room');
    const activitiesList = document.getElementById('activities-list');
    const activityQuizModal = document.getElementById('activity-quiz-modal');
    const quizModalTitle = document.getElementById('quiz-modal-title');
    const quizAccessCodeInput = document.getElementById('quiz-access-code-input');
    const accessCodeInput = document.getElementById('access-code');
    const verifyAccessCodeBtn = document.getElementById('verify-access-code-btn');
    const quizContent = document.getElementById('quiz-content');
    const quizForm = document.getElementById('quiz-form');
    const submitQuizBtn = document.getElementById('submit-quiz-btn'); 
    const closeQuizModalBtn = document.getElementById('close-quiz-modal');
    const certificateSection = document.getElementById('certificate-section');
    const certificateStatus = document.getElementById('certificate-status');
    const printCertificateBtn = document.getElementById('print-certificate-btn');
    const certificatePreviewContainer = document.getElementById('certificate-preview-container');
    const certificateNumberDisplay = document.getElementById('certificate-number-display');
    const participationProgressCard = document.getElementById('participation-progress-card'); 
    const viewStudentCertificateBtn = document.getElementById('view-student-certificate-btn');
    const downloadStudentCertificateBtn = document.getElementById('download-student-certificate-btn');

    // New: Student Certificate View Modal Elements
    const studentCertificateViewModal = document.getElementById('student-certificate-view-modal');
    const studentCertModalImg = document.getElementById('student-cert-modal-img');
    const downloadStudentCertificateFromModalBtn = document.getElementById('download-student-certificate-from-modal-btn');
    const closeStudentCertificateViewModalBtn = document.getElementById('close-student-certificate-view-modal-btn');

    let currentStudentId = null;
    let currentQuizActivityId = null;
    let quizDataForCurrentActivity = [];

    // --- Admin Dashboard Elements ---
    const adminTabButtons = document.querySelectorAll('.admin-tab-btn');
    const adminContentAreas = document.querySelectorAll('.admin-content-area');

    // Dashboard Summary
    const totalStudentsSpan = document.getElementById('total-students');
    const totalActivitiesSpan = document.getElementById('total-activities');
    const studentsPassed70Span = document.getElementById('students-passed-70');
    const participationPercentageSpan = document.getElementById('participation-percentage');

    // Student Management
    const addStudentForm = document.getElementById('add-student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    const importStudentsExcelInput = document.getElementById('import-students-excel');
    const uploadExcelBtn = document.getElementById('upload-excel-btn');
    const newStudentClassSelect = document.getElementById('new-student-class'); 
    const newStudentRoomSelect = document.getElementById('new-student-room'); 
    const filterStudentClass = document.getElementById('filter-student-class');
    const filterStudentRoom = document.getElementById('filter-student-room');
    const clearStudentFiltersBtn = document.getElementById('clear-student-filters');
    // Student Pagination Elements
    // Bottom controls (existing)
    const studentsPrevBtn = document.getElementById('students-prev-btn');
    const studentsNextBtn = document.getElementById('students-next-btn');
    const studentsPageInfoSpan = document.getElementById('students-page-info');
    // Top controls (newly added)
    const studentsPrevBtnTop = document.getElementById('students-prev-btn-top');
    const studentsNextBtnTop = document.getElementById('students-next-btn-top');
    const studentsPageInfoSpanTop = document.getElementById('students-page-info-top');

    let currentStudentsPage = 1;
    const studentsLimitPerPage = 40; // Set student limit as requested
    let totalStudentsPages = 1;


    // Activity Management
    const addActivityForm = document.getElementById('add-activity-form');
    const activitiesTableBody = document.getElementById('activities-table-body');
    // Elements for Edit Activity Modal
    const editActivityModal = document.getElementById('edit-activity-modal');
    const editActivityForm = document.getElementById('edit-activity-form');
    const editActivityIdInput = document.getElementById('edit-activity-id');
    const editActivityNameInput = document.getElementById('edit-activity-name');
    const editActivityDescriptionInput = document.getElementById('edit-activity-description');
    const editActivityImageFileInput = document.getElementById('edit-activity-image-file');
    const editActivityCurrentImage = document.getElementById('edit-activity-current-image');
    const editActivityAccessCodeInput = document.getElementById('edit-activity-access-code');
    const editActivityCancelBtn = document.getElementById('edit-activity-cancel');


    // Quiz Management
    const addQuizForm = document.getElementById('add-quiz-form');
    const quizActivitySelect = document.getElementById('quiz-activity-select');
    const newQuizCorrectAnswerSelect = document.getElementById('new-quiz-correct-answer');
    const quizzesTableBody = document.getElementById('quizzes-table-body');
    const filterQuizActivity = document.getElementById('filter-quiz-activity');

    // New: Elements for Edit Quiz Modal
    const editQuizModal = document.getElementById('edit-quiz-modal');
    const editQuizForm = document.getElementById('edit-quiz-form');
    const editQuizIdInput = document.getElementById('edit-quiz-id');
    const editQuizActivitySelect = document.getElementById('edit-quiz-activity-select');
    const editQuizQuestionInput = document.getElementById('edit-quiz-question');
    const editQuizOptionAInput = document.getElementById('edit-quiz-option-a');
    const editQuizOptionBInput = document.getElementById('edit-quiz-option-b');
    const editQuizOptionCInput = document.getElementById('edit-quiz-option-c');
    const editQuizOptionDInput = document.getElementById('edit-quiz-option-d');
    const editQuizCorrectAnswerSelect = document.getElementById('edit-quiz-correct-answer');
    const editQuizScoreInput = document.getElementById('edit-quiz-score');
    const editQuizCancelBtn = document.getElementById('edit-quiz-cancel');

    // Certificate Template Management
    const addCertificateTemplateForm = document.getElementById('add-certificate-template-form');
    const certificateTemplatesTableBody = document.getElementById('certificate-templates-table-body');
    const newCertificateImageFile = document.getElementById('new-certificate-image-file'); 
    const editCertificateModal = document.getElementById('edit-certificate-modal'); 
    const editCertificateForm = document.getElementById('edit-certificate-form'); 
    const editCertificateIdInput = document.getElementById('edit-certificate-id'); 
    const editCertificateImageFile = document.getElementById('edit-certificate-image-file'); 
    const editCertificateCurrentImage = document.getElementById('edit-certificate-current-image'); 
    const editCertificateStartNumber = document.getElementById('edit-certificate-start-number'); 
    const editCertificateEndNumber = document.getElementById('edit-certificate-end-number'); 
    const editCertificateCancelBtn = document.getElementById('edit-certificate-cancel'); 


    // Issued Certificates
    const generateAllCertificatesBtn = document.getElementById('generate-certificates-btn'); 
    const issuedCertificatesTableBody = document.getElementById('issued-certificates-table-body');
    const filterIssuedCertClass = document.getElementById('filter-issued-cert-class');
    const filterIssuedCertRoom = document.getElementById('filter-issued-cert-room');
    const clearIssuedCertFiltersBtn = document.getElementById('clear-issued-cert-filters');
    // Issued Certificates Pagination Elements
    // Bottom controls (existing)
    const issuedCertificatesPrevBtn = document.getElementById('issued-certificates-prev-btn');
    const issuedCertificatesNextBtn = document.getElementById('issued-certificates-next-btn');
    const issuedCertificatesPageInfoSpan = document.getElementById('issued-certificates-page-info');
    // Top controls (newly added)
    const issuedCertificatesPrevBtnTop = document.getElementById('issued-certificates-prev-btn-top');
    const issuedCertificatesNextBtnTop = document.getElementById('issued-certificates-next-btn-top');
    const issuedCertificatesPageInfoSpanTop = document.getElementById('issued-certificates-page-info-top');

    let currentIssuedCertsPage = 1;
    const issuedCertsLimitPerPage = 40; // Set issued certs limit as requested
    let totalIssuedCertsPages = 1;

    // Admin Issued Certificate Preview Modal Elements (from index.html)
    const issuedCertificatePreviewModal = document.getElementById('issued-certificate-preview-modal');
    const issuedCertPreviewImg = document.getElementById('issued-cert-preview-img');
    const downloadIssuedCertificateBtnAdmin = document.getElementById('download-issued-certificate-btn');
    const closeIssuedCertificatePreviewModalBtn = document.getElementById('close-issued-certificate-preview-modal-btn');

    // Variable to store data for the admin certificate preview modal
    let currentAdminCertData = {};

    // New: Generate Room Certificates Section Elements
    const openGenerateRoomCertificatesModalBtn = document.getElementById('open-generate-room-certificates-modal-btn'); // Button to open the modal
    const generateRoomCertificatesModal = document.getElementById('generate-room-certificates-modal'); // The modal itself
    const generateRoomClassSelect = document.getElementById('generate-room-class'); // Class dropdown in modal
    const generateRoomNumberSelect = document.getElementById('generate-room-number'); // Room dropdown in modal
    const loadEligibleStudentsBtn = document.getElementById('load-eligible-students-btn'); // Button to find students in modal
    const eligibleStudentsResultsDiv = document.getElementById('eligible-students-results'); // Div to display results in modal
    const eligibleStudentsInitialMessage = document.getElementById('eligible-students-initial-message'); // NEW ELEMENT
    const eligibleStudentsTable = document.getElementById('eligible-students-table'); // Table for eligible students in modal
    const eligibleStudentsTableBody = document.getElementById('eligible-students-table-body'); // Table body in modal
    const noEligibleStudentsMessage = document.getElementById('no-eligible-students-message'); // Message if no students
    const downloadSelectedRoomCertificatesPdfBtn = document.getElementById('download-selected-room-certificates-pdf'); // Download PDF button in modal
    const generateRoomCertificatesCancelBtn = document.getElementById('generate-room-certificates-cancel'); // Cancel button in modal

    // Stores student data for room-based PDF generation
    let studentsForRoomCertificate = [];


    // --- Fixed Dropdown Options ---
    const fixedClasses = [
        "มัธยมศึกษาปีที่ 1",
        "มัธยมศึกษาปีที่ 2",
        "มัธยมศึกษาปีที่ 3",
        "มัธยมศึกษาปีที่ 4",
        "มัธยมศึกษาปีที่ 5",
        "มัธยมศึกษาปีที่ 6"
    ];
    const fixedRooms = Array.from({ length: 13 }, (_, i) => i + 1); // Generates [1, 2, ..., 13]


    // --- Helper Functions ---

    /**
     * Display a notification message at the top of the screen.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error' for color styling.
     * @param {number} duration Duration in milliseconds (default: 3000).
     */
    function showMessage(message, type = 'success', duration = 3000) {
        messageBox.textContent = message;
        // Added text-white to ensure text is white
        messageBox.className = `message-box fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-full transition-transform duration-500 ease-out shadow-lg rounded-b-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} show`;
        
        // Ensure the message box is visible before starting the transition
        messageBox.classList.remove('hidden');
        void messageBox.offsetWidth; // Trigger reflow
        messageBox.style.transform = 'translate(-50%, 0)'; // Slide in

        setTimeout(() => {
            messageBox.style.transform = 'translate(-50%, -100%)'; // Start hide transition
            messageBox.addEventListener('transitionend', () => {
                messageBox.classList.add('hidden'); // Fully hide after animation
            }, { once: true });
        }, duration);
    }

    /**
     * Send an AJAX request to the backend (connect.php).
     * Supports both JSON data and FormData for file uploads.
     * @param {string} url The URL suffix for connect.php (e.g., '?action=get_students').
     * @param {string} method HTTP method (GET, POST, PUT, DELETE).
     * @param {object|FormData|null} data Data to send in the request body (for POST/PUT).
     * @returns {Promise<object>} A Promise that resolves with the JSON response.
     */
    async function fetchData(url, method = 'GET', data = null) {
        let options = { method: method };
        
        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`connect.php${url}`, options);
            if (!response.ok) {
                const textError = await response.text(); 
                try {
                    const jsonError = JSON.parse(textError); 
                    throw new Error(jsonError.message || `HTTP Error! Status: ${response.status}`);
                } catch (e) {
                    const displayError = textError.length > 200 ? textError.substring(0, 200) + '...' : textError;
                    throw new Error(`Server Error (${response.status}): ${displayError}`);
                }
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage(`เกิดข้อผิดพลาด: ${error.message}`, 'error', 5000);
            return { status: 'error', message: error.message };
        }
    }

    // --- View Management ---

    /**
     * Hide all sections and show the desired section.
     * @param {HTMLElement} sectionToShow The section to show.
     */
    function showSection(sectionToShow) {
        [loginSection, studentDashboardSection, adminDashboardSection].forEach(section => {
            section.classList.add('hidden');
        });
        sectionToShow.classList.remove('hidden');
    }

    /**
     * Check the admin login status.
     */
    async function checkAdminSession() {
        const response = await fetchData('?action=check_admin_session', 'GET');
        if (response.status === 'success') {
            adminLoginIcon.classList.add('hidden');
            adminLogoutBtn.classList.remove('hidden');
            studentLogoutBtn.classList.add('hidden');
            showSection(adminDashboardSection);
            // Default to dashboard tab on admin login
            showAdminContent('admin-content-dashboard'); 
        } else {
            checkStudentSession(); 
        }
    }

    /**
     * Check the student login status.
     */
    async function checkStudentSession() {
        const response = await fetchData('?action=get_student_session', 'GET');
        if (response.status === 'success') {
            currentStudentId = response.data.student_id;
            updateStudentInfo(response.data);
            showSection(studentDashboardSection);
            adminLoginIcon.classList.add('hidden');
            adminLogoutBtn.classList.add('hidden');
            studentLogoutBtn.classList.remove('hidden');
            loadStudentActivities();
            loadStudentCertificateStatus(); 
            loadStudentParticipationProgress(); 
        } else {
            showSection(loginSection);
            adminLoginIcon.classList.remove('hidden');
            adminLogoutBtn.classList.add('hidden');
            studentLogoutBtn.classList.add('hidden');
        }
    }

    /**
     * Update student information on the Student Dashboard.
     * @param {object} studentData Student data.
     */
    function updateStudentInfo(studentData) {
        studentNameDisplay.textContent = `${studentData.first_name} ${studentData.last_name}`;
        studentInfoId.textContent = studentData.student_id;
        studentInfoName.textContent = `${studentData.first_name} ${studentData.last_name}`;
        studentInfoClass.textContent = studentData.class;
        studentInfoRoom.textContent = studentData.room_number;
    }

    // --- Student Section Logic ---

    /**
     * Load and display the list of activities for students.
     */
    async function loadStudentActivities() {
        activitiesList.innerHTML = '<p class="text-center text-gray-500 col-span-full">กำลังโหลดกิจกรรม...</p>';
        const response = await fetchData('?action=get_activities', 'GET');
        if (response.status === 'success') {
            const activities = response.data;
            if (activities.length === 0) {
                activitiesList.innerHTML = '<p class="text-center text-gray-500 col-span-full">ยังไม่มีกิจกรรมในขณะนี้</p>';
                return;
            }

            const statusResponse = await fetchData(`?action=get_student_activity_status`, 'GET'); 
            const activityStatusMap = {};
            if (statusResponse.status === 'success') {
                statusResponse.data.forEach(item => {
                    activityStatusMap[item.activity_id] = item;
                });
            }

            activitiesList.innerHTML = '';
            activities.forEach(activity => {
                const status = activityStatusMap[activity.activity_id] || { is_completed: false, score: 0, total_possible_score_for_activity: null };
                const isCompleted = status.is_completed;
                const scoreDisplay = status.total_possible_score_for_activity !== null && status.total_possible_score_for_activity > 0 ? `คะแนน: ${status.score} / ${status.total_possible_score_for_activity}` : '';
                const statusText = isCompleted ? `<span class="status-completed"><i class="fas fa-check-circle mr-1"></i> ทำสำเร็จแล้ว</span>` : `<span class="status-incomplete"><i class="fas fa-times-circle mr-1"></i> ยังไม่สำเร็จ</span>`;
                
                activitiesList.innerHTML += `
                    <div class="activity-card flex flex-col">
                        <img src="${activity.image_url || 'https://placehold.co/400x180/E0F2F7/007AFF?text=รูปภาพกิจกรรม'}" alt="${activity.activity_name}" class="w-full h-48 object-cover rounded-t-lg">
                        <div class="p-4 flex flex-col flex-grow">
                            <h4 class="text-xl font-semibold text-gray-800 mb-2">${activity.activity_name}</h4>
                            <p class="text-gray-700 text-sm mb-3 flex-grow">${activity.description}</p>
                            <p class="status-text">${statusText} ${scoreDisplay}</p>
                            <button class="open-quiz-modal-btn w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300" 
                                data-activity-id="${activity.activity_id}" 
                                data-activity-name="${activity.activity_name}"
                                data-access-code="${activity.access_code}"
                                data-has-quiz="${status.total_possible_score_for_activity !== null && status.total_possible_score_for_activity > 0}"
                                ${isCompleted ? 'disabled' : ''}>
                                ${isCompleted ? 'ทำเสร็จแล้ว' : 'เริ่มกิจกรรม'}
                            </button>
                        </div>
                    </div>
                `;
            });

            document.querySelectorAll('.open-quiz-modal-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    currentQuizActivityId = event.target.dataset.activityId;
                    quizModalTitle.textContent = `ทำแบบทดสอบ: ${event.target.dataset.activityName}`;
                    
                    const hasQuiz = event.target.dataset.hasQuiz === 'true';

                    if (!hasQuiz) {
                        showMessage('กิจกรรมนี้ไม่มีแบบทดสอบให้ทำ', 'info');
                        activityQuizModal.classList.add('hidden'); // Close the modal
                        return;
                    }

                    quizAccessCodeInput.classList.remove('hidden');
                    quizContent.classList.add('hidden');
                    accessCodeInput.value = '';
                    quizForm.innerHTML = '';
                    submitQuizBtn.classList.add('hidden'); 
                    activityQuizModal.classList.remove('hidden');
                    activityQuizModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                    setTimeout(() => {
                        activityQuizModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
                    }, 10);
                });
            });
        } else {
            activitiesList.innerHTML = `<p class="text-center text-red-500 col-span-full">ไม่สามารถโหลดกิจกรรมได้: ${response.message}</p>`;
        }
    }

    // Event listener for verifying access code
    verifyAccessCodeBtn.addEventListener('click', async () => {
        const accessCode = accessCodeInput.value.trim();
        if (!accessCode) {
            showMessage('กรุณากรอกรหัสยืนยัน', 'error');
            return;
        }

        const response = await fetchData('?action=verify_access_code', 'POST', {
            activity_id: currentQuizActivityId,
            access_code: accessCode
        });

        if (response.status === 'success') {
            showMessage('รหัสยืนยันถูกต้อง! กำลังโหลดแบบทดสอบ...', 'success');
            quizAccessCodeInput.classList.add('hidden');
            quizContent.classList.remove('hidden');
            loadQuizForActivity(currentQuizActivityId);
        } else {
            showMessage(response.message, 'error');
        }
    });

    /**
     * Load the quiz for the selected activity.
     * @param {string} activityId The ID of the activity.
     */
    async function loadQuizForActivity(activityId) {
        quizForm.innerHTML = '<p class="text-center text-gray-500">กำลังโหลดแบบทดสอบ...</p>';
        submitQuizBtn.classList.add('hidden');

        const response = await fetchData(`?action=get_quizzes&activity_id=${activityId}`, 'GET');
        if (response.status === 'success' && response.data.length > 0) {
            quizDataForCurrentActivity = response.data;
            quizForm.innerHTML = '';

            quizDataForCurrentActivity.forEach((quiz, index) => {
                quizForm.innerHTML += `
                    <div class="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                        <p class="font-semibold text-lg text-gray-800 mb-3">คำถามที่ ${index + 1}: ${quiz.question}</p>
                        <div class="space-y-2">
                            <label class="block cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-200">
                                <input type="radio" name="quiz-${quiz.quiz_id}" value="A" class="mr-2"> A. ${quiz.option_a}
                            </label>
                            <label class="block cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-200">
                                <input type="radio" name="quiz-${quiz.quiz_id}" value="B" class="mr-2"> B. ${quiz.option_b}
                            </label>
                            <label class="block cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-200">
                                <input type="radio" name="quiz-${quiz.quiz_id}" value="C" class="mr-2"> C. ${quiz.option_c}
                            </label>
                            <label class="block cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-200">
                                <input type="radio" name="quiz-${quiz.quiz_id}" value="D" class="mr-2"> D. ${quiz.option_d}
                            </label>
                        </div>
                    </div>
                `;
            });
            submitQuizBtn.classList.remove('hidden');
        } else {
            quizForm.innerHTML = `<p class="text-center text-red-500">ไม่พบแบบทดสอบสำหรับกิจกรรมนี้หรือเกิดข้อผิดพลาด: ${response.message || ''}</p>`;
        }
    }

    // Event listener for submitting quiz
    submitQuizBtn.addEventListener('click', async () => {
        const activityId = currentQuizActivityId; 
        const answers = [];
        let allAnswered = true;

        quizDataForCurrentActivity.forEach(quiz => {
            const selectedOption = quizForm.querySelector(`input[name="quiz-${quiz.quiz_id}"]:checked`);
            if (selectedOption) {
                answers.push({ quiz_id: quiz.quiz_id, selected_option: selectedOption.value });
            } else {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            showMessage('กรุณาตอบคำถามให้ครบทุกข้อ', 'error');
            return;
        }

        const response = await fetchData('?action=submit_quiz', 'POST', {
            student_id: currentStudentId,
            activity_id: parseInt(activityId), 
            answers: answers
        });

        if (response.status === 'success') {
            showMessage(`ส่งแบบทดสอบสำเร็จแล้ว! คะแนนของคุณ: ${response.data.score} / ${response.data.total_possible_score}. ${response.data.certificate_generation_status.message}`, 'success', 8000);
            activityQuizModal.classList.add('hidden');
            loadStudentActivities();
            loadStudentCertificateStatus();
            loadStudentParticipationProgress(); 
        } else {
            showMessage(response.message, 'error');
        }
    });

    closeQuizModalBtn.addEventListener('click', () => {
        activityQuizModal.classList.add('hidden');
    });

    /**
     * Load the student's certificate status.
     */
    async function loadStudentCertificateStatus() {
        if (!currentStudentId) {
            certificateSection.classList.add('hidden');
            return;
        }

        certificateSection.classList.remove('hidden');
        certificateStatus.textContent = 'สถานะ: กำลังตรวจสอบเกียรติบัตร...';
        viewStudentCertificateBtn.classList.add('hidden');
        downloadStudentCertificateBtn.classList.add('hidden');
        printCertificateBtn.classList.add('hidden'); 
        certificatePreviewContainer.classList.add('hidden'); 

        const response = await fetchData('?action=get_student_certificate_details', 'GET');
        
        if (response.status === 'success' && response.data) { 
            const studentCert = response.data;
            if (studentCert && studentCert.certificate_number && studentCert.template_image_url) {
                certificateStatus.innerHTML = '<span class="font-bold text-green-600">สถานะ: คุณได้รับเกียรติบัตรแล้ว!</span>';
                certificateNumberDisplay.textContent = `เลขที่เกียรติบัตร: ${studentCert.certificate_number}`;
                certificateNumberDisplay.classList.remove('hidden');

                viewStudentCertificateBtn.dataset.templateUrl = studentCert.template_image_url;
                viewStudentCertificateBtn.dataset.studentName = `${studentInfoName.textContent}`;
                viewStudentCertificateBtn.dataset.certNumber = studentCert.certificate_number;
                viewStudentCertificateBtn.dataset.studentId = currentStudentId; 
                viewStudentCertificateBtn.dataset.studentClass = studentCert.class; 

                downloadStudentCertificateBtn.dataset.templateUrl = studentCert.template_image_url;
                downloadStudentCertificateBtn.dataset.studentName = `${studentInfoName.textContent}`;
                downloadStudentCertificateBtn.dataset.certNumber = studentCert.certificate_number;
                downloadStudentCertificateBtn.dataset.studentId = currentStudentId;
                downloadStudentCertificateBtn.dataset.studentClass = studentCert.class; 

                printCertificateBtn.dataset.templateUrl = studentCert.template_image_url;
                printCertificateBtn.dataset.studentName = `${studentInfoName.textContent}`;
                printCertificateBtn.dataset.certNumber = studentCert.certificate_number;
                printCertificateBtn.dataset.studentClass = studentCert.class; 


                viewStudentCertificateBtn.classList.remove('hidden');
                downloadStudentCertificateBtn.classList.remove('hidden');
            } else {
                certificateStatus.innerHTML = '<span class="font-bold text-red-500">สถานะ: คุณยังไม่ผ่านเกณฑ์การรับเกียรติบัตร</span>';
                certificateNumberDisplay.classList.add('hidden');
                viewStudentCertificateBtn.classList.add('hidden');
                downloadStudentCertificateBtn.classList.add('hidden');
                printCertificateBtn.classList.add('hidden');
                certificatePreviewContainer.classList.add('hidden');
            }
        } else {
            certificateStatus.innerHTML = `<span class="font-bold text-red-500">ไม่สามารถตรวจสอบสถานะเกียรติบัตรได้: ${response.message}</span>`;
            certificateNumberDisplay.classList.add('hidden');
            viewStudentCertificateBtn.classList.add('hidden');
            downloadStudentCertificateBtn.classList.add('hidden');
            printCertificateBtn.classList.add('hidden');
            certificatePreviewContainer.classList.add('hidden');
        }
    }

    /**
     * Generates a certificate image with student name, class, and certificate number overlaid using Canvas.
     * This function is used for individual student certificate preview/download.
     * @param {string} templateUrl URL of the certificate background template.
     * @param {string} studentFullName Full name of the student.
     * @param {string} certificateNumber Certificate number.
     * @param {string} studentClass Class of the student (e.g., "มัธยมศึกษาปีที่ 5/2").
     * @param {number} [targetWidth=1200] Desired width of the generated image. Image will be scaled to this width.
     * @returns {Promise<string|null>} Data URL of the generated image (PNG), or null on error.
     */
    function generateCertificateImage(templateUrl, studentFullName, certificateNumber, studentClass, targetWidth = 1200) {
        console.log('generateCertificateImage: Start for', studentFullName, 'Template URL:', templateUrl);
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Required for loading images from different origins due to CORS

            img.onload = () => {
                console.log('generateCertificateImage: Image loaded successfully.');

                // Calculate scale factor and set canvas dimensions
                const scaleFactor = targetWidth / img.width;
                canvas.width = targetWidth;
                canvas.height = img.height * scaleFactor;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // --- IMPORTANT: ADJUST THESE COORDINATES AND FONT STYLES FOR YOUR TEMPLATE ---
                // คุณต้องปรับค่าเหล่านี้ให้ตรงกับ Layout ของเทมเพลตเกียรติบัตรของคุณอย่างแม่นยำ
                // เพื่อให้ชื่อนักเรียนและข้อมูลอื่นๆ ไปปรากฏในตำแหน่งที่ถูกต้องบนเกียรติบัตร
                
                // Student Full Name
                ctx.font = `${0.040 * canvas.width}px 'Kanit', sans-serif`; // Adjust font size as needed
                ctx.fillStyle = '#ffffff'; 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const nameX = canvas.width / 2; // Center horizontally
                const nameY = canvas.height * 0.41; // Adjusted Y for better centering
                ctx.fillText(studentFullName, nameX, nameY);

                // Student Class (e.g., "มัธยมศึกษาปีที่ 5/2")
                ctx.font = `${0.022 * canvas.width}px 'Kanit', sans-serif`; // Adjust font size
                ctx.fillStyle = '#4B0082'; 
                ctx.textAlign = 'center';
                const classY = nameY + (0.040 * canvas.width * 1.2); // Position below name with some line height
                ctx.fillText(`ชั้น ${studentClass}`, nameX, classY); 

                // Certificate Number (e.g., "เลขที่ 1234/2568")
                const displayCertNumber = certificateNumber && certificateNumber !== 'ยังไม่กำหนด' ? certificateNumber : 'ยังไม่กำหนด';
                ctx.font = `${0.02 * canvas.width}px 'Kanit', sans-serif`; // Adjust font size
                ctx.fillStyle = '#ffffff'; 
                ctx.textAlign = 'right';
                const numberX = canvas.width * 0.90; // Adjust X based on template (e.g., 90% from left)
                const numberY = canvas.height * 0.04; // Adjust Y based on template (e.g., 4% down from top)
                ctx.fillText(`เลขที่ ${displayCertNumber}/2568`, numberX, numberY);
                // --- END OF IMPORTANT ADJUSTMENT AREA ---

                const imageData = canvas.toDataURL('image/png'); // Output as PNG (lossless)
                console.log('generateCertificateImage: Canvas to DataURL successful.');
                resolve(imageData);
            };

            img.onerror = (e) => {
                console.error("generateCertificateImage: Error loading template image for canvas:", e);
                showMessage('ไม่สามารถโหลดรูปภาพเทมเพลตเกียรติบัตรได้', 'error');
                reject(null);
            };

            img.src = templateUrl;
            console.log('generateCertificateImage: Setting image src to', templateUrl);
        });
    }

    /**
     * Load student participation progress as a percentage
     * and show print certificate button if eligible.
     */
    async function loadStudentParticipationProgress() {
        if (!currentStudentId) return;

        const allActivitiesResponse = await fetchData('?action=get_activities', 'GET');
        const studentActivitiesStatusResponse = await fetchData(`?action=get_student_activity_status`, 'GET'); 

        if (allActivitiesResponse.status === 'success' && studentActivitiesStatusResponse.status === 'success') {
            const allActivities = allActivitiesResponse.data;
            const studentActivityStatuses = studentActivitiesStatusResponse.data;

            const activityStatusMap = {}; 
            studentActivityStatuses.forEach(item => {
                activityStatusMap[item.activity_id] = item;
            });

            const totalActivitiesCount = allActivities.length;
            let completedQuizzedActivitiesCount = 0; 
            let totalPossibleQuizzedActivities = 0; 

            let studentOverallScore = 0;
            let studentOverallPossibleScore = 0;
            
            const quizzedActivityIds = [];
            for (const activity of allActivities) {
                const quizzesResponse = await fetchData(`?action=get_quizzes&activity_id=${activity.activity_id}`, 'GET');
                if (quizzesResponse.status === 'success' && quizzesResponse.data.length > 0) {
                    quizzedActivityIds.push(activity.activity_id);
                    quizzesResponse.data.forEach(q => studentOverallPossibleScore += q.score_per_question);
                }
            }

            quizzedActivityIds.forEach(activityId => {
                const status = activityStatusMap[activityId];
                if (status && status.is_completed) {
                    completedQuizzedActivitiesCount++;
                    studentOverallScore += status.score;
                }
            });
            totalPossibleQuizzedActivities = quizzedActivityIds.length;


            const overallProgressPercentage = totalPossibleQuizzedActivities > 0 
                ? (completedQuizzedActivitiesCount / totalPossibleQuizzedActivities) * 100 
                : 0;

            let progressHtml = `
                <strong class="font-medium text-gray-800">ความคืบหน้าการเข้าร่วม:</strong> 
                <div class="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                    <div class="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${overallProgressPercentage.toFixed(0)}%;"></div>
                </div>
                <span class="text-blue-600 font-bold text-xl">${overallProgressPercentage.toFixed(0)}%</span>
                <p class="text-gray-700 mt-2">
                    <strong class="font-medium">แบบทดสอบที่ทำสำเร็จแล้ว:</strong> 
                    <span class="text-gray-600 font-bold">${completedQuizzedActivitiesCount} / ${totalPossibleQuizzedActivities}</span>
                </p>
            `;

            participationProgressCard.innerHTML = `
                <h3 class="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <i class="fas fa-tasks mr-3 text-2xl"></i>ความคืบหน้ากิจกรรม
                </h3>
                ${progressHtml}
            `;
            
            const isEligibleForCertificate = (completedQuizzedActivitiesCount === totalPossibleQuizzedActivities && totalPossibleQuizzedActivities > 0) &&
                                             (studentOverallPossibleScore > 0 ? (studentOverallScore / studentOverallPossibleScore) * 100 >= 70 : true); 


            if (isEligibleForCertificate) {
                viewStudentCertificateBtn.classList.remove('hidden');
                downloadStudentCertificateBtn.classList.remove('hidden');
                certificateStatus.innerHTML = '<span class="font-bold text-green-600">สถานะ: คุณได้รับเกียรติบัตรแล้ว!</span>';
                loadStudentCertificateStatus(); 
            } else {
                viewStudentCertificateBtn.classList.add('hidden');
                downloadStudentCertificateBtn.classList.add('hidden');
                printCertificateBtn.classList.add('hidden');
                certificateStatus.innerHTML = '<span class="font-bold text-red-500">สถานะ: คุณยังไม่ผ่านเกณฑ์การรับเกียรติบัตร</span>';
                certificatePreviewContainer.classList.add('hidden');
                certificateNumberDisplay.classList.add('hidden');
            }
        } else {
            participationProgressCard.innerHTML = `
                <h3 class="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <i class="fas fa-tasks mr-3 text-2xl"></i>ความคืบหน้ากิจกรรม
                </h3>
                <strong class="font-medium">ความคืบหน้าการเข้าร่วม:</strong> <span class="text-red-500">ไม่สามารถโหลดข้อมูลได้.</span>
            `;
            showMessage(`ไม่สามารถโหลดความคืบหน้าได้: ${allActivitiesResponse.message || studentActivitiesStatusResponse.message}`, 'error');
        }
    }


    // --- Student Certificate Actions ---
    viewStudentCertificateBtn.addEventListener('click', async (event) => {
        const template_url = event.currentTarget.dataset.templateUrl;
        const student_name = event.currentTarget.dataset.studentName;
        const cert_number = event.currentTarget.dataset.certNumber;
        const student_class = event.currentTarget.dataset.studentClass; 

        const imageDataUrl = await generateCertificateImage(template_url, student_name, cert_number, student_class, 1200); 
        if (imageDataUrl) {
            studentCertModalImg.src = imageDataUrl;
            studentCertificateViewModal.classList.remove('hidden');
            studentCertificateViewModal.querySelector('div').classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                studentCertificateViewModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            }, 10);
        } else {
            showMessage('ไม่สามารถสร้างตัวอย่างเกียรติบัตรได้', 'error');
        }
    });

    downloadStudentCertificateBtn.addEventListener('click', async (event) => {
        const template_url = event.currentTarget.dataset.templateUrl;
        const student_name = event.currentTarget.dataset.studentName;
        const cert_number = event.currentTarget.dataset.certNumber;
        const student_id = event.currentTarget.dataset.studentId;
        const student_class = event.currentTarget.dataset.studentClass;

        showMessage('กำลังสร้างเกียรติบัตรสำหรับดาวน์โหลด...', 'success');
        const imageDataUrl = await generateCertificateImage(template_url, student_name, cert_number, student_class, 1200); 
        if (imageDataUrl) {
            const a = document.createElement('a');
            a.href = imageDataUrl;
            a.download = `certificate_${student_id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showMessage('ดาวน์โหลดเกียรติบัตรสำเร็จแล้ว', 'success');
        } else {
            showMessage('ไม่สามารถสร้างเกียรติบัตรสำหรับดาวน์โหลดได้', 'error');
        }
    });

    if (downloadStudentCertificateFromModalBtn) { 
        downloadStudentCertificateFromModalBtn.addEventListener('click', async () => {
            const template_url = viewStudentCertificateBtn.dataset.templateUrl; 
            const student_name = viewStudentCertificateBtn.dataset.studentName;
            const cert_number = viewStudentCertificateBtn.dataset.certNumber;
            const student_id = viewStudentCertificateBtn.dataset.studentId; 
            const student_class = viewStudentCertificateBtn.dataset.studentClass; 

            showMessage('กำลังสร้างเกียรติบัตรสำหรับดาวน์โหลด...', 'success');
            const generatedDataUrl = await generateCertificateImage(template_url, student_name, cert_number, student_class, 1200);
            if (generatedDataUrl) {
                const a = document.createElement('a');
                a.href = generatedDataUrl;
                a.download = `certificate_${student_id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showMessage('ดาวน์โหลดเกียรติบัตรสำเร็จแล้ว', 'success');
            } else {
                showMessage('ไม่สามารถสร้างเกียรติบัตรสำหรับดาวน์โหลดได้', 'error');
            }
        });
    }


    closeStudentCertificateViewModalBtn.addEventListener('click', () => {
        studentCertificateViewModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            studentCertificateViewModal.classList.add('hidden');
            studentCertModalImg.src = ''; 
        }, 300);
    });

    printCertificateBtn.addEventListener('click', async () => {
        const studentFullName = printCertificateBtn.dataset.studentName;
        const certNumber = printCertificateBtn.dataset.certNumber;
        const template_url = printCertificateBtn.dataset.templateUrl;
        const studentClass = printCertificateBtn.dataset.studentClass; 

        const imageDataUrl = await generateCertificateImage(template_url, studentFullName, certNumber, studentClass, 1200); 
        if (imageDataUrl) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>เกียรติบัตร - ${studentFullName}</title>
                    <style>
                        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f2f5; }
                        .print-container { position: relative; width: 100%; max-width: 800px; margin: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .print-container img { width: 100%; height: auto; display: block; }
                        @media print {
                            body { background-color: white; }
                            .print-container { box-shadow: none; margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        <img src="${imageDataUrl}" alt="Certificate">
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            showMessage('ไม่สามารถเตรียมเกียรติบัตรสำหรับพิมพ์ได้', 'error');
        }
    });


    // --- Student Login Form ---
    studentLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value.trim();
        if (!studentId) {
            showMessage('กรุณากรอกรหัสนักเรียน', 'error');
            return;
        }

        const response = await fetchData('?action=student_login', 'POST', { student_id: studentId });
        if (response.status === 'success') {
            showMessage('เข้าสู่ระบบสำเร็จ', 'success');
            currentStudentId = response.data.student_id;
            updateStudentInfo(response.data);
            showSection(studentDashboardSection);
            adminLoginIcon.classList.add('hidden');
            adminLogoutBtn.classList.add('hidden');
            studentLogoutBtn.classList.remove('hidden');
            loadStudentActivities();
            loadStudentCertificateStatus(); 
            loadStudentParticipationProgress(); 
        } else {
            showMessage(response.message, 'error');
        }
    });

    // --- Student Logout
    studentLogoutBtn.addEventListener('click', async () => {
        const response = await fetchData('?action=student_logout', 'POST');
        if (response.status === 'success') {
            showMessage('ออกจากระบบนักเรียนสำเร็จ', 'success');
            currentStudentId = null;
            showSection(loginSection);
            adminLoginIcon.classList.remove('hidden');
            studentLogoutBtn.classList.add('hidden');
            updateStudentInfo({first_name: '', last_name: '', student_id: '', class: '', room_number: ''});
            activitiesList.innerHTML = '';
            certificateSection.classList.add('hidden');
        } else {
            showMessage(response.message, 'error');
        }
    });


    // --- Admin Login Modal and Form ---
    adminLoginIcon.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminLoginModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            adminLoginModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        }, 10);
    });

    adminLoginCancelBtn.addEventListener('click', () => {
        adminLoginModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            adminLoginModal.classList.add('hidden');
        }, 300);
    });

    adminLoginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value.trim();

        if (!username || !password) {
            showMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'error');
            return;
        }

        const response = await fetchData('?action=admin_login', 'POST', { username, password });
        if (response.status === 'success') {
            showMessage('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ', 'success');
            adminLoginModal.classList.add('hidden');
            adminLoginIcon.classList.add('hidden');
            adminLogoutBtn.classList.remove('hidden');
            studentLogoutBtn.classList.add('hidden');
            showSection(adminDashboardSection);
            showAdminContent('admin-content-dashboard'); 
        } else {
            showMessage(response.message, 'error');
        }
    });

    adminLogoutBtn.addEventListener('click', async () => {
        const response = await fetchData('?action=admin_logout', 'POST');
        if (response.status === 'success') {
            showMessage('ออกจากระบบผู้ดูแลระบบสำเร็จ', 'success');
            adminLoginIcon.classList.remove('hidden');
            adminLogoutBtn.classList.add('hidden');
            studentLogoutBtn.classList.add('hidden');
            showSection(loginSection);
        } else {
            showMessage(response.message, 'error');
        }
    });

    // --- Admin Dashboard Logic ---

    // Tab switching for Admin Dashboard
    adminTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            adminTabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md', 'hover:bg-blue-700');
                btn.classList.add('bg-gray-300', 'text-gray-800', 'shadow', 'hover:bg-gray-400');
            });
            button.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md', 'hover:bg-blue-700');
            button.classList.remove('bg-gray-300', 'text-gray-800', 'shadow', 'hover:bg-gray-400');

            const targetId = button.id.replace('admin-tab-', 'admin-content-');
            showAdminContent(targetId);
        });
    });

    /**
     * Show the desired admin content section.
     * @param {string} contentId ID of the content section to show (e.g., 'admin-content-students').
     */
    async function showAdminContent(contentId) {
        adminContentAreas.forEach(area => area.classList.add('hidden'));
        document.getElementById(contentId).classList.remove('hidden');

        if (contentId === 'admin-content-dashboard') {
            await loadAdminDashboardSummary();
        } else if (contentId === 'admin-content-students') {
            populateClassDropdown(newStudentClassSelect, 'เลือกชั้น'); 
            populateFixedRoomOptions(newStudentRoomSelect);

            populateClassDropdown(filterStudentClass, 'แสดงทั้งหมด'); 
            populateFixedRoomOptions(filterStudentRoom); 
            currentStudentsPage = 1; 
            await loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage); 
        } else if (contentId === 'admin-content-activities') {
            await loadActivities();
        } else if (contentId === 'admin-content-quizzes') {
            await loadActivitiesForQuizSelect();
            await loadQuizzes();
        } else if (contentId === 'admin-content-certificates') {
            await loadCertificateTemplates();
        } else if (contentId === 'admin-content-issued-certificates') {
            populateClassDropdown(filterIssuedCertClass, 'แสดงทั้งหมด'); 
            populateFixedRoomOptions(filterIssuedCertRoom); 
            // Also populate for the generate room certs modal/section
            populateClassDropdown(generateRoomClassSelect, 'เลือกชั้น'); 
            populateFixedRoomOptions(generateRoomNumberSelect); 
            currentIssuedCertsPage = 1; 
            await loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage); 
        }
    }

    /**
     * Load dashboard summary data for Admin.
     */
    async function loadAdminDashboardSummary() {
        const response = await fetchData('?action=get_dashboard_summary', 'GET');
        if (response.status === 'success') {
            totalStudentsSpan.textContent = response.data.total_students;
            totalActivitiesSpan.textContent = response.data.total_activities;
            studentsPassed70Span.textContent = response.data.students_passed_70;
            participationPercentageSpan.textContent = `${response.data.participation_percentage}%`;
        } else {
            showMessage(`ไม่สามารถโหลดข้อมูลสรุปแดชบอร์ดได้: ${response.message}`, 'error');
        }
    }

    // --- Student Management (Admin) ---

    // Populate class dropdowns based on fixedClasses array
    function populateClassDropdown(selectElement, defaultText) {
        const currentVal = selectElement.value; 
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        
        fixedClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            selectElement.appendChild(option);
        });
        selectElement.value = currentVal; 
    }

    // Populate fixed room options for a given select element
    function populateFixedRoomOptions(selectElement) {
        const initialOptionText = selectElement.options.length > 0 ? selectElement.options[0].textContent : (selectElement.id.includes('filter') ? 'กรองตามห้อง' : 'เลือกห้อง');
        selectElement.innerHTML = `<option value="">${initialOptionText}</option>`;
        
        fixedRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            selectElement.appendChild(option);
        });
    }
    
    newStudentClassSelect.addEventListener('change', () => {
        populateFixedRoomOptions(newStudentRoomSelect);
    });

    addStudentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const student_id = document.getElementById('new-student-id').value.trim();
        const first_name = document.getElementById('new-student-first-name').value.trim();
        const last_name = document.getElementById('new-student-last-name').value.trim();
        const selectedClassBase = newStudentClassSelect.value.trim();
        const selectedRoomNumber = newStudentRoomSelect.value.trim();
        const class_for_db = `${selectedClassBase}/${selectedRoomNumber}`; 
        const room_number = document.getElementById('new-student-room-number').value.trim(); 

        if (!student_id || !first_name || !last_name || !selectedClassBase || !selectedRoomNumber || !room_number) {
            showMessage('กรุณากรอกข้อมูลนักเรียนให้ครบถ้วน', 'error');
            return;
        }

        const response = await fetchData('?action=add_student', 'POST', {
            student_id, first_name, last_name, class: class_for_db, room_number: parseInt(room_number)
        });

        if (response.status === 'success') {
            showMessage('เพิ่มนักเรียนสำเร็จ', 'success');
            addStudentForm.reset();
            populateClassDropdown(newStudentClassSelect, 'เลือกชั้น'); 
            populateFixedRoomOptions(newStudentRoomSelect);
            document.getElementById('new-student-room-number').value = ''; 
            loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
            loadAdminDashboardSummary();
        } else {
            showMessage(response.message, 'error');
        }
    });

    uploadExcelBtn.addEventListener('click', async () => {
        const file = importStudentsExcelInput.files[0];
        if (!file) {
            showMessage('กรุณาเลือกไฟล์ Excel', 'error');
            return;
        }

        if (!file.name.endsWith('.csv')) { 
            showMessage('รองรับเฉพาะไฟล์ CSV เท่านั้น. หากต้องการรองรับ .xls/.xlsx ต้องใช้ไลบรารีเพิ่มเติม.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) { 
                showMessage('ไฟล์ CSV ไม่มีข้อมูลที่ถูกต้อง', 'error');
                return;
            }
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const requiredHeaders = ['student_id', 'first_name', 'last_name', 'class', 'room_number'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

            if (missingHeaders.length > 0) {
                showMessage(`ไฟล์ CSV ขาดคอลัมน์ที่จำเป็น: ${missingHeaders.join(', '.toUpperCase())}. โปรดตรวจสอบหัวข้อคอลัมน์ให้ถูกต้อง.`, 'error', 7000);
                return;
            }

            const studentsData = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length === headers.length) {
                    let student = {};
                    headers.forEach((header, index) => {
                        student[header] = values[index];
                    });
                    if (student.room_number) {
                        student.room_number = parseInt(student.room_number);
                    } else {
                        student.room_number = 0; 
                    }
                    studentsData.push(student);
                } else {
                    console.warn(`Skipping malformed row ${i + 1} in CSV: ${lines[i]}`);
                }
            }

            if (studentsData.length === 0) {
                showMessage('ไม่พบข้อมูลนักเรียนที่ถูกต้องในไฟล์ CSV', 'error');
                return;
            }

            const response = await fetchData('?action=upload_students_excel', 'POST', { students_data: studentsData });
            if (response.status === 'success') {
                showMessage(`นำเข้าข้อมูลนักเรียนสำเร็จ: ${response.message}`, 'success', 5000);
                importStudentsExcelInput.value = '';
                loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
                loadAdminDashboardSummary();
            } else {
                showMessage(`ข้อผิดพลาดในการนำเข้าข้อมูล: ${response.message}`, 'error', 5000);
            }
        };
        reader.onerror = () => {
            showMessage('ข้อผิดพลาดในการอ่านไฟล์', 'error');
        };
        reader.readAsText(file);
    });

    /**
     * Load all student data and display it in the table.
     * @param {string} filterClass (Optional) Filter by class.
     * @param {number} filterRoom (Optional) Filter by room number.
     * @param {number} page Current page number.
     * @param {number} limit Items per page.
     */
    async function loadStudents(filterClass = '', filterRoom = '', page = 1, limit = studentsLimitPerPage) {
        studentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">กำลังโหลดข้อมูลนักเรียน...</td></tr>';
        
        const url = `?action=get_students&class=${encodeURIComponent(filterClass)}&room=${encodeURIComponent(filterRoom)}&page=${page}&limit=${limit}`;
        const response = await fetchData(url, 'GET');

        if (response.status === 'success') {
            const students = response.data.students;
            currentStudentsPage = response.data.current_page;
            totalStudentsPages = response.data.total_pages;

            studentsTableBody.innerHTML = '';
            if (students.length === 0) {
                studentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">ไม่พบข้อมูลนักเรียน</td></tr>';
            } else {
                students.forEach(student => {
                    const row = studentsTableBody.insertRow();
                    row.innerHTML = `
                        <td class="py-2 px-4">${student.student_id}</td>
                        <td class="py-2 px-4">${student.first_name} ${student.last_name}</td>
                        <td class="py-2 px-4">${student.class}</td>
                        <td class="py-2 px-4">${student.room_number}</td>
                        <td class="py-2 px-4">
                            <button class="edit-student-btn bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 mr-2" data-id="${student.student_id}" data-first="${student.first_name}" data-last="${student.last_name}" data-class="${student.class}" data-room="${student.room_number}">แก้ไข</button>
                            <button class="delete-student-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600" data-id="${student.student_id}">ลบ</button>
                        </td>
                    `;
                });
            }
            attachStudentActionListeners();
            updateStudentsPaginationControls(); 
        } else {
            studentsTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">ไม่สามารถโหลดข้อมูลนักเรียนได้: ${response.message}</td></tr>`;
        }
    }

    /**
     * Update the pagination controls for the students table.
     */
    function updateStudentsPaginationControls() {
        // Update both top and bottom pagination info spans
        studentsPageInfoSpan.textContent = `หน้า ${currentStudentsPage} จาก ${totalStudentsPages}`;
        studentsPageInfoSpanTop.textContent = `หน้า ${currentStudentsPage} จาก ${totalStudentsPages}`;

        // Update disabled states for both top and bottom previous buttons
        studentsPrevBtn.disabled = (currentStudentsPage === 1);
        studentsPrevBtnTop.disabled = (currentStudentsPage === 1);

        // Update disabled states for both top and bottom next buttons
        studentsNextBtn.disabled = (currentStudentsPage === totalStudentsPages);
        studentsNextBtnTop.disabled = (currentStudentsPage === totalStudentsPages);
    }

    // Student Pagination Event Listeners (Bottom buttons - existing)
    studentsPrevBtn.addEventListener('click', () => {
        if (currentStudentsPage > 1) {
            currentStudentsPage--;
            loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
        }
    });

    studentsNextBtn.addEventListener('click', () => {
        if (currentStudentsPage < totalStudentsPages) {
            currentStudentsPage++;
            loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
        }
    });

    // Student Pagination Event Listeners (Top buttons - NEW)
    studentsPrevBtnTop.addEventListener('click', () => {
        if (currentStudentsPage > 1) {
            currentStudentsPage--;
            loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
        }
    });

    studentsNextBtnTop.addEventListener('click', () => {
        if (currentStudentsPage < totalStudentsPages) {
            currentStudentsPage++;
            loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
        }
    });


    /**
     * Attach Event Listeners for student edit and delete buttons.
     */
    function attachStudentActionListeners() {
        document.querySelectorAll('.edit-student-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const currentFirstName = event.target.dataset.first;
                const currentLastName = event.target.dataset.last;
                const currentClass = event.target.dataset.class; 
                const currentRoomNumberInClass = currentClass.split('/')[1] || ''; 
                const currentClassBase = currentClass.split('/')[0] || ''; 
                const currentRoom = event.target.dataset.room; 

                const studentData = {
                    student_id: id,
                    first_name: currentFirstName,
                    last_name: currentLastName,
                    class_base: currentClassBase,
                    room_in_class: currentRoomNumberInClass,
                    room_number: currentRoom 
                };
                
                const updatedData = await customEditStudentPrompt(studentData);

                if (updatedData) {
                    const class_for_db = `${updatedData.class_base}/${updatedData.room_in_class}`;
                    const response = await fetchData('?action=update_student', 'PUT', {
                        student_id: id,
                        first_name: updatedData.first_name,
                        last_name: updatedData.last_name,
                        class: class_for_db,
                        room_number: parseInt(updatedData.room_number)
                    });
                    if (response.status === 'success') {
                        showMessage('อัปเดตข้อมูลนักเรียนสำเร็จ', 'success');
                        loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage); 
                        loadAdminDashboardSummary();
                    } else {
                        showMessage(response.message, 'error');
                    }
                }
            };
        });

        document.querySelectorAll('.delete-student-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = await customConfirm('คุณแน่ใจหรือไม่ที่ต้องการลบนักเรียนนี้?');
                if (confirmDelete) {
                    const response = await fetchData(`?action=delete_student&student_id=${id}`, 'DELETE');
                    if (response.status === 'success') {
                        showMessage('ลบนักเรียนสำเร็จ', 'success');
                        loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage); 
                        loadAdminDashboardSummary();
                    } else {
                        showMessage(response.message, 'error');
                    }
                }
            };
        });
    }

    /**
     * Show a Custom Confirmation Dialog.
     * @param {string} message The confirmation message.
     * @returns {Promise<boolean>} True if the user confirms, false if cancelled.
     */
    function customConfirm(message) {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm transform scale-95 opacity-0 transition-all duration-300 ease-out">
                    <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">ยืนยันการดำเนินการ</h3>
                    <p class="text-gray-700 text-center mb-6">${message}</p>
                    <div class="flex justify-end space-x-4">
                        <button id="confirm-cancel" class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition-colors duration-300">ยกเลิก</button>
                        <button id="confirm-ok" class="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">ยืนยัน</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            setTimeout(() => {
                modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            }, 10);

            document.getElementById('confirm-ok').onclick = () => {
                modal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => { modal.remove(); }, 300);
                resolve(true);
            };
            document.getElementById('confirm-cancel').onclick = () => {
                modal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => { modal.remove(); }, 300);
                resolve(false);
            };
        });
    }

    /**
     * Show a custom modal for editing student data.
     * @param {object} studentData The student data to pre-fill.
     * @returns {Promise<object|null>} The updated student data, or null if cancelled.
     */
    function customEditStudentPrompt(studentData) {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform scale-95 opacity-0 transition-all duration-300 ease-out">
                    <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">แก้ไขข้อมูลนักเรียน</h3>
                    <form id="edit-student-modal-form" class="space-y-4">
                        <div>
                            <label for="edit-student-first-name" class="block text-gray-700 text-sm font-medium mb-1">ชื่อ:</label>
                            <input type="text" id="edit-student-first-name" class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" value="${studentData.first_name}" required>
                        </div>
                        <div>
                            <label for="edit-student-last-name" class="block text-gray-700 text-sm font-medium mb-1">นามสกุล:</label>
                            <input type="text" id="edit-student-last-name" class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" value="${studentData.last_name}" required>
                        </div>
                        <div>
                            <label for="edit-student-class-base" class="block text-gray-700 text-sm font-medium mb-1">ชั้น:</label>
                            <select id="edit-student-class-base" class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                                <!-- Options populated by JS -->
                            </select>
                        </div>
                        <div>
                            <label for="edit-student-room-in-class" class="block text-gray-700 text-sm font-medium mb-1">ห้อง:</label>
                            <select id="edit-student-room-in-class" class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                                <!-- Options populated by JS -->
                            </select>
                        </div>
                        <div>
                            <label for="edit-student-room-number" class="block text-gray-700 text-sm font-medium mb-1">เลขที่:</label>
                            <input type="number" id="edit-student-room-number" class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" value="${studentData.room_number}" required>
                        </div>
                        <div class="flex justify-end space-x-4 mt-6">
                            <button type="button" id="edit-student-cancel" class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition-colors duration-300">ยกเลิก</button>
                            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">บันทึก</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            const editStudentClassBaseSelect = document.getElementById('edit-student-class-base');
            const editStudentRoomInClassSelect = document.getElementById('edit-student-room-in-class');

            populateClassDropdown(editStudentClassBaseSelect, 'เลือกชั้น');
            editStudentClassBaseSelect.value = studentData.class_base;

            populateFixedRoomOptions(editStudentRoomInClassSelect);
            editStudentRoomInClassSelect.value = studentData.room_in_class;

            editStudentClassBaseSelect.addEventListener('change', () => {
                populateFixedRoomOptions(editStudentRoomInClassSelect);
            });


            setTimeout(() => {
                modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            }, 10);

            document.getElementById('edit-student-modal-form').onsubmit = (e) => {
                e.preventDefault();
                const updatedData = {
                    first_name: document.getElementById('edit-student-first-name').value.trim(),
                    last_name: document.getElementById('edit-student-last-name').value.trim(),
                    class_base: editStudentClassBaseSelect.value,
                    room_in_class: editStudentRoomInClassSelect.value,
                    room_number: document.getElementById('edit-student-room-number').value.trim()
                };
                modal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => { modal.remove(); }, 300);
                resolve(updatedData);
            };

            document.getElementById('edit-student-cancel').onclick = () => {
                modal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => { modal.remove(); }, 300);
                resolve(null);
            };
        });
    }

    // Event listeners for student filters
    filterStudentClass.addEventListener('change', () => {
        currentStudentsPage = 1; 
        loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
    });

    filterStudentRoom.addEventListener('change', () => {
        currentStudentsPage = 1; 
        loadStudents(filterStudentClass.value, filterStudentRoom.value, currentStudentsPage, studentsLimitPerPage);
    });

    clearStudentFiltersBtn.addEventListener('click', () => {
        filterStudentClass.value = '';
        filterStudentRoom.value = '';
        currentStudentsPage = 1; 
        loadStudents();
    });

    // --- Activity Management (Admin) ---

    addActivityForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const activity_name = document.getElementById('new-activity-name').value.trim();
        const description = document.getElementById('new-activity-description').value.trim();
        const imageFile = document.getElementById('new-activity-image-file').files[0];
        const access_code = document.getElementById('new-activity-access-code').value.trim();

        if (!activity_name || !description || !access_code) {
            showMessage('กรุณากรอกชื่อกิจกรรม, คำอธิบาย และรหัสยืนยันการเข้าฐานกิจกรรม', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('activity_name', activity_name);
        formData.append('description', description);
        formData.append('access_code', access_code);
        if (imageFile) {
            formData.append('image_file', imageFile);
        }

        const response = await fetchData('?action=add_activity', 'POST', formData);

        if (response.status === 'success') {
            showMessage('เพิ่มกิจกรรมสำเร็จ', 'success');
            addActivityForm.reset();
            loadActivities();
            loadAdminDashboardSummary();
            loadActivitiesForQuizSelect();
        } else {
            showMessage(response.message, 'error');
        }
    });

    /**
     * Load all activity data and display it in the table.
     */
    async function loadActivities() {
        activitiesTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">กำลังโหลดข้อมูลกิจกรรม...</td></tr>';
        const response = await fetchData('?action=get_activities', 'GET');
        if (response.status === 'success') {
            const activities = response.data;
            activitiesTableBody.innerHTML = '';
            if (activities.length === 0) {
                activitiesTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">ไม่พบข้อมูลกิจกรรม</td></tr>';
                return;
            }
            activities.forEach(activity => {
                const row = activitiesTableBody.insertRow();
                row.innerHTML = `
                    <td class="py-2 px-4"><img src="${activity.image_url || 'https://placehold.co/80x40/E0F2F7/007AFF?text=ไม่มีรูปภาพ'}" class="w-20 h-10 object-cover rounded-md" alt="Activity Image"></td>
                    <td class="py-2 px-4">${activity.activity_name}</td>
                    <td class="py-2 px-4">${activity.description.substring(0, 50)}${activity.description.length > 50 ? '...' : ''}</td>
                    <td class="py-2 px-4">${activity.access_code}</td>
                    <td class="py-2 px-4">
                        <button class="edit-activity-btn bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 mr-2" 
                            data-id="${activity.activity_id}" 
                            data-name="${activity.activity_name}" 
                            data-desc="${activity.description}" 
                            data-image="${activity.image_url || ''}" 
                            data-code="${activity.access_code}">แก้ไข</button>
                        <button class="delete-activity-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600" data-id="${activity.activity_id}">ลบ</button>
                    </td>
                `;
            });
            attachActivityActionListeners();
        } else {
            activitiesTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">ไม่สามารถโหลดข้อมูลกิจกรรมได้: ${response.message}</td></tr>`;
        }
    }

    /**
     * Attach Event Listeners for activity edit and delete buttons.
     */
    function attachActivityActionListeners() {
        document.querySelectorAll('.edit-activity-btn').forEach(button => {
            button.onclick = (event) => {
                const id = event.target.dataset.id;
                const name = event.target.dataset.name;
                const desc = event.target.dataset.desc;
                const image = event.target.dataset.image;
                const code = event.target.dataset.code;

                editActivityIdInput.value = id;
                editActivityNameInput.value = name;
                editActivityDescriptionInput.value = desc;
                editActivityCurrentImage.src = image || 'https://placehold.co/80x40/E0F2F7/007AFF?text=ไม่มีรูปภาพ';
                editActivityAccessCodeInput.value = code;
                editActivityImageFileInput.value = '';

                editActivityModal.classList.remove('hidden');
                editActivityModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    editActivityModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
                }, 10);
            };
        });

        document.querySelectorAll('.delete-activity-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = await customConfirm('การลบกิจกรรมนี้จะลบแบบทดสอบและข้อมูลการเข้าร่วมที่เกี่ยวข้องทั้งหมด คุณแน่ใจหรือไม่?');
                if (confirmDelete) {
                    const response = await fetchData(`?action=delete_activity&activity_id=${id}`, 'DELETE');
                    if (response.status === 'success') {
                        showMessage('ลบกิจกรรมสำเร็จ', 'success');
                        loadActivities();
                        loadAdminDashboardSummary();
                        loadActivitiesForQuizSelect();
                    } else {
                        showMessage(response.message, 'error');
                    }
                }
            };
        });
    }

    editActivityCancelBtn.addEventListener('click', () => {
        editActivityModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            editActivityModal.classList.add('hidden');
        }, 300);
    });

    editActivityForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const activity_id = editActivityIdInput.value;
        const activity_name = editActivityNameInput.value.trim();
        const description = editActivityDescriptionInput.value.trim();
        const imageFile = editActivityImageFileInput.files[0];
        const access_code = editActivityAccessCodeInput.value.trim();
        const current_image_url = editActivityCurrentImage.src;

        if (!activity_name || !description || !access_code) {
            showMessage('กรุณากรอกข้อมูลกิจกรรมให้ครบถ้วน', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('activity_id', activity_id);
        formData.append('activity_name', activity_name);
        formData.append('description', description);
        formData.append('access_code', access_code);
        
        if (imageFile) {
            formData.append('image_file', imageFile);
        } else {
            formData.append('current_image_url', current_image_url);
        }

        const response = await fetchData('?action=update_activity', 'POST', formData); 

        if (response.status === 'success') {
            showMessage('อัปเดตกิจกรรมสำเร็จ', 'success');
            editActivityModal.classList.add('hidden');
            loadActivities();
            loadAdminDashboardSummary();
            loadActivitiesForQuizSelect();
        } else {
            showMessage(response.message, 'error');
        }
    });

    // --- Quiz Management (Admin) ---

    /**
     * Populate activity dropdowns for quiz management.
     */
    async function loadActivitiesForQuizSelect() {
        const response = await fetchData('?action=get_activities', 'GET');
        if (response.status === 'success') {
            const activities = response.data;
            quizActivitySelect.innerHTML = '<option value="">เลือกกิจกรรม</option>';
            filterQuizActivity.innerHTML = '<option value="">แสดงทั้งหมด</option>';
            editQuizActivitySelect.innerHTML = '<option value="">เลือกกิจกรรม</option>'; 
            activities.forEach(activity => {
                const option = `<option value="${activity.activity_id}">${activity.activity_name}</option>`;
                quizActivitySelect.innerHTML += option;
                filterQuizActivity.innerHTML += option;
                editQuizActivitySelect.innerHTML += option; 
            });
        }
    }

    addQuizForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const activity_id = quizActivitySelect.value;
        const question = document.getElementById('new-quiz-question').value.trim();
        const option_a = document.getElementById('new-quiz-option-a').value.trim();
        const option_b = document.getElementById('new-quiz-option-b').value.trim();
        const option_c = document.getElementById('new-quiz-option-c').value.trim();
        const option_d = document.getElementById('new-quiz-option-d').value.trim();
        const correct_answer = newQuizCorrectAnswerSelect.value.trim(); 
        const score_per_question = document.getElementById('new-quiz-score').value.trim();

        if (!activity_id || !question || !option_a || !option_b || !option_c || !option_d || !correct_answer || !score_per_question) {
            showMessage('กรุณากรอกข้อมูลแบบทดสอบให้ครบถ้วน', 'error');
            return;
        }

        const response = await fetchData('?action=add_quiz', 'POST', {
            activity_id: parseInt(activity_id),
            question, option_a, option_b, option_c, option_d, correct_answer, score_per_question: parseInt(score_per_question)
        });

        if (response.status === 'success') {
            showMessage('เพิ่มแบบทดสอบสำเร็จ', 'success');
            addQuizForm.reset();
            quizActivitySelect.value = activity_id; 
            loadQuizzes(activity_id);
            loadAdminDashboardSummary();
        } else {
            showMessage(response.message, 'error');
        }
    });

    filterQuizActivity.addEventListener('change', () => {
        loadQuizzes(filterQuizActivity.value);
    });

    /**
     * Load quiz data and display it in the table.
     * @param {string} activityId (Optional) Filter by Activity ID.
     */
    async function loadQuizzes(activityId = '') {
        quizzesTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">กำลังโหลดข้อมูลแบบทดสอบ...</td></tr>';
        const response = await fetchData(`?action=get_quizzes&activity_id=${activityId}`, 'GET');
        const activitiesResponse = await fetchData('?action=get_activities', 'GET');
        const activityMap = {};
        if (activitiesResponse.status === 'success') {
            activitiesResponse.data.forEach(activity => {
                activityMap[activity.activity_id] = activity.activity_name;
            });
        }

        if (response.status === 'success') {
            const quizzes = response.data;
            quizzesTableBody.innerHTML = '';
            if (quizzes.length === 0) {
                quizzesTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">ไม่พบข้อมูลแบบทดสอบ</td></tr>';
                return;
            }
            quizzes.forEach(quiz => {
                const row = quizzesTableBody.insertRow();
                row.innerHTML = `
                    <td class="py-2 px-4">${quiz.quiz_id}</td>
                    <td class="py-2 px-4">${activityMap[quiz.activity_id] || 'N/A'}</td>
                    <td class="py-2 px-4">${quiz.question.substring(0, 70)}${quiz.question.length > 70 ? '...' : ''}</td>
                    <td class="py-2 px-4">${quiz.correct_answer}</td>
                    <td class="py-2 px-4">${quiz.score_per_question}</td>
                    <td class="py-2 px-4">
                        <button class="edit-quiz-btn bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 mr-2" 
                            data-id="${quiz.quiz_id}" 
                            data-activity-id="${quiz.activity_id}" 
                            data-question="${quiz.question}"
                            data-option-a="${quiz.option_a}"
                            data-option-b="${quiz.option_b}"
                            data-option-c="${quiz.option_c}"
                            data-option-d="${quiz.option_d}"
                            data-correct="${quiz.correct_answer}"
                            data-score="${quiz.score_per_question}">แก้ไข</button>
                        <button class="delete-quiz-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600" data-id="${quiz.quiz_id}">ลบ</button>
                    </td>
                `;
            });
            attachQuizActionListeners(activityMap);
        } else {
            quizzesTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">ไม่สามารถโหลดข้อมูลแบบทดสอบได้: ${response.message}</td></tr>`;
        }
    }

    /**
     * Attach Event Listeners for quiz edit and delete buttons.
     * @param {object} activityMap Activity map (ID -> Name).
     */
    function attachQuizActionListeners(activityMap) {
        document.querySelectorAll('.edit-quiz-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const currentActivityId = event.target.dataset.activityId;
                const currentQuestion = event.target.dataset.question;
                const currentOptionA = event.target.dataset.optionA;
                const currentOptionB = event.target.dataset.optionB;
                const currentOptionC = event.target.dataset.optionC;
                const currentOptionD = event.target.dataset.optionD;
                const currentCorrect = event.target.dataset.correct;
                const currentScore = event.target.dataset.score;

                editQuizIdInput.value = id;
                editQuizActivitySelect.value = currentActivityId;
                editQuizQuestionInput.value = currentQuestion;
                editQuizOptionAInput.value = currentOptionA;
                editQuizOptionBInput.value = currentOptionB;
                editQuizOptionCInput.value = currentOptionC;
                editQuizOptionDInput.value = currentOptionD;
                editQuizCorrectAnswerSelect.value = currentCorrect;
                editQuizScoreInput.value = currentScore;

                editQuizModal.classList.remove('hidden');
                editQuizModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    editQuizModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
                }, 10);
            };
        });

        document.querySelectorAll('.delete-quiz-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = await customConfirm('คุณแน่ใจหรือไม่ที่ต้องการลบแบบทดสอบนี้?');
                if (confirmDelete) {
                    const response = await fetchData(`?action=delete_quiz&quiz_id=${id}`, 'DELETE');
                    if (response.status === 'success') {
                        showMessage('ลบแบบทดสอบสำเร็จ', 'success');
                        loadQuizzes(filterQuizActivity.value);
                        loadAdminDashboardSummary();
                    } else {
                        showMessage(response.message, 'error');
                    }
                }
            };
        });
    }

    editQuizCancelBtn.addEventListener('click', () => {
        editQuizModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            editQuizModal.classList.add('hidden');
        }, 300);
    });

    editQuizForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const quiz_id = editQuizIdInput.value;
        const activity_id = editQuizActivitySelect.value;
        const question = editQuizQuestionInput.value.trim();
        const option_a = editQuizOptionAInput.value.trim();
        const option_b = editQuizOptionBInput.value.trim();
        const option_c = editQuizOptionCInput.value.trim();
        const option_d = editQuizOptionDInput.value.trim();
        const correct_answer = editQuizCorrectAnswerSelect.value.trim();
        const score_per_question = editQuizScoreInput.value.trim();

        if (!activity_id || !question || !option_a || !option_b || !option_c || !option_d || !correct_answer || !score_per_question) {
            showMessage('กรุณากรอกข้อมูลแบบทดสอบให้ครบถ้วน', 'error');
            return;
        }

        const response = await fetchData('?action=update_quiz', 'PUT', {
            quiz_id: parseInt(quiz_id),
            activity_id: parseInt(activity_id),
            question, option_a, option_b, option_c, option_d, correct_answer, score_per_question: parseInt(score_per_question)
        });

        if (response.status === 'success') {
            showMessage('อัปเดตแบบทดสอบสำเร็จ', 'success');
            editQuizModal.classList.add('hidden');
            loadQuizzes(filterQuizActivity.value); 
            loadAdminDashboardSummary();
        } else {
            showMessage(response.message, 'error');
        }
    });

    // --- Certificate Template Management (Admin) ---

    addCertificateTemplateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const imageFile = newCertificateImageFile.files[0]; 
        const start_number = document.getElementById('new-certificate-start-number').value.trim();
        const end_number = document.getElementById('new-certificate-end-number').value.trim();

        if (!imageFile || !start_number || !end_number) { 
            showMessage('กรุณาเลือกไฟล์รูปภาพและกรอกข้อมูลให้ครบทุกช่อง', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('template_image_file', imageFile); 
        formData.append('start_number', parseInt(start_number));
        formData.append('end_number', parseInt(end_number));

        const response = await fetchData('?action=add_certificate_template', 'POST', formData); 

        if (response.status === 'success') {
            showMessage('เพิ่มเทมเพลตเกียรติบัตรสำเร็จ', 'success');
            addCertificateTemplateForm.reset();
            loadCertificateTemplates();
        } else {
            showMessage(response.message, 'error');
        }
    });

    /**
     * Load certificate templates and display them in the table.
     */
    async function loadCertificateTemplates() {
        certificateTemplatesTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">กำลังโหลดเทมเพลตเกียรติบัตร...</td></tr>';
        const response = await fetchData('?action=get_certificate_templates', 'GET');
        if (response.status === 'success') {
            const templates = response.data;
            certificateTemplatesTableBody.innerHTML = '';
            if (templates.length === 0) {
                certificateTemplatesTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">ไม่พบเทมเพลตเกียรติบัตร</td></tr>';
                return;
            }
            templates.forEach(template => {
                const row = certificateTemplatesTableBody.insertRow();
                row.innerHTML = `
                    <td class="py-2 px-4">${template.certificate_id}</td>
                    <td class="py-2 px-4"><img src="${template.template_image_url || 'https://placehold.co/80x40/E0F2F7/007AFF?text=ไม่มีรูปภาพ'}" class="w-24 h-16 object-cover rounded-md" alt="Certificate Template"></td>
                    <td class="py-2 px-4">${template.start_number}</td>
                    <td class="py-2 px-4">${template.end_number}</td>
                    <td class="py-2 px-4">
                        <button class="edit-certificate-template-btn bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 mr-2" 
                            data-id="${template.certificate_id}" 
                            data-image="${template.template_image_url || ''}" 
                            data-start="${template.start_number}" 
                            data-end="${template.end_number}">แก้ไข</button>
                        <button class="delete-certificate-template-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600" data-id="${template.certificate_id}">ลบ</button>
                    </td>
                `;
            });
            attachCertificateTemplateActionListeners();
        } else {
            certificateTemplatesTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">ไม่สามารถโหลดเทมเพลตเกียรติบัตรได้: ${response.message}</td></tr>`;
        }
    }

    /**
     * Attach Event Listeners for certificate template edit and delete buttons.
     */
    function attachCertificateTemplateActionListeners() {
        document.querySelectorAll('.edit-certificate-template-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const currentImage = event.target.dataset.image;
                const currentStart = event.target.dataset.start;
                const currentEnd = event.target.dataset.end;

                editCertificateIdInput.value = id;
                editCertificateCurrentImage.src = currentImage || 'https://placehold.co/80x40/E0F2F7/007AFF?text=ไม่มีรูปภาพ';
                editCertificateStartNumber.value = currentStart;
                editCertificateEndNumber.value = currentEnd;
                editCertificateImageFile.value = ''; 

                editCertificateModal.classList.remove('hidden');
                editCertificateModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    editCertificateModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
                }, 10);
            };
        });

        editCertificateCancelBtn.addEventListener('click', () => {
            editCertificateModal.querySelector('div').classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                editCertificateModal.classList.add('hidden');
            }, 300);
        });

        editCertificateForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const certificate_id = editCertificateIdInput.value;
            const imageFile = editCertificateImageFile.files[0]; 
            const start_number = editCertificateStartNumber.value.trim();
            const end_number = editCertificateEndNumber.value.trim();
            const current_image_url = editCertificateCurrentImage.src; 

            if (!start_number || !end_number) {
                showMessage('กรุณากรอกเลขที่เริ่มต้นและเลขที่สิ้นสุด', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('certificate_id', certificate_id);
            formData.append('start_number', parseInt(start_number));
            formData.append('end_number', parseInt(end_number));

            if (imageFile) {
                formData.append('template_image_file', imageFile); 
            } else {
                formData.append('current_image_url', current_image_url); 
            }

            const response = await fetchData('?action=update_certificate_template', 'POST', formData); 

            if (response.status === 'success') {
                showMessage('อัปเดตเทมเพลตเกียรติบัตรสำเร็จ', 'success');
                editCertificateModal.classList.add('hidden');
                loadCertificateTemplates();
            } else {
                showMessage(response.message, 'error');
            }
        });


        document.querySelectorAll('.delete-certificate-template-btn').forEach(button => {
            button.onclick = async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = await customConfirm('คุณแน่ใจหรือไม่ว่าต้องการลบเทมเพลตเกียรติบัตรนี้? การดำเนินการนี้จะไม่ลบเกียรติบัตรที่ออกให้ไปแล้ว');
                if (confirmDelete) {
                    const response = await fetchData(`?action=delete_certificate_template&certificate_id=${id}`, 'DELETE');
                    if (response.status === 'success') {
                        showMessage('ลบเทมเพลตเกียรติบัตรสำเร็จ', 'success');
                        loadCertificateTemplates();
                    } else {
                        showMessage(response.message, 'error');
                    }
                }
            };
        });
    }

    // --- Issued Certificates (Admin) ---

    generateAllCertificatesBtn.addEventListener('click', async () => {
        const confirmGenerate = await customConfirm('การดำเนินการนี้จะสร้างเกียรติบัตรสำหรับนักเรียนทุกคนที่มีสิทธิ์ที่ยังไม่ได้รับเกียรติบัตร คุณแน่ใจหรือไม่?');
        if (confirmGenerate) {
            const response = await fetchData('?action=generate_issued_certificates', 'POST');
            if (response.status === 'success') {
                showMessage(`ออกเกียรติบัตรสำเร็จ: ${response.message}`, 'success', 5000);
                loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage); 
                loadAdminDashboardSummary();
            } else {
                showMessage(response.message, 'error', 5000);
            }
        }
    });

    /**
     * Load issued certificates and display them in the table.
     * @param {string} filterClass (Optional) Filter by class.
     * @param {number} filterRoom (Optional) Filter by room number.
     * @param {number} page Current page number.
     * @param {number} limit Items per page.
     */
    async function loadIssuedCertificates(filterClass = '', filterRoom = '', page = 1, limit = issuedCertsLimitPerPage) {
        // Updated colspan to 8 to match the 8 columns in the HTML table header
        issuedCertificatesTableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">กำลังโหลดเกียรติบัตรที่ออกให้แล้ว...</td></tr>';
        
        let url = `?action=get_issued_certificates&page=${page}&limit=${limit}`;
        if (filterClass) {
            url += `&class=${encodeURIComponent(filterClass)}`;
        }
        if (filterRoom) {
            url += `&room=${encodeURIComponent(filterRoom)}`;
        }

        const response = await fetchData(url, 'GET');
        if (response.status === 'success') {
            const issuedCerts = response.data.certificates;
            currentIssuedCertsPage = response.data.current_page;
            totalIssuedCertsPages = response.data.total_pages;

            issuedCertificatesTableBody.innerHTML = '';
            if (issuedCerts.length === 0) {
                issuedCertificatesTableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">ไม่พบเกียรติบัตรที่ออกให้</td></tr>';
            } else {
                issuedCerts.forEach(cert => {
                    const statusText = cert.certificate_number ? '<span class="text-green-600 font-semibold">ออกให้แล้ว</span>' : '<span class="text-red-500 font-semibold">ยังไม่ออกให้</span>';
                    const certNumber = cert.certificate_number || 'ยังไม่กำหนด'; 
                    // No need for image preview column in table as it's handled by modal
                    const templateImage = cert.template_image_url ? `<img src="${cert.template_image_url}" class="w-20 h-10 object-cover rounded-md" alt="Template">` : 'N/A';

                    const row = issuedCertificatesTableBody.insertRow();
                    row.innerHTML = `
                        <td class="py-2 px-4">${cert.student_id}</td>
                        <td class="py-2 px-4">${cert.first_name} ${cert.last_name}</td>
                        <td class="py-2 px-4">${cert.class}</td>
                        <td class="py-2 px-4">${cert.room_number}</td>
                        <td class="py-2 px-4">${statusText}</td>
                        <td class="py-2 px-4">${certNumber}</td>
                        <td class="py-2 px-4">${templateImage}</td>
                        <td class="py-2 px-4">
                            ${cert.certificate_number && cert.template_image_url ? `
                                <button class="view-issued-certificate-btn bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 mr-2"
                                    data-template-url="${cert.template_image_url}"
                                    data-student-name="${cert.first_name} ${cert.last_name}"
                                    data-cert-number="${cert.certificate_number}"
                                    data-student-id="${cert.student_id}" 
                                    data-student-class="${cert.class}">
                                    <i class="fas fa-eye"></i> ดู
                                </button>
                                <button class="download-generated-certificate-btn bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                                    data-template-url="${cert.template_image_url}"
                                    data-student-name="${cert.first_name} ${cert.last_name}"
                                    data-cert-number="${cert.certificate_number}"
                                    data-student-id="${cert.student_id}"
                                    data-student-class="${cert.class}">
                                    <i class="fas fa-download"></i> ดาวน์โหลด
                                </button>
                            ` : 'N/A'}
                        </td>
                    `;
                });
            }
            // Attach event listeners using event delegation for dynamically created buttons
            document.getElementById('issued-certificates-table-body').addEventListener('click', (event) => {
                const target = event.target.closest('.view-issued-certificate-btn, .download-generated-certificate-btn');
                if (target) {
                    const template_url = target.dataset.templateUrl;
                    const student_name = target.dataset.studentName;
                    const cert_number = target.dataset.certNumber;
                    const student_id = target.dataset.studentId;
                    const student_class = target.dataset.studentClass;

                    if (target.classList.contains('view-issued-certificate-btn')) {
                        currentAdminCertData = { templateUrl: template_url, studentName: student_name, certNumber: cert_number, studentId: student_id, studentClass: student_class };
                        generateCertificateImage(template_url, student_name, cert_number, student_class, 1200).then(imageDataUrl => { 
                            if (imageDataUrl) {
                                issuedCertPreviewImg.src = imageDataUrl;
                                issuedCertificatePreviewModal.classList.remove('hidden');
                                issuedCertificatePreviewModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                                setTimeout(() => {
                                    issuedCertificatePreviewModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
                                }, 10);
                            } else {
                                showMessage('ไม่สามารถสร้างตัวอย่างเกียรติบัตรได้', 'error');
                            }
                        });
                    } else if (target.classList.contains('download-generated-certificate-btn')) {
                        showMessage('กำลังสร้างเกียรติบัตรสำหรับดาวน์โหลด...', 'success');
                        generateCertificateImage(template_url, student_name, cert_number, student_class, 1200).then(imageDataUrl => { 
                            if (imageDataUrl) {
                                const a = document.createElement('a');
                                a.href = imageDataUrl;
                                a.download = `certificate_${student_id}.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                showMessage('ดาวน์โหลดเกียรติบัตรสำเร็จแล้ว', 'success');
                            } else {
                                showMessage('ไม่สามารถสร้างเกียรติบัตรสำหรับดาวน์โหลดได้', 'error');
                            }
                        });
                    }
                }
            });

            // Re-attach listeners for buttons within the modal if they are already in the DOM
            if (downloadIssuedCertificateBtnAdmin) {
                downloadIssuedCertificateBtnAdmin.onclick = async () => {
                    const storedTemplateUrl = currentAdminCertData.templateUrl;
                    const storedStudentName = currentAdminCertData.studentName;
                    const storedCertNumber = currentAdminCertData.certNumber;
                    const storedStudentId = currentAdminCertData.studentId; 
                    const storedStudentClass = currentAdminCertData.studentClass; 

                    showMessage('กำลังสร้างเกียรติบัตรสำหรับดาวน์โหลด...', 'success');
                    const generatedDataUrl = await generateCertificateImage(storedTemplateUrl, storedStudentName, storedCertNumber, storedStudentClass, 1200);
                    if (generatedDataUrl) {
                        const a = document.createElement('a');
                        a.href = generatedDataUrl;
                        a.download = `certificate_${storedStudentId}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        showMessage('ดาวน์โหลดเกียรติบัตรสำเร็จแล้ว', 'success');
                    } else {
                        showMessage('ไม่สามารถสร้างเกียรติบัตรสำหรับดาวน์โหลดได้', 'error');
                    }
                };
            }

            if (closeIssuedCertificatePreviewModalBtn) {
                closeIssuedCertificatePreviewModalBtn.onclick = () => {
                    issuedCertificatePreviewModal.querySelector('div').classList.add('scale-95', 'opacity-0');
                    setTimeout(() => {
                        issuedCertificatePreviewModal.classList.add('hidden');
                        issuedCertPreviewImg.src = ''; 
                    }, 300);
                };
            }


            updateIssuedCertsPaginationControls(); 
        } else {
            issuedCertificatesTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-500">ไม่สามารถโหลดเกียรติบัตรที่ออกให้ได้: ${response.message}</td></tr>`;
        }
    }
    
    /**
     * Update the pagination controls for the issued certificates table.
     */
    function updateIssuedCertsPaginationControls() {
        // Update both top and bottom pagination info spans
        issuedCertificatesPageInfoSpan.textContent = `หน้า ${currentIssuedCertsPage} จาก ${totalIssuedCertsPages}`;
        issuedCertificatesPageInfoSpanTop.textContent = `หน้า ${currentIssuedCertsPage} จาก ${totalIssuedCertsPages}`;

        // Update disabled states for both top and bottom previous buttons
        issuedCertificatesPrevBtn.disabled = (currentIssuedCertsPage === 1);
        issuedCertificatesPrevBtnTop.disabled = (currentIssuedCertsPage === 1);

        // Update disabled states for both top and bottom next buttons
        issuedCertificatesNextBtn.disabled = (currentIssuedCertsPage === totalIssuedCertsPages);
        issuedCertificatesNextBtnTop.disabled = (currentIssuedCertsPage === totalIssuedCertsPages);
    }

    // Issued Certificates Pagination Event Listeners (Bottom buttons - existing)
    issuedCertificatesPrevBtn.addEventListener('click', () => {
        if (currentIssuedCertsPage > 1) {
            currentIssuedCertsPage--;
            loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
        }
    });

    issuedCertificatesNextBtn.addEventListener('click', () => {
        if (currentIssuedCertsPage < totalIssuedCertsPages) {
            currentIssuedCertsPage++;
            loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
        }
    });

    // Issued Certificates Pagination Event Listeners (Top buttons - NEW)
    issuedCertificatesPrevBtnTop.addEventListener('click', () => {
        if (currentIssuedCertsPage > 1) {
            currentIssuedCertsPage--;
            loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
        }
    });

    issuedCertificatesNextBtnTop.addEventListener('click', () => {
        if (currentIssuedCertsPage < totalIssuedCertsPages) {
            currentIssuedCertsPage++;
            loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
        }
    });


    // --- New Room Certificate Logic Implementation ---

    // Open Generate Room Certificates Modal
    openGenerateRoomCertificatesModalBtn.addEventListener('click', () => {
        generateRoomCertificatesModal.classList.remove('hidden');
        generateRoomCertificatesModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            generateRoomCertificatesModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        }, 10);
        // Reset modal content
        generateRoomClassSelect.value = '';
        generateRoomNumberSelect.innerHTML = '<option value="">เลือกห้อง</option>'; // Clear rooms
        
        // Corrected: Manage visibility of existing elements
        eligibleStudentsInitialMessage.classList.remove('hidden'); // Show initial message
        eligibleStudentsInitialMessage.textContent = 'กรุณาเลือกชั้นและห้องเพื่อค้นหานักเรียนที่ผ่านเกณฑ์';
        eligibleStudentsTable.classList.add('hidden'); // Hide table
        eligibleStudentsTableBody.innerHTML = ''; // Clear table rows
        noEligibleStudentsMessage.classList.add('hidden'); // Hide no data message

        downloadSelectedRoomCertificatesPdfBtn.disabled = true;
        studentsForRoomCertificate = []; // Clear previous data
    });

    // Close Generate Room Certificates Modal
    generateRoomCertificatesCancelBtn.addEventListener('click', () => {
        generateRoomCertificatesModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            generateRoomCertificatesModal.classList.add('hidden');
        }, 300);
    });

    // Populate class dropdown in room certificate modal
    generateRoomClassSelect.addEventListener('change', () => {
        const selectedClass = generateRoomClassSelect.value;
        generateRoomNumberSelect.innerHTML = '<option value="">เลือกห้อง</option>'; // Clear rooms
        if (selectedClass) {
            fixedRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                generateRoomNumberSelect.appendChild(option);
            });
        }
        // Corrected: Manage visibility of existing elements
        eligibleStudentsInitialMessage.classList.remove('hidden'); // Show initial message
        eligibleStudentsInitialMessage.textContent = 'กรุณาเลือกชั้นและห้องเพื่อค้นหานักเรียนที่ผ่านเกณฑ์';
        eligibleStudentsTable.classList.add('hidden'); // Hide table
        eligibleStudentsTableBody.innerHTML = ''; // Clear table rows
        noEligibleStudentsMessage.classList.add('hidden'); // Hide no data message

        downloadSelectedRoomCertificatesPdfBtn.disabled = true;
        studentsForRoomCertificate = []; 
    });

    // Add listener for room number change in room certificate generation section
    generateRoomNumberSelect.addEventListener('change', () => {
        // Corrected: Manage visibility of existing elements
        eligibleStudentsInitialMessage.classList.remove('hidden'); // Show initial message
        eligibleStudentsInitialMessage.textContent = 'เลือกชั้นและห้องแล้วคลิก "ค้นหานักเรียนที่ผ่านเกณฑ์" เพื่อแสดงรายชื่อนักเรียนที่มีสิทธิ์รับเกียรติบัตร';
        eligibleStudentsTable.classList.add('hidden'); // Hide table
        eligibleStudentsTableBody.innerHTML = ''; // Clear table rows
        noEligibleStudentsMessage.classList.add('hidden'); // Hide no data message

        downloadSelectedRoomCertificatesPdfBtn.disabled = true;
        studentsForRoomCertificate = []; 
    });


    loadEligibleStudentsBtn.addEventListener('click', async () => {
        const selectedClass = generateRoomClassSelect.value;
        const selectedRoom = generateRoomNumberSelect.value;

        // Reset display before new search
        eligibleStudentsInitialMessage.classList.add('hidden'); // Hide initial message
        eligibleStudentsTable.classList.add('hidden'); // Hide table
        eligibleStudentsTableBody.innerHTML = ''; // Clear previous table rows
        noEligibleStudentsMessage.classList.add('hidden'); // Hide no data message
        downloadSelectedRoomCertificatesPdfBtn.disabled = true;
        studentsForRoomCertificate = []; 

        if (!selectedClass || !selectedRoom) {
            showMessage('กรุณาเลือกชั้นและห้องก่อน', 'error');
            eligibleStudentsInitialMessage.classList.remove('hidden'); // Re-show initial message
            eligibleStudentsInitialMessage.textContent = 'กรุณาเลือกชั้นและห้องเพื่อค้นหานักเรียนที่ผ่านเกณฑ์'; // Reset text
            return;
        }

        showMessage('กำลังค้นหานักเรียนที่ผ่านเกณฑ์...', 'info', 2000);
        eligibleStudentsInitialMessage.classList.remove('hidden'); // Ensure it's not showing the initial message
        eligibleStudentsInitialMessage.textContent = 'กำลังโหลดข้อมูล...'; // Set loading message
        eligibleStudentsInitialMessage.classList.remove('hidden'); // Show loading message


        const result = await fetchData(`?action=get_eligible_students_for_room_certificate&class=${encodeURIComponent(selectedClass)}&room=${encodeURIComponent(selectedRoom)}`, 'GET');

        console.log('API Response for eligible students:', result);

        eligibleStudentsInitialMessage.classList.add('hidden'); // Hide loading/initial message after fetch

        if (result.status === 'success' && result.data && result.data.length > 0) {
            studentsForRoomCertificate = result.data; 

            eligibleStudentsTable.classList.remove('hidden'); // Show the table
            
            result.data.forEach(student => {
                const row = eligibleStudentsTableBody.insertRow();
                row.innerHTML = `
                    <td class="py-2 px-3 border-b border-gray-100">${student.student_id}</td>
                    <td class="py-2 px-3 border-b border-gray-100">${student.first_name} ${student.last_name}</td>
                    <td class="py-2 px-3 border-b border-gray-100">${student.class}</td>
                    <td class="py-2 px-3 border-b border-gray-100">${student.room_number}</td>
                `;
            });
            downloadSelectedRoomCertificatesPdfBtn.disabled = false; // Enable download button
            showMessage(`พบนักเรียนที่ผ่านเกณฑ์ ${result.data.length} คน`, 'success');
        } else {
            eligibleStudentsTable.classList.add('hidden'); // Hide table
            noEligibleStudentsMessage.classList.remove('hidden'); // Show no students message
            noEligibleStudentsMessage.textContent = result.message || 'ไม่พบนักเรียนที่ผ่านเกณฑ์ในชั้น/ห้องนี้';
            showMessage(result.message || 'ไม่พบนักเรียนที่ผ่านเกณฑ์ในชั้น/ห้องนี้', 'info');
        }
    });

    downloadSelectedRoomCertificatesPdfBtn.addEventListener('click', async () => {
        if (studentsForRoomCertificate.length === 0) {
            showMessage('ไม่พบนักเรียนที่ผ่านเกณฑ์สำหรับสร้างเกียรติบัตร', 'error');
            return;
        }

        showMessage('กำลังสร้างไฟล์ PDF เกียรติบัตร...', 'info', 5000);
        console.log('PDF Generation: Starting...');
        
        const templatesResult = await fetchData('?action=get_certificate_templates');
        let templateImageUrl = '';
        if (templatesResult.status === 'success' && templatesResult.data && templatesResult.data.length > 0) {
            // Assuming the first template is the one to use for batch generation
            templateImageUrl = templatesResult.data[0].template_image_url; 
            console.log('PDF Generation: Fetched template URL:', templateImageUrl);
        } else {
            showMessage('ไม่พบเทมเพลตเกียรติบัตรในระบบ', 'error');
            console.error('PDF Generation: No certificate templates found in the system.');
            return;
        }

        if (!templateImageUrl) {
            showMessage('ไม่พบ URL รูปภาพเทมเพลตเกียรติบัตร', 'error');
            console.error('PDF Generation: templateImageUrl is empty.');
            return;
        }

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            showMessage('ข้อผิดพลาด: ไม่พบไลบรารี jsPDF กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือการรวมไลบรารี', 'error', 7000);
            console.error('PDF Generation: jsPDF library not found on window object.');
            return;
        }
        const doc = new jsPDF({
            orientation: 'landscape', 
            unit: 'px',
            format: 'a4' 
        });
        console.log('PDF Generation: jsPDF instance created.');

        let firstPage = true;
        let certificatesAddedCount = 0; 

        for (const student of studentsForRoomCertificate) {
            if (!firstPage) {
                doc.addPage();
            }
            firstPage = false;
            console.log('PDF Generation: Processing student', student.student_id);

            let certNumberToDisplay = 'ยังไม่กำหนด';
            const issuedCertResponse = await fetchData(`?action=get_issued_certificates&student_id=${student.student_id}`, 'GET');
            if (issuedCertResponse.status === 'success' && issuedCertResponse.data.certificates && issuedCertResponse.data.certificates.length > 0) {
                certNumberToDisplay = issuedCertResponse.data.certificates[0].certificate_number;
            }

            const imageDataUrl = await generateCertificateImage(
                templateImageUrl,
                `${student.first_name} ${student.last_name}`,
                certNumberToDisplay, 
                student.class,
                1000 
            );

            if (imageDataUrl) {
                console.log('PDF Generation: ImageDataUrl generated for student', student.student_id);
                const imgWidth = doc.internal.pageSize.getWidth();
                const imgHeight = doc.internal.pageSize.getHeight();
                doc.addImage(imageDataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
                certificatesAddedCount++; 
            } else {
                console.warn(`PDF Generation: Skipping certificate for student ${student.student_id} due to image generation failure.`);
                showMessage(`ข้ามการสร้างเกียรติบัตรสำหรับ ${student.first_name} ${student.last_name} เนื่องจากเกิดข้อผิดพลาดในการสร้างรูปภาพ.`, 'error', 4000);
            }
        }
        console.log('PDF Generation: Total certificates added:', certificatesAddedCount);

        if (certificatesAddedCount === 0) {
            showMessage('ไม่สามารถสร้างไฟล์ PDF ได้ เนื่องจากไม่มีเกียรติบัตรที่สามารถสร้างรูปภาพได้สำเร็จ', 'error', 7000);
            console.error('PDF Generation: No certificates were successfully added to the PDF. Aborting save.');
            return; 
        }

        const className = generateRoomClassSelect.value.replace(/\s+/g, '_'); 
        const roomNumber = generateRoomNumberSelect.value;
        const filename = `เกียรติบัตร_${className}_ห้อง${roomNumber}.pdf`;
        doc.save(filename);
        console.log('PDF Generation: PDF saved as', filename);
        showMessage('สร้างไฟล์ PDF เกียรติบัตรสำเร็จ!', 'success', 5000);
        // Close the modal after successful generation
        generateRoomCertificatesModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            generateRoomCertificatesModal.classList.add('hidden');
        }, 300);

        // Optionally reload issued certificates to reflect new ones
        loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
    });

    // --- Initial Load ---
    checkAdminSession();
    // Populate dropdowns that use fixed options
    populateClassDropdown(newStudentClassSelect, 'เลือกชั้น');
    populateFixedRoomOptions(newStudentRoomSelect);
    
    populateClassDropdown(filterStudentClass, 'แสดงทั้งหมด');
    populateFixedRoomOptions(filterStudentRoom);

    filterIssuedCertClass.addEventListener('change', () => {
        currentIssuedCertsPage = 1; 
        loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
    });
    filterIssuedCertRoom.addEventListener('change', () => {
        currentIssuedCertsPage = 1; 
        loadIssuedCertificates(filterIssuedCertClass.value, filterIssuedCertRoom.value, currentIssuedCertsPage, issuedCertsLimitPerPage);
    });
    clearIssuedCertFiltersBtn.addEventListener('click', () => {
        filterIssuedCertClass.value = '';
        filterIssuedCertRoom.value = '';
        currentIssuedCertsPage = 1; 
        loadIssuedCertificates();
    });

    // Initial population for the room certificate generation modal/section
    populateClassDropdown(generateRoomClassSelect, 'เลือกชั้น');
    populateFixedRoomOptions(generateRoomNumberSelect);

});
