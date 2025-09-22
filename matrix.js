// SW.BERNHARDT Legal Assistant Platform - Matrix Background Effect

let matrixCanvas;
let matrixCtx;
let matrixChars = [];
let animationId;

// Matrix characters (Thai + English + Numbers + Legal symbols)
const matrixCharacters = [
    // Thai characters
    'ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ญ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ',
    'ะ', 'ั', 'า', 'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ',
    // English characters
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    // Numbers
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    // Legal and special symbols
    '§', '¶', '©', '®', '™', '€', '$', '¥', '£', '₿', '%', '&', '@', '#', '*', '+', '-', '=', '/', '\\', '|', '~', '^', '<', '>', '?', '!',
    // Thai numbers
    '๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'
];

class MatrixChar {
    constructor(x, y, speed, fontSize) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.fontSize = fontSize;
        this.char = this.getRandomChar();
        this.opacity = Math.random();
        this.changeTimer = 0;
        this.changeInterval = Math.random() * 100 + 50; // Change character every 50-150 frames
    }
    
    getRandomChar() {
        return matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
    }
    
    update() {
        this.y += this.speed;
        this.changeTimer++;
        
        // Change character occasionally
        if (this.changeTimer >= this.changeInterval) {
            this.char = this.getRandomChar();
            this.changeTimer = 0;
            this.changeInterval = Math.random() * 100 + 50;
        }
        
        // Reset position when off screen
        if (this.y > matrixCanvas.height + this.fontSize) {
            this.y = -this.fontSize;
            this.x = Math.random() * matrixCanvas.width;
            this.opacity = Math.random();
        }
        
        // Fade effect
        this.opacity = Math.max(0, this.opacity - 0.005);
        if (this.opacity <= 0) {
            this.opacity = Math.random() * 0.8 + 0.2;
        }
    }
    
    draw() {
        matrixCtx.save();
        matrixCtx.globalAlpha = this.opacity;
        matrixCtx.fillStyle = '#00ff41';
        matrixCtx.font = `${this.fontSize}px 'Courier New', monospace`;
        matrixCtx.textAlign = 'center';
        
        // Add glow effect for some characters
        if (Math.random() < 0.1) {
            matrixCtx.shadowColor = '#00ff41';
            matrixCtx.shadowBlur = 10;
        }
        
        matrixCtx.fillText(this.char, this.x, this.y);
        matrixCtx.restore();
    }
}

function initializeMatrix() {
    matrixCanvas = document.getElementById('matrix-canvas');
    if (!matrixCanvas) {
        console.warn('Matrix canvas not found');
        return;
    }
    
    matrixCtx = matrixCanvas.getContext('2d');
    
    // Set canvas size
    resizeMatrix();
    
    // Create initial characters
    createMatrixChars();
    
    // Start animation
    animateMatrix();
    
    // Handle window resize
    window.addEventListener('resize', resizeMatrix);
    
    console.log('🌐 Matrix background initialized');
}

function resizeMatrix() {
    if (!matrixCanvas) return;
    
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    // Recreate characters on resize
    createMatrixChars();
}

function createMatrixChars() {
    matrixChars = [];
    
    const columns = Math.floor(matrixCanvas.width / 20); // Character spacing
    const rows = Math.floor(matrixCanvas.height / 20);
    
    // Create characters in a grid pattern with some randomness
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < Math.random() * rows; j++) {
            const x = i * 20 + Math.random() * 10;
            const y = j * 20 + Math.random() * matrixCanvas.height;
            const speed = Math.random() * 2 + 0.5; // Speed between 0.5 and 2.5
            const fontSize = Math.random() * 8 + 12; // Font size between 12 and 20
            
            matrixChars.push(new MatrixChar(x, y, speed, fontSize));
        }
    }
    
    // Add some random floating characters
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * matrixCanvas.width;
        const y = Math.random() * matrixCanvas.height;
        const speed = Math.random() * 1 + 0.2;
        const fontSize = Math.random() * 6 + 10;
        
        matrixChars.push(new MatrixChar(x, y, speed, fontSize));
    }
}

function animateMatrix() {
    if (!matrixCanvas || !matrixCtx) return;
    
    // Clear canvas with fade effect
    matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    // Update and draw all characters
    matrixChars.forEach(char => {
        char.update();
        char.draw();
    });
    
    // Continue animation
    animationId = requestAnimationFrame(animateMatrix);
}

function stopMatrix() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function startMatrix() {
    if (!animationId) {
        animateMatrix();
    }
}

// Performance optimization - pause animation when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopMatrix();
    } else {
        startMatrix();
    }
});

// Reduce animation on low-end devices
function checkPerformance() {
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     navigator.deviceMemory <= 2 ||
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowEnd) {
        // Reduce number of characters for better performance
        matrixChars = matrixChars.filter((_, index) => index % 2 === 0);
        console.log('🔧 Matrix optimized for low-end device');
    }
}

// Initialize performance check
setTimeout(checkPerformance, 1000);

// Export functions
window.initializeMatrix = initializeMatrix;
window.stopMatrix = stopMatrix;
window.startMatrix = startMatrix;