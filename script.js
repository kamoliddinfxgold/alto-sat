// Supabase configuration (sizning haqiqiy Supabase ma'lumotlaringiz)
const SUPABASE_URL = 'https://ufmoftsasbwfeqerilpq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbW9mdHNhc2J3ZmVxZXJpbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzY3NjksImV4cCI6MjA4MDQxMjc2OX0.qGp-15_VWEPaK0vaCbmT2bIL0xd0Ntchh-ahvKiOOLw';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
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

// Event Listeners
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
logoutBtn.addEventListener('click', logout);

startTestBtn.addEventListener('click', startTest);
submitTestBtn.addEventListener('click', submitTest);
prevBtn.addEventListener('click', goToPrevQuestion);
nextBtn.addEventListener('click', goToNextQuestion);

// Calculator event listeners
closeCalculatorBtn.addEventListener('click', () => {
    calculatorCard.classList.add('hidden');
});

minimizeCalculatorBtn.addEventListener('click', () => {
    calculatorCard.classList.toggle('minimized');
});

// Make calculator draggable
makeCalculatorDraggable();

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
            authSection.classList.add('hidden');
            dashboard.classList.remove('hidden');
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
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        }
    } catch (err) {
        console.error('Unexpected error during registration:', err);
        alert('Kutilmagan xatolik yuz berdi. Iltimos, konsolda xatoliklarni tekshiring.');
    }
}

function logout() {
    // Haqiqiy Supabase chiqishidan foydalanish
    supabase.auth.signOut();
    
    dashboard.classList.add('hidden');
    authSection.classList.remove('hidden');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

// Test Functions
async function startTest() {
    dashboard.classList.add('hidden');
    testSection.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = Array(60).fill(null);
    timeLeft = 50 * 60;
    testStarted = true;
    
    // Supabase'dan savollarni olish
    await loadQuestionsFromSupabase();
    
    renderQuestion();
    startTimer();
    
    // Show calculator button when test starts
    const calcButton = document.createElement('button');
    calcButton.id = 'calculator-toggle-btn';
    calcButton.textContent = 'Calculator';
    calcButton.className = 'calculator-toggle';
    calcButton.addEventListener('click', toggleCalculator);
    
    // Add calculator button to navigation
    const navigation = document.querySelector('.navigation');
    if (!document.getElementById('calculator-toggle-btn')) {
        navigation.appendChild(calcButton);
    }
}

async function loadQuestionsFromSupabase() {
    try {
        // 30 ta matematika savolini olish
        const { data: mathData, error: mathError } = await supabase
            .from('sat_math_questions')
            .select('id, question, options, correct_answer')
            .limit(30);
        
        if (mathError) {
            console.error('Math questions loading error:', mathError);
            // Xato yuz bersa, namuna savollardan foydalanamiz
            testQuestions = [...generateSampleQuestions('math', 30)];
        } else {
            testQuestions = [...mathData];
        }
        
        // 30 ta ingliz tili savolini olish
        const { data: englishData, error: englishError } = await supabase
            .from('sat_english_questions')
            .select('id, question, options, correct_answer')
            .limit(30);
        
        if (englishError) {
            console.error('English questions loading error:', englishError);
            // Xato yuz bersa, namuna savollardan foydalanamiz
            testQuestions = [...testQuestions, ...generateSampleQuestions('english', 30)];
        } else {
            testQuestions = [...testQuestions, ...englishData];
        }
        
        // Savollarni aralashtirish
        shuffleArray(testQuestions);
        
    } catch (error) {
        console.error('Error loading questions from Supabase:', error);
        // Xato yuz bersa, namuna savollardan foydalanamiz
        testQuestions = [...generateSampleQuestions('math', 30), ...generateSampleQuestions('english', 30)];
    }
}

// Namuna savollar generatsiya qilish funksiyasi
function generateSampleQuestions(type, count) {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        if (type === 'math') {
            questions.push({
                id: i + 1,
                question: `Math Question ${i + 1}: What is the value of x in the equation 2x + ${i + 5} = ${2 * (i + 10)}?`,
                options: [`${i + 3}`, `${i + 5}`, `${i + 7}`, `${i + 9}`],
                correct_answer: 1
            });
        } else {
            questions.push({
                id: i + 1000,
                question: `English Question ${i + 1}: Which word is most similar to 'intelligent'?`,
                options: [`smart`, `foolish`, `tired`, `hungry`],
                correct_answer: 0
            });
        }
    }
    
    return questions;
}

// Massivni aralashtirish funksiyasi
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
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const score = Math.round((correctCount / 60) * 800); // 60 savolga moslashtirildi
    finalScoreEl.textContent = score;
    correctCountEl.textContent = correctCount;
    
    // Display review
    renderReview();
}

function renderReview() {
    answersReview.innerHTML = '';
    testQuestions.forEach((question, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
            answerItem.classList.add('correct');
        } else {
            answerItem.classList.add('incorrect');
        }
        
        const userAnswerText = userAnswer !== null ? 
            String.fromCharCode(65 + userAnswer) : 'Not answered';
        const correctAnswerText = String.fromCharCode(65 + question.correctAnswer);
        
        answerItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${question.question}<br>
            <strong>Your answer:</strong> ${userAnswerText}<br>
            <strong>Correct answer:</strong> ${correctAnswerText}
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in (in a real app)
    // For demo, we start at the login screen
    console.log('SAT Practice App Loaded');
});