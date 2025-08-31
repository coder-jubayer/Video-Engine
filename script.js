// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Initialize animations
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .value-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize portfolio functionality
    initializePortfolio();
    
    // Setup infinite slider loop
    setupSlider();
    
    // Initialize contact form
    initializeContactForm();
});

// Portfolio functionality
function initializePortfolio() {
    console.log('Initializing portfolio...');
    
    // Initialize filter buttons
    initializePortfolioFilter();
    
    // Initialize video modal
    initializeVideoModal();
    
    // Setup portfolio videos
    setupPortfolioVideos();
}

// Portfolio Filter Function
function initializePortfolioFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    console.log('Found category tabs:', categoryTabs.length);
    console.log('Found portfolio items:', portfolioItems.length);
    
    if (categoryTabs.length === 0) {
        console.error('No category tabs found!');
        return;
    }
    
    if (portfolioItems.length === 0) {
        console.error('No portfolio items found!');
        return;
    }
    
    // Debug: Log all category tabs
    categoryTabs.forEach((tab, index) => {
        console.log(`Tab ${index}:`, tab.textContent, 'data-category:', tab.getAttribute('data-category'));
    });
    
    // Debug: Log all portfolio items
    portfolioItems.forEach((item, index) => {
        console.log(`Item ${index}:`, 'data-category:', item.getAttribute('data-category'));
    });
    
    // Add click event listeners to category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const category = this.getAttribute('data-category');
            console.log('Category clicked:', category);
            console.log('Button text:', this.textContent);
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(category, portfolioItems);
        });
    });
    
    // Test the filter on page load
    console.log('Testing filter on page load...');
    filterPortfolioItems('all', portfolioItems);
}

// Filter Portfolio Items Function
function filterPortfolioItems(category, portfolioItems) {
    console.log('Filtering for category:', category);
    
    portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        console.log('Checking item:', itemCategory, 'against target:', category);
        
        if (category === 'all' || itemCategory === category) {
            console.log('Showing item:', itemCategory);
            item.classList.remove('hidden');
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.visibility = 'visible';
        } else {
            console.log('Hiding item:', itemCategory);
            item.classList.add('hidden');
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.visibility = 'hidden';
        }
    });
}

// Video Modal Function
function initializeVideoModal() {
    console.log('Initializing video modal...');
    
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalClose = document.getElementById('videoModalClose');
    
    if (!videoModal || !modalVideo || !modalClose) {
        console.error('Video modal elements not found!');
        return;
    }
    
    // Add click event to portfolio items using event delegation
    document.addEventListener('click', function(e) {
        const portfolioItem = e.target.closest('.portfolio-item');
        if (portfolioItem && !portfolioItem.classList.contains('hidden')) {
            const video = portfolioItem.querySelector('video');
            if (video) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Portfolio item clicked, opening video modal...');
                console.log('Original video element:', video);
                console.log('Video src from portfolio:', video.src);
                console.log('Video currentSrc:', video.currentSrc);
                
                // Check if video source is valid
                if (video.src && video.src !== '') {
                    openVideoModal(video.src);
                } else if (video.currentSrc && video.currentSrc !== '') {
                    openVideoModal(video.currentSrc);
                } else {
                    console.error('No valid video source found');
                    showVideoError();
                }
            }
        }
    });
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        closeVideoModal();
    });
    
    // Close modal when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            console.log('Clicked outside modal, closing...');
            closeVideoModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            console.log('Escape key pressed, closing modal...');
            closeVideoModal();
        }
    });
}

// Open Video Modal
function openVideoModal(videoSrc) {
    console.log('Opening video modal with src:', videoSrc);
    
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!videoModal || !modalVideo) {
        console.error('Video modal elements not found!');
        return;
    }
    
    // Find the original video element to determine its type
    const originalVideo = document.querySelector(`video[src="${videoSrc}"]`) || 
                         document.querySelector(`video[currentSrc="${videoSrc}"]`);
    
    let isReelsVideo = false;
    if (originalVideo) {
        const portfolioItem = originalVideo.closest('.portfolio-item');
        const portfolioVideo = portfolioItem.querySelector('.portfolio-video');
        isReelsVideo = portfolioVideo.classList.contains('reels-video');
        console.log('Video type detected:', isReelsVideo ? 'reels (9:16)' : 'long (16:9)');
    }
    
    // Show modal first
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Clear any previous error listeners
    modalVideo.removeEventListener('error', handleVideoError);
    modalVideo.removeEventListener('loadeddata', handleVideoLoaded);
    
    // Set video source and properties
    modalVideo.src = videoSrc;
    modalVideo.muted = false; // Enable sound
    modalVideo.loop = true;
    modalVideo.controls = false;
    modalVideo.autoplay = true;
    
    // Set aspect ratio based on video type
    if (isReelsVideo) {
        modalVideo.style.aspectRatio = '9/16';
        modalVideo.style.maxWidth = '400px';
        modalVideo.style.width = '100%';
    } else {
        modalVideo.style.aspectRatio = '16/9';
        modalVideo.style.maxWidth = '800px';
        modalVideo.style.width = '100%';
    }
    
    console.log('Video properties set:', {
        src: modalVideo.src,
        muted: modalVideo.muted,
        loop: modalVideo.loop,
        autoplay: modalVideo.autoplay,
        aspectRatio: modalVideo.style.aspectRatio,
        maxWidth: modalVideo.style.maxWidth
    });
    
    // Add error handling
    modalVideo.addEventListener('error', handleVideoError);
    
    // Wait for video to load then play
    modalVideo.addEventListener('loadeddata', handleVideoLoaded, { once: true });
    
    // If video is already loaded, play immediately
    if (modalVideo.readyState >= 2) {
        console.log('Video already loaded, playing immediately...');
        handleVideoLoaded();
    }
}

