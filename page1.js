// page1.js - JavaScript לעמוד הראשון

// אובייקט לניהול העמוד הראשון
const page1Manager = {
    // אלמנטים מה-DOM
    elements: {
        playerNameInput: null,
        startButton: null,
        skeletonImage: null
    },
    // אתחול העמוד
    init() {
        // שמירת הפניות לאלמנטים
        this.elements.playerNameInput = document.getElementById('playerName');
        this.elements.startButton = document.getElementById('startGame');
        this.elements.skeletonImage = document.querySelector('.skeleton-img');
	console.log("page1.js - Run init(3)");

        // הוספת מאזיני אירועים
        this.addEventListeners();
        console.log("page1.js - Run init(4)");

        // הפעלת אנימציית פתיחה
        this.playOpeningAnimation();
        console.log("page1.js - Run init(5)");

	// ביטול כפתור ההתחלה
	this.elements.startButton.disabled = true;
	console.log("page1.js - Run init(6)");
	
	setTimeout(() => {
	    audioManager.play();
	    console.log("page1.js - Run init(7)");
	}, 100);
        // התחלת מוזיקת רקע
	//document.addEventListener('mousemove',startMusicOnStartup);

    },
    
    // הוספת מאזיני אירועים
    addEventListeners() {
        // מאזין ללחיצה על כפתור ההתחלה
        this.elements.startButton.addEventListener('click', () => this.handleStartGame());

        // מאזין לשינויים בשדה השם
        this.elements.playerNameInput.addEventListener('input', (e) => this.validateInput(e));

        // מאזין ללחיצה על Enter
        this.elements.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.validateInput(e)) {
                this.handleStartGame();
            }
        });
    },

    // ולידציה של קלט השם
    validateInput(e) {
        const input = e.target.value.trim();
        
        // בדיקה שהשם לא ריק ומכיל רק תווים חוקיים
        const isValid = input.length > 0 && /^[\u0590-\u05FF\s\w]+$/.test(input);
        
        // עדכון סטייל הכפתור בהתאם לתקינות הקלט
        this.elements.startButton.disabled = !isValid;
        this.elements.startButton.style.opacity = isValid ? '1' : '0.5';
        
        return isValid;
    },

    // טיפול בהתחלת המשחק
    handleStartGame() {
        const playerName = this.elements.playerNameInput.value.trim();
        
        if (playerName) {
            // שמירת שם השחקן במצב המשחק
            gameState.playerName = playerName;
            
            // אנימציית יציאה
            this.playExitAnimation().then(() => {
                // מעבר לעמוד הבא
                utils.changePage(2);
            });
        }
    },

    // אנימציית פתיחה
    playOpeningAnimation() {
        // הוספת קלאס לאנימציה
        this.elements.skeletonImage.classList.add('fade-in');
        
        // אנימציה הדרגתית של הכותרת והטופס
        gsap.from('h1', {
            duration: 1,
            y: -50,
            opacity: 0,
            ease: 'power2.out'
        });

        gsap.from('.name-input-container', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.5,
            ease: 'power2.out'
        });
    },

    // אנימציית יציאה
    async playExitAnimation() {
        return new Promise(resolve => {
            // אנימציית עמעום של כל התוכן
            gsap.to('.container', {
                duration: 0.5,
                // opacity: 0,
                y: -20,
                ease: 'power2.in',
                onComplete: resolve
            });
        });
    }
};
//&& gameState.loaded === 1
// אתחול העמוד כשה-DOM נטען
document.addEventListener('DOMContentLoaded', () => {
	console.log("page1.js - Run init(0)");
	const checkGameStateLoaded = setInterval(() => {
	//console.log(document.readyState);
    	if (gameState.loaded === 1) {
	    clearInterval(checkGameStateLoaded); // Stop polling once the condition is met
    	    if (gameState.currentPage === 1 ) {
      		  console.log("page1.js - Run init(2)");
      		  page1Manager.init();
    	    }    	    
   	 }
	}, 100); // Check every 100ms
    console.log("page1.js - Run init(1)");
});

// האזנה למעבר חזרה לעמוד הראשון
document.addEventListener('pageChange', (e) => {
    if (e.detail.page === 1) {
        page1Manager.init();
    }
});