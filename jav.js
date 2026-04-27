/**
 * jav.js — ACU CS Achievements Interactive Logic
 *
 * Features:
 *  - Auto-discovers gallery images per event folder
 *  - Thumbnail strip with active state & main image swap
 *  - Lightbox with keyboard navigation
 *  - Expand/collapse card detail sections
 *  - Smooth scroll reveal animations on card entry
 */

/* ═══════════════════════════════════════════════════════════════
   1. IMAGE CONFIGURATION
   — Add actual filenames for each event folder here.
     The paths are relative to index.html.
   ═══════════════════════════════════════════════════════════════ */
const EVENTS = {
  1: {
    folder: 'assets/Automated Virus Classification/',
    // List every image filename in this folder:
    images: [
      'one.png', 'two.png', 'three.png', 'four.png', 
    ],
    altBase: 'مشروع تصنيف الفيروسات – CU-AI NEXUS 2025'
  },
  2: {
    folder: 'assets/تتبع الجنف دون إشعاع/',
    // List every image filename in this folder:
    images: [
         'one.png', 'two.png', 'three.png', 'four.png', 
    ],
    altBase: 'تكريم مشروع تتبع الجنف دون إشعاع'
  },
  3: {
  folder: 'assets/Optical Character Recognition for Ancient Egyptian Hieroglyphs/',
  images: [
    'one.png',
  ],
  altBase: 'OCR Hieroglyphs Research'
},
4: {
  folder: 'assets/Advanced Intelligent Anemia IEEE/',
  images: [
    'one.jpg', 'two.jpg', 'three.jpg'
    
  ],
  altBase: 'Anemia Detection IEEE Research'
},5: {
  folder: 'assets/Advanced Intelligent Anemia IEEE/',
  images: ['one.jpg','two.jpg','four.png','five.png','six.png'

  ],
  altBase: 'AnemoScan UGRF'
},
6: {
  folder: 'assets/Huawei ICT Innovation/',
  images: ['one.jpg'],
  altBase: 'Huawei ICT'
},
7: {
  folder: 'assets/football/',
  images: ['one.png','two.png','three.png'],
  altBase: 'football'
},
8: {
  folder: 'assets/مسابقة المتحف المصري الكبير/',
  images: ['one.png','two.png','three.png','four.png'],
  altBase: 'مسابقة المتحف المصري الكبير'
},
9:
{
  folder: 'assets/دراسة مراجعة علمية حول اكتشاف الأنيم/',
  images: ['one.jpg'],
  altBase: 'دراسة مراجعة علمية حول اكتشاف الأنيم'
},
10:
{
  folder: 'assets/ole of Explainable Artificial Intelligence (XAI)/', 
  images: ['one.jpg'],
  altBase: '  role of Explainable Artificial Intelligence (XAI) '
},11:
{
    folder: 'assets/دمج التراث المصري والسياحة العلاجية والتكنولوجيا في إطار رقمي مستدام/',
    images: ['two.jpg','one.jpg'],
    altBase: 'دمج التراث المصري والسياحة العلاجية والتكنولوجيا في إطار رقمي مستدام'
},
12:
{
  folder: 'assets/IntelliCare/',
    images: ['one.png',],   
    altBase: 'IntelliCare'
},
13:
{
  folder: 'assets/Digital Cultural Framework/',
  images: ['one.jpg',],
  altBase: 'Digital Cultural Framework'
},
14:
{
    folder: 'assets/ECPC/',
    images: ['one.png'],
    altBase: 'ECPC'
},

};

/* ═══════════════════════════════════════════════════════════════
   2. LIGHTBOX STATE
   ═══════════════════════════════════════════════════════════════ */
let currentEventId  = null;
let currentImgIndex = 0;

/* ═══════════════════════════════════════════════════════════════
   3. GALLERY INITIALISATION
   ═══════════════════════════════════════════════════════════════ */