// Handle video loaded event
function handleVideoLoaded() {
    const modalVideo = document.getElementById('modalVideo');
    console.log('Video loaded, attempting to play...');
    
    modalVideo.play().then(() => {
        console.log('Video playing successfully');
    }).catch(e => {
        console.log('Autoplay prevented:', e);
        // Show a play button or message to user
        showPlayButton(modalVideo);
    });
}

// Handle video error
function handleVideoError(e) {
    const modalVideo = document.getElementById('modalVideo');
    console.error('Video error occurred:', e);
    console.error('Video error details:', modalVideo.error);
    console.error('Video src:', modalVideo.src);
    console.error('Video readyState:', modalVideo.readyState);
    
    // Show error message to user
    showVideoError();
}

// Show video error message
function showVideoError() {
    const modalContent = document.querySelector('.video-modal-content');
    
    // Remove any existing error messages
    const existingError = modalContent.querySelector('.video-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'video-error';
    errorDiv.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: white;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Video Error</h3>
            <p style="color: #a1a1aa;">Unable to load video. Please try again or contact support.</p>
        </div>
    `;
    
    modalContent.appendChild(errorDiv);
}

// Show play button when autoplay is blocked
function showPlayButton(video) {
    const modalContent = document.querySelector('.video-modal-content');
    
    // Remove any existing play buttons
    const existingButtons = modalContent.querySelectorAll('.play-button-overlay');
    existingButtons.forEach(btn => btn.remove());
    
    // Create a play button overlay
    const playButton = document.createElement('div');
    playButton.className = 'play-button-overlay';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10002;
    `;
    
    playButton.addEventListener('click', function() {
        video.play().then(() => {
            console.log('Video playing after user interaction');
            playButton.remove();
        }).catch(e => {
            console.error('Still cannot play video:', e);
        });
    });
    
    modalContent.appendChild(playButton);
}

// Close Video Modal
function closeVideoModal() {
    console.log('Closing video modal');
    
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!videoModal || !modalVideo) {
        console.error('Video modal elements not found!');
        return;
    }
    
    // Remove event listeners
    modalVideo.removeEventListener('error', handleVideoError);
    modalVideo.removeEventListener('loadeddata', handleVideoLoaded);
    
    // Pause and reset video
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.muted = true;
    modalVideo.loop = false;
    modalVideo.autoplay = false;
    modalVideo.src = ''; // Clear source
    
    // Remove any overlays
    const modalContent = document.querySelector('.video-modal-content');
    const overlays = modalContent.querySelectorAll('.play-button-overlay, .video-error');
    overlays.forEach(overlay => overlay.remove());
    
    // Hide modal
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Setup Portfolio Videos
function setupPortfolioVideos() {
    console.log('Setting up portfolio videos...');
    
    const portfolioVideos = document.querySelectorAll('.portfolio-video');
    console.log('Found portfolio videos:', portfolioVideos.length);
    
    portfolioVideos.forEach((video, index) => {
        const videoElement = video.querySelector('video');
        if (videoElement) {
            console.log(`Setting up video ${index}:`, video.classList.contains('reels-video') ? 'reels' : 'long');
            console.log(`Video ${index} src:`, videoElement.src);
            
            // Set proper aspect ratios
            if (video.classList.contains('reels-video')) {
                video.style.aspectRatio = '9/16';
            } else if (video.classList.contains('long-video')) {
                video.style.aspectRatio = '16/9';
            }
            
            // Ensure videos are muted for autoplay
            videoElement.muted = true;
            videoElement.loop = true;
            videoElement.autoplay = true;
            videoElement.controls = false;
            
            // Test video accessibility
            testVideoAccessibility(videoElement.src, index);
        }
    });
}

// Test video accessibility
function testVideoAccessibility(videoSrc, index) {
    if (!videoSrc) {
        console.error(`Video ${index}: No source found`);
        return;
    }
    
    console.log(`Testing video ${index} accessibility:`, videoSrc);
    
    // Create a test video element to check if the file is accessible
    const testVideo = document.createElement('video');
    testVideo.style.display = 'none';
    testVideo.muted = true;
    testVideo.preload = 'metadata';
    
    testVideo.addEventListener('loadedmetadata', function() {
        console.log(`Video ${index}: Successfully loaded metadata`);
        document.body.removeChild(testVideo);
    });
    
    testVideo.addEventListener('error', function(e) {
        console.error(`Video ${index}: Error loading video:`, e);
        console.error(`Video ${index}: Error details:`, testVideo.error);
        document.body.removeChild(testVideo);
    });
    
    testVideo.src = videoSrc;
    document.body.appendChild(testVideo);
}

// Setup Slider
function setupSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        console.log('Setting up slider...');
        // Clone the original slides and append them for seamless loop
        const originalSlides = sliderTrack.querySelectorAll('.slide');
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            sliderTrack.appendChild(clone);
        });
    }
}

