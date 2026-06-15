async function loadEventDetails() {
    if (!eventId) return;

    try {
        const data = await fetchAPI(`/${eventId}`);
        const event = data.event; 

        const hero = document.querySelector('.hero-section');
        if (hero && event.image) {
            const imageUrl = `${event.image.base}${event.image.filename}`;
            hero.style.setProperty('--hero-img', `url('${imageUrl}')`);
            
            if (event.lastTiming && new Date(event.lastTiming.end) < new Date()) {
                hero.style.filter = "grayscale(100%)";
            }
        }

        const titleElem = document.querySelector('.event-title');
        if (titleElem) {
            titleElem.textContent = event.title?.fr || "Titre non disponible";
        }

        const dateElem = document.querySelector('.event-date');
        if (dateElem && event.firstTiming) {
            const startDate = new Date(event.firstTiming.begin);
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            dateElem.textContent = startDate.toLocaleDateString('fr-FR', dateOptions);
        }

        const infoContainer = document.querySelector('.info-container');
        if (infoContainer) {
            const locName = event.location?.name || "Lieu non précisé";
            const locAddr = event.location?.address || "";
            const desc = event.longDescription?.fr || event.description?.fr || "Aucune description disponible.";

            infoContainer.innerHTML = `
                <section class="event-details">
                    <p class="location"><strong>Lieu :</strong> ${locName}, ${locAddr}</p>
                    <div class="description">${desc}</div>
                </section>
            `;
        }

    } catch (error) {
        // Debugging error in console
        console.error(error);
        
        // Front error message
        const titleElem = document.querySelector('.event-title');
        if (titleElem) {
            titleElem.textContent = "Quelque chose n'a pas fonctionné...";
        }

        const infoContainer = document.querySelector('.info-container');
        if (infoContainer) {
            infoContainer.innerHTML = `<p>Erreur lors du chargement des détails.</p>`;
        }
    }
}

loadEventDetails();