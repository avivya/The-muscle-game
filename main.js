// main.js - קובץ JavaScript ראשי

// אובייקט גלובלי לשמירת נתוני המשחק
const gameState = {
    playerName: '',
    currentPage: 1,
    loaded: 0,
    totalScore: 0,
    scores: {
        hunterScore: 0,
        simulatorScore: 0,
        dailyScore: 0
    },
    // מערך השאלות לכל שלב
    questions: {
        hunter: [
            { muscle: 'biceps', question: 'מצא את השריר הדו-ראשי', area: 'area0' }, // done
            { muscle: 'triceps', question: 'מצא את השריר התלת-ראשי', area: 'area1' }, // done
            { muscle: 'quadriceps', question: 'מצא את השריר הארבע-ראשי', area: 'area2' }, // done
            { muscle: 'gluteus', question: 'מצא את השריר הישבן', area: 'area3' }, // done
            { muscle: 'deltoids', question: 'מצא את שרירי הכתף', area: 'area4' },
            { muscle: 'pectorals', question: 'מצא את שרירי החזה', area: 'area5' }
        ],
        simulator: [
            { action: 'bend', instruction: 'כופף את המרפק!', correctMuscle: 'biceps' },
            { action: 'straighten', instruction: 'ישר את המרפק!', correctMuscle: 'triceps' },
            { action: 'raise', instruction: 'הרם את הזרוע!', correctMuscle: 'deltoids' }
        ],
        daily: [
            { 
                activity: 'liftBag',
                description: 'הרם תיק כבד מהרצפה',
                correctMuscle: 'quadriceps',
                options: ['quadriceps', 'biceps', 'deltoids'],
                feedback: 'שרירי הירך הארבע-ראשיים עוזרים לך להתרומם!'
            },
            {
                activity: 'pushDoor',
                description: 'דחוף דלת כבדה',
                correctMuscle: 'pectorals',
                options: ['pectorals', 'biceps', 'triceps'],
                feedback: 'שרירי החזה מסייעים בדחיפה קדימה!'
            },
            {
                activity: 'climbStairs',
                description: 'טפס במדרגות',
                correctMuscle: 'gastrocnemius',
                options: ['gastrocnemius', 'hamstrings', 'quadriceps'],
                feedback: 'שרירי השוק עוזרים לך לדחוף את הגוף כלפי מעלה!'
            }
        ]
    }
};

// פונקציות עזר
const utils = {
    // ערבוב מערך
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // מעבר בין עמודים
    changePage(newPage) {
        const currentPage = document.querySelector('.game-page.active');
        const nextPage = document.getElementById(`page${newPage}`);
        
        if (currentPage) {
            currentPage.classList.remove('active');
        }
        if (nextPage) {
            nextPage.classList.add('active');
            gameState.currentPage = newPage;
        }

        // fire event
        const event = new CustomEvent('pageChange', { detail: { page: newPage } });
        document.dispatchEvent(event);
    },

    // חישוב דירוג כוכבים
    calculateStars(score, maxScore) {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 5;
        if (percentage >= 75) return 4;
        if (percentage >= 50) return 3;
        if (percentage >= 25) return 2;
        return 1;
    },

    // הצגת דירוג
    getRankText(stars) {
        const ranks = [
            'לא אכלת הבוקר',
            'מתאמן מתחיל',
            'מתאמן מתמיד',
            'מתאמן בפעולה',
            'מאסטר בתנועת שרירים'
        ];
        return ranks[Math.min(ranks.length - 1, Math.max(0, stars - 1))];
    },

    // יצירת אפקט הצלחה
    playSuccessEffect(element) {
        element.classList.add('correct');
        new Audio('success.mp3').play();
        setTimeout(() => element.classList.remove('correct'), 1000);
    },

    // יצירת אפקט כישלון
    playFailureEffect(element) {
        element.classList.add('incorrect');
        new Audio('failure.mp3').play();
        setTimeout(() => element.classList.remove('incorrect'), 1000);
    },

    // עדכון ניקוד
    updateScore(type, points) {
        gameState.scores[type] += points;
        gameState.totalScore += points;
        
        // עדכון תצוגת הניקוד בממשק
        const scoreElement = document.getElementById(type);
        if (scoreElement) {
            scoreElement.textContent = gameState.scores[type];
        }
    }
};

// Track whether the user has interacted with the page
let userInteracted = false;

// Add event listeners for user interaction
function onUserInteraction() {
    userInteracted = true;
    audioManager.init();
       gameState.loaded = 1;

    // Remove event listeners after the first interaction
    window.removeEventListener('click', onUserInteraction);
    window.removeEventListener('keydown', onUserInteraction);
    console.log('User has interacted with the page.');
}
function createUserInteractionTest() {
// Listen for mouse movement and key presses
window.addEventListener('click', onUserInteraction);
window.addEventListener('keydown', onUserInteraction);

// Check if the page has partially loaded and user has interacted
const intervalId = setInterval(() => {
    if (document.readyState === 'interactive' && userInteracted) {
        console.log('Page partially loaded, and user has interacted.');
        clearInterval(intervalId); // Stop the interval
    }
}, 100); // Check every 100m
}
// ניהול מוזיקת רקע
const audioManager = {
    backgroundMusic: null,
    
    init() {
        this.backgroundMusic = new Howl({
            src: ['background-music.mp3'],
            loop: true,
            volume: 0.5
        });
    },

    play() {
        this.backgroundMusic.play();
    },

    pause() {
        this.backgroundMusic.pause();
    },

    setVolume(volume) {
        this.backgroundMusic.volume(volume);
    }
};

// אתחול המשחק
function initGame() {
    console.log("main.js - initGame");

    // ערבוב השאלות בכל המשחקים
    gameState.questions.hunter = utils.shuffleArray([...gameState.questions.hunter]);
    gameState.questions.simulator = utils.shuffleArray([...gameState.questions.simulator]);
    gameState.questions.daily = utils.shuffleArray([...gameState.questions.daily]);

    // הצגת העמוד הראשון
    utils.changePage(1); // Start on page 1 explicitly.
    // בדוק שהשחקן זז
    createUserInteractionTest();

    // הוספת מאזין לאירוע כפתור "התחל משחק"
    const startGameButton = document.getElementById('startGame');
    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            const playerNameInput = document.getElementById('playerName');
            const playerName = playerNameInput?.value.trim();

            if (playerName) {
                gameState.playerName = playerName;
                document.getElementById('playerNameDisplay').textContent = `שחקן: ${playerName}`;
                utils.changePage(2); // Move to the next page.
            } else {
                alert('אנא הכנס שם כדי להתחיל את המשחק!');
            }
        });
    }

    // האזנה לאירועי מקלדת
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            audioManager.pause();
        }
    });
}
// טעינת המשחק
window.addEventListener('load', initGame);

// ייצוא הפונקציות והאובייקטים לשימוש בקבצים אחרים
window.gameState = gameState;
window.utils = utils;
window.audioManager = audioManager;