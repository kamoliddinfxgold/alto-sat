// Supabase configuration (sizning haqiqiy Supabase ma'lumotlaringiz)
const SUPABASE_URL = 'https://ufmoftsasbwfeqerilpq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbW9mdHNhc2J3ZmVxZXJpbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzY3NjksImV4cCI6MjA4MDQxMjc2OX0.qGp-15_VWEPaK0vaCbmT2bIL0xd0Ntchh-ahvKiOOLw';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements (only those available on current page)
const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const testSection = document.getElementById('test-section');
const resultsSection = document.getElementById('results-section');

// Auth elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

// Test elements
const startTestBtn = document.getElementById('start-test-btn');
const submitTestBtn = document.getElementById('submit-test-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionEl = document.getElementById('current-question');
const timeDisplay = document.getElementById('time-display');
const progressFill = document.getElementById('progress-fill');
const finalScoreEl = document.getElementById('final-score');
const correctCountEl = document.getElementById('correct-count');
const answersReview = document.getElementById('answers-review');

// Calculator elements
const calculatorCard = document.getElementById('calculator-card');
const calcDisplay = document.getElementById('calc-display');
const closeCalculatorBtn = document.getElementById('close-calculator');
const minimizeCalculatorBtn = document.getElementById('minimize-calculator');

// Sidebar elements
const sidebar = document.getElementById('main-sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const openSidebarTestBtn = document.getElementById('open-sidebar-test');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const themeToggleBtn = document.getElementById('theme-toggle');
const logoutBtnSidebar = document.getElementById('logout-btn-sidebar');
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const userInitialsEl = document.getElementById('user-initials');

// Test state
let currentQuestionIndex = 0;
let userAnswers = Array(60).fill(null); // 60 savolga oshirildi
let timerInterval;
let timeLeft = 50 * 60; // 50 minutes in seconds
let testStarted = false;
let testQuestions = []; // Tanlangan 60 savol

// Sample SAT questions database (endi bu Supabase'dan keladi)
// Bu yerda faqat namuna sifatida qoladi, real loyihada Supabase'dan olinadi
const sampleMathQuestions = [
    {
        id: 1,
        question: "If 3x - 7 = 11, what is the value of x?",
        options: ["4", "6", "8", "10"],
        correctAnswer: 1
    },
    {
        id: 2,
        question: "If a car travels 60 miles per hour, how far will it travel in 2.5 hours?",
        options: ["120 miles", "150 miles", "180 miles", "200 miles"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "If the ratio of boys to girls in a class is 3:4 and there are 21 boys, how many girls are there?",
        options: ["18", "24", "28", "32"],
        correctAnswer: 2
    },
    {
        id: 4,
        question: "Which of the following is NOT a factor of 24?",
        options: ["2", "4", "6", "9"],
        correctAnswer: 3
    },
    {
        id: 5,
        question: "If 5y + 15 = 40, what is the value of y?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 0
    },
    {
        id: 6,
        question: "Which word is an antonym of 'abundant'?",
        options: ["scarce", "plentiful", "ample", "copious"],
        correctAnswer: 0
    },
    {
        id: 7,
        question: "The sum of the interior angles of a hexagon is:",
        options: ["360°", "540°", "720°", "900°"],
        correctAnswer: 2
    },
    {
        id: 8,
        question: "If 2a = 3b and b = 4, what is the value of a?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1
    },
    {
        id: 9,
        question: "Solve for x: 4(x - 2) = 20",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2
    },
    {
        id: 10,
        question: "Which word is spelled correctly?",
        options: ["accomodate", "excede", "occured", "necessary"],
        correctAnswer: 3
    },
    {
        id: 11,
        question: "What is the volume of a rectangular prism with dimensions 4 × 5 × 6?",
        options: ["120", "150", "180", "200"],
        correctAnswer: 0
    },
    {
        id: 12,
        question: "If the probability of an event occurring is 0.3, what is the probability that it will NOT occur?",
        options: ["0.3", "0.5", "0.7", "1.0"],
        correctAnswer: 2
    },
    {
        id: 13,
        question: "Solve for x: 3x + 5 = 20",
        options: ["3", "5", "7", "9"],
        correctAnswer: 1
    },
    {
        id: 14,
        question: "What is the value of sin(30°)?",
        options: ["0.5", "√2/2", "√3/2", "1"],
        correctAnswer: 0
    },
    {
        id: 15,
        question: "If a triangle has sides of length 3, 4, and 5, what type of triangle is it?",
        options: ["acute", "right", "obtuse", "equilateral"],
        correctAnswer: 1
    }
];

const sampleEnglishQuestions = [
    {
        id: 1,
        question: "Which word is most similar in meaning to 'gregarious'?",
        options: ["solitary", "sociable", "angry", "tired"],
        correctAnswer: 1
    },
    {
        id: 2,
        question: "In the passage, the author's primary purpose is to:",
        options: ["criticize a theory", "describe a phenomenon", "argue against a position", "explain a process"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "Which sentence is grammatically correct?",
        options: ["She don't like apples.", "He don't likes apples.", "They doesn't like apples.", "We don't like apples."],
        correctAnswer: 3
    },
    {
        id: 4,
        question: "The author's tone in lines 25-30 can best be described as:",
        options: ["optimistic", "skeptical", "indifferent", "hostile"],
        correctAnswer: 1
    },
    {
        id: 5,
        question: "Which of the following best describes the main idea of the passage?",
        options: ["Technology improves communication", "Social media affects mental health", "People spend too much time online", "Online platforms have both benefits and drawbacks"],
        correctAnswer: 3
    },
    {
        id: 6,
        question: "The passage suggests that the primary cause of the problem is:",
        options: ["lack of funding", "poor management", "insufficient training", "inadequate resources"],
        correctAnswer: 1
    },
    {
        id: 7,
        question: "Which sentence uses the correct form of the verb?",
        options: ["She has went to the store.", "She had went to the store.", "She has gone to the store.", "She have gone to the store."],
        correctAnswer: 2
    },
    {
        id: 8,
        question: "What is the slope of the line passing through points (2,3) and (6,11)?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1
    },
    {
        id: 9,
        question: "According to the graph, during which period did sales increase most rapidly?",
        options: ["January to March", "March to May", "May to July", "July to September"],
        correctAnswer: 1
    },
    {
        id: 10,
        question: "Which sentence is punctuated correctly?",
        options: ["She said, \"I'll be there soon\".", "She said, \"I'll be there soon\"!", "She said, \"I'll be there soon.\"", "She said, \"I'll be there soon,\""],
        correctAnswer: 3
    },
    {
        id: 11,
        question: "Based on the data in the table, which conclusion is best supported?",
        options: ["Sales increased every month.", "June had the highest sales.", "Winter months showed the lowest sales.", "There was a seasonal pattern in sales."],
        correctAnswer: 3
    },
    {
        id: 12,
        question: "The author mentions the study primarily to:",
        options: ["support the main argument", "introduce a counterargument", "provide background information", "conclude the discussion"],
        correctAnswer: 0
    },
    {
        id: 13,
        question: "Which of the following best describes the author's attitude toward the subject?",
        options: ["enthusiastic", "objective", "critical", "nostalgic"],
        correctAnswer: 2
    },
    {
        id: 14,
        question: "What is the area of a circle with radius 5 units?",
        options: ["10π", "15π", "20π", "25π"],
        correctAnswer: 3
    }
];

// Event Listeners (only add listeners for elements that exist on current page)
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });
}

// Sidebar event listeners
if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', toggleSidebar);
}

