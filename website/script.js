/* Initialize Particles with Enhanced Effects */
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 120, density: { enable: true, value_area: 1000 } },
            color: { value: ['#ffffff', '#ff007a', '#00ddeb', '#00b7c2', '#ff4d94'] },
            shape: { type: ['circle', 'triangle', 'star'], polygon: { nb_sides: 6 } },
            opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1.2, opacity_min: 0.2 } },
            size: { value: 4, random: true, anim: { enable: true, speed: 2.5, size_min: 1 } },
            line_linked: { enable: true, distance: 180, color: '#ffffff', opacity: 0.3, width: 1.5 },
            move: { enable: true, speed: 8, direction: 'none', random: true, out_mode: 'bounce' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
} else {
    console.error("particlesJS library not loaded.");
}


/* Utility Functions */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Helper to show error messages
const showError = (id, message) => {
    const errorElement = $(`#${id}`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        console.warn(`Error element with ID #${id} not found.`);
    }
};
// Helper to hide error messages
const hideError = (id) => {
    const errorElement = $(`#${id}`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
};

/* Debounce function to prevent rapid scroll events */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* Smooth Scrolling with Nav Bar Offset */
function scrollToSection(id) {
    const element = $(`#${id}`);
    if (!element) {
        console.error(`Element with ID #${id} not found for scrolling.`);
        return;
    }

    const navHeight = window.innerWidth <= 768 ? 48 : 64; // Match styles.css
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // Close mobile menu if open
    const hamburger = $('.hamburger');
    if (hamburger && window.innerWidth <= 768 && hamburger.classList.contains('open')) {
        toggleMenu();
    }

    // Update active nav link immediately for better UX
    $$('nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
         if (linkHref && linkHref.startsWith('#')) { // Check if it's an internal link
            link.removeAttribute('aria-current');
            link.classList.remove('active');
            if (linkHref === `#${id}`) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            }
        }
    });

    // Manage focus for accessibility after scroll animation
    setTimeout(() => {
        element.setAttribute('tabindex', '-1'); // Temporarily make focusable
        element.focus({ preventScroll: true }); // Focus without scrolling again
        element.removeAttribute('tabindex'); // Remove tabindex after focus
    }, 600); // Should roughly match scroll animation duration
}

/* Toggle Mobile Menu */
function toggleMenu() {
    const hamburger = $('.hamburger');
    const navLinks = $$('nav a, nav .theme-toggle'); // Select all items to show/hide

    if (hamburger) {
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open')); // ARIA attribute
        navLinks.forEach(link => link.classList.toggle('show')); // Toggle visibility class
    }
}

