// Get form elements
const form = document.getElementById('paymentForm');
const cardNumberInput = document.getElementById('cardNumber');
const cvvInput = document.getElementById('cvv');
const zipCodeInput = document.getElementById('zipCode');

// Format credit card number with dashes
cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join('-') || value;
    e.target.value = formattedValue;
});

// Restrict CVV to numbers only
cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Restrict Zip Code to numbers and spaces only
zipCodeInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9\s]/g, '');
});

// Form validation and submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Remove any existing error classes
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    
    // Validate all required fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        email.classList.add('error');
        isValid = false;
    }
    
    // Validate card number (should have 16 digits)
    const cardNumber = cardNumberInput.value.replace(/-/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        cardNumberInput.classList.add('error');
        isValid = false;
    }
    
    // Validate CVV (should be 3 or 4 digits)
    if (cvvInput.value.length < 3 || cvvInput.value.length > 4) {
        cvvInput.classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        // Create success message
        let successMessage = document.querySelector('.success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            form.insertBefore(successMessage, form.firstChild);
        }
        
        successMessage.textContent = 'Payment processed successfully! Thank you for your purchase.';
        successMessage.classList.add('show');
        
        // Reset form after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            form.reset();
        }, 3000);
    } else {
        // Show error message
        alert('Please fill in all required fields correctly.');
    }
});

// Real-time validation feedback
const allInputs = form.querySelectorAll('input');
allInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim()) {
            this.classList.remove('error');
        }
    });
});

// Prevent form submission on Enter key in input fields (except submit button)
allInputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.click();
        }
    });
});