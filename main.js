// SW.BERNHARDT Legal Assistant Platform - Main JavaScript

// Global Variables
let currentSection = 'home';
let notificationTimeout;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize time display
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize notification system
    initializeNotifications();
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('✅ SW.BERNHARDT Platform initialized successfully');
}

// Navigation Functions
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Handle mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
    }
    
    // Update navigation
    updateNavigation(sectionId);
    
    // Update current section
    currentSection = sectionId;
    
    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`📍 Navigated to section: ${sectionId}`);
}

function updateNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === activeSection) {
            item.classList.add('active');
        }
    });
}

// Time Functions
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('th-TH', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Notification System
function initializeNotifications() {
    const notificationClose = document.getElementById('notificationClose');
    if (notificationClose) {
        notificationClose.addEventListener('click', hideNotification);
    }
}

function showNotification(message, type = 'success', duration = 5000) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    // Clear existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Set message and type
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after duration
    notificationTimeout = setTimeout(() => {
        hideNotification();
    }, duration);
    
    console.log(`📢 Notification: ${message} (${type})`);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
    
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
}

// Tab System for Legal Info
function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target tab content
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    const activeButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    console.log(`📑 Switched to tab: ${tabId}`);
}

// Contact Form Handler
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('กำลังส่งข้อความ...', 'warning', 2000);
    
    setTimeout(() => {
        // Reset form
        form.reset();
        showNotification('ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง', 'success');
        
        console.log('📧 Contact form submitted:', {
            name, email, subject, message
        });
    }, 2000);
}

// Utility Functions
function formatNumber(number) {
    return new Intl.NumberFormat('th-TH').format(number);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(amount);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
    showNotification('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง', 'error');
});

// Performance Monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
});

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + 1-5 for quick navigation
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showSection('home');
                break;
            case '2':
                e.preventDefault();
                showSection('calculator');
                break;
            case '3':
                e.preventDefault();
                showSection('scanner');
                break;
            case '4':
                e.preventDefault();
                showSection('legal-info');
                break;
            case '5':
                e.preventDefault();
                showSection('contact');
                break;
        }
    }
    
    // Escape to close notifications
    if (e.key === 'Escape') {
        hideNotification();
    }
});

// Export functions for global use
window.showSection = showSection;
window.showTab = showTab;
window.submitContactForm = submitContactForm;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;