/* Toggle Dark Mode */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
    const themeIcon = $('.theme-toggle i');
    if (themeIcon) {
        themeIcon.classList.toggle('fa-moon', !isDarkMode);
        themeIcon.classList.toggle('fa-sun', isDarkMode);
        // Update ARIA label for accessibility
        themeIcon.parentElement.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

/* Apply saved dark mode preference on load */
function applySavedTheme() {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        const themeIcon = $('.theme-toggle i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeIcon.parentElement.setAttribute('aria-label', 'Switch to light mode');
        }
    } else {
         // Ensure light mode is default if no preference or preference is false
        document.body.classList.remove('dark-mode');
        const themeIcon = $('.theme-toggle i');
        if (themeIcon){
            themeIcon.classList.add('fa-moon');
            themeIcon.classList.remove('fa-sun');
            themeIcon.parentElement.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

/* Monitoring Update */
function updateMonitor() {
    const oxygenEl = $('#oxygen');
    const heartEl = $('#heart');
    const bpEl = $('#bp');

    if (oxygenEl) oxygenEl.textContent = `${Math.floor(Math.random() * (100 - 90 + 1) + 90)}%`; // Inclusive range
    if (heartEl) heartEl.textContent = `${Math.floor(Math.random() * (80 - 60 + 1) + 60)} BPM`; // Inclusive range
    if (bpEl) bpEl.textContent = `${Math.floor(Math.random() * (130 - 110 + 1) + 110)}/${Math.floor(Math.random() * (90 - 70 + 1) + 70)} mmHg`; // Inclusive range
}

/* Initial Ventilator Data */
const INITIAL_VENTILATOR_DATA = {
    jyothy: { available: 5, inUse: 0 },
    city: { available: 1, inUse: 0 },
    rural: { available: 3, inUse: 0 }
};

/* Initialize Ventilator Data in Local Storage */
function initializeVentilatorData() {
    if (!localStorage.getItem('ventilatorData')) {
        localStorage.setItem('ventilatorData', JSON.stringify(INITIAL_VENTILATOR_DATA));
    }
}

/* Get Current Ventilator Data */
function getVentilatorData() {
    try {
        const data = JSON.parse(localStorage.getItem('ventilatorData'));
        // Basic validation to ensure structure is somewhat correct
        if (data && data.jyothy && data.city && data.rural &&
            typeof data.jyothy.available === 'number' && typeof data.jyothy.inUse === 'number') {
            return data;
        } else {
            console.warn("Ventilator data in localStorage is invalid or missing. Re-initializing.");
            localStorage.setItem('ventilatorData', JSON.stringify(INITIAL_VENTILATOR_DATA));
            return INITIAL_VENTILATOR_DATA;
        }
    } catch (error) {
        console.error("Error parsing ventilator data from localStorage:", error);
        localStorage.setItem('ventilatorData', JSON.stringify(INITIAL_VENTILATOR_DATA)); // Reset on error
        return INITIAL_VENTILATOR_DATA;
    }
}

/* Save Ventilator Data */
function saveVentilatorData(data) {
     try {
        localStorage.setItem('ventilatorData', JSON.stringify(data));
    } catch (error) {
        console.error("Error saving ventilator data to localStorage:", error);
        alert("Could not save ventilator status. Please try again.");
    }
}


/* Partial Reset for Ventilators */
function promptPartialReset() {
    const password = prompt('Enter admin password to reset ventilator counts:');
    if (password !== 'admin123') { // Consider a more secure method in a real application
        alert('Incorrect password. Reset aborted.');
        return;
    }

    const location = prompt('Enter location to reset (jyothy, city, rural):')?.toLowerCase().trim();
    if (!location || !['jyothy', 'city', 'rural'].includes(location)) {
        alert('Invalid location. Please enter "jyothy", "city", or "rural".');
        return;
    }

    const data = getVentilatorData();
    const maxToReset = data[location].inUse;

    if (maxToReset === 0) {
        alert(`No ventilators are currently marked as 'in use' at ${location}. Cannot reset.`);
        return;
    }

    const countStr = prompt(`Enter number of ventilators to reset at ${location} (make available). Max ${maxToReset}:`);
    const numToReset = parseInt(countStr);

    if (isNaN(numToReset) || numToReset < 1 || numToReset > maxToReset) {
        alert(`Invalid number. Please enter a number between 1 and ${maxToReset}.`);
        return;
    }

    data[location].inUse -= numToReset;
    data[location].available += numToReset;
    saveVentilatorData(data);
    updateVentilatorUI();
    alert(`${numToReset} ventilator(s) marked as available at ${location}.`);
}

/* Check and Remove Expired Bookings, Update Ventilator Counts */
function checkExpiredBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const data = getVentilatorData();
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    let changed = false;
    const activeBookings = bookings.filter(booking => {
        if (booking.endDate < today) {
            // Booking has expired, make ventilator available again
            if (data[booking.location]) { // Check if location still exists in data
                 if (data[booking.location].inUse > 0) { // Avoid negative 'inUse'
                    data[booking.location].inUse -= 1;
                    data[booking.location].available += 1;
                    changed = true;
                    console.log(`Expired booking found for ${booking.name} at ${booking.location}. Ventilator made available.`);
                 } else {
                    console.warn(`Expired booking for ${booking.name} at ${booking.location}, but 'inUse' count was already 0.`);
                 }
            } else {
                 console.warn(`Expired booking for ${booking.name} references non-existent location ${booking.location}.`);
            }
            return false; // Remove from active bookings
        }
        return true; // Keep in active bookings
    });

    if (changed) {
        localStorage.setItem('bookings', JSON.stringify(activeBookings));
        saveVentilatorData(data);
        updateVentilatorUI();
    }
}

/* Update Ventilator UI Display */
function updateVentilatorUI() {
    const data = getVentilatorData();
    const jyothyAvail = $('#jyothy-available');
    const jyothyInUse = $('#jyothy-in-use');
    const cityAvail = $('#city-available');
    const cityInUse = $('#city-in-use');
    const ruralAvail = $('#rural-available');
    const ruralInUse = $('#rural-in-use');

    if (jyothyAvail) jyothyAvail.textContent = data.jyothy.available;
    if (jyothyInUse) jyothyInUse.textContent = data.jyothy.inUse;
    if (cityAvail) cityAvail.textContent = data.city.available;
    if (cityInUse) cityInUse.textContent = data.city.inUse;
    if (ruralAvail) ruralAvail.textContent = data.rural.available;
    if (ruralInUse) ruralInUse.textContent = data.rural.inUse;
}

/* Booking Form Validation */
function validateStep(step) {
    let isValid = true;
    // Hide all errors for this step before re-validating
    $$(`#step-${step} .error-message`).forEach(el => el.style.display = 'none');

    if (step === 1) {
        const name = $('#bookingName').value.trim();
        const email = $('#bookingEmail').value.trim();

        if (!name) {
            showError('name-error', 'Please enter your name.');
            isValid = false;
        } else {
            hideError('name-error');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email-error', 'Please enter a valid email address.');
            isValid = false;
        } else {
            hideError('email-error');
        }
    } else if (step === 2) {
        const locationSelect = $('#bookingLocation');
        const dateInput = $('#bookingDate');
        const durationInput = $('#bookingDuration');

        const location = locationSelect ? locationSelect.value : '';
        const date = dateInput ? dateInput.value : '';
        const duration = durationInput ? durationInput.value : '';
        const data = getVentilatorData();
        const today = new Date().toISOString().split('T')[0]; // Get today's date

        // Validate Location
        if (!location) {
            showError('location-error', 'Please select a location.');
            isValid = false;
        } else {
            hideError('location-error');
            // Check availability only if location is selected
            if (data[location] && data[location].available <= 0) {
                 showError('availability-error', `Sorry, no ventilators available at this location currently.`);
                 isValid = false;
            } else {
                 hideError('availability-error'); // Hide if available or location invalid
            }
        }

        // Validate Date
        if (!date) {
            showError('date-error', 'Please select a start date.');
            isValid = false;
        } else if (date < today) {
             showError('date-error', 'Start date cannot be in the past.');
             isValid = false;
        } else {
            hideError('date-error');
        }

        // Validate Duration
        const durationNum = parseInt(duration);
        if (!duration || isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
            showError('duration-error', 'Please enter a duration between 1 and 30 days.');
            isValid = false;
        } else {
            hideError('duration-error');
        }
    }
    // Step 3 has no specific validation triggered by 'Next'

    return isValid;
}

/* Booking Form Navigation */
function nextStep(targetStep) {
    const currentStep = targetStep - 1;
    // Validate the step the user is LEAVING before moving forward
    if (!validateStep(currentStep)) return;

    $$('.form-step').forEach(s => s.classList.remove('active'));
    const nextStepElement = $(`#step-${targetStep}`);
    if (nextStepElement) {
        nextStepElement.classList.add('active');
    } else {
        console.error(`Form step element #step-${targetStep} not found.`);
        return; // Stop if the target step doesn't exist
    }

    // Update progress indicator: Highlight all steps up to and including the target step
    $$('.progress div').forEach((div, index) => {
         div.classList.toggle('active', index < targetStep);
    });
}

function prevStep(targetStep) {
    // No validation needed when going back
    $$('.form-step').forEach(s => s.classList.remove('active'));
     const prevStepElement = $(`#step-${targetStep}`);
    if (prevStepElement) {
        prevStepElement.classList.add('active');
    } else {
        console.error(`Form step element #step-${targetStep} not found.`);
        return; // Stop if the target step doesn't exist
    }

    // Update progress indicator: Highlight steps up to the target step
    $$('.progress div').forEach((div, index) => {
        div.classList.toggle('active', index < targetStep);
    });
}

/* Booking Form Submission */
const bookingForm = $('#booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Final validation check for step 2 data is crucial before submission
        if (!validateStep(1) || !validateStep(2)) {
             // If validation fails for step 1 or 2, try to navigate the user back
            if (!validateStep(1)) {
                prevStep(1);
                alert("Please correct the errors in Step 1.");
            } else if (!validateStep(2)) {
                prevStep(2);
                 alert("Please correct the errors in Step 2.");
            }
            return;
        }


        const name = $('#bookingName').value.trim();
        const email = $('#bookingEmail').value.trim();
        const location = $('#bookingLocation').value;
        const date = $('#bookingDate').value;
        const duration = $('#bookingDuration').value;
        const notes = $('#bookingNotes').value.trim();

        const data = getVentilatorData();

        // **Crucial:** Double-check availability right before committing the booking
        if (data[location] && data[location].available > 0) {
            data[location].available -= 1;
            data[location].inUse += 1;
            saveVentilatorData(data); // Save updated counts

            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const startDate = new Date(date);
            // Ensure correct date calculation, accounting for timezones if necessary
            // Using UTC dates avoids timezone shifts during calculation
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + parseInt(duration));


            bookings.push({
                id: Date.now().toString(), // Add a simple unique ID
                name,
                email,
                location,
                startDate: date, // Store as YYYY-MM-DD string
                duration: parseInt(duration),
                endDate: endDate.toISOString().split('T')[0] // Store as YYYY-MM-DD string
            });
            localStorage.setItem('bookings', JSON.stringify(bookings));

            updateVentilatorUI(); // Update location counts display immediately

            // Show success message
            const successMsg = $('#success-message');
            if (successMsg) {
                successMsg.style.display = 'block'; // Make it visible
                setTimeout(() => {
                    successMsg.style.display = 'none'; // Hide after timeout
                }, 4500); // Match CSS animation duration if using one
            }

            bookingForm.reset(); // Clear form fields

            // Reset form visually to step 1
            $$('.form-step').forEach(s => s.classList.remove('active'));
            $('#step-1')?.classList.add('active'); // Show step 1
            $$('.progress div').forEach((div, index) => { // Reset progress indicator
                div.classList.toggle('active', index === 0);
            });

            // Hide any potentially visible error messages from previous attempts
            $$('#booking-form .error-message').forEach(el => el.style.display = 'none');

            console.log('Booking Confirmed:', { name, email, location, date, duration, notes });
            alert('Booking Confirmed! We’ll reach out to you soon.'); // User feedback

        } else {
            // This case should ideally be caught by validateStep, but is a final safeguard
            showError('availability-error', `Sorry, the last ventilator at ${location} was just booked. Please select another location or check back later.`);
            prevStep(2); // Send user back to step 2 to choose again
            alert('Booking failed: No ventilators available at the selected location.');
        }
    });
} else {
    console.error("Booking form element (#booking-form) not found.");
}