if (openSidebarTestBtn) {
    openSidebarTestBtn.addEventListener('click', toggleSidebar);
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

if (logoutBtnSidebar) {
    logoutBtnSidebar.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', login);
}

if (registerBtn) {
    registerBtn.addEventListener('click', register);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

if (startTestBtn) {
    startTestBtn.addEventListener('click', startTest);
}

if (submitTestBtn) {
    submitTestBtn.addEventListener('click', submitTest);
}

if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevQuestion);
}

if (nextBtn) {
    nextBtn.addEventListener('click', goToNextQuestion);
}

// Calculator event listeners
if (closeCalculatorBtn) {
    closeCalculatorBtn.addEventListener('click', () => {
        calculatorCard.classList.add('hidden');
    });
}

if (minimizeCalculatorBtn) {
    minimizeCalculatorBtn.addEventListener('click', () => {
        calculatorCard.classList.toggle('minimized');
    });
}

// Make calculator draggable (only if calculator exists on page)
if (calculatorCard) {
    makeCalculatorDraggable();
}

// Function to make calculator draggable
function makeCalculatorDraggable() {
    const calculator = document.getElementById('calculator-card');
    const header = calculator.querySelector('.calculator-header');
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    if (header) {
        header.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        calculator.style.top = (calculator.offsetTop - pos2) + "px";
        calculator.style.left = (calculator.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Auth Functions
async function login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Iltimos, barcha maydonlarni to\'ldiring');
        return;
    }
    
    try {
        // Haqiqiy Supabase autentifikatsiyasidan foydalanish
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error('Login error:', error);
            
            // Email tasdiqlanmagan bo'lsa maxsus xabar berish
            if (error.message.includes('Email not confirmed')) {
                alert('Email manzilingiz tasdiqlanmagan. Iltimos, emailingizni tekshiring va tasdiqlash havolasini bosing.');
                return;
            }
            
            alert('Kirishda xatolik: ' + error.message);
            return;
        }
        
        if (data.user) {
            console.log('User logged in:', data.user);
            // Redirect to dashboard after successful login
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        console.error('Unexpected error during login:', err);
        alert('Kutilmagan xatolik yuz berdi. Iltimos, konsolda xatoliklarni tekshiring.');
    }
}

