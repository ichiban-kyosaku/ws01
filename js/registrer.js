// Add this function at the top of your file
function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
}

// Set maximum date to today when page loads
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateOfBirth').setAttribute('max', today);
    
    // Add validation for date of birth
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    dateOfBirthInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        
        if (selectedDate < minDate) {
            this.setCustomValidity('Jaartal incorrect');
        } else if (selectedDate > maxDate) {
            this.setCustomValidity('Geboortedatum kan niet in de toekomst liggen');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Add validation for phone number (digits only)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        const phoneValue = this.value;
        const digitsOnly = /^\d+$/.test(phoneValue);
        
        if (phoneValue && !digitsOnly) {
            this.setCustomValidity('Telefoonnummer mag alleen cijfers bevatten');
        } else {
            this.setCustomValidity('');
        }
    });
});

function submitForm(event) {
    event.preventDefault();
    
    // Check GDPR consent
    const gdprConsent = document.getElementById('gdprConsent').checked;
    if (!gdprConsent) {
        alert('U moet akkoord gaan met de privacyverklaring om door te gaan.');
        return;
    }
    
    // Check form submission timing
    const formTime = parseInt(document.getElementById('form_time').value);
    const currentTime = Date.now();
    const timeElapsed = (currentTime - formTime) / 1000; // Time in seconds
    
    // Too fast submission (less than 10 seconds) - likely a bot
    if (timeElapsed < 10) {
        alert('Het formulier is te snel ingevuld.');
        return;
    }
    
    // Too slow submission (more than 30 minutes) - form might be stale
    if (timeElapsed > 1800) {
        alert('Het formulier is te lang open geweest. Vernieuw de pagina en probeer opnieuw.');
        return;
    }
    
    // Check honeypot field - if filled, likely a bot
    const honeypotValue = document.getElementById('website').value.trim();
    if (honeypotValue !== '') {
        return;
    }
    
    // Get form values and sanitize them
    const firstName = sanitizeInput(document.getElementById('firstName').value);
    const lastName = sanitizeInput(document.getElementById('lastName').value);
    const email = sanitizeInput(document.getElementById('email').value);
    const phone = sanitizeInput(document.getElementById('phone').value);
    const dateOfBirth = sanitizeInput(document.getElementById('dateOfBirth').value);
    const nationality = sanitizeInput(document.getElementById('nationality').value);
    const sex = sanitizeInput(document.getElementById('sex').value);
    const street = sanitizeInput(document.getElementById('street').value);
    const houseNumber = sanitizeInput(document.getElementById('houseNumber').value);
    const postalCode = sanitizeInput(document.getElementById('postalCode').value);
    const city = sanitizeInput(document.getElementById('city').value);
    const remarks = sanitizeInput(document.getElementById('remarks').value);
    
    // Format the email body
    let emailBody = `Nieuwe registratie via website

PERSOONLIJKE GEGEVENS:
────────────────────────
Voornaam: ${firstName}
Naam: ${lastName}
E-mail: ${email}
Telefoon: ${phone}
Geboortedatum: ${dateOfBirth}
Nationaliteit: ${nationality}
Geslacht: ${sex}

ADRES:
──────
Straat: ${street}
Huisnummer: ${houseNumber}
Postcode: ${postalCode}
Gemeente: ${city}

OPMERKINGEN:
────────────
${remarks || 'Geen opmerkingen'}

GDPR TOESTEMMING:
─────────────────
✅ Toestemming gegeven voor verwerking van persoonsgegevens en publicatie van fotomateriaal op de website of social media.
Datum: ${new Date().toLocaleDateString('nl-BE')}


────────────────────────
Dit bericht is automatisch gegenereerd via het registratieformulier op de website.`;

    // Create mailto link with formatted body
    const subject = encodeURIComponent('Nieuwe registratie via website');
    const body = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:info@ichiban-kyosaku.be?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
} 