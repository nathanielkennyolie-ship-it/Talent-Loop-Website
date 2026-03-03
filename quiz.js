// ================================
// Talent Loop - Assessment Quiz
// ================================

document.addEventListener('DOMContentLoaded', function() {

    // ================================
    // Element Selectors
    // ================================
    const personalInfoForm = document.getElementById('personalInfoForm');
    const contactInfoForm = document.getElementById('contactInfoForm');
    const assessmentIntro = document.getElementById('assessmentIntro');
    const startButton = document.getElementById('startAssessment');
    const assessmentContainer = document.getElementById('assessmentContainer');
    const assessmentComplete = document.getElementById('assessmentComplete');
    const assessmentForm = document.getElementById('assessmentForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const addressInput = document.getElementById('address');
    const addressSuggestions = document.getElementById('addressSuggestions');
    const cityInput = document.getElementById('city');
    const stateSelect = document.getElementById('state');
    const zipCodeInput = document.getElementById('zipCode');
    const countrySelect = document.getElementById('country');

    // Modal Elements
    const optOutModal = document.getElementById('optOutModal');
    const confirmOptInBtn = document.getElementById('confirmOptIn');
    const confirmOptOutBtn = document.getElementById('confirmOptOut');
    const closeModalBtn = document.getElementById('closeModal');

    // ================================
    // State & Constants
    // ================================
    let currentQuestion = 1;
    const totalQuestions = 10;
    const answers = {};
    let contactInfo = {};
    const QUICKEN_URL = 'https://quicken.sjv.io/OemEbP';  // ✅ Updated to Quicken
    const statesByCountry = {
        'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    };

    // ================================
    // INITIALIZATION
    // ================================

    async function initialize() {
        await initializeDropdowns();
        setupEventListeners();
        if (window.location.pathname.includes('assessment.html')) {
            showInitialForm();
        }
    }
    
    function showInitialForm() {
        if(personalInfoForm) personalInfoForm.style.display = 'block';
        if(assessmentIntro) assessmentIntro.style.display = 'none';
        if(assessmentContainer) assessmentContainer.style.display = 'none';
        if(assessmentComplete) assessmentComplete.style.display = 'none';
    }

    // ================================
    // DROPDOWN & ADDRESS LOGIC
    // ================================

    async function initializeDropdowns() {
        if (!countrySelect) return;
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) throw new Error('Country data fetch failed');
            const countries = await response.json();
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            
            countrySelect.innerHTML = '<option value="">Select a Country</option>'; 
            countries.forEach(country => {
                let option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });

            try {
                const ipResponse = await fetch('https://get.geojs.io/v1/ip/country.json');
                if (!ipResponse.ok) throw new Error('IP-based country detection failed');
                const ipData = await ipResponse.json();
                const userCountry = ipData.name;
                if (userCountry && countrySelect.querySelector(`[value="${userCountry}"`)) {
                    countrySelect.value = userCountry;
                }
            } catch (ipError) {
                console.error('IP-based country detection error:', ipError);
                countrySelect.value = 'United States';
            }
            
            populateStates(countrySelect.value);

        } catch (error) {
            console.error('Error initializing dropdowns:', error);
            countrySelect.innerHTML = '<option value="United States">United States</option>';
            populateStates('United States');
        }
    }

    function populateStates(country) {
        if (!stateSelect) return;
        const states = statesByCountry[country];
        stateSelect.innerHTML = '';
        stateSelect.disabled = true;
        if (states) {
            stateSelect.disabled = false;
            let placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Select State/Province';
            stateSelect.appendChild(placeholder);
            states.forEach(state => {
                let opt = document.createElement('option');
                opt.value = state;
                opt.textContent = state;
                stateSelect.appendChild(opt);
            });
        } else {
            let placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'N/A';
            stateSelect.appendChild(placeholder);
        }
    }
    
    async function getRealAddressSuggestions(query) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=us`;
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'TalentLoopApp/1.0' } });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            return data.map(item => {
                const addr = item.address;
                const fullStreet = `${addr.house_number || ''} ${addr.road || ''}`.trim();
                return {
                    street: fullStreet,
                    city: addr.city || addr.town || addr.village || '',
                    state: addr.state || '',
                    postcode: addr.postcode || '',
                    formatted: [fullStreet, addr.city, addr.state, addr.postcode].filter(Boolean).join(', ')
                };
            });
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            return [];
        }
    }

    // ================================
    // EVENT LISTENERS (The Core Logic)
    // ================================
    function setupEventListeners() {
        if (contactInfoForm) {
            contactInfoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(contactInfoForm);
                contactInfo = Object.fromEntries(formData.entries());
                personalInfoForm.style.display = 'none';
                assessmentIntro.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (startButton) {
            startButton.addEventListener('click', function() {
                assessmentIntro.style.display = 'none';
                assessmentContainer.style.display = 'block';
                showQuestion(1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (validateQuestion(currentQuestion)) {
                    showQuestion(currentQuestion + 1);
                } else {
                    alert('Please select an answer.');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                showQuestion(currentQuestion - 1);
            });
        }

        if (assessmentForm) {
            assessmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateQuestion(totalQuestions)) {
                    completeAssessment();
                } else {
                    alert('Please make a selection for the final question.');
                }
            });
        }

        document.querySelectorAll('.option-card input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const questionNumber = parseInt(this.closest('.question-slide').dataset.question, 10);
                const value = this.value;

                answers[`q${questionNumber}`] = value;

                if (questionNumber === totalQuestions && value === 'no-standard') {
                    showModal();
                    return; 
                }

                if (questionNumber < totalQuestions) {
                    setTimeout(() => {
                        showQuestion(currentQuestion + 1);
                    }, 300); 
                }
            });
        });

        if (countrySelect) {
            countrySelect.addEventListener('change', function() {
                populateStates(this.value);
            });
        }

        // Modal event listeners
        if (optOutModal) optOutModal.addEventListener('click', (e) => { if (e.target === optOutModal) hideModal(); });
        if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
        if (confirmOptOutBtn) confirmOptOutBtn.addEventListener('click', () => {
            hideModal();
            completeAssessment();
        });
        if (confirmOptInBtn) confirmOptInBtn.addEventListener('click', () => {
            const yesRadio = document.querySelector('input[name="q10"][value="yes-verify"]');
            if(yesRadio) yesRadio.checked = true;
            answers.q10 = 'yes-verify';
            hideModal();
            completeAssessment();
        });

        if (addressInput) {
            addressInput.addEventListener('input', async function() {
                const query = this.value;
                if (query.length < 3) {
                    if (addressSuggestions) addressSuggestions.style.display = 'none';
                    return;
                }
                const suggestions = await getRealAddressSuggestions(query);
                if (addressSuggestions) {
                    addressSuggestions.innerHTML = suggestions.map(s => 
                        `<div class="suggestion-item" data-address='${JSON.stringify(s)}'>${s.formatted}</div>`
                    ).join('');
                    addressSuggestions.style.display = 'block';
                }
            });

            if (addressSuggestions) {
                addressSuggestions.addEventListener('click', function(e) {
                    if (e.target.matches('.suggestion-item')) {
                        const addr = JSON.parse(e.target.dataset.address);
                        addressInput.value = addr.street;
                        cityInput.value = addr.city;
                        zipCodeInput.value = addr.postcode;
                        if (countrySelect.querySelector('[value="United States"]')) {
                             countrySelect.value = "United States";
                             populateStates("United States");
                             if (stateSelect.querySelector(`[value="${addr.state}"`)) {
                                 stateSelect.value = addr.state;
                             }
                        }
                        addressSuggestions.style.display = 'none';
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (addressSuggestions && !addressInput.contains(e.target)) {
                    addressSuggestions.style.display = 'none';
                }
            });
        }
    }

    // ================================
    // ASSESSMENT FLOW & UI
    // ================================

    function showQuestion(num) {
        currentQuestion = num;
        document.querySelectorAll('.question-slide').forEach(s => s.classList.remove('active'));
        const slide = document.querySelector(`[data-question="${num}"]`);
        if (slide) {
            slide.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (prevBtn) prevBtn.style.display = num === 1 ? 'none' : 'inline-block';
        if (nextBtn) nextBtn.style.display = num === totalQuestions ? 'none' : 'inline-block';
        if (submitBtn) submitBtn.style.display = num === totalQuestions ? 'inline-block' : 'none';
        if (currentQuestionSpan) currentQuestionSpan.textContent = num;
        updateProgress();
    }

    function updateProgress() {
        if (progressFill) progressFill.style.width = ((currentQuestion -1) / (totalQuestions) * 100) + '%';
    }

    function validateQuestion(questionNumber) {
        const slide = document.querySelector(`[data-question="${questionNumber}"]`);
        if (!slide) return false;
        if (answers[`q${questionNumber}`]) return true;
        const radios = slide.querySelectorAll('input[type="radio"]:checked');
        return radios.length > 0;
    }

    function completeAssessment() {
        assessmentContainer.style.display = 'none';
        assessmentComplete.style.display = 'block';
        const msg = document.getElementById('completionMessage');

        localStorage.setItem('talent_loop_assessment', JSON.stringify({
            timestamp: new Date().toISOString(),
            contactInfo: contactInfo,
            answers: answers,
            status: answers.q10 === 'yes-verify' ? 'priority' : 'standard'
        }));

        if (answers.q10 === 'yes-verify') {
            window.open(QUICKEN_URL, '_blank');  // ✅ Now opens Quicken
            msg.innerHTML = `
                <div class="priority-badge">⚡ Priority Status Activated!</div>
                <p style="margin-top: 1.5rem; font-size: 1.2rem;"><strong>Congratulations!</strong> Your profile is in the priority queue.</p>
                <div style="background: #e7f3ff; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Next Steps:</h3>
                    <ol style="text-align: left; margin-left: 1.5rem; line-height: 1.8;">
                        <li>A new window has opened for our trusted partner, <strong>Quicken®</strong>.</li>
                        <li>Complete the simple sign-up to finalize your priority status.</li>
                        <li>Once complete, expect priority matches from our team within <strong>24 hours</strong>.</li>
                    </ol>
                </div>
                <p><strong>Didn't see the window?</strong> 
                <a href="${QUICKEN_URL}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">Click here to continue to Quicken®</a></p>
            `;
        } else {
            msg.innerHTML = `
                <p style="font-size: 1.2rem;"><strong>Thank you for completing the assessment!</strong></p>
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #6c757d;">
                    <h3 style="color: #343a40; margin-bottom: 1rem;">What Happens Next:</h3>
                    <ul style="text-align: left; margin-left: 1.5rem; color: #495057; line-height: 1.8;">
                        <li>Your application is in our standard candidate pool.</li>
                        <li>Our team will review your profile and contact you with any potential matches within <strong>7-10 business days.</strong></li>
                    </ul>
                </div>
            `;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ================================
    // MODAL VISIBILITY
    // ================================

    function showModal() {
        if (optOutModal) optOutModal.classList.add('active');
    }

    function hideModal() {
        if (optOutModal) optOutModal.classList.remove('active');
    }

    // ================================
    // Let's go!
    // ================================
    initialize();

});