async function register(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
        alert('Iltimos, barcha maydonlarni to\'ldiring');
        return;
    }
    
    if (password.length < 6) {
        alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        return;
    }
    
    try {
        // Haqiqiy Supabase ro'yxatdan o'tishidan foydalanish
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) {
            console.error('Registration error:', error);
            alert('Ro\'yxatdan o\'tishda xatolik: ' + error.message);
            return;
        }
        
        if (data.user) {
            console.log('User registered:', data.user);
            // Email tasdiqlash kerak bo'lsa maxsus xabar
            if (data.user.identities && data.user.identities.length === 0) {
                alert('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos, email manzilingizga yuborilgan tasdiqlash havolasini bosing.');
            } else {
                alert('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos, tizimga kiring.');
            }
            // Switch to login form after registration
            if (registerForm && loginForm) {
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            }
        }
    } catch (err) {
        console.error('Unexpected error during registration:', err);
        alert('Kutilmagan xatolik yuz berdi. Iltimos, konsolda xatoliklarni tekshiring.');
    }
}

async function logout() {
    // Haqiqiy Supabase chiqishidan foydalanish
    await supabase.auth.signOut();
    
    // Clear any stored session data
    localStorage.clear();
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Test Functions
// This function is now handled by redirecting to test.html
// The actual test functionality is in test.html
function startTest() {
    // Redirect to test page
    window.location.href = 'test.html';
}

async function loadQuestionsFromSupabase() {
    try {
        console.log("Loading questions from Supabase...");
        let mathQuestions = [];
        let englishQuestions = [];
        
        // 30 ta matematika savolini olish - avval "hard" darajadagilarni urinib ko'ramiz
        let { data: mathData, error: mathError } = await supabase
            .from('sat_math_questions')
            .select('id, question, options, correct_answer, difficulty')
            .eq('difficulty', 'hard')
            .limit(30);
        
        // Agar yetarli hard savollar bo'lmasa, "medium" darajadagilarni ham qo'shamiz
        if (!mathError && mathData && mathData.length < 30) {
            const neededMore = 30 - mathData.length;
            const { data: additionalMathData } = await supabase
                .from('sat_math_questions')
                .select('id, question, options, correct_answer, difficulty')
                .eq('difficulty', 'medium')
                .limit(neededMore);
            
            if (additionalMathData) {
                mathData = [...mathData, ...additionalMathData];
                console.log(`Added ${additionalMathData.length} medium difficulty math questions`);
            }
        }
        
        // Agar hali ham yetarli bo'lmasa, "easy" darajadagilarni ham qo'shamiz
        if (!mathError && mathData && mathData.length < 30) {
            const neededMore = 30 - mathData.length;
            const { data: additionalMathData } = await supabase
                .from('sat_math_questions')
                .select('id, question, options, correct_answer, difficulty')
                .eq('difficulty', 'easy')
                .limit(neededMore);
            
            if (additionalMathData) {
                mathData = [...mathData, ...additionalMathData];
                console.log(`Added ${additionalMathData.length} easy difficulty math questions`);
            }
        }
        
        if (mathError) {
            console.error('Math questions loading error:', mathError);
            // Xato yuz bersa, namuna savollardan foydalanamiz
            mathQuestions = generateSampleQuestions('math', 30);
        } else {
            mathQuestions = mathData || [];
            console.log('Loaded math questions:', mathQuestions.length);
        }
        
        // 30 ta ingliz tili savolini olish - avval "hard" darajadagilarni urinib ko'ramiz
        let { data: englishData, error: englishError } = await supabase
            .from('sat_english_questions')
            .select('id, question, options, correct_answer, difficulty')
            .eq('difficulty', 'hard')
            .limit(30);
        
        // Agar yetarli hard savollar bo'lmasa, "medium" darajadagilarni ham qo'shamiz
        if (!englishError && englishData && englishData.length < 30) {
            const neededMore = 30 - englishData.length;
            const { data: additionalEnglishData } = await supabase
                .from('sat_english_questions')
                .select('id, question, options, correct_answer, difficulty')
                .eq('difficulty', 'medium')
                .limit(neededMore);
            
            if (additionalEnglishData) {
                englishData = [...englishData, ...additionalEnglishData];
                console.log(`Added ${additionalEnglishData.length} medium difficulty English questions`);
            }
        }
        
        // Agar hali ham yetarli bo'lmasa, "easy" darajadagilarni ham qo'shamiz
        if (!englishError && englishData && englishData.length < 30) {
            const neededMore = 30 - englishData.length;
            const { data: additionalEnglishData } = await supabase
                .from('sat_english_questions')
                .select('id, question, options, correct_answer, difficulty')
                .eq('difficulty', 'easy')
                .limit(neededMore);
            
            if (additionalEnglishData) {
                englishData = [...englishData, ...additionalEnglishData];
                console.log(`Added ${additionalEnglishData.length} easy difficulty English questions`);
            }
        }
        
        if (englishError) {
            console.error('English questions loading error:', englishError);
            // Xato yuz bersa, namuna savollardan foydalanamiz
            englishQuestions = generateSampleQuestions('english', 30);
        } else {
            englishQuestions = englishData || [];
            console.log('Loaded English questions:', englishQuestions.length);
        }
        
        // Savollarni birlashtirish
        testQuestions = [...mathQuestions, ...englishQuestions];
        
        // Log difficulty distribution
        const mathDifficultyCount = {};
        const englishDifficultyCount = {};
        
        mathQuestions.forEach(q => {
            const difficulty = q.difficulty || 'unknown';
            mathDifficultyCount[difficulty] = (mathDifficultyCount[difficulty] || 0) + 1;
        });
        
        englishQuestions.forEach(q => {
            const difficulty = q.difficulty || 'unknown';
            englishDifficultyCount[difficulty] = (englishDifficultyCount[difficulty] || 0) + 1;
        });
        
        console.log('Math questions by difficulty:', mathDifficultyCount);
        console.log('English questions by difficulty:', englishDifficultyCount);
        
        // Savollarni aralashtirish
        shuffleArray(testQuestions);
        console.log('Total questions loaded:', testQuestions.length);
        
        // Savollar to'g'ri yuklanganligini tekshirish
        if (testQuestions.length === 0) {
            console.warn('No questions loaded, using sample questions');
            testQuestions = [...generateSampleQuestions('math', 30), ...generateSampleQuestions('english', 30)];
        }
        
    } catch (error) {
        console.error('Error loading questions from Supabase:', error);
        // Xato yuz bersa, namuna savollardan foydalanamiz
        testQuestions = [...generateSampleQuestions('math', 30), ...generateSampleQuestions('english', 30)];
    }
}
// Namuna savollar generatsiya qilish funksiyasi
function generateSampleQuestions(type, count) {
    const questions = [];
    
    // Turli xil matematik savollar
    const mathQuestions = [
        {
            question: "If 3x - 7 = 11, what is the value of x?",
            options: ["4", "6", "8", "10"],
            correct_answer: 1,
            difficulty: "medium"
        },
        {
            question: "If f(x) = 2x² - 3x + 1, what is f(3)?",
            options: ["10", "12", "14", "16"],
            correct_answer: 0,
            difficulty: "hard"
        },
        {
            question: "What is the slope of the line passing through points (2,3) and (6,11)?",
            options: ["1", "2", "3", "4"],
            correct_answer: 1,
            difficulty: "medium"
        },
        {
            question: "If the ratio of boys to girls in a class is 3:4 and there are 21 boys, how many girls are there?",
            options: ["18", "24", "28", "32"],
            correct_answer: 2,
            difficulty: "medium"
        },
        {
            question: "If 5y + 15 = 40, what is the value of y?",
            options: ["5", "6", "7", "8"],
            correct_answer: 0,
            difficulty: "medium"
        },
        {
            question: "What is the area of a circle with radius 5 units?",
            options: ["10π", "15π", "20π", "25π"],
            correct_answer: 3,
            difficulty: "hard"
        },
        {
            question: "The sum of the interior angles of a hexagon is:",
            options: ["360°", "540°", "720°", "900°"],
            correct_answer: 2,
            difficulty: "hard"
        },
        {
            question: "If a car travels 60 miles per hour, how far will it travel in 2.5 hours?",
            options: ["120 miles", "150 miles", "180 miles", "200 miles"],
            correct_answer: 1,
            difficulty: "easy"
        },
        {
            question: "What is the volume of a rectangular prism with dimensions 4 × 5 × 6?",
            options: ["120", "150", "180", "200"],
            correct_answer: 0,
            difficulty: "medium"
        },
        {
            question: "If the probability of an event occurring is 0.3, what is the probability that it will NOT occur?",
            options: ["0.3", "0.5", "0.7", "1.0"],
            correct_answer: 2,
            difficulty: "hard"
        }
    ];
    
    // Turli xil ingliz tili savollari - yuqori darajada
    const englishQuestions = [
        {
            question: "Which of the following best exemplifies the author's use of juxtaposition to highlight thematic contrasts in the passage?",
            options: [
                "The comparison of urban and rural landscapes to illustrate societal divisions",
                "The description of weather patterns to establish mood",
                "The enumeration of historical events to provide context",
                "The use of dialogue to develop character personalities"
            ],
            correct_answer: 0,
            difficulty: "hard"
        },
        {
            question: "The phrase 'a tempest in a teapot' in line 34 most nearly means:",
            options: [
                "A catastrophic event with widespread consequences",
                "A minor incident blown out of proportion",
                "A brewing storm that threatens destruction",
                "A peaceful resolution to a longstanding dispute"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "Based on the evidence in lines 52-67, the author's attitude toward the protagonist's decision can best be characterized as:",
            options: [
                "Unambiguous approbation",
                "Measured skepticism",
                "Trenchant criticism",
                "Dispassionate neutrality"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "Which choice provides the best evidence for the answer to the previous question?",
            options: [
                "Lines 42-45 ('The character... dilemma')",
                "Lines 58-62 ('While... consequences')",
                "Lines 71-75 ('Ultimately... perspective')",
                "Lines 80-84 ('Despite... resolution')"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "In the context of the entire passage, the shift from the first paragraph to the second primarily serves to:",
            options: [
                "Introduce a counterargument that undermines the thesis",
                "Transition from abstract theory to concrete application",
                "Establish chronological progression of events",
                "Contrast opposing viewpoints within the same narrative"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "The author's use of the term 'paradigm shift' in line 23 suggests:",
            options: [
                "A gradual evolution of established practices",
                "A revolutionary change in fundamental assumptions",
                "A temporary deviation from conventional methods",
                "A cyclical return to previously discarded ideas"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "Which sentence best summarizes the central claim of the passage?",
            options: [
                "Technological advancement inevitably leads to social disruption.",
                "Historical precedent provides inadequate guidance for contemporary challenges.",
                "Interdisciplinary collaboration yields more robust solutions than specialized approaches.",
                "Ethical considerations should supersede economic imperatives in policy formation."
            ],
            correct_answer: 2,
            difficulty: "hard"
        },
        {
            question: "The rhetorical function of the third paragraph (lines 48-65) is primarily to:",
            options: [
                "Refute an opposing viewpoint through empirical evidence",
                "Illustrate an abstract principle with a concrete example",
                "Trace the historical development of a theoretical framework",
                "Enumerate the practical implications of a proposed methodology"
            ],
            correct_answer: 1,
            difficulty: "hard"
        },
        {
            question: "The author's tone in the concluding paragraph can best be described as:",
            options: [
                "Optimistic yet cautious",
                "Resigned and pessimistic",
                "Confident and assertive",
                "Ambivalent and uncertain"
            ],
            correct_answer: 0,
            difficulty: "hard"
        },
        {
            question: "Which of the following inferences is most supported by the passage?",
            options: [
                "Traditional methodologies are becoming obsolete in academic research.",
                "Future innovations will likely encounter resistance from established institutions.",
                "Collaborative approaches produce more comprehensive understanding than isolated scholarship.",
                "Government funding is essential for breakthrough discoveries in applied sciences."
            ],
            correct_answer: 2,
            difficulty: "hard"
        }
    ];    
    for (let i = 0; i < count; i++) {
        if (type === 'math') {
            // Mavjud savollardan tasodifiy tanlash yoki yangi generatsiya qilish
            if (i < mathQuestions.length) {
                questions.push({
                    id: i + 1,
                    ...mathQuestions[i]
                });
            } else {
                // Qo'shimcha savollar generatsiya qilish
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                const num3 = Math.floor(Math.random() * 10) + 1;
                questions.push({
                    id: i + 1,
                    question: `Math Question ${i + 1}: Solve for x: ${num1}x + ${num2} = ${num1 * num3 + num2}`,
                    options: [`${num3 - 2}`, `${num3}`, `${num3 + 1}`, `${num3 + 2}`],
                    correct_answer: 1,
                    difficulty: "medium"
                });
            }
        } else {
            // Mavjud savollardan tasodifiy tanlash yoki yangi generatsiya qilish
            if (i < englishQuestions.length) {
                questions.push({
                    id: i + 1000,
                    ...englishQuestions[i]
                });
            } else {
                // Qo'shimcha savollar generatsiya qilish
                const vocabWords = ["intelligent", "beautiful", "happy", "creative", "brave", "clever", "kind", "strong"];
                const randomWord = vocabWords[Math.floor(Math.random() * vocabWords.length)];
                questions.push({
                    id: i + 1000,
                    question: `English Question ${i + 1}: Which word is most similar to '${randomWord}'?`,
                    options: [`smart`, `foolish`, `tired`, `hungry`],
                    correct_answer: 0,
                    difficulty: "medium"
                });
            }
        }
    }
    
    return questions;
}// Massivni aralashtirish funksiyasi
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderQuestion() {
    if (testQuestions.length === 0) {
        questionText.textContent = "Savollar yuklanmadi. Iltimos, sahifani yangilang.";
        return;
    }
    
    const question = testQuestions[currentQuestionIndex];
    questionText.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercent = ((currentQuestionIndex + 1) / 60) * 100; // 60 savolga oshirildi
    progressFill.style.width = `${progressPercent}%`;
    
    // Render options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === 59; // 60 savolga oshirildi
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    renderQuestion();
}

function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < 59) { // 60 savolga oshirildi
        currentQuestionIndex++;
        renderQuestion();
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
            return;
        }
        
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function submitTest() {
    clearInterval(timerInterval);
    testSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Calculate score
    let correctCount = 0;
    testQuestions.forEach((question, index) => {
        // Foydalanuvchi javobini tekshirish
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct_answer;
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            correctCount++;
        }
        
        console.log(`Question ${index + 1}: User answer=${userAnswer}, Correct answer=${correctAnswer}, Is correct=${isCorrect}`);
    });
    
    const score = Math.round((correctCount / 60) * 800); // 60 savolga moslashtirildi
    finalScoreEl.textContent = score;
    correctCountEl.textContent = `${correctCount}`;
    
    // Display review
    renderReview();
}
function renderReview() {
    answersReview.innerHTML = '';
    testQuestions.forEach((question, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct_answer;
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            answerItem.classList.add('correct');
        } else {
            answerItem.classList.add('incorrect');
        }
        
        // Variantlarni harflar bilan ko'rsatish
        const getUserAnswerText = (answerIndex) => {
            if (answerIndex === null) return 'Not answered';
            return String.fromCharCode(65 + answerIndex); // A, B, C, D
        };
        
        const getCorrectAnswerText = () => {
            return String.fromCharCode(65 + correctAnswer); // A, B, C, D
        };
        
        answerItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${question.question}<br>
            <strong>Your answer:</strong> ${getUserAnswerText(userAnswer)}<br>
            <strong>Correct answer:</strong> ${getCorrectAnswerText()}<br>
            <strong>Status:</strong> ${isCorrect ? 'Correct' : 'Incorrect'}
        `;
        
        answersReview.appendChild(answerItem);
    });
}
document.getElementById('back-to-dashboard').addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
});

// Calculator Functions
function appendToDisplay(value) {
    calcDisplay.value += value;
}

function clearDisplay() {
    calcDisplay.value = '';
}

function deleteLastChar() {
    calcDisplay.value = calcDisplay.value.slice(0, -1);
}

function calculateResult() {
    try {
        // Replace × with * for evaluation
        const expression = calcDisplay.value.replace(/×/g, '*');
        const result = eval(expression);
        calcDisplay.value = result;
    } catch (error) {
        calcDisplay.value = 'Error';
    }
}

// Sidebar Functions
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    
    // Update theme toggle button text and icon
    if (document.body.classList.contains('light-mode')) {
        themeToggleBtn.querySelector('.menu-text').textContent = 'Light Mode';
        themeToggleBtn.querySelector('.menu-icon').textContent = '☀️';
    } else {
        themeToggleBtn.querySelector('.menu-text').textContent = 'Dark Mode';
        themeToggleBtn.querySelector('.menu-icon').textContent = '🌙';
    }
}

// Update user info in sidebar
function updateUserInfo(user) {
    if (user && user.email) {
        const email = user.email;
        const name = user.user_metadata?.full_name || email.split('@')[0];
        
        if (userNameEl) userNameEl.textContent = name;
        if (userEmailEl) userEmailEl.textContent = email;
        
        // Set user initials
        if (userInitialsEl) {
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userInitialsEl.textContent = initials;
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is already logged in
    await checkUserSession();
    console.log('SAT Practice App Loaded');
});

// Check user session on page load
async function checkUserSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            // User is logged in, show dashboard
            authSection.classList.add('hidden');
            dashboard.classList.remove('hidden');
            
            // Update user info in sidebar
            updateUserInfo(session.user);
        } else {
            // No session, show login screen
            authSection.classList.remove('hidden');
            dashboard.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking session:', error);
        // Default to login screen on error
        authSection.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
}
