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
    const validationMessage = document.getElementById('validationMessage');
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
    const AMERICANCAREERGUIDE_URL = 'https://www.mz1ay3ch.com/CDCH2K3/DTBLSPG/?source_id=talent-loop&sub1=assessment';

    // N8N Webhook Configuration - DIRECT URL (no CORS proxy)
    const N8N_WEBHOOK_URL = 'https://n8n-production-52b4.up.railway.app/webhook/talent-loop-assessment';

    // ================================
    // EMAILJS INTEGRATION
    // ================================
    let emailjsReady = false;

    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('bxxx6SAVqvCeW_bdO');
            emailjsReady = true;
            return;
        }
        const checkLoaded = () => {
            if (typeof emailjs !== 'undefined') {
                emailjs.init('bxxx6SAVqvCeW_bdO');
                emailjsReady = true;
            } else {
                setTimeout(checkLoaded, 300);
            }
        };
        setTimeout(checkLoaded, 300);
    }

    function waitForEmailJS(timeout) {
        return new Promise(resolve => {
            if (emailjsReady) { resolve(true); return; }
            const start = Date.now();
            const check = () => {
                if (emailjsReady) { resolve(true); return; }
                if (Date.now() - start >= timeout) { resolve(false); return; }
                setTimeout(check, 200);
            };
            setTimeout(check, 200);
        });
    }

    async function sendAssessmentEmails(contact, isPriority) {
        const loaded = await waitForEmailJS(5000);

        const params = {
            to_email:   contact.email      || '',
            first_name: contact.firstName  || 'there',
            last_name:  contact.lastName   || '',
            phone:      contact.phone      || '',
            country:    contact.country    || '',
            status:     isPriority ? 'Priority Verified' : 'Standard',
            email:      contact.email      || ''
        };

        // Email 1 - Immediate (DIRECT to N8N, no CORS proxy)
        try {
            await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...params,
                    template_id: 'template_wzwgl1d',
                    email_type: 'email_1_immediate'
                })
            });
        } catch (err) {
            // Email 1 failed silently
        }

        // Email 2 - Delayed (DIRECT to N8N, no CORS proxy)
        try {
            await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...params,
                    service_id:  'service_indy5vg',
                    template_id: 'template_57x777t',
                    public_key:  'bxxx6SAVqvCeW_bdO',
                    email_type:  'email_2_delayed'
                })
            });
        } catch (err) {
            // Email 2 failed silently
        }
    }

    const statesByCountry = {
        'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'],
        'United Kingdom': ['England', 'Northern Ireland', 'Scotland', 'Wales'],
        'Australia': ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia']
    };

    // ================================
    // INITIALIZATION
    // ================================

    async function initialize() {
        initEmailJS();
        await initializeDropdowns();
        setupEventListeners();
        if (window.location.pathname.includes('assessment')) {
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

    function initializeDropdowns() {
        if (!countrySelect) return;

        const allCountries = [
            "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
            "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
            "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
            "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
            "Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
            "Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)",
            "Congo (Kinshasa)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
            "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
            "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
            "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana",
            "Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti",
            "Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
            "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati",
            "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
            "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia",
            "Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
            "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
            "Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua",
            "Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan",
            "Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
            "Poland","Portugal","Qatar","Romania","Russia","Rwanda",
            "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
            "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia",
            "Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands",
            "Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka",
            "Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
            "Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
            "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine",
            "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
            "Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
        ];

        countrySelect.innerHTML = '<option value="">Select a Country</option>';
        allCountries.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            countrySelect.appendChild(option);
        });

        fetch('https://get.geojs.io/v1/ip/country.json')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                if (data.name && countrySelect.querySelector(`[value="${data.name}"]`)) {
                    countrySelect.value = data.name;
                } else {
                    countrySelect.value = 'United States';
                }
            })
            .catch(() => {
                countrySelect.value = 'United States';
            })
            .finally(() => {
                populateStates(countrySelect.value);
            });
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

    function getCountryCode(countryName) {
        const map = {
            'United States': 'us', 'Canada': 'ca', 'United Kingdom': 'gb', 'Australia': 'au',
            'Nigeria': 'ng', 'Ghana': 'gh', 'Kenya': 'ke', 'South Africa': 'za',
            'India': 'in', 'Philippines': 'ph', 'Germany': 'de', 'France': 'fr',
            'Spain': 'es', 'Italy': 'it', 'Netherlands': 'nl', 'Brazil': 'br',
            'Mexico': 'mx', 'Japan': 'jp', 'China': 'cn', 'Ireland': 'ie'
        };
        return map[countryName] || '';
    }

    async function getRealAddressSuggestions(query) {
        const cc = getCountryCode(countrySelect ? countrySelect.value : '');
        const ccParam = cc ? `&countrycodes=${cc}` : '';
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5${ccParam}`;
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
                    formatted: [fullStreet, addr.city || addr.town || addr.village || '', addr.state, addr.postcode].filter(Boolean).join(', ')
                };
            });
        } catch (error) {
            return [];
        }
    }

    // ================================
    // EVENT LISTENERS
    // ================================
    function setupEventListeners() {
        if (contactInfoForm) {
            contactInfoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(contactInfoForm);
                contactInfo = Object.fromEntries(formData.entries());
                const resumeFile = document.getElementById('resume');
                if (resumeFile && resumeFile.files && resumeFile.files[0]) {
                    contactInfo.resume_filename = resumeFile.files[0].name;
                    contactInfo.resume_size = resumeFile.files[0].size;
                }
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
                    if (validationMessage) validationMessage.style.display = 'none';
                    showQuestion(currentQuestion + 1);
                } else {
                    if (validationMessage) {
                        validationMessage.textContent = 'Please select an answer before proceeding.';
                        validationMessage.style.display = 'block';
                    }
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
                    if (validationMessage) validationMessage.style.display = 'none';
                    completeAssessment();
                } else {
                    if (validationMessage) {
                        validationMessage.textContent = 'Please make a selection for the final question.';
                        validationMessage.style.display = 'block';
                    }
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
                        `<div class="suggestion-item" data-address='${JSON.stringify(s).replace(/'/g, '&#39;')}'>${s.formatted}</div>`
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
                             if (stateSelect.querySelector(`[value="${addr.state}"]`)) {
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
        if (validationMessage) validationMessage.style.display = 'none';
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
        if (progressFill) progressFill.style.width = ((currentQuestion) / (totalQuestions) * 100) + '%';
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

        const isPriority = answers.q10 === 'yes-verify';
        sendAssessmentEmails(contactInfo, isPriority);

        localStorage.setItem('talent_loop_assessment', JSON.stringify({
            timestamp: new Date().toISOString(),
            contactInfo: contactInfo,
            answers: answers,
            status: isPriority ? 'priority' : 'standard'
        }));

        if (isPriority) {
            window.open(AMERICANCAREERGUIDE_URL, '_blank');
            msg.innerHTML = `
                <div class="priority-badge">⚡ Priority Status Activated!</div>
                <p style="margin-top: 1.5rem; font-size: 1.15rem; color: var(--color-text-dark);"><strong>Congratulations!</strong> Your profile is in the priority queue.</p>
                <div style="background: rgba(148,163,184,0.06); padding: 2rem; border-radius: 16px; margin: 2rem 0; border-left: 4px solid var(--color-gold);">
                    <h3 style="color: var(--color-text-dark); margin-bottom: 1rem;">Next Steps:</h3>
                    <ol style="text-align: left; margin-left: 1.5rem; line-height: 1.8; color: var(--color-text-muted);">
                        <li>A new window has opened for <strong>TheAmericanCareerGuide-Super Jobs</strong> — discover top job opportunities matched to your profile.</li>
                        <li>Browse and apply to positions that fit your skills and goals.</li>
                        <li>Once complete, expect priority matches from our team within <strong>24 hours</strong>.</li>
                    </ol>
                </div>
                <p style="color: var(--color-text-muted);"><strong>Didn't see the window?</strong> 
                <a href="${AMERICANCAREERGUIDE_URL}" target="_blank" rel="nofollow sponsored" style="color: var(--color-link); text-decoration: underline;">Click here to open TheAmericanCareerGuide-Super Jobs</a></p>
            `;
        } else {
            msg.innerHTML = `
                <p style="font-size: 1.15rem; color: var(--color-text-dark);"><strong>Thank you for completing the assessment!</strong></p>
                <div style="background: rgba(148,163,184,0.06); padding: 2rem; border-radius: 16px; margin: 2rem 0; border-left: 4px solid var(--color-text-muted-2);">
                    <h3 style="color: var(--color-text-dark); margin-bottom: 1rem;">What Happens Next:</h3>
                    <ul style="text-align: left; margin-left: 1.5rem; color: var(--color-text-muted); line-height: 1.8;">
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