/* Feedback Form Submission */
const feedbackForm = $('#feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = $('#feedbackName');
        const emailInput = $('#feedbackEmail');
        const messageInput = $('#feedbackMessage');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        let valid = true;

        // Validate Name
        if (!name) {
            showError('feedback-name-error', 'Please enter your name.');
            valid = false;
        } else {
            hideError('feedback-name-error');
        }

        // Validate Email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('feedback-email-error', 'Please enter a valid email address.');
            valid = false;
        } else {
            hideError('feedback-email-error');
        }

        // Validate Message
        if (!message) {
            showError('feedback-message-error', 'Please enter your feedback message.');
            valid = false;
        } else {
            hideError('feedback-message-error');
        }

        if (valid) {
            console.log('Feedback Received:', { name, email, message });

            // Display success message
            const successMsg = $('#feedback-success');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 4500); // Match CSS animation if used
            }

            feedbackForm.reset(); // Reset the form fields

             // Hide any potentially visible error messages after success
             hideError('feedback-name-error');
             hideError('feedback-email-error');
             hideError('feedback-message-error');

            alert('Feedback Received – Thank You!'); // User feedback
        }
    });
} else {
    console.error("Feedback form element (#feedback-form) not found.");
}


/* Chat Widget Functionality */
const chatWidget = $('.chat-widget');
const chatInput = $('#chat-input');
const chatBox = $('#chat-box');

