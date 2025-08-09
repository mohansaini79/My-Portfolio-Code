// Change to your backend address after you run it
const BACKEND_URL = "https://my-portfolio-1qvk.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  // typing effect
  const texts = ["Web Developer","Full Stack Enthusiast","Student Dev"];
  let ti=0,tj=0,deleting=false;
  const typingEl = document.getElementById('typing');
  const cursor = document.querySelector('.cursor');
  function typeLoop(){
    const full = texts[ti];
    typingEl.textContent = full.slice(0,tj);
    if(!deleting && tj < full.length) { tj++; setTimeout(typeLoop,90); }
    else if(deleting && tj > 0) { tj--; setTimeout(typeLoop,40); }
    else { deleting = !deleting; if(!deleting) ti=(ti+1)%texts.length; setTimeout(typeLoop,700); }
  }
  typeLoop();
  setInterval(()=>{ if(cursor) cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0' },600);

  // mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenu');
  const navLinks = document.getElementById('navLinks');
  mobileMenuBtn?.addEventListener('click', ()=> navLinks.classList.toggle('open'));

  // theme toggle
  const themeBtn = document.getElementById('themeToggle');
  themeBtn?.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light-theme');
    themeBtn.textContent = document.documentElement.classList.contains('light-theme') ? '☀' : '🌙';
  });

  // animate skill bars on scroll
  function animateSkills(){
    document.querySelectorAll('.progress span').forEach(span=>{
      const w = span.dataset.width;
      const rect = span.getBoundingClientRect();
      if(rect.top < window.innerHeight - 80) span.style.width = w;
    });
  }
  window.addEventListener('scroll', animateSkills);
  window.addEventListener('load', ()=> { animateSkills(); document.getElementById('year').textContent = new Date().getFullYear(); });

  // project modals
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');
  const modalLive = document.getElementById('modalLive');

  function openModalFromCard(card){
    modalTitle.textContent = card.dataset.title || '';
    modalImage.src = card.dataset.img || '';
    modalImage.alt = card.dataset.title || 'Project image';
    modalDesc.textContent = card.dataset.desc || '';
    modalLive.href = card.dataset.live || '#';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

  projectCards.forEach(card=>{
    card.querySelector('.open-modal')?.addEventListener('click', ()=> openModalFromCard(card));
    card.addEventListener('keydown', (e)=> { if(e.key==='Enter') openModalFromCard(card); });
  });
  modalClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

  // contact form submit -> backend
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.textContent = 'Sending...';
    const payload = {
      name: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      subject: e.target.subject.value.trim(),
      message: e.target.message.value.trim()
    };
    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method:'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      formMsg.style.color = data.success ? '#06f3c6' : '#ff7676';
      formMsg.textContent = data.message;
      if(data.success) form.reset();
    } catch(err) {
      console.error(err);
      formMsg.style.color = '#ff7676';
      formMsg.textContent = 'Error sending message. Try again later.';
    }
  });

  document.getElementById('clearBtn')?.addEventListener('click', ()=> form.reset());
});
