/*
  ╔══════════════════════════════════════════════════════════════╗
  ║                     main.js — Core Logic                     ║
  ║   PURPOSE: Navbar, dark mode, hamburger, back-to-top,        ║
  ║            counter animation, testimonial carousel           ║
  ╚══════════════════════════════════════════════════════════════╝

  WHAT IS JAVASCRIPT?
  → HTML = Structure (bones)
  → CSS  = Style (clothes)
  → JS   = Behaviour (muscles/brain)

  JS makes the page interactive and dynamic.

  HOW JS CONNECTS TO HTML:
  document.getElementById('someId')  → finds <div id="someId">
  document.querySelector('.class')   → finds first element with .class

  HOW JS MODIFIES HTML:
  element.classList.add('newClass')    → adds a CSS class
  element.classList.remove('myClass') → removes a CSS class
  element.classList.toggle('class')   → adds if missing, removes if present

  HOW JS LISTENS TO EVENTS:
  element.addEventListener('eventType', function() {
    // code runs when event happens
  });
  Common events: 'click', 'scroll', 'keydown', 'submit', 'input'
*/

// ═══════════════════════════════════════════════════════
// STEP 1: Wait for HTML to fully load before running JS
// 'DOMContentLoaded' = fires when HTML is ready
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {

  // When this runs, we know ALL HTML elements exist in memory
  console.log('🚀 EdLearn JS loaded!');

  // Initialize all our features:
  initNavbar();
  initHamburger();
  initDarkMode();
  initBackToTop();
  initCarousel();
  initCounterAnimation();
  initRippleEffect();

}); // ← End of DOMContentLoaded


// ═══════════════════════════════════════════════════════
// FEATURE 1: NAVBAR — Scroll Behaviour
// When user scrolls down, navbar gets a shadow/bg change
// ═══════════════════════════════════════════════════════
function initNavbar() {

  // Get the navbar element
  const navbar = document.getElementById('navbar');

  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-link');

  // Listen for scroll events on the whole window
  window.addEventListener('scroll', function() {

    // window.scrollY = how many pixels user has scrolled down
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');    // Add shadow
    } else {
      navbar.classList.remove('scrolled'); // Remove shadow
    }

    // ACTIVE LINK HIGHLIGHTING
    // Find which section is currently visible on screen
    // Then highlight its nav link as "active"
    updateActiveNavLink(navLinks);

  });
}

