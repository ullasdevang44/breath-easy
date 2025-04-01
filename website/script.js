// Initialize Particles with Enhanced Effects
particlesJS('particles-js', {
    particles: {
        number: { value: 150, density: { enable: true, value_area: 1000 } },
        color: { value: ['#ffffff', '#ff007a', '#00ddeb', '#00b7c2', '#ff4d94'] },
        shape: { type: ['circle', 'triangle', 'star', 'edge'], polygon: { nb_sides: 6 } },
        opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1.5, opacity_min: 0.2 } },
        size: { value: 5, random: true, anim: { enable: true, speed: 3, size_min: 1 } },
        line_linked: { enable: true, distance: 200, color: '#ffffff', opacity: 0.4, width: 2 },
        move: { enable: true, speed: 10, direction: 'none', random: true, out_mode: 'bounce' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 250, line_linked: { opacity: 0.6 } }, push: { particles_nb: 5 } }
    },
    retina_detect: true
});

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Navigation
function scrollToSection(id) {
    const element = $(`#${id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) toggleMenu();
    }
}

function toggleMenu() {
    $$('nav a, nav .theme-toggle').forEach(link => link.classList.toggle('show'));
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

// Apply saved dark mode preference
if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-mode');

// Monitoring
let monitoringInterval;
function updateMonitor() {
    $('#oxygen').textContent = `${Math.floor(Math.random() * (100 - 90) + 90)}%`;
    $('#heart').textContent = `${Math.floor(Math.random() * (80 - 60) + 60)} BPM`;
    $('#bp').textContent = `${Math.floor(Math.random() * (130 - 110) + 110)}/${Math.floor(Math.random() * (90 - 70) + 70)} mmHg`;
}

function toggleMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        $('#monitor button').textContent = 'Start Live Updates';
    } else {
        monitoringInterval = setInterval(updateMonitor, 1500);
        updateMonitor();
        $('#monitor button').textContent = 'Stop Live Updates';
    }
}

// Booking Form
function nextStep(step) {
    $$('.form-step').forEach(s => s.classList.remove('active'));
    $$('.form-step')[step - 1].classList.add('active');
    $$('.progress div').forEach((d, i) => d.classList.toggle('active', i < step));
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

$('#booking-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#bookingName').value.trim();
    const email = $('#bookingEmail').value.trim();
    const location = $('#bookingLocation').value;
    const date = $('#bookingDate').value;
    const notes = $('#bookingNotes').value.trim();

    if (!name || !validateEmail(email) || !location || !date) {
        alert('Please fill in all required fields with valid data.');
        return;
    }

    console.log('Booking:', { name, email, location, date, notes });
    alert('Booking Confirmed! We’ll reach out soon.');
    $('#booking-form').reset();
    nextStep(1);
});

// Feedback Form
$('#feedback-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#feedbackName').value.trim();
    const message = $('#feedbackMessage').value.trim();

    if (!name || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    console.log('Feedback:', { name, message });
    alert('Feedback Received – Thank You!');
    $('#feedback-form').reset();
});

// Chat Widget
function toggleChat() {
    $('.chat-widget').classList.toggle('active');
}

function closeChat() {
    $('.chat-widget').classList.remove('active');
}

function sendChatMessage() {
    const input = $('#chat-input');
    const message = input.value.trim();
    if (!message) return;

    const chatBox = $('#chat-box');
    chatBox.innerHTML += `<div class="chat-message user">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight; //Keep scroll at the bottom

    // Convert message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase();

    // Define responses with keywords
    const responses = {
        'breath easy': 'Breath Easy is an innovative, low-cost ventilator system with real-time monitoring and booking features.',
        'jyothy institute': 'Jyothy Institute of Technology is our primary location in Bangalore, offering ventilator services.',
        'how to book': 'Go to the "Book" section, fill out the form step-by-step, and confirm your booking.',
        'booking': 'You can book a Breath Easy ventilator through the "Book" section on our website. Fill out the form, and we\'ll contact you to confirm.', //Added booking keyword
        'how to monitor': 'Click "Start/Stop Live Updates" in the Monitor section to see real-time patient data.',
        'problem': 'Sorry to hear that! Check the power supply or contact support at support@breatheasy.com.',
        'issue': 'Please describe the issue you\'re experiencing, and we\'ll do our best to help. You can also contact support@breatheasy.com.', //Added issue keyword
        'hi': 'Hello! How can I assist you today?',
        'hello': 'Hi there!  What can I help you with?', //Added "hello"
        'hey': 'Hey!  How can I help?',  //Added "hey"
        'thanks': 'You’re welcome! Anything else I can help with?',
        'thank you': 'You\'re most welcome!  Let me know if you have any other questions.', //Added thank you
        'where': 'Our main location is Jyothy Institute of Technology. Check the Locations section for more!',
        'location': 'We are located at Jyothy Institute of Technology and other partner locations. Check the "Locations" section for a detailed list.', //Added location
        'locations': 'We are located at Jyothy Institute of Technology and other partner locations. Check the "Locations" section for a detailed list.', //Added location
        'cost': 'Breath Easy ventilators are designed to be affordable. Contact us for exact pricing!',
        'price': 'Breath Easy ventilators are designed to be affordable. Contact us for exact pricing!', //Added "price"
        'ventilator': 'Breath Easy is dedicated to providing affordable, high-quality ventilator solutions.', //Added ventilator
        'ventilators': 'Breath Easy is dedicated to providing affordable, high-quality ventilator solutions.',  //Added ventilators
        'support': 'For technical support, please email support@breatheasy.com or call us at 555-123-4567', //Added support
        'help': 'How can I help you today?',  //Added help
        'accessibility': 'We are committed to making our ventilators accessible. Please contact us for specific accessibility needs.', //Added accessibility
        'not working': 'If your ventilator is not working, please check the power supply, ensure all connections are secure, and consult the user manual. If the issue persists, contact support@breatheasy.com immediately.', //Added "not working"
        'broken': 'If your ventilator is broken, contact support@breatheasy.com immediately to resolve this issue.', // Added "broken"
        'maintenance': 'For ventilator maintenance inquiries, please contact support@breatheasy.com',//Added "maintenance"
        'warranty': 'Our ventilators come with a standard one-year warranty. Contact support@breatheasy.com for more information.' //Added "warranty"

    };

    //Improved Keyword Matching & Fallback
    let botReply = 'I\'m not sure about that. Try asking about Breath Easy, booking, locations, or issues!';
    let foundMatch = false;

    for (const key in responses) {
        if (lowerMessage.includes(key)) {
            botReply = responses[key];
            foundMatch = true;
            break; // Stop at the first match
        }
    }

    setTimeout(() => {
        chatBox.innerHTML += `<div class="chat-message bot">${botReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight; //Keep scroll at the bottom after bot reply
}