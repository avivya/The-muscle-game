// page2.js - JavaScript לעמוד השני - משחק "צייד השרירים"

const page2Manager = {
    // מצב המשחק המקומי
    state: {
        currentQuestionIndex: 0,
        attempts: 0,
        hintShown: false,
        isAnswering: false
    },

    // אלמנטים מה-DOM
    elements: {
        muscleMap: null,
        clickableAreas: null,
        scoreDisplay: null,
        taskDisplay: null,
        nextButton: null
    },

    // נתוני השאלות
    questions: [],

    // אתחול העמוד
    init() {
        if (this.questions.length !== 0)
            return;

        // שמירת הפניות לאלמנטים
        this.elements.muscleMap = document.querySelector('.muscle-map');
        this.elements.clickableAreas = document.getElementById('clickableAreas');
        this.elements.scoreDisplay = document.getElementById('hunterScore');
        this.elements.taskDisplay = document.getElementById('currentTask');
        this.elements.nextButton = document.getElementById('nextQuestion');

        // העתקת השאלות מהמצב הגלובלי
        this.questions = [...gameState.questions.hunter];
        
        // יצירת אזורים לחיצים על המפה
        this.createClickableAreas();
        
        // הוספת מאזיני אירועים
        this.addEventListeners();
        
        // התחלת השאלה הראשונה
        this.startNewQuestion();
    },

    // יצירת אזורים לחיצים על המפה
    createClickableAreas() {
        const areas = {
            area0: [{ top: '30%', left: '12.5%', width: '7%', height: '15%' },{ top: '30%', left: '36%', width: '7%', height: '15%' }],
            area1: [{ top: '30%', left: '55%', width: '10%', height: '15%' },{ top: '30%', left: '78%', width: '10%', height: '15%' }],
            area2: [{ top: '55%', left: '19%', width: '8%', height: '20%' },{ top: '55%', left: '28%', width: '8%', height: '20%' }],
            area3: [{ top: '50%', right: '20%', width: '19%', height: '12%' }],
            area4: [{ top: '20%', left: '15%', width: '7%', height: '10%' },{ top: '20%', left: '34%', width: '7%', height: '10%' }],
            area5: [{ top: '23%', left: '20%', width: '17%', height: '12%' }]
        };

        Object.entries(areas).forEach(([areaName, arrayPositions]) => {
            arrayPositions.forEach((position) => {
                const area = document.createElement('div');
                area.className = 'clickable-area';
                area.dataset.area = areaName;
                Object.assign(area.style, {
                position: 'absolute',
                ...position,
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                border: '2px solid black',
                borderRadius: '5px',
                transition: 'all 0.3s ease'
            });

            this.elements.clickableAreas.appendChild(area);
        });
        });
    },

    // הוספת מאזיני אירועים
    addEventListeners() {
        // מאזין ללחיצות על אזורי המפה
        this.elements.clickableAreas.addEventListener('click', (e) => {
            const area = e.target.closest('.clickable-area');
            if (area && !this.state.isAnswering) {
                this.handleAreaClick(area);
            }
        });

        // מאזין לכפתור השאלה הבאה
        this.elements.nextButton.addEventListener('click', () => {
            this.moveToNextQuestion();
        });

        // מאזין למעבר עכבר מעל אזורים
        this.elements.clickableAreas.addEventListener('mouseover', (e) => {
            const area = e.target.closest('.clickable-area');
            if (area) {
                area.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
        });

        this.elements.clickableAreas.addEventListener('mouseout', (e) => {
            const area = e.target.closest('.clickable-area');
            if (area) {
                area.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
            }
        });
    },

    // התחלת שאלה חדשה
    startNewQuestion() {
        const question = this.questions[this.state.currentQuestionIndex];
        this.elements.taskDisplay.textContent = question.question;
        this.state.attempts = 0;
        this.state.hintShown = false;
        this.state.isAnswering = false;
        this.state.correct = false;
        this.elements.nextButton.classList.add('hidden');
        
        // איפוס כל ההדגשות על המפה
        document.querySelectorAll('.clickable-area').forEach(area => {
            area.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
            area.style.border = '2px solid transparent';
        });
    },

    // טיפול בלחיצה על אזור במפה
    async handleAreaClick(area) {
        this.state.isAnswering = true;
        const question = this.questions[this.state.currentQuestionIndex];
        const isCorrect = area.dataset.area === question.area;

        if (this.state.correct || this.state.attempts >= 2)
            return;

        if (isCorrect) {
            this.state.correct = true;
            // תשובה נכונה
            utils.playSuccessEffect(area);
            utils.updateScore('hunterScore', 10);
            area.style.backgroundColor = 'rgba(46, 204, 113, 0.3)';
            area.style.border = '2px solid #27ae60';
            
            // הצגת הודעת הצלחה
            this.showFeedback('נכון מאוד!', true);
            
            // הצגת כפתור המשך
            this.elements.nextButton.classList.remove('hidden');
        } else {
            // תשובה שגויה
            utils.playFailureEffect(area);
            area.style.backgroundColor = 'rgba(231, 76, 60, 0.3)';
            area.style.border = '2px solid #c0392b';
            
            this.state.attempts++;
            
            if (this.state.attempts >= 2 && !this.state.hintShown) {
                // הצגת רמז אחרי שתי טעויות
                this.showHint(question.area);
                this.state.hintShown = true;
            }
            
            // הצגת הודעת שגיאה
            this.showFeedback('נסה שוב!', false);
        }
        
        setTimeout(() => {
            this.state.isAnswering = false;
            if (this.state.attempts >= 2) {
                this.elements.nextButton.classList.remove('hidden');
            }
        }, 1000);
    },

    // הצגת רמז
    showHint(correctArea) {
        const correctElement = document.querySelector(`[data-area="${correctArea}"]`);
        if (correctElement) {
            gsap.to(correctElement, {
                backgroundColor: 'rgba(241, 196, 15, 0.3)',
                border: '2px solid #f1c40f',
                repeat: 3,
                yoyo: true,
                duration: 0.7
            });
        }
    },

    // הצגת משוב
    showFeedback(message, isSuccess) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;
        feedback.style.position = 'fixed';
        feedback.style.top = '20%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 2000);
    },

    // מעבר לשאלה הבאה
    moveToNextQuestion() {
        this.state.currentQuestionIndex++;
        
        if (this.state.currentQuestionIndex >= this.questions.length) {
            // סיום המשחק
            this.state.currentQuestionIndex = 0;
            this.startNewQuestion();
            
            utils.changePage(5);
        } else {
            // התחלת השאלה הבאה
            this.startNewQuestion();
        }
    }
};

// אתחול העמוד כשה-DOM נטען
document.addEventListener('DOMContentLoaded', () => {
    if (gameState.currentPage === 2) {
        page2Manager.init();
    }
});

// האזנה למעבר לעמוד השני
document.addEventListener('pageChange', (e) => {
    if (e.detail.page === 2) {
        page2Manager.init();
    }
});