/*
  ╔══════════════════════════════════════════════════════════════╗
  ║                form.js — Form Validation Logic               ║
  ║   PURPOSE: Validate the contact form fields and show         ║
  ║            errors/success messages. Prevent bad submissions. ║
  ╚══════════════════════════════════════════════════════════════╝

  WHAT IS FORM VALIDATION?
  → Checking user input BEFORE sending it to a server.
  → Ensures required fields aren't empty.
  → Checks email format (has @ and .)
  → Checks phone number format.
  → Shows friendly error messages instead of browser defaults.

  WHY CLIENT-SIDE VALIDATION?
  → Faster feedback for the user (no server round-trip).
  → Better UX (user experience).
  → NOTE: Always ALSO validate on server side for security!
*/

document.addEventListener('DOMContentLoaded', function() {
  initFormValidation();
});


// ═══════════════════════════════════════════════════════
// MAIN FORM SETUP
// ═══════════════════════════════════════════════════════
function initFormValidation() {

  const form = document.getElementById('contactForm');

  if (!form) return; // Form doesn't exist on this page? Exit.

  // REAL-TIME VALIDATION: validate field as user types
  // This gives instant feedback without waiting for submit

  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  // 'blur' event fires when user LEAVES a field (clicks elsewhere)
  if (nameInput) {
    nameInput.addEventListener('blur', function() {
      validateName(nameInput);
    });
    // Also clear error when user starts typing again
    nameInput.addEventListener('input', function() {
      clearError('name', 'nameError');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      validateEmail(emailInput);
    });
    emailInput.addEventListener('input', function() {
      clearError('email', 'emailError');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
      validatePhone(phoneInput);
    });
    phoneInput.addEventListener('input', function() {
      clearError('phone', 'phoneError');
    });
  }

  // FORM SUBMIT HANDLER
  // This runs when user clicks the submit button
  form.addEventListener('submit', function(event) {
    // event.preventDefault() → STOPS the form from actually submitting
    // This is important so we can validate first
    event.preventDefault();

    // Validate all fields
    const isNameValid  = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPhoneValid = validatePhone(phoneInput);

    // Only proceed if ALL fields are valid
    if (isNameValid && isEmailValid && isPhoneValid) {
      submitForm(form);
    } else {
      // Shake the submit button to indicate error
      const submitBtn = form.querySelector('button[type="submit"]');
      shakeElement(submitBtn);
    }
  });
}


// ═══════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// Each returns true (valid) or false (invalid)
// ═══════════════════════════════════════════════════════

// Validate name: must not be empty, min 2 chars
function validateName(input) {
  const value = input.value.trim(); // .trim() removes spaces from start/end

  if (value === '') {
    showError(input, 'nameError', 'Name is required.');
    return false; // false = invalid
  }
  if (value.length < 2) {
    showError(input, 'nameError', 'Name must be at least 2 characters.');
    return false;
  }
  // Valid!
  showSuccess(input, 'nameError');
  return true;
}

// Validate email: must match pattern user@domain.ext
function validateEmail(input) {
  const value = input.value.trim();

  if (value === '') {
    showError(input, 'emailError', 'Email is required.');
    return false;
  }

  /*
    REGULAR EXPRESSION (regex) — a pattern to test strings
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    Breakdown:
    ^         = start of string
    [^\s@]+   = one or more chars that are NOT space or @
    @         = literal @ symbol
    [^\s@]+   = domain name
    \.        = literal dot (. needs \ because . means "any char" in regex)
    [^\s@]+   = extension (com, in, org, etc.)
    $         = end of string
  */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // .test() → returns true if string matches pattern
  if (!emailPattern.test(value)) {
    showError(input, 'emailError', 'Please enter a valid email (e.g. you@gmail.com).');
    return false;
  }

  showSuccess(input, 'emailError');
  return true;
}

// Validate phone: must be 10 digits (Indian format)
function validatePhone(input) {
  const value = input.value.trim();

  if (value === '') {
    showError(input, 'phoneError', 'Phone number is required.');
    return false;
  }

  // Remove spaces, dashes, plus signs for checking
  // .replace(/[^0-9]/g, '') removes anything that is NOT a digit
  const digitsOnly = value.replace(/[^0-9]/g, '');

  if (digitsOnly.length < 10) {
    showError(input, 'phoneError', 'Phone must have at least 10 digits.');
    return false;
  }
  if (digitsOnly.length > 12) {
    showError(input, 'phoneError', 'Phone number is too long.');
    return false;
  }

  showSuccess(input, 'phoneError');
  return true;
}


