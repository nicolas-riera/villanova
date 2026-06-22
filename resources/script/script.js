// API fetching
const PUBLIC_KEY = '534084e507ba4b508d43d3a2c176d4a0';
const AGENDA_ID = '6875632';

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

async function fetchAPI(endpoint = '') {
    // OpenAgenda is used as a event database
    const url = `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events${endpoint}?key=${PUBLIC_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
}

// Contact Form
const toggleBtn = document.getElementById('toggleFooterBtn');
const contactSection = document.querySelector('.contact-section');

toggleBtn.addEventListener('click', () => {
    contactSection.classList.toggle('hidden');
    
    if (contactSection.classList.contains('hidden')) {
        toggleBtn.textContent = 'Nous Contacter';
    } else {
        toggleBtn.textContent = 'Masquer';
    }
});
// Copyright date
document.getElementById('year').textContent = new Date().getFullYear();
