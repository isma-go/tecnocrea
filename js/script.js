/**
 * ==========================================================================
 * TECNOCREA - INTERACTIONS & MOTION CONTROLLER
 * Philosophy: Motion communicates, it does not decorate.
 * Features:
 *   1. Optimized Horizontal Scroll Track (rAF synced translation)
 *   2. Active Section Navigation Observer
 *   3. Staggered Process Step Reveal
 *   4. Smooth Anchor Scrolling & Top Return
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* --------------------------------------------------------------------------
       1. HORIZONTAL SCROLL TRACK (Soluciones Section)
       Why rAF? Syncs transform calculations directly to display refresh cycles (60-120fps)
       preventing layout thrashing and jitter during fast scroll events.
       -------------------------------------------------------------------------- */
    const horizontalSection = document.querySelector('.horizontal-scroll');
    const scrollTrack = document.querySelector('.scroll-track');

    if (horizontalSection && scrollTrack) {
        let isTicking = false;

        const updateHorizontalTrack = () => {
            const rect = horizontalSection.getBoundingClientRect();
            const sectionHeight = horizontalSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate progress: 0 when top enters viewport, 1 when section finishes
            const scrollDistance = -rect.top;
            const maxScroll = sectionHeight - viewportHeight;

            if (scrollDistance >= 0 && scrollDistance <= maxScroll) {
                const maxTranslate = scrollTrack.scrollWidth - window.innerWidth + 80;
                const progress = scrollDistance / maxScroll;
                const translateX = progress * Math.max(0, maxTranslate);

                scrollTrack.style.transform = `translateX(-${translateX}px)`;
            } else if (scrollDistance < 0) {
                scrollTrack.style.transform = 'translateX(0px)';
            }

            isTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(updateHorizontalTrack);
                isTicking = true;
            }
        }, { passive: true });

        // Recalculate on window resize
        window.addEventListener('resize', updateHorizontalTrack, { passive: true });
    }

    /* --------------------------------------------------------------------------
       2. ACTIVE NAVIGATION LINK TRACKING
       Uses IntersectionObserver with calibrated rootMargins for robust section detection.
       -------------------------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav__link');
    const observedSections = document.querySelectorAll('section[id], footer[id]');

    if (navLinks.length && observedSections.length) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Target active when section enters upper-middle view
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, observerOptions);

        observedSections.forEach(section => sectionObserver.observe(section));
    }

    /* --------------------------------------------------------------------------
       3. PINNED PROCESS REVEAL (El Proceso Tecnocrea)
       The section holds extra scroll runway while the background image stays
       pinned via CSS `position: sticky`; each white panel rises off the
       bottom edge in sequence as the user keeps scrolling through it.
       -------------------------------------------------------------------------- */
    const processSection = document.querySelector('.process-section');
    const processBoxes = document.querySelectorAll('.process-section .box');

    if (processSection && processBoxes.length) {
        let processTicking = false;

        const updateProcessReveal = () => {
            const sectionTop = processSection.offsetTop;
            const relativeScroll = window.scrollY - sectionTop;
            const viewportHeight = window.innerHeight;

            processBoxes.forEach((box, i) => {
                const revealPoint = viewportHeight * (0.4 + i * 0.5);
                box.classList.toggle('is-visible', relativeScroll > revealPoint);
            });

            processTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!processTicking) {
                window.requestAnimationFrame(updateProcessReveal);
                processTicking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', updateProcessReveal, { passive: true });
        updateProcessReveal();
    }

    /* --------------------------------------------------------------------------
       4. MOBILE MENU (Hamburger Toggle & Full-Screen Overlay)
       Reuses the desktop pill's `.nav__link` class on the overlay links so the
       active-section observer above updates both in lockstep automatically.
       -------------------------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        const closeMobileMenu = () => {
            document.body.classList.remove('mobile-menu-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
        };

        const openMobileMenu = () => {
            document.body.classList.add('mobile-menu-open');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Cerrar menú');
        };

        navToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.contains('mobile-menu-open');
            isOpen ? closeMobileMenu() : openMobileMenu();
        });

        // Closing on link click lets the anchor's smooth scroll play out
        // against the page underneath instead of the menu overlay.
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
                navToggle.focus();
            }
        });
    }

    /* --------------------------------------------------------------------------
       5. SMOOTH SCROLL TO TOP & KEYBOARD ENHANCEMENT
       -------------------------------------------------------------------------- */
    const scrollTopBtn = document.querySelector('.btn-scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});