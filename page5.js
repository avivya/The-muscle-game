// page5.js - קובץ JavaScript לעמוד הסיום

class FinalPage {
    constructor() {
        this.playerNameDisplay = document.getElementById('playerNameDisplay');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.restartButton = document.getElementById('restartGame');
        this.trophyImage = document.querySelector('.trophy-img');
        this.self = document.getElementById('page5');
        
        this.rankTextDisplay = document.createElement('p'); // הוספת אלמנט חדש לטקסט הדירוג
        this.rankTextDisplay.className = 'rank-text';
        this.playerNameDisplay.parentElement.insertBefore(
            this.rankTextDisplay,
            this.playerNameDisplay.nextSibling
        );

        this.initializeEventListeners();
    }

    initializeEventListeners() {        
        // האזנה לכפתור התחל מחדש
        this.restartButton.addEventListener('click', () => this.restartGame());        
        // האזנה לטעינת תמונת הגביע
        this.trophyImage.addEventListener('load', () => this.animateTrophy());        
    }

    // הצגת העמוד הסופי
    displayFinalPage() {
        // עדכון שם השחקן
        //this.playerNameDisplay.textContent = gameState.playerName;
        this.playerNameDisplay.textContent = `שחקן: ${gameState.playerName}`;
        // חישוב וכתיבת הציון הסופי
        const totalScore = this.calculateTotalScore();
        this.finalScoreDisplay.textContent = totalScore;

        // חישוב רמת הציון
        const stars = utils.calculateStars(totalScore,60);
        const rankText = utils.getRankText(stars);
        this.rankTextDisplay.textContent = rankText;

        // הפעלת אנימציית כניסה
        this.playEntryAnimation();

        // השמעת צליל סיום
        this.playCompletionSound();
    }

    // חישוב הציון הסופי
    calculateTotalScore() {
        return gameState.scores.hunterScore + 
               gameState.scores.simulatorScore + 
               gameState.scores.dailyScore;
    }

    // אנימציית כניסה לעמוד
    playEntryAnimation() {
        const elements = [
            this.playerNameDisplay,
            this.rankTextDisplay,
            document.querySelector('h2'),
            this.trophyImage,
            this.finalScoreDisplay.parentElement,
            this.restartButton
        ];

        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // אנימציה לגביע
    animateTrophy() {
        this.trophyImage.style.animation = 'trophyEntrance 1s ease-out';
    }

    // השמעת צליל סיום
    playCompletionSound() {
        const completionSound = new Audio('completion.mp3');
        completionSound.volume = 0.6;
        completionSound.play();
    }

    // התחלת משחק מחדש
    restartGame() {
        // איפוס נתוני המשחק
        gameState.scores = {
            hunterScore: 0,
            simulatorScore: 0,
            dailyScore: 0
        };
        gameState.totalScore = 0;

        // ערבוב מחדש של השאלות
        gameState.questions.hunter = utils.shuffleArray([...gameState.questions.hunter]);
        gameState.questions.simulator = utils.shuffleArray([...gameState.questions.simulator]);
        gameState.questions.daily = utils.shuffleArray([...gameState.questions.daily]);

        // מעבר לעמוד הראשון
        utils.changePage(1);

        // איפוס תצוגת הניקוד בכל העמודים
        const scoreDisplays = document.querySelectorAll('.score-display span');
        scoreDisplays.forEach(display => {
            display.textContent = '0';
        });
    }
}

// יצירת מופע של העמוד החמישי והוספת סגנונות CSS דינמיים
const page5 = new FinalPage();

// הוספת אנימציות CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes trophyEntrance {
        0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(10deg);
        }
        100% {
            transform: scale(1) rotate(0);
            opacity: 1;
        }
    }

    .completion-message > * {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .trophy-img {
        transform-origin: center bottom;
    }
    .rank-text {
        font-size: 1.2em;
        color: #4a4a4a;
        margin: 10px 0;
        text-align: center;
    }
`;
document.head.appendChild(style);

// ייצוא המופע לשימוש בקבצים אחרים
window.page5 = page5;

// אתחול העמוד כשה-DOM נטען
document.addEventListener('DOMContentLoaded', () => {
    if (gameState.currentPage === 5) {        
        page5.displayFinalPage();        
    }
});
document.addEventListener('pageChange', (e) => {
    if (e.detail.page === 5) {
        page5.displayFinalPage();
    }
});