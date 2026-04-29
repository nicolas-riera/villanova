let allEvents = [];

async function loadEvents() {
    try {
        const response = await fetch('../../database/events.json');
        allEvents = await response.json();

        displayEvents(allEvents);
    } catch (error) {
        console.error("Erreur :", error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <p class="error-text">Erreur avec le serveur, veillez réessayer ultérieurement.</p>
                </div>`;
        }
    }
}

function displayEvents(eventsToDisplay) {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = "";
    const now = new Date();

    const sorted = [...eventsToDisplay].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = sorted.filter(e => new Date(e.date) >= now);
    const past = sorted.filter(e => new Date(e.date) < now);
    const finalEvents = [...upcoming, ...past];

    if (finalEvents.length == 0) {
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <p class="error-text">Aucun résultat.</p>
                </div>`;
        }
    } 

    finalEvents.forEach(event => {
        const eventCard = document.createElement('article');
        const eventDate = new Date(event.date);
        const isPast = eventDate < now;

        eventCard.className = `event-card ${isPast ? 'event-past' : ''}`;

        const formattedDate = eventDate.toLocaleDateString('fr-FR');
        const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        eventCard.innerHTML = `
            <div class="event-image-container">
                <img loading="lazy" src="${event.image_link || 'placeholder.jpg'}" alt="${event.title}" class="event-image">
            </div>
            <div class="event-details">
                <div class="event-info-text">
                    <h3 class="event-name">${event.title}</h3>
                    <p class="event-date">${formattedDate} - ${formattedTime}</p>
                    <p class="event-location" style="font-size: 0.8rem; color: #666;">${event.location || ''}</p>
                </div>
                <a href="event.html?id=${event.id}" class="info-button">${isPast ? 'Détails' : "Plus d'infos"}</a>
            </div>
        `;
        container.appendChild(eventCard);
    });
}

loadEvents();

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        const filtered = allEvents.filter(event => {
            const titleMatch = event.title.toLowerCase().includes(term);
            const locationMatch = (event.location || "").toLowerCase().includes(term);
            return titleMatch || locationMatch;
        });

        displayEvents(filtered);
    });
}


