// Global variables
let currentStep = 1;
const totalSteps = 5;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form
    initializeForm();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Set current date for referral date and signature date
    const today = new Date().toISOString().split('T')[0];
    const referralDateInput = document.getElementById('referral-date');
    const signatureDateInput = document.getElementById('signature-date');
    
    if (referralDateInput) referralDateInput.value = today;
    if (signatureDateInput) signatureDateInput.value = today;
});

// Initialize form functionality
function initializeForm() {
    const form = document.getElementById('referral-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input validation
    addInputValidation();
}

// Show online form
function showOnlineForm() {
    const formContainer = document.getElementById('online-form');
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Download PDF form
function downloadPDF() {
    // Create a simple PDF download link
    // In a real implementation, this would generate a PDF from the original form
    const link = document.createElement('a');
    link.href = '/home/ubuntu/upload/ReferralForm.pdf';
    link.download = 'A_Step_Ahead_Referral_Form.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show message to user
    alert('PDF download initiated. If the download doesn\'t start automatically, please contact us for the form.');
}

// Form step navigation
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormStep();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
    }
}

function updateFormStep() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Previous button
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }
    
    // Next/Submit buttons
    if (currentStep === totalSteps) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'block';
    } else {
        if (nextBtn) nextBtn.style.display = 'block';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

// Form validation
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"].form-step`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Additional validation based on field type
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e0e0e0';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
}

// Add input validation listeners
function addInputValidation() {
    document.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else {
                clearFieldError(this);
                
                if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    showFieldError(this, 'Please enter a valid email address');
                } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
                    showFieldError(this, 'Please enter a valid phone number');
                }
            }
        });
        
        field.addEventListener('input', function() {
            if (this.parentNode.querySelector('.field-error')) {
                clearFieldError(this);
            }
        });
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Collect form data
    const formData = new FormData(e.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in real implementation, this would send to server)
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage();
        
        // Optionally reset form or redirect
        // e.target.reset();
        // currentStep = 1;
        // updateFormStep();
    }, 2000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
        border: 1px solid #c3e6cb;
    `;
    successDiv.innerHTML = `
        <h3>Referral Submitted Successfully!</h3>
        <p>Thank you for your referral. We will review the information and contact you within 2-3 business days.</p>
        <p>Reference ID: REF-${Date.now()}</p>
    `;
    
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(successDiv, formContainer.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Auto-save form data to localStorage (optional feature)
function saveFormData() {
    const form = document.getElementById('referral-form');
    if (form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('referralFormData', JSON.stringify(data));
    }
}

function loadFormData() {
    const savedData = localStorage.getItem('referralFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Save form data on input change
document.addEventListener('input', function(e) {
    if (e.target.closest('#referral-form')) {
        saveFormData();
    }
});

// Load saved data when form is shown
function showOnlineForm() {
    const formContainer = document.getElementById('online-form');
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Load saved data
        setTimeout(loadFormData, 100);
    }
}

// Export functions for global access
window.showOnlineForm = showOnlineForm;
window.downloadPDF = downloadPDF;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.scrollToSection = scrollToSection;

