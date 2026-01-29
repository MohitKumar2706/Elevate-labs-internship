// script.js

const form = document.getElementById('registrationForm');
const usernameEl = document.getElementById('username');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('confirmPassword');

// --- Helper Functions (Refactored Logic) ---

// Check if a value is empty
const isRequired = value => value === '' ? false : true;

// Check length requirements
const isBetween = (length, min, max) => length < min || length > max ? false : true;

// Email Regex Validation
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// Password Strength Regex (at least 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol)
const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

// --- UI Feedback Functions ---

const showError = (input, message) => {
    const formField = input.parentElement;
    // Remove success class first
    input.classList.remove('success');
    input.classList.add('error');
    
    // Show error message
    const error = formField.querySelector('small');
    error.textContent = message;
    formField.classList.remove('success');
    formField.classList.add('error');
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    // Remove error class
    input.classList.remove('error');
    input.classList.add('success');
    
    // Hide error message
    const error = formField.querySelector('small');
    error.textContent = '';
    formField.classList.remove('error');
    formField.classList.add('success');
};

// --- Specific Field Validations ---

const checkUsername = () => {
    let valid = false;
    const min = 3, max = 25;
    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, 'Username cannot be blank.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `Username must be between ${min} and ${max} characters.`);
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.');
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordEl.value.trim();

    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    } else if (!isPasswordSecure(password)) {
        showError(passwordEl, 'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }
    return valid;
};

const checkConfirmPassword = () => {
    let valid = false;
    const confirmPassword = confirmPasswordEl.value.trim();
    const password = passwordEl.value.trim();

    if (!isRequired(confirmPassword)) {
        showError(confirmPasswordEl, 'Please enter the password again.');
    } else if (password !== confirmPassword) {
        showError(confirmPasswordEl, 'The password does not match');
    } else {
        showSuccess(confirmPasswordEl);
        valid = true;
    }
    return valid;
};

// --- Event Listeners ---

// Real-time validation using 'input' event (fires immediately on change)
// Using debounce technique is optional but recommended for heavy validation.
// For simple regex, direct binding is fine.
form.addEventListener('input', function (e) {
    switch (e.target.id) {
        case 'username':
            checkUsername();
            break;
        case 'email':
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;
        case 'confirmPassword':
            checkConfirmPassword();
            break;
    }
});

// Final Submit Validation
form.addEventListener('submit', function (e) {
    // Prevent default submission
    e.preventDefault();

    // Validate forms
    let isUsernameValid = checkUsername(),
        isEmailValid = checkEmail(),
        isPasswordValid = checkPassword(),
        isConfirmPasswordValid = checkConfirmPassword();

    let isFormValid = isUsernameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid;

    // Submit to server if valid
    if (isFormValid) {
        // You would typically use fetch() here to send data to a backend
        alert("Registration Successful!");
        console.log("Form Submitted Successfully");
        form.reset(); // Clear form
        // Remove success styles
        document.querySelectorAll('input').forEach(input => input.classList.remove('success'));
    }
});