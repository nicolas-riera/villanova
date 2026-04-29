const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

fetch('../../database/events.json')
    .then(response => response.json())
    .then(data => {
        const event = data.find(e => e.id == eventId);

        if (event) {
            const hero = document.querySelector('.hero-section');
            if (hero) {
                hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${event.image_link}')`;
            }

            const title = document.querySelector('.event-title');
            if (title) title.textContent = event.title;

            const dateElem = document.querySelector('.event-date');
            if (dateElem) {
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                dateElem.textContent = new Date(event.date).toLocaleDateString('fr-FR', dateOptions);
            }

            const eventDate = new Date(event.date);
            const now = new Date();
            if (eventDate < now) {
                hero.style.filter = "grayscale(100%)";
            }

            const infoContainer = document.querySelector('.info-container');
            if (infoContainer) {
                infoContainer.innerHTML = `
                    <section class="event-details">
                        <p class="location"><strong>Lieu :</strong> ${event.location}</p>
                        <p class="description">${event.description}</p>
                    </section>
                `;
            }
        }
    })
    .catch(error => console.error(error));