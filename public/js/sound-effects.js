// Sound Effects Module
// Uses Web Audio API for cross-browser compatible sound generation

let audioContext;
let soundEnabled = true;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.textContent = soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !soundEnabled);
    }
    return soundEnabled;
}

// Main sound effect function
function playSound(type) {
    if (!soundEnabled) return;

    initAudio();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
        case 'buzzer':
            // Buzzer sound - quick beep
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;

        case 'correct':
            // Correct answer - ascending chime
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;

        case 'wrong':
            // Wrong answer - descending buzz
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;

        case 'click':
            // Board click - short click
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;

        case 'timer':
            // Timer tick - subtle tick
            oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
            break;

        default:
            console.warn('Unknown sound type:', type);
            oscillator.disconnect();
            gainNode.disconnect();
            return;
    }
}

// Initialize audio on any user interaction
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });
