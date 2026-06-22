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


// Header and Footer injection
const header = document.querySelector('header')
const footer = document.querySelector('footer')

header.innerHTML = `
        <a href=""><img src="resources/img/logo.webp" alt="Logo Villanova"></a>
    `;

footer.innerHTML = `
        <button id="toggleFooterBtn">Nous Contacter</button>
        <section class="contact-section hidden">
            <h3>Contact</h3>
            <form id="contactForm">
                <div class="form-group">
                    <input type="text" id="nom" name="nom" placeholder="Nom" required>
                </div>
                <div class="form-group">
                    <input type="text" id="prenom" name="prenom" placeholder="Prénom" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <textarea id="message" name="message" placeholder="Votre message" required></textarea>
                </div>
                <button type="submit">Envoyer</button>
            </form>
        </section>
        
        <p><span id="year"></span> © <a href="./">VillaNova</a> - Tous droits réservés</p>
    `;

// Contact Form
// Show/hide button
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

// Form submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    console.log(formData);

    alert('Le message a été envoyé. Merci.');
    
    this.reset();
    
    contactSection.classList.toggle('hidden');
    toggleBtn.textContent = 'Nous Contacter';
});

// Copyright date
document.getElementById('year').textContent = new Date().getFullYear();
