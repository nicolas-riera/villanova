let allEvents = [];

async function loadEvents() {
    try {
        let allFetchedEvents = [];
        const data = await fetchAPI();
        
        allFetchedEvents = allFetchedEvents.concat(data.events || []);
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

    // Event sorting and separation (upcoming and past)
    const now = new Date();

    const sorted = [...eventsToDisplay].sort((a, b) => 
        new Date(a.firstTiming.begin) - new Date(b.firstTiming.begin)
    );

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const upcoming = sorted.filter(e => new Date(e.lastTiming.end) >= now);
    const past = sorted.filter(e => {
        const endDate = new Date(e.lastTiming.end);
        // Ignore events that are 6 months old or older
        return endDate < now && endDate >= sixMonthsAgo;
    }).reverse();
    
    const finalEvents = [...upcoming, ...past];

    // Empty events handling, notably because of search
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
            : '';

        eventCard.className = `event-card ${isPast ? 'event-past' : ''}`;

        const formattedDate = startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        eventCard.innerHTML = `
            <div class="event-image-container">
                ${imageUrl ? `
                    <img loading="lazy" src="${imageUrl}" alt="${event.title.fr}" class="event-image">
                ` : ''}
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

// Search bar handling
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        // Either match with event name or with location
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