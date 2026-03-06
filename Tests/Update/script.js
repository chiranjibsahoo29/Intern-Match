// Switch between login and signup tabs
function switchTab(tab) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Show corresponding form section
    document.getElementById(tab).classList.add('active');
    
    // Clear all errors and form fields
    clearErrors();
    clearForms();
}

// Clear all error messages
function clearErrors() {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    document.querySelectorAll('.success').forEach(e => e.textContent = '');
}

// Clear all form fields
function clearForms() {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// API integration functions
async function loginAPI(email, password) {
    try {
        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to connect to server" };
    }
}

async function signupAPI(email, regNo, password, phone) {
    try {
        const res = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, regNo, password, phone }),
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to connect to server" };
    }
}

// Handle Login
async function handleLogin() {
    clearErrors();
    let valid = true;

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        document.getElementById('loginCaptchaError').textContent = 'Please complete the reCAPTCHA';
        valid = false;
    }

    // Email validation
    if (!email) {
        document.getElementById('loginEmailError').textContent = 'Email is required';
        valid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('loginEmailError').textContent = 'Please enter a valid email address';
        valid = false;
    }

    // Password validation
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        valid = false;
    } else if (password.length < 6) {
        document.getElementById('loginPasswordError').textContent = 'Password must be at least 6 characters';
        valid = false;
    }

    if (valid) {
        const response = await loginAPI(email, password);
        if (response.error) {
            document.getElementById('loginError').textContent = response.error;
        } else {
            alert('Login successful!');
            clearForms();
            grecaptcha.reset();
        }
    }
}

// Handle Signup
async function handleSignup() {
    clearErrors();
    let valid = true;

    const email = document.getElementById('signupEmail').value.trim();
    const regNo = document.getElementById('signupRegNo').value.trim();
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value.trim();

    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        document.getElementById('signupCaptchaError').textContent = 'Please complete the reCAPTCHA';
        valid = false;
    }

    // Email validation
    if (!email) {
        document.getElementById('signupEmailError').textContent = 'Email is required';
        valid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email address';
        valid = false;
    }

    // Registration number validation
    if (!regNo) {
        document.getElementById('signupRegError').textContent = 'Registration number is required';
        valid = false;
    } else if (regNo.length < 3) {
        document.getElementById('signupRegError').textContent = 'Registration number must be at least 3 characters';
        valid = false;
    }

    // Password validation
    if (!password) {
        document.getElementById('signupPasswordError').textContent = 'Password is required';
        valid = false;
    } else if (password.length < 8) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 8 characters';
        valid = false;
    }

    // Phone validation
    if (!phone) {
        document.getElementById('signupPhoneError').textContent = 'Phone number is required';
        valid = false;
    } else if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        document.getElementById('signupPhoneError').textContent = 'Please enter a valid 10-digit phone number';
        valid = false;
    }

    if (valid) {
        const response = await signupAPI(email, regNo, password, phone);
        if (response.error) {
            document.getElementById('signupError').textContent = response.error;
        } else {
            alert('Signup successful!');
            document.querySelector('.tab').click();
            clearForms();
            grecaptcha.reset();
        }
    }
}

// Allow Enter key to submit forms
document.addEventListener('DOMContentLoaded', function() {
    // Login form enter key
    document.getElementById('login').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Signup form enter key
    document.getElementById('signup').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSignup();
        }
    });
});
