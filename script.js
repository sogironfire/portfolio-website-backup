/* ============================================================
   PORTFOLIO — Siam Al Sogir  |  script.js
   Lightweight · Clean · No Dependencies
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ── Cache DOM elements ──────────────────────────────────
    const header = document.getElementById("site-header");
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navOverlay = document.getElementById("nav-overlay");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const form = document.getElementById("contact-form");
    const buttons = document.querySelectorAll(".btn");

    // ── 1. Smooth Scrolling with Page Transition ─────────────
    // Scroll‑progress indicator bar
    const scrollIndicator = document.createElement("div");
    scrollIndicator.className = "scroll-progress-bar";
    document.body.appendChild(scrollIndicator);

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();

                // ── Active link pulse animation
                navLinks.forEach((l) => l.classList.remove("nav-click-active"));
                link.classList.add("nav-click-active");
                setTimeout(() => link.classList.remove("nav-click-active"), 600);

                // ── Page transition overlay
                document.body.classList.add("page-transitioning");

                // ── Animate the scroll progress bar
                scrollIndicator.classList.add("active");

                // Small delay so the transition overlay fades in, then scroll
                setTimeout(() => {
                    const offset = header.offsetHeight + 8;
                    const top = target.getBoundingClientRect().top
                        + window.scrollY - offset;

                    window.scrollTo({ top, behavior: "smooth" });

                    // Remove overlay after scroll completes
                    setTimeout(() => {
                        document.body.classList.remove("page-transitioning");
                        scrollIndicator.classList.remove("active");

                        // Re‑trigger reveal animations for the target section's children
                        const revealChildren = target.querySelectorAll(".reveal");
                        revealChildren.forEach((el, i) => {
                            el.classList.remove("visible");
                            setTimeout(() => el.classList.add("visible"), 80 + i * 100);
                        });

                        // ── Special skill-card entrance animations
                        if (targetId === "#skills") {
                            const skillCards = target.querySelectorAll(".skill-card");
                            const animations = [
                                "skill-enter-flip",
                                "skill-enter-zoom-spin",
                                "skill-enter-drop",
                                "skill-enter-slide-up",
                                "skill-enter-pop"
                            ];
                            skillCards.forEach((card, i) => {
                                // Remove any previous animation class
                                animations.forEach(cls => card.classList.remove(cls));
                                card.classList.remove("skill-animated");

                                // Force reflow
                                void card.offsetWidth;

                                const anim = animations[i % animations.length];
                                setTimeout(() => {
                                    card.classList.add(anim, "skill-animated");
                                }, 120 * i);
                            });
                        }
                    }, 700);
                }, 150);

                closeMobileMenu();
            }
        });
    });

    // ── 2. Mobile Menu Toggle ───────────────────────────────
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        navToggle.setAttribute("aria-expanded", "true");
        navMenu.classList.add("open");
        if (navOverlay) navOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
        if (navOverlay) navOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener("click", closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu.classList.contains("open")) {
            closeMobileMenu();
        }
    });

    // Close when clicking outside the menu
    document.addEventListener("click", (e) => {
        if (
            navMenu.classList.contains("open") &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target) &&
            (!navOverlay || !navOverlay.contains(e.target))
        ) {
            closeMobileMenu();
        }
    });

    // ── 3. Scroll Animations (Intersection Observer) ────────
    const revealTargets = document.querySelectorAll(
        ".section-title, .skill-card, .project-card, .about-grid, " +
        ".about-photo, .about-skill-card, .contact-form, .hero-content, .hero-visual"
    );

    revealTargets.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);

                    // Trigger skill card entrance if it's a skill-card
                    if (entry.target.classList.contains("skill-card")) {
                        const skillAnimations = [
                            "skill-enter-flip",
                            "skill-enter-zoom-spin",
                            "skill-enter-drop",
                            "skill-enter-slide-up",
                            "skill-enter-pop"
                        ];
                        const allCards = Array.from(document.querySelectorAll(".skill-card"));
                        const idx = allCards.indexOf(entry.target);
                        const anim = skillAnimations[idx % skillAnimations.length];
                        entry.target.classList.add(anim, "skill-animated");
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));

    // Stagger cards for a cascade effect
    document.querySelectorAll(".skill-card, .project-card, .about-skill-card").forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.07}s`;
    });

    // ── 4. Button Hover / Press Effects ─────────────────────
    // Only add magnetic effect on non-touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouch) {
        buttons.forEach((btn) => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
            });

            btn.addEventListener("mousedown", () => {
                btn.style.transform = "scale(0.96)";
            });

            btn.addEventListener("mouseup", () => {
                btn.style.transform = "";
            });
        });
    }

    // ── 5. Active Nav Highlight on Scroll ───────────────────
    let scrollTicking = false;

    function updateActiveNav() {
        const scrollY = window.scrollY + header.offsetHeight + 60;

        let currentSection = "";

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollY >= top && scrollY < bottom) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    }

    // ── Header Appearance on Scroll ─────────────────────────
    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > 50);
    }

    // Combine scroll handlers with requestAnimationFrame
    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                updateHeader();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // ── EmailJS Init ───────────────────────────────────
    emailjs.init("UQY5IY2-acvGNSFvM");

    // ── Contact Form Validation & EmailJS Submission ─────
    const formSuccess = document.getElementById("form-success");

    const allowedEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com", "icloud.com"];
    const emailDomainError = document.getElementById("email-domain-error");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const message = form.message.value.trim();

        // Clear previous error states
        form.querySelectorAll("input, textarea").forEach((el) => {
            el.style.borderColor = "";
        });
        emailDomainError.style.display = "none";

        let firstInvalid = null;

        if (!name) {
            markInvalid(form.querySelector("#name"));
            firstInvalid = firstInvalid || form.querySelector("#name");
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            markInvalid(form.querySelector("#email"));
            firstInvalid = firstInvalid || form.querySelector("#email");
        } else {
            const domain = email.split("@")[1];
            if (!allowedEmailDomains.includes(domain)) {
                markInvalid(form.querySelector("#email"));
                emailDomainError.style.display = "block";
                firstInvalid = firstInvalid || form.querySelector("#email");
            }
        }

        if (!message) {
            markInvalid(form.querySelector("#message"));
            firstInvalid = firstInvalid || form.querySelector("#message");
        }

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        // Send via EmailJS
        const btn = form.querySelector(".btn");
        const originalText = btn.textContent;
        btn.textContent = "Sending…";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        emailjs.send("service_ko3z2m5", "template_1a1mlrk", {
            name: name,
            email: email,
            message: message
        })
            .then(() => {
                form.reset();
                form.hidden = true;
                formSuccess.hidden = false;
            })
            .catch(() => {
                btn.textContent = "Failed — Try Again";
                btn.disabled = false;
                btn.style.opacity = "";
            });
    });

    function markInvalid(el) {
        el.style.borderColor = "#ef4444";
        el.addEventListener("input", function handler() {
            el.style.borderColor = "";
            el.removeEventListener("input", handler);
        });
    }

    // ── Kick‑off ────────────────────────────────────────────
    updateHeader();
    updateActiveNav();

    // ── Logo Click — meow + refresh ─────────────────────────
    const logoLink = document.querySelector(".logo");
    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault();
            playMeow();
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }

    function playMeow() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const duration = 1.2;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.4, t);
        master.connect(ctx.destination);

        // Layer 1: Primary "meee-aaaw" voice
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = "sawtooth";
        // "M" onset → "EE" rise → "AA" peak → "OW" fall
        o1.frequency.setValueAtTime(250, t);
        o1.frequency.linearRampToValueAtTime(700, t + 0.12);
        o1.frequency.linearRampToValueAtTime(850, t + 0.3);
        o1.frequency.setValueAtTime(850, t + 0.45);
        o1.frequency.linearRampToValueAtTime(600, t + 0.7);
        o1.frequency.linearRampToValueAtTime(350, t + 1.0);
        o1.frequency.linearRampToValueAtTime(180, t + duration);
        // Envelope
        g1.gain.setValueAtTime(0, t);
        g1.gain.linearRampToValueAtTime(0.22, t + 0.06);
        g1.gain.linearRampToValueAtTime(0.3, t + 0.3);
        g1.gain.setValueAtTime(0.3, t + 0.5);
        g1.gain.linearRampToValueAtTime(0.15, t + 0.85);
        g1.gain.linearRampToValueAtTime(0.001, t + duration);

        // Layer 2: Harmonic overtone for nasal "cat" quality
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = "triangle";
        o2.frequency.setValueAtTime(500, t);
        o2.frequency.linearRampToValueAtTime(1400, t + 0.12);
        o2.frequency.linearRampToValueAtTime(1700, t + 0.3);
        o2.frequency.setValueAtTime(1700, t + 0.45);
        o2.frequency.linearRampToValueAtTime(1200, t + 0.7);
        o2.frequency.linearRampToValueAtTime(700, t + 1.0);
        o2.frequency.linearRampToValueAtTime(360, t + duration);
        g2.gain.setValueAtTime(0, t);
        g2.gain.linearRampToValueAtTime(0.08, t + 0.1);
        g2.gain.linearRampToValueAtTime(0.12, t + 0.35);
        g2.gain.linearRampToValueAtTime(0.04, t + 0.9);
        g2.gain.linearRampToValueAtTime(0.001, t + duration);

        // Layer 3: Breathy noise for realism
        const bufferSize = ctx.sampleRate * duration;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(800, t);
        noiseFilter.frequency.linearRampToValueAtTime(2000, t + 0.3);
        noiseFilter.frequency.linearRampToValueAtTime(1000, t + 0.8);
        noiseFilter.frequency.linearRampToValueAtTime(400, t + duration);
        noiseFilter.Q.value = 3;
        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(0.04, t + 0.08);
        noiseGain.gain.linearRampToValueAtTime(0.02, t + 0.5);
        noiseGain.gain.linearRampToValueAtTime(0.001, t + duration);

        // Layer 4: Vibrato for liveliness
        const vib = ctx.createOscillator();
        const vibGain = ctx.createGain();
        vib.frequency.value = 7;
        vibGain.gain.setValueAtTime(0, t);
        vibGain.gain.linearRampToValueAtTime(15, t + 0.3);
        vibGain.gain.setValueAtTime(15, t + 0.7);
        vibGain.gain.linearRampToValueAtTime(25, t + duration);
        vib.connect(vibGain);
        vibGain.connect(o1.frequency);
        vibGain.connect(o2.frequency);

        // Connect everything
        o1.connect(g1); g1.connect(master);
        o2.connect(g2); g2.connect(master);
        noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(master);

        // Start & stop
        [o1, o2, noise, vib].forEach(n => n.start(t));
        [o1, o2, noise, vib].forEach(n => n.stop(t + duration + 0.05));

        o1.onended = () => ctx.close();
    }

});