function toggleChat() {
    chatWidget?.classList.toggle('active');
    if (chatWidget?.classList.contains('active')) {
        chatInput?.focus(); // Focus input when opening
    }
}

function closeChat() {
    chatWidget?.classList.remove('active');
}

function sendChatMessage() {
    if (!chatInput || !chatBox) return;

    const message = chatInput.value.trim();
    if (!message) return; // Don't send empty messages

    // Display user message
    chatBox.innerHTML += `<div class="chat-message user">${escapeHTML(message)}</div>`; // Sanitize user input
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
    chatInput.value = ''; // Clear input field
    chatInput.focus(); // Keep focus on input

    // Basic Bot Response Logic
    const lowerMessage = message.toLowerCase();
    let botReply = 'I\'m sorry, I can only provide information on basic topics like "Breath Easy", "booking", "locations", "monitor", or "support". Could you rephrase your question?'; // Default response

    // Simple keyword matching (expand as needed)
    const responses = {
        'breath easy': 'Breath Easy is an innovative, low-cost ventilator system with real-time monitoring and booking features, developed at Jyothy Institute of Technology.',
        'jyothy institute': 'Jyothy Institute of Technology is our primary location in Bangalore, offering ventilator services and development.',
        'city clinic': 'City Clinic is one of our partner locations providing ventilator access in urban areas.',
        'rural health center': 'Rural Health Center serves remote areas, ensuring ventilator availability outside the city.',
        'how to book': 'You can book a ventilator using the multi-step form in the "Book" section on this page. Just follow the prompts!',
        'booking': 'To book a ventilator, navigate to the "Book" section, select a location, date, and duration, then provide your contact details.',
        'monitor': 'Visit the "Monitor" section to see simulated real-time patient data (Oxygen, Heart Rate, Blood Pressure). A link to a more detailed external monitor is also available there.',
        'locations': 'Our ventilators are currently available at Jyothy Institute of Technology, City Clinic, and the Rural Health Center. See the "Locations" section for details and a map.',
        'support': 'For technical support or inquiries, please email support@breatheasy-project.com (example) or use the feedback form.',
        'help': 'How can I help you? Ask about Breath Easy, booking, locations, monitoring, or support.',
        'hi': 'Hello! How can I assist you with Breath Easy today?',
        'hello': 'Hi there! What information are you looking for regarding Breath Easy ventilators?',
        'thanks': 'You’re welcome! Feel free to ask if anything else comes up.',
        'thank you': 'You\'re most welcome! Let me know if you need further assistance.',
        'cost': 'Breath Easy aims to be a low-cost solution. For specific pricing or partnership details, please contact us via the feedback form or email support@breatheasy-project.com.',
        'price': 'Breath Easy aims to be a low-cost solution. For specific pricing or partnership details, please contact us via the feedback form or email support@breatheasy-project.com.',
        'ventilator': 'Breath Easy provides affordable ventilators with real-time monitoring and an online booking system.'
        // Add more keywords and responses here
    };

    for (const key in responses) {
        if (lowerMessage.includes(key)) {
            botReply = responses[key];
            break; // Use the first match found
        }
    }

    // Simulate bot thinking time and display reply
    setTimeout(() => {
        chatBox.innerHTML += `<div class="chat-message bot">${escapeHTML(botReply)}</div>`; // Sanitize bot reply too
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
    }, 1000); // 1 second delay
}

