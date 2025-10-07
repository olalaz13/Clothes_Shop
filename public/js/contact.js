// Initialize navbar functionality for About page
document.addEventListener("DOMContentLoaded", function () {
    // Highlight current page in menu
    const currentPage = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach((item) => {
        if (item.getAttribute("href") === currentPage) {
            item.style.color = "var(--accent)";
            item.style.fontWeight = "600";
        }
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Form Validation
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });

        // Validate First Name
        const firstName = document.getElementById('firstName');
        if (!firstName.value.trim()) {
            showError(firstName, 'firstNameError');
            isValid = false;
        }

        // Validate Last Name
        const lastName = document.getElementById('lastName');
        if (!lastName.value.trim()) {
            showError(lastName, 'lastNameError');
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            showError(email, 'emailError');
            isValid = false;
        }

        // Validate Phone (optional but must be valid if provided)
        const phone = document.getElementById('phone');
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (phone.value.trim() && !phoneRegex.test(phone.value)) {
            showError(phone, 'phoneError');
            isValid = false;
        }

        // Validate Subject
        const subject = document.getElementById('subject');
        if (!subject.value) {
            showError(subject, 'subjectError');
            isValid = false;
        }

        // Validate Message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            showError(message, 'messageError');
            isValid = false;
        }

        if (isValid) {
            // Show loading state
            const submitText = document.getElementById('submitText');
            const submitLoading = document.getElementById('submitLoading');
            submitText.style.display = 'none';
            submitLoading.style.display = 'block';

            // Simulate form submission
            setTimeout(() => {
                successMessage.classList.add('show');
                contactForm.reset();

                submitText.style.display = 'block';
                submitLoading.style.display = 'none';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        }
    });

    function showError(input, errorId) {
        input.classList.add('error');
        document.getElementById(errorId).classList.add('show');
    }

    // Real-time validation
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorId = this.id + 'Error';
                document.getElementById(errorId).classList.remove('show');
            }
        });
    });
});