// ═══════════════════════════════════════════════════════
// HELPER: Show error message
// ═══════════════════════════════════════════════════════
function showError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);

  // Add .error class to input (red border via CSS)
  input.classList.add('error');
  input.classList.remove('valid');

  // Show the error message text
  if (errorEl) {
    errorEl.textContent = message; // Set the text inside the error span
    errorEl.style.display = 'block';
  }
}

// ═══════════════════════════════════════════════════════
// HELPER: Mark field as valid
// ═══════════════════════════════════════════════════════
function showSuccess(input, errorId) {
  const errorEl = document.getElementById(errorId);

  input.classList.remove('error');
  input.classList.add('valid');

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════
// HELPER: Clear error (while typing)
// ═══════════════════════════════════════════════════════
function clearError(inputId, errorId) {
  const input   = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);

  if (input) input.classList.remove('error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════
// FORM SUBMISSION SIMULATION
// In real project: you'd send data to a server using fetch()
// Here we simulate it with a loading state + success message
// ═══════════════════════════════════════════════════════
function submitForm(form) {

  const submitBtn    = form.querySelector('button[type="submit"]');
  const successMsg   = document.getElementById('formSuccess');
  const originalText = submitBtn.innerHTML; // Save original button text

  // LOADING STATE: show spinner on button
  submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
  submitBtn.disabled  = true; // Prevent multiple clicks

  // Simulate network delay (like sending to a server)
  // setTimeout(function, ms) = run code after a delay
  setTimeout(function() {

    // SUCCESS STATE
    submitBtn.innerHTML = '✅ Message Sent!';
    submitBtn.style.background = 'var(--color-success)';

    // Show success banner
    if (successMsg) {
      successMsg.style.display = 'block';

      // Smooth animation to show success
      successMsg.style.opacity = '0';
      successMsg.style.transform = 'translateY(10px)';
      successMsg.style.transition = 'all 0.4s ease';

      // Force reflow (trick to ensure transition plays)
      successMsg.offsetHeight; // Reading this property forces reflow

      successMsg.style.opacity   = '1';
      successMsg.style.transform = 'translateY(0)';
    }

    // RESET FORM after 3 seconds
    setTimeout(function() {
      form.reset();           // Clear all form fields
      submitBtn.innerHTML     = originalText;
      submitBtn.disabled      = false;
      submitBtn.style.background = '';

      if (successMsg) {
        successMsg.style.display = 'none';
      }

      // Remove validation classes from all inputs
      form.querySelectorAll('input, select, textarea').forEach(function(field) {
        field.classList.remove('valid', 'error');
      });

    }, 3000); // 3 seconds

  }, 1500); // Simulate 1.5s loading time
}

// ═══════════════════════════════════════════════════════
// HELPER: Shake animation (for invalid submit attempt)
// ═══════════════════════════════════════════════════════
function shakeElement(element) {
  if (!element) return;

  // Create shake via CSS animation added temporarily
  element.style.animation = 'shake 0.4s ease';

  // Inject shake keyframes if not already added
  if (!document.getElementById('shakeStyle')) {
    const style = document.createElement('style');
    style.id = 'shakeStyle';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-6px); }
        80%       { transform: translateX(6px); }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove animation after it plays so it can play again next time
  setTimeout(function() {
    element.style.animation = '';
  }, 400);
}

// ═══════════════════════════════════════════════════════
// BONUS: Character counter for message textarea
// Shows "x/300 characters" as user types
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  const messageArea = document.getElementById('message');

  if (!messageArea) return;

  const maxLength = 300;

  // Create counter element
  const counter = document.createElement('span');
  counter.style.cssText = 'display:block; text-align:right; font-size:0.78rem; color:var(--color-text-muted); margin-top:4px;';
  counter.textContent = `0/${maxLength}`;

  // Insert counter after the textarea
  messageArea.parentNode.insertBefore(counter, messageArea.nextSibling);

  // Update counter as user types
  messageArea.addEventListener('input', function() {
    const length = messageArea.value.length;

    // Enforce max length
    if (length > maxLength) {
      messageArea.value = messageArea.value.substring(0, maxLength);
    }

    counter.textContent = `${Math.min(length, maxLength)}/${maxLength}`;

    // Turn red when near limit
    if (length > maxLength * 0.9) {  // > 90% full
      counter.style.color = '#EF4444'; // Red
    } else {
      counter.style.color = 'var(--color-text-muted)'; // Normal
    }
  });
});