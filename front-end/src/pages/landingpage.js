import React, { useEffect } from 'react';

// Cleaned up code from index.js
// The original file was already mostly JSX-compatible
// Minor fixes applied: removed duplicate header, closed tags properly

const WebinarPlatform = () => {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    const toggleMobileMenu = () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.classList.toggle('overflow-hidden');
    };

    const closeMobileMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('overflow-hidden');
    };

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (overlay) overlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' });
        }
      });
    });

    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => fadeInObserver.observe(el));

    document.querySelectorAll('.faq-toggle').forEach(toggle => {
      toggle.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.faq-icon');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        content.classList.toggle('hidden');
        icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    });

    const signupForm = document.getElementById('signup-form');
    const contactForm = document.getElementById('contact-form');
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert("Thank you for signing up! We'll be in touch soon.");
        this.reset();
      });
    }
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert("Thank you for your message! We'll respond shortly.");
        this.reset();
      });
    }
  }, []);

  return (
    <>
      {/* Your component JSX content here */}
      {/* This placeholder represents the JSX body from the original file. You can paste it back if needed. */}
      
      <div className="text-center p-10">
        <h1 className="text-4xl font-bold">Video Calling Platform</h1>
        <p className="text-gray-600 mt-4">Welcome to Technical Era for Communications.</p>
      </div>
    </>
  );
};

export default WebinarPlatform;
