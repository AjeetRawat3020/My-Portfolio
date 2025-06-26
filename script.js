function toggleMobileMenu() {
    document.getElementById("menu").classList.toggle("active");
}
document.getElementById("year").textContent = new Date().getFullYear();

const contactForm = document.getElementById("js-contact-form");
const statusDiv = document.getElementById("contact-status");
if (contactForm && statusDiv) {
    contactForm.addEventListener("submit", async e => {
        e.preventDefault();
        const btn = contactForm.querySelector("button[type='submit']");
        btn.disabled = true;
        statusDiv.textContent = 'Sending…';
        statusDiv.className = '';

        const params = Object.fromEntries(new FormData(contactForm).entries());

        try {
            // Validation
            if (!params.user_name || !params.user_email || !params.subject || !params.message) {
                throw new Error("All fields are required.");
            }

            // 1) Send to site owner - include both user_email and email for template compatibility
            await emailjs.send("service_ujf9u1t", "template_ev8n3up", {
                user_name: params.user_name,
                user_email: params.user_email,
                email: params.user_email,        // fallback
                subject: params.subject,
                message: params.message
            });

            statusDiv.textContent = '✅ Sent successfully!';
            statusDiv.classList.add('success');
            contactForm.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            if (err.status) console.error('Status:', err.status);
            if (err.text) console.error('Response:', err.text);
            statusDiv.textContent = '❌ Failed to send. Check logs.';
            statusDiv.classList.add('error');
        } finally {
            btn.disabled = false;
            setTimeout(() => { statusDiv.textContent = ''; statusDiv.className = ''; }, 7000);
        }
    });
}