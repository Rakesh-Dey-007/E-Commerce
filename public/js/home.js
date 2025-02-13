
// Particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#7f00ff'  // Updated to new violet color
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#7f00ff',  // Updated to new violet color
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Hamburger menu functionality
document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('nav')) {
        document.querySelector('.nav-links').classList.remove('active');
    }
});


const texts = [
    "Welcome to my website ✨",
    "This is an E-commerce website ✨",
    "This is a Backend Project ✨",
    "This website is created by Rakesh Dey. ✨"
];
let index = 0;
let charIndex = 0;
const typingSpeed = 100; // Speed of typing in milliseconds
const erasingSpeed = 50; // Speed of erasing in milliseconds
const pauseBetweenTexts = 2000; // Pause between texts in milliseconds

function type() {
    if (charIndex < texts[index].length) {
        document.getElementById("typed-text").textContent += texts[index].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, pauseBetweenTexts);
    }
}

function erase() {
    if (charIndex > 0) {
        document.getElementById("typed-text").textContent = texts[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        index = (index + 1) % texts.length; // Move to the next text
        setTimeout(type, typingSpeed + 1000); // Start typing again after a short delay
    }
}

// Start the typing effect
type();

