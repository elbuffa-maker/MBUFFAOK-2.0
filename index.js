// Modal Visibility with specific IDs
function toggleModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.toggle('active');

    // Prevent scrolling when modal is open
    if (modal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Particle system - Subtle Rose Glow
const initParticles = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    const count = 35;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            position: absolute;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 2 + 1}px;
            background: #f43f5e;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.2};
            pointer-events: none;
        `;
        container.appendChild(p);

        p.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { transform: `translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px)`, opacity: 0.3 },
            { transform: 'translate(0, 0)', opacity: 0 }
        ], {
            duration: 10000 + Math.random() * 5000,
            iterations: Infinity
        });
    }
};

// Intersection Observer for Reveal & Stats
const setupObserver = () => {
    const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Counter logic
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    let count = 0;
                    const duration = 2000;
                    const step = target / (duration / 16);
                    const update = () => {
                        count += step;
                        if (count < target) {
                            entry.target.innerText = Math.floor(count).toLocaleString();
                            requestAnimationFrame(update);
                        } else {
                            if (target === 14) entry.target.innerText = '+' + target;
                            else if (target >= 10000000) entry.target.innerText = '+10M';
                            else entry.target.innerText = '+' + target.toLocaleString();
                        }
                    };
                    update();
                }
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal, .stat-number').forEach(el => observer.observe(el));
};

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        toggleModal(e.target.id);
    }
});

// Form Handling
const setupForms = () => {
    const forms = ['contact-form', 'collab-form'];

    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Loading state
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success UI
                    form.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <h3 style="color: #f43f5e; margin-bottom: 15px;">¡Mensaje Enviado!</h3>
                            <p style="font-size: 14px; line-height: 1.6;">Muchas gracias por contactarse, nos comunicaremos dentro de las próximas 24 horas. Gracias por confiar en nosotros.</p>
                        </div>
                    `;
                    setTimeout(() => {
                        toggleModal(formId === 'contact-form' ? 'booking-modal' : 'collab-modal');
                    }, 4000);
                } else {
                    throw new Error();
                }
            } catch (error) {
                alert('Hubo un error al enviar el formulario. Por favor, intenta por WhatsApp.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    });
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    setupObserver();
    setupForms();
});