// Initialize Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Initializing contact form...');
        contactForm.addEventListener('submit', handleContactForm);
        
        // Initialize EmailJS with new configuration
        if (typeof emailjs !== 'undefined') {
            emailjs.init("PdTiZ71yqEbvktSqj");
            console.log('EmailJS initialized successfully with new keys');
        } else {
            console.log('EmailJS not available, using fallback');
        }
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate form
    if (!validateContactForm()) {
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    
    // Get form data
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        company: form.querySelector('#company').value,
        service: form.querySelector('#service').value,
        message: form.querySelector('#message').value,
        to_email: 'contact@softimply.com'
    };
    
    console.log('Sending form data:', formData);
    
    // Send email using EmailJS with new service ID
    if (typeof emailjs !== 'undefined') {
        // Try with the new service ID and template
        emailjs.send('reel', 'template_pr3wnga', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showSuccessMessage();
                form.reset();
            }, function(error) {
                console.log('FAILED...', error);
                // Try with alternative template names
                tryAlternativeTemplates(formData, form);
            })
            .finally(() => {
                // Reset button
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            });
    } else {
        console.log('EmailJS not available, using fallback');
        showSuccessMessageWithCopy(formData);
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
    }
}

// Try alternative templates
function tryAlternativeTemplates(formData, form) {
    const templates = ['template_pr3wnga', 'template_reel', 'template_6rgcdim', 'contact_form'];
    
    function tryTemplate(index) {
        if (index >= templates.length) {
            // All templates failed, show fallback
            showSuccessMessageWithCopy(formData);
            form.reset();
            return;
        }
        
        const templateId = templates[index];
        console.log(`Trying template: ${templateId}`);
        
        emailjs.send('reel', templateId, formData)
            .then(function(response) {
                console.log('SUCCESS with template:', templateId, response.status, response.text);
                showSuccessMessage();
                form.reset();
            }, function(error) {
                console.log('FAILED with template:', templateId, error);
                tryTemplate(index + 1);
            });
    }
    
    tryTemplate(0);
}

// Show success message with copy option
function showSuccessMessageWithCopy(formData) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--dark-card);
        border: 1px solid #10b981;
        border-radius: 12px;
        padding: 2rem;
        color: var(--text-primary);
        text-align: center;
        z-index: 1001;
        box-shadow: var(--shadow-xl);
        max-width: 500px;
        width: 90%;
    `;
    
    const emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Service: ${formData.service}
Message: ${formData.message}
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">✓</div>
        <h3 style="margin-bottom: 0.5rem;">Message Ready!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Your message has been prepared. Please copy the content below and send it to contact@softimply.com</p>
        <textarea readonly style="width: 100%; height: 150px; background: var(--dark-surface); border: 1px solid var(--dark-border); border-radius: 8px; padding: 1rem; color: var(--text-primary); margin-bottom: 1rem; font-family: monospace;">${emailContent}</textarea>
        <button onclick="navigator.clipboard.writeText('${emailContent.replace(/'/g, "\\'")}').then(() => alert('Content copied to clipboard!'))" style="background: var(--gradient-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; margin-right: 1rem;">Copy Content</button>
        <button onclick="window.open('mailto:contact@softimply.com?subject=New Contact Form Submission from ${formData.name}&body=${encodeURIComponent(emailContent)}')" style="background: var(--gradient-secondary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">Open Email Client</button>
        <button onclick="this.parentElement.remove()" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--dark-border); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; margin-left: 1rem;">Close</button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 30000);
}

// Show Success Message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--dark-card);
        border: 1px solid #10b981;
        border-radius: 12px;
        padding: 2rem;
        color: var(--text-primary);
        text-align: center;
        z-index: 1001;
        box-shadow: var(--shadow-xl);
        max-width: 400px;
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">✓</div>
        <h3 style="margin-bottom: 0.5rem;">Message Sent!</h3>
        <p style="color: var(--text-secondary);">Thank you for contacting us. We'll get back to you within 24 hours.</p>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// Show Error Message
function showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--dark-card);
        border: 1px solid #ef4444;
        border-radius: 12px;
        padding: 2rem;
        color: var(--text-primary);
        text-align: center;
        z-index: 1001;
        box-shadow: var(--shadow-xl);
        max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
        <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">✗</div>
        <h3 style="margin-bottom: 0.5rem;">Message Failed</h3>
        <p style="color: var(--text-secondary);">Sorry, there was an error sending your message. Please try again or contact us directly at contact@softimply.com</p>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

// Validate Contact Form
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#6366f1';
        }
    });
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            isValid = false;
        }
    }
    
    return isValid;
}

console.log('Softimply Video Editing website loaded successfully! 🎬'); 