// Helper: update active nav link based on scroll position
function updateActiveNavLink(navLinks) {

  // Get all section elements that have IDs
  const sections = document.querySelectorAll('section[id]');

  let currentSection = '';

  sections.forEach(function(section) {
    // getBoundingClientRect() returns element's position relative to viewport
    const rect = section.getBoundingClientRect();

    // If section top is within viewport (above halfway point)
    if (rect.top <= 150 && rect.bottom >= 150) {
      currentSection = section.getAttribute('id'); // e.g. "home", "courses"
    }
  });

  // Remove active from all links, add to current one
  navLinks.forEach(function(link) {
    link.classList.remove('active');

    // link.getAttribute('href') = "#courses", "#home", etc.
    // We compare: "#courses" === "#" + "courses" → true
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 2: HAMBURGER MENU (Mobile)
// Clicking ☰ icon shows/hides the nav links on mobile
// ═══════════════════════════════════════════════════════
function initHamburger() {

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // No hamburger element? Exit early (defensive programming)
  if (!hamburger || !navLinks) return;

  // When hamburger is clicked:
  hamburger.addEventListener('click', function() {
    // toggle: adds class if missing, removes if present
    hamburger.classList.toggle('active'); // Animate ☰ → ✕
    navLinks.classList.toggle('open');    // Show/hide menu
  });

  // Close menu when a nav link is clicked
  const allNavLinks = navLinks.querySelectorAll('.nav-link');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', function(event) {
    // event.target = the element that was clicked
    // .contains() checks if click was inside navbar or hamburger
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 3: DARK MODE TOGGLE
// Clicking 🌙/☀️ button switches between dark and light
// We also SAVE the preference in localStorage so it
// persists when the user refreshes the page!
// ═══════════════════════════════════════════════════════
function initDarkMode() {

  const themeToggle = document.getElementById('themeToggle');
  const body        = document.body;

  if (!themeToggle) return;

  // localStorage = browser storage that persists across sessions
  // Check if user previously chose dark mode
  const savedTheme = localStorage.getItem('theme'); // Returns 'dark', 'light', or null

  // Apply saved preference on page load
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  // When toggle button is clicked:
  themeToggle.addEventListener('click', function() {

    // Toggle the dark-mode class on body
    body.classList.toggle('dark-mode');

    // Save the new preference
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');  // Save 'dark'
    } else {
      localStorage.setItem('theme', 'light'); // Save 'light'
    }

    // Add a little rotation animation to the button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(function() {
      themeToggle.style.transform = ''; // Reset after animation
    }, 300);
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 4: BACK TO TOP BUTTON
// Button appears after scrolling 300px, scrolls to top
// ═══════════════════════════════════════════════════════
function initBackToTop() {

  const backBtn = document.getElementById('backToTop');

  if (!backBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backBtn.classList.add('visible');    // Show button
    } else {
      backBtn.classList.remove('visible'); // Hide button
    }
  });

  // Scroll to top when clicked
  backBtn.addEventListener('click', function() {
    // scrollTo with behavior: 'smooth' = animated scroll
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 5: TESTIMONIAL CAROUSEL
// Auto-rotates through testimonial cards
// User can also click dots to switch
// ═══════════════════════════════════════════════════════
function initCarousel() {

  const track      = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !dotsContainer) return;

  // Get all testimonial cards
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;

  let currentIndex = 0; // Which card is currently showing

  // CREATE DOTS dynamically using JS
  // (We don't hardcode dots in HTML — JS creates them based on number of cards)
  cards.forEach(function(_, index) {
    // '_' means we don't need the card itself, just the index number

    const dot = document.createElement('div'); // Create a new <div>
    dot.className = 'dot';                      // Give it the CSS class

    // Mark first dot as active
    if (index === 0) dot.classList.add('active');

    // Click a dot → go to that card
    dot.addEventListener('click', function() {
      goToSlide(index);
    });

    dotsContainer.appendChild(dot); // Add dot to the DOM
  });

  // FUNCTION: Move to a specific slide
  function goToSlide(index) {
    currentIndex = index;

    // Move the track: slide 0 = 0%, slide 1 = -100%, slide 2 = -200%
    // translateX(-100%) moves the whole row left by one card width
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots: remove active from all, add to current
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentIndex); // add if i===current, else remove
    });
  }

  // AUTO-ADVANCE every 4 seconds
  // setInterval(function, milliseconds) = runs repeatedly
  const autoPlay = setInterval(function() {
    // Go to next, or wrap back to 0
    const nextIndex = (currentIndex + 1) % total; // % = modulo (wraps around)
    goToSlide(nextIndex);
  }, 4000); // 4000ms = 4 seconds

  // PAUSE auto-play when user hovers over carousel
  track.addEventListener('mouseenter', function() {
    clearInterval(autoPlay); // Stop auto-advance
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 6: COUNTER ANIMATION
// Numbers count up from 0 to their target value
// e.g., 0 → 5000 with smooth animation
// ═══════════════════════════════════════════════════════
function initCounterAnimation() {

  // Find all elements with data-target attribute
  // data-* attributes store custom data in HTML: <span data-target="5000">
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (counters.length === 0) return;

  let started = false; // Track if animation has started

  // Only start counting when stats come into view
  function startCounting() {
    if (started) return; // Don't run twice

    // Check if hero section is visible
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    // If hero section is visible in viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      started = true;

      counters.forEach(function(counter) {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        // parseInt('5000', 10) → converts string "5000" to number 5000
        // 10 = base 10 (decimal)

        const duration = 2000; // 2 seconds total
        const steps    = 60;   // 60 steps
        const stepValue = target / steps;
        let current = 0;

        // setInterval: run a function every X milliseconds
        const timer = setInterval(function() {
          current += stepValue;

          if (current >= target) {
            current = target;
            clearInterval(timer); // Stop when we reach target
          }

          // Math.floor rounds DOWN to nearest integer
          counter.textContent = Math.floor(current).toLocaleString('en-IN');
          // toLocaleString('en-IN') formats: 5000 → "5,000" (Indian format)

        }, duration / steps); // Interval = 2000ms / 60 steps ≈ 33ms
      });
    }
  }

  window.addEventListener('scroll', startCounting);
  startCounting(); // Also try immediately on page load
}


// ═══════════════════════════════════════════════════════
// FEATURE 7: RIPPLE EFFECT on buttons
// When any button is clicked, a ripple animation plays
// ═══════════════════════════════════════════════════════
function initRippleEffect() {

  // Select all buttons and anchor links with btn class
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      // event = the click event object
      // event.clientX/Y = mouse position when clicked

      // Create a ripple element
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';

      // Position ripple where click happened
      const rect = button.getBoundingClientRect();
      // getBoundingClientRect = returns element's position on screen

      const x = event.clientX - rect.left - 5; // 5 = half of ripple width (10px)
      const y = event.clientY - rect.top - 5;

      ripple.style.left = x + 'px';
      ripple.style.top  = y + 'px';

      button.appendChild(ripple); // Add ripple to button

      // Remove ripple after animation ends (0.6s)
      setTimeout(function() {
        ripple.remove(); // Remove from DOM
      }, 600);
    });
  });
}


// ═══════════════════════════════════════════════════════
// SMOOTH SCROLL for nav links
// Clicking "Courses" smoothly scrolls to #courses section
// ═══════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  // href^="#" = selects all links whose href STARTS WITH "#"

  link.addEventListener('click', function(event) {
    const href = link.getAttribute('href'); // e.g., "#courses"

    // Only handle internal links (not plain "#")
    if (href === '#') return;

    const targetId = href.substring(1); // Remove "#": "courses"
    const target   = document.getElementById(targetId);

    if (target) {
      event.preventDefault(); // Stop default instant-jump behaviour

      const navHeight = document.getElementById('navbar').offsetHeight;
      // offsetHeight = height of element in pixels

      const targetPos = target.getBoundingClientRect().top
                        + window.scrollY
                        - navHeight
                        - 20; // Extra 20px padding

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});


// ═══════════════════════════════════════════════════════
// SMOOTH Swapping of slide
// ═══════════════════════════════════════════════════════

  let current = 0;

  function showSlide(index) {
    const track = document.getElementById('testimonialTrack');
    track.style.transform = "translateX(-" + (index * 100) + "%)";
  }

  // Auto-swap every 5 seconds
  setInterval(function() {
    current = current + 1;

    // Reset to 0 after last slide
    if (current >= 4) {
      current = 0;
    }

    showSlide(current);
  }, 5000);
  
