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

// Validate REDG ID FORMAT
function isValidID(ID) {
    const IDRegex = /^\d{10}$/;
    return IDRegex.test(ID);
}

// API integration functions
async function loginAPI(id, password, captcha) {
    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: id,
                password: password,
                captcha: captcha   
            }),
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to connect to server" };
    }
}
async function signupAPI(id, password) {
    try {
        const res = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id, password}),
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

    const ID = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        document.getElementById('loginCaptchaError').textContent = 'Please complete the reCAPTCHA';
        valid = false;
    }

    // Email validation
    if (!ID) {
        document.getElementById('loginEmailError').textContent = 'REGD NO is required';
        valid = false;
    } else if (!isValidID(ID)) {
        document.getElementById('loginEmailError').textContent = 'Please enter a valid registration number';
        valid = false;
    }

    // Password validation
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        valid = false;
    } else if (password.length < 8) {
        document.getElementById('loginPasswordError').textContent = 'Password must be at least 8 characters';
        valid = false;
    }

    if (valid) {
        const response = await loginAPI(ID, password, recaptchaResponse);
        if (response.error) {
            document.getElementById('loginError').textContent = response.error;
        } 
        else if (response.success)
        {
            alert(response.message);
            clearForms();
            grecaptcha.reset();
            sessionStorage.setItem("ID",ID);
            window.location.href = "/user_profile";
        }
        else
        {
            alert(response.message);
            grecaptcha.reset();
        }
    }
}

// Handle Signup
async function handleSignup() {
    clearErrors();
    let valid = true;
    const regNo = document.getElementById('signupId').value.trim();
    const password = document.getElementById('signupPassword').value;
    const rpassword = document.getElementById('signupRPassword').value.trim();

    // Validate reCAPTCHA
    // const recaptchaResponse = grecaptcha.getResponse();
    // console.log(recaptchaResponse)
    // if (!recaptchaResponse) {
    //     document.getElementById('signupCaptchaError').textContent = 'Please complete the reCAPTCHA';
    //     valid = false;
    // }

    // ID validation
    if (!regNo) {
        document.getElementById('signupRegError').textContent = 'Registration number is required';
        valid = false;
    } else if (!isValidID(regNo)) {
        document.getElementById('signupRegError').textContent = 'Please enter a valid registration number';
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

    // Repeat password validation
    if (!rpassword) {
        document.getElementById('signupRPasswordError').textContent = 'You must repeat the password';
        valid = false;
    } else if (rpassword != password) {
        document.getElementById('signupRPasswordError').textContent = 'Please write the matching password';
        valid = false;
    }

    if (valid) {
        const response = await signupAPI(regNo, password);
        if (response.error) {
            document.getElementById('signupError').textContent = response.error;
        } 
        else if (response.success)
        {
            alert(response.message);
            document.querySelector('.tab').click();
            clearForms();
            grecaptcha.reset();
        }
        else
        {
            alert(response.message);
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
