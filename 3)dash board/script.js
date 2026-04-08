document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('tilt-card');
    const form = document.getElementById('loan-form');
    const resultContainer = document.getElementById('result-container');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const creditScoreInput = document.getElementById('credit-score');
    const scoreBar = document.getElementById('score-bar');
    const iconEl = document.getElementById('result-icon');

    // --- 3D Tilt Effect Logic ---
    document.addEventListener('mousemove', (e) => {
        // Calculate rotation based on cursor position relative to window center
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        
        // Apply transform. Limit rotation to a reasonable max angle for better readability
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
        card.style.transition = 'transform 0.5s ease';
    });
    
    document.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
    });

    // --- Credit Score Interactive Bar ---
    creditScoreInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        
        // Logic constraint for visual only (HTML min/max handles validation)
        const min = 300;
        const max = 850;
        
        // Calculate percentage (300 = 0%, 850 = 100%)
        let percentage = ((val - min) / (max - min)) * 100;
        
        // Clamp between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));
        
        scoreBar.style.width = `${percentage}%`;
        
        // Color transition
        if (val < 580) {
            scoreBar.style.background = '#ef4444'; // Red
        } else if (val < 670) {
            scoreBar.style.background = '#f59e0b'; // Orange
        } else if (val < 740) {
            scoreBar.style.background = '#10b981'; // Green
        } else {
            scoreBar.style.background = '#9b6dff'; // Purple (Excellent)
        }
    });

    // --- Form Submission & Mock Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // UI Loading State
        submitBtn.classList.add('loading');
        
        // Gather values
        const name = document.getElementById('name').value;
        const income = parseFloat(document.getElementById('income').value);
        const amount = parseFloat(document.getElementById('loan-amount').value);
        const score = parseInt(document.getElementById('credit-score').value);

        // Simulate network delay
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            
            // Eligibility Algorithm (Mock)
            // Rule 1: Credit score must be >= 600
            // Rule 2: Loan amount <= Monthly Income * 10
            let isApproved = false;
            let message = "";

            if (score < 600) {
                isApproved = false;
                message = `Sorry ${name}, your credit score (${score}) is below our minimum requirement of 600.`;
            } else if (amount > (income * 10)) {
                isApproved = false;
                message = `Sorry ${name}, the requested amount ($${amount}) exceeds our limit based on your monthly income.`;
            } else {
                isApproved = true;
                message = `Congratulations ${name}! You are pre-approved for the loan of $${amount}.`;
            }

            // Show Results
            showResult(isApproved, message);

        }, 1500); // 1.5s delay
    });

    function showResult(isApproved, message) {
        // Hide form fields (fade out)
        form.style.display = 'none';
        
        // Populate result data
        const titleEl = document.getElementById('result-title');
        const messageEl = document.getElementById('result-message');
        
        // Reset pop animation
        iconEl.classList.remove('animate-pop');
        void iconEl.offsetWidth; // trigger reflow
        iconEl.classList.add('animate-pop');

        messageEl.textContent = message;

        if (isApproved) {
            titleEl.textContent = "Approved";
            titleEl.className = "success-text";
            iconEl.innerHTML = "✓";
            iconEl.className = "result-icon approved animate-pop";
        } else {
            titleEl.textContent = "Declined";
            titleEl.className = "error-text";
            iconEl.innerHTML = "✕";
            iconEl.className = "result-icon rejected animate-pop";
        }

        // Show result container
        resultContainer.classList.remove('hidden');
    }

    // --- Reset Form ---
    resetBtn.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        
        setTimeout(() => {
            form.reset();
            scoreBar.style.width = '0%';
            form.style.display = 'block';
            card.style.transform = `rotateY(0deg) rotateX(0deg)`; // Reset rotation cleanly
        }, 500); // Wait for fade out
    });
});
