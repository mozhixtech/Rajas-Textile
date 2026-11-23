/**
 * Rajas Textile | ராஜஸ் டெக்ஸ்டைல் - Pavoorchatram
 * Interactive Frontend Controller
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Hero Slider Carousel
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, 5500);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
      startSlideTimer();
    });
  });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideTimer);
    heroSection.addEventListener('mouseleave', startSlideTimer);
  }

  startSlideTimer();

  /* ==========================================================================
     2. Bilingual Tamil & English Switcher
     ========================================================================== */
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = 'en';

  function setLanguage(lang) {
    currentLang = lang;
    langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    const translatableElements = document.querySelectorAll('[data-en]');
    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    showToast(lang === 'ta' ? 'மொழி தமிழுக்கு மாற்றப்பட்டது' : 'Language switched to English');
  }

  langBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const selectedLang = e.currentTarget.getAttribute('data-lang');
      if (selectedLang !== currentLang) {
        setLanguage(selectedLang);
      }
    });
  });

  /* ==========================================================================
     3. Search Drawer & Live Catalog Filter
     ========================================================================== */
  const searchTrigger = document.getElementById('searchTrigger');
  const searchDrawer = document.getElementById('searchDrawer');
  const searchClose = document.getElementById('searchClose');
  const catalogSearchInput = document.getElementById('catalogSearchInput');
  const quickTags = document.querySelectorAll('.quick-tag');
  const catalogCards = document.querySelectorAll('.catalog-card');

  if (searchTrigger && searchDrawer) {
    searchTrigger.addEventListener('click', () => {
      searchDrawer.classList.toggle('open');
      if (searchDrawer.classList.contains('open') && catalogSearchInput) {
        catalogSearchInput.focus();
      }
    });
  }

  if (searchClose && searchDrawer) {
    searchClose.addEventListener('click', () => {
      searchDrawer.classList.remove('open');
    });
  }

  function filterCatalogBySearch(query) {
    const q = query.toLowerCase().trim();
    let visibleCount = 0;

    catalogCards.forEach((card) => {
      const title = card.querySelector('.item-title')?.textContent.toLowerCase() || '';
      const tamilName = card.querySelector('.item-tamil-name')?.textContent.toLowerCase() || '';
      const cat = card.getAttribute('data-category') || '';
      const itemName = card.getAttribute('data-name')?.toLowerCase() || '';

      const match = title.includes(q) || tamilName.includes(q) || cat.includes(q) || itemName.includes(q);
      card.style.display = match ? 'flex' : 'none';
      if (match) visibleCount++;
    });

    if (q.length > 0) {
      // scroll smoothly to catalog
      const catalogSection = document.getElementById('catalog-explorer');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => {
      filterCatalogBySearch(e.target.value);
    });
  }

  quickTags.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      const tagValue = e.currentTarget.getAttribute('data-tag');
      if (catalogSearchInput) {
        catalogSearchInput.value = tagValue;
        filterCatalogBySearch(tagValue);
      }
    });
  });

  /* ==========================================================================
     4. Catalog Filter Tabs (All, Women, Men, Kids, Wedding)
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const category = e.currentTarget.getAttribute('data-category');

      catalogCards.forEach((card) => {
        const cardCats = card.getAttribute('data-category').split(' ');
        if (category === 'all' || cardCats.includes(category)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     5. Multi-Floor Showroom Tour Tabs
     ========================================================================== */
  const floorPills = document.querySelectorAll('.floor-pill');
  const floorPanels = document.querySelectorAll('.floor-panel');

  floorPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      floorPills.forEach((p) => p.classList.remove('active'));
      floorPanels.forEach((panel) => panel.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const floorNum = e.currentTarget.getAttribute('data-floor');
      const targetPanel = document.getElementById(`floorPanel-${floorNum}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     6. Rajas Savings Scheme Calculator ("திவ்யம்" & "ஐஸ்வர்யம்")
     ========================================================================== */
  const amountPills = document.querySelectorAll('.amount-pill');
  const schemeOptions = document.querySelectorAll('.scheme-option');
  const calcUserTotal = document.getElementById('calcUserTotal');
  const calcBonusTotal = document.getElementById('calcBonusTotal');
  const calcGrandTotal = document.getElementById('calcGrandTotal');

  let selectedAmount = 1000;
  let selectedScheme = 'divyam';

  function recalculateScheme() {
    const months = 11;
    const userTotal = selectedAmount * months;
    let bonus = selectedAmount; // 1 month bonus for Divyam

    if (selectedScheme === 'aiswaryam') {
      // 1.2x festive gift benefit
      bonus = Math.round(selectedAmount * 1.2);
    }

    const grandTotal = userTotal + bonus;

    if (calcUserTotal) calcUserTotal.textContent = `₹${userTotal.toLocaleString('en-IN')}`;
    if (calcBonusTotal) calcBonusTotal.textContent = `+ ₹${bonus.toLocaleString('en-IN')}`;
    if (calcGrandTotal) calcGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  amountPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      amountPills.forEach((p) => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      selectedAmount = parseInt(e.currentTarget.getAttribute('data-amount'), 10);
      recalculateScheme();
    });
  });

  schemeOptions.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      schemeOptions.forEach((o) => o.classList.remove('active'));
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      opt.classList.add('active');
      selectedScheme = opt.getAttribute('data-scheme');
      recalculateScheme();
    });
  });

  recalculateScheme();

  /* ==========================================================================
     7. Product Quick View Modal & Rich Catalog Data
     ========================================================================== */
  const productData = {
    1: {
      title: "Royal Kanchipuram Dual-Tone Silk Saree",
      tamilTitle: "காஞ்சிபுரம் தூய பட்டுச் சேலை (ரோஸ் & வயலட்)",
      category: "Women's Bridal Silks",
      image: "video1_files/unnamed(69).webp",
      specs: [
        "Weave: 100% Pure Mulberry Handloom Silk with Silk Mark India",
        "Zari: Authentic Gold Brocade & Korvai Temple Border",
        "Pallu: Heavy Intricate Floral & Peacock Jacquard Pallu",
        "Includes: Unstitched matching pure silk contrast blouse piece",
        "Occasion: Wedding Muhurtham, Grand Receptions & Seemantham"
      ],
      desc: "Woven by generational master weavers of Kanchipuram, this masterpiece exhibits a mesmerizing dual-tone magenta body adorned with pure gold zari buttas and a majestic royal violet contrast border.",
      ref: "RS-W01"
    },
    2: {
      title: "Clarke Gable by Otto - Liverpool Crimson Shirt",
      tamilTitle: "கிளார்க் கேபிள் பை ஓட்டோ பிரீமியம் சட்டை",
      category: "Menswear Executive & Smart",
      image: "video1_files/unnamed(74).webp",
      specs: [
        "Brand: Clarke Gable by OTTO (Authorized Showroom Stock)",
        "Fabric: 100% Super Combed Egyptian Giza Cotton",
        "Fit: Contemporary Tailored Fit with Reinforced Collar",
        "Sizes Available: 38 (M), 40 (L), 42 (XL), 44 (XXL)",
        "Care: Machine Wash Friendly, Long-lasting Luster"
      ],
      desc: "Delivered in a signature presentation box, this Liverpool Crimson formal shirt features ultra-refined stitch detailing, breathable weave, and timeless executive elegance.",
      ref: "RS-M02"
    },
    3: {
      title: "Traditional Pattu Pavadai & Party Frocks",
      tamilTitle: "பாரம்பரிய பட்டு பாவாடை & பார்ட்டி கவுன்",
      category: "Kids & Princess Ethnic",
      image: "video1_files/unnamed(68).webp",
      specs: [
        "Fabric: Soft Silk blend skirt with soft cotton inner lining",
        "Price: Starts from ₹300/- onwards in store",
        "Age Groups: 6 Months to 14 Years available",
        "Safety: Hypoallergenic lining, soft against tender skin",
        "Designs: Rich gold borders, festive tassels and contrast tops"
      ],
      desc: "Make your little girl twirl with grace during festivals, temple visits, and family celebrations. Fully lined with pure cotton for comfort without irritation.",
      ref: "RS-K03"
    },
    4: {
      title: "Gold Zari Wedding Silk Dhoti & Shirt Combo",
      tamilTitle: "தங்க ஜரிகை பட்டு வேஷ்டி & சட்டை செட்",
      category: "Mens Traditional Groom Set",
      image: "img6.webp",
      specs: [
        "Fabric: Pure Silk / Premium Ramraj Minister White options",
        "Zari: Authentic Kasavu Gold Border (Mayilkan & Temple motifs)",
        "Includes: 8 Muzham Dhoti + 4 Muzham Angavastram + Matching Silk Shirt",
        "Showroom Assistance: Live fitting & matching angavastram styling",
        "Occasion: Groom Attire, Tamil New Year, Pongal & Special Poojas"
      ],
      desc: "Complete the traditional South Indian wedding ceremony in utmost majesty with our handpicked bridal dhoti sets from Tamil Nadu's leading brands.",
      ref: "RS-M04"
    },
    5: {
      title: "Boys Jacquard Kurta-Dhoti & Western Suits",
      tamilTitle: "சிறுவர்களுக்கான ஜாக்கார்ட் குர்தா & சூட்கள்",
      category: "Boys Festive Wear",
      image: "video1_files/unnamed(77).webp",
      specs: [
        "Brand: Charles Wear & In-House Festive Designers",
        "Includes: Jacquard Kurta, Velcro Dhoti / Pant & Stole",
        "Ages: 6 Months up to 16 Years",
        "Colors: Royal Blue, Mint Green, Mustard Gold & Maroon",
        "Comfort: Breathable fabric engineered for active young boys"
      ],
      desc: "Celebrate festivals with your young prince looking his dashing best! Comes with convenient pre-stitched Velcro fastening for hassle-free dressing.",
      ref: "RS-K05"
    },
    6: {
      title: "Trending Linen & Cotton Checkered Shirts",
      tamilTitle: "லினன் மற்றும் காட்டன் செக்கர்ஸ் சட்டைகள்",
      category: "Menswear Casuals",
      image: "video1_files/unnamed(81).webp",
      specs: [
        "Brands: Otto, Pan America, Basics Life, Indian Terrain",
        "Fabric: 100% Breathable European Linen and Twill Cotton",
        "Patterns: Classic Madras checks, subtle micro-patterns & solids",
        "Selection: Over 500+ patterns displayed on Floor 2",
        "Price: Complete budget range from daily essentials to luxury"
      ],
      desc: "Our Floor 2 showcases rows upon rows of finely crafted shirts organized by exact chest sizes, ensuring you find your perfect fit in seconds.",
      ref: "RS-M06"
    }
  };

  const quickViewModal = document.getElementById('quickViewModal');
  const closeQuickViewModal = document.getElementById('closeQuickViewModal');
  const quickViewContent = document.getElementById('quickViewContent');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const itemId = e.currentTarget.getAttribute('data-item');
      const item = productData[itemId];

      if (item && quickViewContent) {
        quickViewContent.innerHTML = `
          <div class="quick-view-img-box">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="quick-view-details">
            <span class="item-category">${item.category}</span>
            <h3>${item.title}</h3>
            <p class="quick-view-tamil">${item.tamilTitle}</p>
            <p class="quick-view-desc">${item.desc}</p>
            <ul class="quick-specs-list">
              ${item.specs.map(spec => `<li><i class="fa-solid fa-circle-check text-gold"></i> ${spec}</li>`).join('')}
            </ul>
            <a href="https://wa.me/919944332044?text=${encodeURIComponent(`Hello Rajas Textile, I am inquiring about: ${item.title} (Ref: ${item.ref})`)}" target="_blank" rel="noopener" class="btn btn-gold btn-block">
              <i class="fa-brands fa-whatsapp"></i> Inquire or Order via WhatsApp
            </a>
          </div>
        `;

        if (quickViewModal) {
          quickViewModal.classList.add('open');
        }
      }
    });
  });

  if (closeQuickViewModal && quickViewModal) {
    closeQuickViewModal.addEventListener('click', () => {
      quickViewModal.classList.remove('open');
    });
  }

  /* ==========================================================================
     8. WhatsApp Video Shopping Appointment Modal & Form
     ========================================================================== */
  const appointmentModal = document.getElementById('appointmentModal');
  const closeAppointmentModal = document.getElementById('closeAppointmentModal');
  const openAppointmentBtns = document.querySelectorAll('.open-appointment-modal');
  const videoShoppingForm = document.getElementById('videoShoppingForm');

  openAppointmentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (appointmentModal) {
        appointmentModal.classList.add('open');
      }
    });
  });

  if (closeAppointmentModal && appointmentModal) {
    closeAppointmentModal.addEventListener('click', () => {
      appointmentModal.classList.remove('open');
    });
  }

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
      appointmentModal.classList.remove('open');
    }
    if (e.target === quickViewModal) {
      quickViewModal.classList.remove('open');
    }
  });

  if (videoShoppingForm) {
    videoShoppingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('shopperName')?.value || '';
      const phone = document.getElementById('shopperPhone')?.value || '';
      const category = document.getElementById('shoppingCategory')?.value || '';
      const slot = document.getElementById('preferredTime')?.value || '';

      const waMessage = `Hello Rajas Textile, I would like to book a WhatsApp Video Shopping Session.\n\nName: ${name}\nPhone: ${phone}\nCollection: ${category}\nPreferred Slot: ${slot}\n\nPlease confirm availability. Thank you!`;
      const waUrl = `https://wa.me/919944332044?text=${encodeURIComponent(waMessage)}`;

      showToast('Opening WhatsApp to confirm your appointment...');
      if (appointmentModal) appointmentModal.classList.remove('open');

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }

  /* ==========================================================================
     9. Mobile Hamburger Navigation
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileMenuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close on link click
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* ==========================================================================
     10. Toast Notification Helper
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bell text-gold"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

});
