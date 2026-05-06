/*
  ╔══════════════════════════════════════════════════════════════╗
  ║               animations.js — Scroll Animations             ║
  ║   PURPOSE: Detect when elements enter the viewport and       ║
  ║            trigger their CSS animation classes               ║
  ╚══════════════════════════════════════════════════════════════╝

  WHAT IS IntersectionObserver?
  → A modern browser API that watches if an element is visible.
  → Much better than the old way (checking scroll position every frame).
  → When element becomes visible → callback function fires.

  SYNTAX:
  const observer = new IntersectionObserver(callbackFunction, options);
  observer.observe(element); // Start watching this element
*/

// ═══════════════════════════════════════════════════════
// SCROLL ANIMATION SETUP
// ═══════════════════════════════════════════════════════

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initParallax();
  initProgressBars();
});


// ═══════════════════════════════════════════════════════
// FEATURE 1: Scroll-triggered animations
// Elements with class .animate-on-scroll start hidden,
// become visible when scrolled into view
// ═══════════════════════════════════════════════════════
function initScrollAnimations() {

  // Find all elements we want to animate on scroll
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

  if (elementsToAnimate.length === 0) return;

  // CREATE AN INTERSECTION OBSERVER
  // This is the modern, efficient way to detect scroll visibility
  const observer = new IntersectionObserver(
    // CALLBACK: runs when element enters or exits viewport
    function(entries) {
      // entries = array of all observed elements that changed
      entries.forEach(function(entry) {
        // entry.isIntersecting = true if element is visible on screen
        if (entry.isIntersecting) {
          // Add .is-visible class → triggers the CSS animation
          entry.target.classList.add('is-visible');

          // IMPORTANT: Once animated, stop observing (don't animate twice)
          observer.unobserve(entry.target);
        }
      });
    },
    // OPTIONS object
    {
      threshold: 0.15,     // Fire when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // -50px bottom margin = trigger slightly before
    }
  );

  // Start observing each element
  elementsToAnimate.forEach(function(element) {
    observer.observe(element);
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 2: PARALLAX EFFECT on Hero shapes
// Background shapes move at different speed than scroll
// Creates a 3D depth illusion
// ═══════════════════════════════════════════════════════
function initParallax() {

  const shapes = document.querySelectorAll('.hero .shape');

  if (shapes.length === 0) return;

  // Listen to scroll events
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY; // How far user has scrolled

    shapes.forEach(function(shape, index) {
      // Different speed multiplier for each shape
      // index 0 → 0.3, index 1 → 0.15, index 2 → 0.25, index 3 → 0.1
      const speeds = [0.3, 0.15, 0.25, 0.1];
      const speed  = speeds[index] || 0.2;

      // Move shape based on scroll (each at different speed)
      // Positive = moves down, Negative = moves up
      const yOffset = scrollY * speed;

      // Apply the transform
      // We combine it with the existing float animation
      shape.style.transform = `translateY(${yOffset}px)`;
    });
  }, { passive: true }); // passive: true = performance optimization for scroll
}


// ═══════════════════════════════════════════════════════
// FEATURE 3: PROGRESS BARS / SKILL BARS
// (Added to "Why Our Approach Works" section dynamically)
// ═══════════════════════════════════════════════════════
function initProgressBars() {

  // This demonstrates how to animate elements with JS
  // We'll look for any element with data-progress attribute
  const progressBars = document.querySelectorAll('[data-progress]');

  if (progressBars.length === 0) return;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const bar      = entry.target;
          const progress = bar.getAttribute('data-progress'); // e.g., "85"

          // Animate the width from 0 to target
          // We use a slight delay so user sees it fill
          setTimeout(function() {
            bar.style.width = progress + '%';
          }, 100);

          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach(function(bar) {
    bar.style.width = '0%'; // Start at 0
    bar.style.transition = 'width 1s ease';
    observer.observe(bar);
  });
}


// ═══════════════════════════════════════════════════════
// FEATURE 4: TYPING ANIMATION
// Makes text appear to be typed out character by character
// Applied to hero title if desired
// ═══════════════════════════════════════════════════════
function typeText(element, text, speed = 80) {
  /*
    PARAMETERS:
    element = the DOM element to type into
    text    = the string to type
    speed   = milliseconds between each character

    This is a recursive function — it calls itself!
  */

  let index = 0; // Current character position

  function typeNextChar() {
    if (index < text.length) {
      // Add one character at a time
      element.textContent += text.charAt(index);
      index++;

      // Call this function again after 'speed' ms
      setTimeout(typeNextChar, speed);
    }
  }

  element.textContent = ''; // Clear existing text
  typeNextChar();            // Start typing
}

// Export for use in other files (not needed for vanilla JS,
// but good practice to show what functions are available)
// In React/Node, you'd use: export { typeText, initScrollAnimations };

