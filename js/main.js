// Main javascript file

(function () {
  // Run after window load so Webflow interactions have initialized
  function init() {
    const section = document.querySelector('section#Experiences.section.split-col');
    if (!section) return;

    // Prevent double-init
    if (section.dataset.wfCarouselInit === '1') return;

    // Collect slides by side based on original structure
    const leftSlides = Array.from(section.querySelectorAll(':scope > .col-left'));
    const rightSlides = Array.from(section.querySelectorAll(':scope > .col-right'));

    if (!leftSlides.length && !rightSlides.length) return;

    // Create container holding two carousels
    const dual = document.createElement('div');
    dual.className = 'wf-dual-container';

    function makeCarousel(sideSlides) {
      const car = document.createElement('div');
      car.className = 'wf-carousel';
      const rail = document.createElement('div');
      rail.className = 'wf-slides';

      sideSlides.forEach((orig) => {
        const wrap = document.createElement('div');
        wrap.className = 'wf-slide';
        // Move the existing node to preserve styles/animations
        wrap.appendChild(orig);
        rail.appendChild(wrap);
      });

      car.appendChild(rail);

      const total = sideSlides.length || 0;
      function setIndex(i) {
        if (!total) return;
        const idx = ((i % total) + total) % total; // safe modulo
        rail.style.transform = 'translateX(' + (-idx * 100) + '%)';
      }

      return { element: car, rail, total, setIndex };
    }

    // Insert the dual container in place of the first original child
    const anchor = section.firstElementChild;
    if (anchor) {
      section.insertBefore(dual, anchor);
    } else {
      section.appendChild(dual);
    }

    // Append the two carousels (left and right). If one side is missing, create an empty rail to keep layout balanced.
    const leftCtrl = makeCarousel(leftSlides);
    const rightCtrl = makeCarousel(rightSlides);
    dual.appendChild(leftCtrl.element);
    dual.appendChild(rightCtrl.element);

    // Single shared navigation that advances both sides in sync
    const maxTotal = Math.max(leftCtrl.total || 0, rightCtrl.total || 0);
    if (maxTotal > 1) {
      const prev = document.createElement('button');
      prev.className = 'wf-nav wf-prev';
      prev.setAttribute('aria-label', 'Previous');
      prev.textContent = '‹';
      const next = document.createElement('button');
      next.className = 'wf-nav wf-next';
      next.setAttribute('aria-label', 'Next');
      next.textContent = '›';
      dual.appendChild(prev);
      dual.appendChild(next);

      let pairIndex = 0;
      function updateBoth() {
        if (leftCtrl.total > 0) leftCtrl.setIndex(pairIndex);
        if (rightCtrl.total > 0) rightCtrl.setIndex(pairIndex);
      }
      prev.addEventListener('click', function (e) {
        e.preventDefault();
        pairIndex = (pairIndex - 1 + maxTotal) % maxTotal;
        updateBoth();
      });
      next.addEventListener('click', function (e) {
        e.preventDefault();
        pairIndex = (pairIndex + 1) % maxTotal;
        updateBoth();
      });

      // initialize transforms
      updateBoth();
    }

    // Remove any leftover original top-level nodes that were not moved (e.g., intro-cover)
    // Keep intro-cover at top if present
    const introCover = section.querySelector(':scope > .intro-cover');
    // Clean-up: remove any stray .col-left/.col-right that were not moved (should be none)
    section.querySelectorAll(':scope > .col-left, :scope > .col-right').forEach((n) => {
      if (n.parentElement === section) {
        // If this occurs, append to the appropriate carousel
        const wrap = document.createElement('div');
        wrap.className = 'wf-slide';
        wrap.appendChild(n);
        // Heuristic: send to left if it has .span-text with M/STONE; otherwise right
        if ((n.textContent || '').toLowerCase().includes('stone') || (n.textContent || '').toLowerCase().includes('music')) {
          leftCar.querySelector('.wf-slides').appendChild(wrap);
        } else {
          rightCar.querySelector('.wf-slides').appendChild(wrap);
        }
      }
    });

    // Ensure the intro cover (logo) stays above and not wrapped
    if (introCover && introCover !== dual.previousElementSibling) {
      section.insertBefore(introCover, dual);
    }

    // Mark as initialized for CSS guards
    section.dataset.wfCarouselInit = '1';
    section.classList.add('wf-initialized');
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('load', function () {
      setTimeout(init, 0);
    });
  }
})();
