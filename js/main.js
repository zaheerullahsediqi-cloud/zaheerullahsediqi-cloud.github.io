// ---- Load each section file into its placeholder ----
// To edit a section's content, open its file directly in /sections/ —
// you don't need to touch this file for content changes.

const sections = [
  { file: 'sections/nav.html',           target: 'nav-placeholder' },
  { file: 'sections/hero.html',          target: 'hero-placeholder' },
  { file: 'sections/about.html',         target: 'about-placeholder' },
  { file: 'sections/capabilities.html',  target: 'capabilities-placeholder' },
  { file: 'sections/certifications.html',target: 'certifications-placeholder' },
  { file: 'sections/why.html',           target: 'why-placeholder' },
  { file: 'sections/contact.html',       target: 'contact-placeholder' },
  { file: 'sections/footer.html',        target: 'footer-placeholder' }
];

async function loadSections(){
  await Promise.all(sections.map(async (s) => {
    try{
      const res = await fetch(s.file);
      const html = await res.text();
      document.getElementById(s.target).innerHTML = html;
    }catch(err){
      console.error('Could not load ' + s.file, err);
      document.getElementById(s.target).innerHTML =
        '<p style="padding:20px;color:red;">Could not load ' + s.file + '</p>';
    }
  }));

  // Once the contact section (which contains the form) is loaded, wire it up
  initRfqForm();
}

// ---- EmailJS setup ----
// 1. Create a free account at https://www.emailjs.com
// 2. Add your Gmail as an "Email Service" -> copy the Service ID
// 3. Create an Email Template -> copy the Template ID
//    (Template should use {{from_name}}, {{org}}, {{reply_to}}, {{phone}}, {{message}}, {{to_email}})
// 4. Copy your Public Key from Account > General
// 5. Paste all three values into the placeholders below

const EMAILJS_PUBLIC_KEY = 'bjwPBjmQ5xTYB8VUj';
const EMAILJS_SERVICE_ID = 'service_e9ixd4c';
const EMAILJS_TEMPLATE_ID = 'template_0dwv0wa';

function initRfqForm(){
  if (typeof emailjs !== 'undefined'){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const rfqForm = document.getElementById('rfq-form');
  const rfqStatus = document.getElementById('rfq-status');
  const rfqSubmit = document.getElementById('rfq-submit');

  if (!rfqForm) return;

  rfqForm.addEventListener('submit', function(e){
    e.preventDefault();

    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
      rfqStatus.textContent = 'Form not connected yet — add your EmailJS keys in js/main.js.';
      rfqStatus.className = 'rfq-status err';
      return;
    }

    rfqSubmit.disabled = true;
    rfqSubmit.textContent = 'Sending...';
    rfqStatus.textContent = '';
    rfqStatus.className = 'rfq-status';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, rfqForm)
      .then(function(){
        rfqStatus.textContent = 'Request sent — we\'ll follow up shortly.';
        rfqStatus.className = 'rfq-status ok';
        rfqForm.reset();
      })
      .catch(function(err){
        rfqStatus.textContent = 'Something went wrong. Please try again or email us directly.';
        rfqStatus.className = 'rfq-status err';
      })
      .finally(function(){
        rfqSubmit.disabled = false;
        rfqSubmit.textContent = 'Send Request';
      });
  });
}

loadSections();