function initGalleries() {
  Object.entries(EVENTS).forEach(([id, evt]) => {
    const thumbsEl = document.getElementById(`thumbs-${id}`);
    const mainImg  = document.querySelector(`#gallery-${id} .gallery-primary-img`);

    if (!thumbsEl || !mainImg || !evt.images.length) return;

    // Set the primary image src (first image)
    mainImg.src = evt.folder + evt.images[0];
    mainImg.alt = `${evt.altBase} – صورة 1`;

    // Build thumbnail strip
    evt.images.forEach((filename, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', `صورة ${i + 1}`);

      const img = document.createElement('img');
      img.src = evt.folder + filename;
      img.alt = `${evt.altBase} – صورة ${i + 1}`;
      img.loading = 'lazy';

      // Error fallback – hide missing images gracefully
      img.onerror = () => { thumb.style.display = 'none'; };

      thumb.appendChild(img);
      thumbsEl.appendChild(thumb);

      // Click: swap main image
      thumb.addEventListener('click', () => switchMainImage(id, i));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') switchMainImage(id, i);
      });
    });

    // Main image click → open lightbox
    mainImg.style.cursor = 'zoom-in';
    mainImg.addEventListener('click', () => openLightbox(Number(id), getCurrentIndex(id)));
  });
}

function switchMainImage(eventId, index) {
  const evt    = EVENTS[eventId];
  const mainImg = document.querySelector(`#gallery-${eventId} .gallery-primary-img`);
  const thumbs  = document.querySelectorAll(`#thumbs-${eventId} .gallery-thumb`);

  if (!mainImg || !evt) return;

  mainImg.src = evt.folder + evt.images[index];
  mainImg.alt = `${evt.altBase} – صورة ${index + 1}`;

  // Update active thumb
  thumbs.forEach((t, i) => t.classList.toggle('active', i === index));

  // Store current index on the gallery element
  const gallery = document.getElementById(`gallery-${eventId}`);
  if (gallery) gallery.dataset.currentIndex = index;
}

function getCurrentIndex(eventId) {
  const gallery = document.getElementById(`gallery-${eventId}`);
  return gallery ? Number(gallery.dataset.currentIndex || 0) : 0;
}

/* ═══════════════════════════════════════════════════════════════
   4. LIGHTBOX
   ═══════════════════════════════════════════════════════════════ */
function openLightbox(eventId, startIndex) {
  currentEventId  = eventId;
  currentImgIndex = startIndex || 0;

  const overlay = document.getElementById('lightbox');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  renderLightboxImage();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  currentEventId  = null;
  currentImgIndex = 0;
}

function lightboxNav(direction) {
  if (!currentEventId) return;
  const images = EVENTS[currentEventId].images;
  currentImgIndex = (currentImgIndex + direction + images.length) % images.length;
  renderLightboxImage();
}

function renderLightboxImage() {
  if (!currentEventId) return;
  const evt = EVENTS[currentEventId];
  const img = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');

  img.src = evt.folder + evt.images[currentImgIndex];
  img.alt = `${evt.altBase} – صورة ${currentImgIndex + 1}`;
  counter.textContent = `${currentImgIndex + 1} / ${evt.images.length}`;

  // Also sync the main gallery image
  switchMainImage(currentEventId, currentImgIndex);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape')       closeLightbox();
  if (e.key === 'ArrowLeft')    lightboxNav(1);   // RTL: left = next
  if (e.key === 'ArrowRight')   lightboxNav(-1);  // RTL: right = prev
});

// Close on backdrop click
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// Expose to HTML onclick attributes
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxNav   = lightboxNav;

/* ═══════════════════════════════════════════════════════════════
   5. EXPAND / COLLAPSE
   ═══════════════════════════════════════════════════════════════ */
function toggleExpand(eventId) {
  const section = document.getElementById(`expand-${eventId}`);
  const btn     = document.querySelector(`[aria-controls="expand-${eventId}"]`);
  if (!section || !btn) return;

  const isOpen = section.classList.contains('open');
  section.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
}

// Expose to HTML onclick attributes
window.toggleExpand = toggleExpand;

/* ═══════════════════════════════════════════════════════════════
   6. SCROLL REVEAL ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const cards = document.querySelectorAll('.achievement-card');

  // Set initial hidden state
  cards.forEach((card) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(32px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((card) => observer.observe(card));
}

/* ═══════════════════════════════════════════════════════════════
   7. BOOT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initGalleries();
  initScrollReveal();
});