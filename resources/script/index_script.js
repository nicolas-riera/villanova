let allEvents = [];

async function loadEvents() {
    const PUBLIC_KEY = '534084e507ba4b508d43d3a2c176d4a0';
    const AGENDA_ID = '6875632';
    
    let url = `https://corsproxy.io/?https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events`;
    
    try {
        let allFetchedEvents = [];
        let hasMore = true;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'key': PUBLIC_KEY }
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();
        allFetchedEvents = allFetchedEvents.concat(data.events);
    
        allEvents = allFetchedEvents;
        displayEvents(allEvents);

    } catch (error) {
        console.error("Erreur de récupération :", error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = `<p>Erreur lors du chargement des événements.</p>`;
        }
    }
}

function displayEvents(eventsToDisplay) {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = "";
    const now = new Date();

    const sorted = [...eventsToDisplay].sort((a, b) => 
        new Date(a.firstTiming.begin) - new Date(b.firstTiming.begin)
    );

    const upcoming = sorted.filter(e => new Date(e.lastTiming.end) >= now);
    const past = sorted.filter(e => new Date(e.lastTiming.end) < now).reverse(); 
    
    const finalEvents = [...upcoming, ...past];

    if (finalEvents.length === 0) {
        container.innerHTML = `<div class="error-container"><p class="error-text">Aucun résultat.</p></div>`;
        return;
    } 

    finalEvents.forEach(event => {
        const eventCard = document.createElement('article');
        
        const startDate = new Date(event.firstTiming.begin);
        const endDate = new Date(event.lastTiming.end);
        const isPast = endDate < now;

        const imageUrl = event.image 
            ? `${event.image.base}${event.image.filename}` 
            : 'placeholder.jpg';

        eventCard.className = `event-card ${isPast ? 'event-past' : ''}`;

        const formattedDate = startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        eventCard.innerHTML = `
            <div class="event-image-container">
                <img loading="lazy" src="${imageUrl}" alt="${event.title.fr}" class="event-image">
            </div>
            <div class="event-details">
                <div class="event-info-text">
                    <h3 class="event-name">${event.title.fr}</h3>
                    <p class="event-date">${formattedDate} à ${formattedTime}</p>
                    <p class="event-location">${event.location.name} (${event.location.city})</p>
                </div>
                <a href="event.html?id=${event.uid}" class="info-button">${isPast ? 'Détails' : "Plus d'infos"}</a>
            </div>
        `;
        container.appendChild(eventCard);
    });
}

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allEvents.filter(event => {
            const titleMatch = event.title.fr.toLowerCase().includes(term);
            const locationMatch = event.location.name.toLowerCase().includes(term) || 
                                 event.location.city.toLowerCase().includes(term);
            return titleMatch || locationMatch;
        });
        displayEvents(filtered);
    });
}

loadEvents();