// Simple HTML escaping function to prevent XSS in chat
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Add Enter key listener for chat input
if (chatInput) {
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission (if it were in a form)
            sendChatMessage();
        }
    });
}


/* Initialize on Page Load */
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Apply theme first to avoid flash
    initializeVentilatorData();
    checkExpiredBookings(); // Check for expired bookings on load
    updateVentilatorUI();
    updateMonitor(); // Initial monitor values
    setInterval(updateMonitor, 5000); // Update monitor every 5 seconds

    // Set minimum date for booking input dynamically to today
    const today = new Date().toISOString().split('T')[0];
    const bookingDateInput = $('#bookingDate');
    if (bookingDateInput) {
        bookingDateInput.setAttribute('min', today);
    }

    // Add click event listeners to nav links for smooth scrolling
    $$('nav a').forEach(link => {
        // Ensure it's an internal link and not the theme toggle
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && !link.closest('.theme-toggle')) {
             link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = href.slice(1);
                scrollToSection(id);
             });
        }
    });

     // Setup Hamburger Menu Accessibility
    const hamburger = $('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu-items'); // Assuming nav links are grouped
        // Add IDs to nav items if needed for aria-controls
    }

    // Setup Theme Toggle Accessibility
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
         themeToggle.setAttribute('role', 'button');
         // ARIA label is set dynamically in applySavedTheme/toggleDarkMode
    }


    // Scrollspy: Highlight active section in nav on scroll
    const sections = $$('section[id]'); // Select only sections with IDs
    const navLinks = $$('nav a[href^="#"]'); // Select only internal nav links

    window.addEventListener('scroll', debounce(() => {
        let currentSectionId = '';
        const navHeight = window.innerWidth <= 768 ? 48 : 64;
        // Adjust trigger point (e.g., 30% down the viewport + nav height)
        const scrollTriggerPoint = window.pageYOffset + navHeight + window.innerHeight * 0.3;

        sections.forEach(section => {
            // Check if the section is within the trigger area
            if (section.offsetTop <= scrollTriggerPoint && (section.offsetTop + section.offsetHeight) > scrollTriggerPoint) {
                 currentSectionId = section.id;
            }
        });

        // Fallback for top of page
        if (!currentSectionId && window.pageYOffset < window.innerHeight * 0.2) {
            currentSectionId = 'home'; // Default to home if near the top
        }
        // Add fallback for bottom if needed

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }, 100)); // Debounce scroll handler

    // Trigger scroll event once on load to set initial active link
    window.dispatchEvent(new Event('scroll'));
});