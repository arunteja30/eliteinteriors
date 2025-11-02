// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});


// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Gallery Filter
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter');
        loadGallery(currentFilter);
    });
});

// Load Gallery from Firebase
async function loadGallery(filter = 'all') {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) {
        console.error('Gallery grid element not found');
        return;
    }
    
    galleryGrid.innerHTML = '<div class="gallery-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading gallery...</p></div>';

    try {
        // Check if Firebase is initialized
        if (!window.database) {
            throw new Error('Firebase Realtime Database not initialized');
        }

        console.log('🔍 Loading gallery with filter:', filter);
        
        // Get all gallery items from Realtime Database
        const snapshot = await window.database.ref('gallery').once('value');
        const galleryData = snapshot.val();
        console.log('📊 Gallery data from Realtime Database:', galleryData);
        // Print each gallery item in the console
        Object.entries(galleryData || {}).forEach(([key, value]) => {
            console.log(`Gallery item [${key}]:`, value);
        });
        
        console.log('📊 Gallery data from Realtime Database:', galleryData);
        
        if (!galleryData) {
            galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d;">No images found. Add gallery data to Firebase Realtime Database.</p>';
            return;
        }

        // Convert to array and filter/sort in JavaScript
        let galleryItems = [];
        Object.keys(galleryData).forEach(key => {
            const data = galleryData[key];
            console.log('📸 Gallery item:', key, {
                title: data.title,
                imageUrl: data.imageUrl,
                category: data.category
            });
            galleryItems.push(data);
        });
        
        // Filter by category if needed
        if (filter !== 'all') {
            galleryItems = galleryItems.filter(item => item.category === filter);
        }
        
        // Sort by createdAt (most recent first)
        galleryItems.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
        
        console.log('📊 Filtered gallery items:', galleryItems.length, 'items for filter:', filter);

        galleryGrid.innerHTML = '';
        
        galleryItems.forEach(data => {
            console.log('📸 Creating gallery item:', data.title);
            const galleryItem = createGalleryItem(data);
            galleryGrid.appendChild(galleryItem);
        });
        
        console.log('✅ Gallery loaded successfully');
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #e74c3c;">Error loading gallery: ${error.message}</p>`;
    }
}

function createGalleryItem(data) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', data.category);
    
    const img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.title;
    img.loading = 'lazy';
    
    // Add error handling for images
    img.onerror = function() {
        console.error('❌ Failed to load image:', data.imageUrl);
        this.src = 'https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Image+Not+Available';
    };
    
    img.onload = function() {
        console.log('✅ Image loaded successfully:', data.title);
    };
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description || ''}</p>
    `;
    
    item.appendChild(img);
    item.appendChild(overlay);
    
    item.addEventListener('click', () => {
        openModal(data.imageUrl, data.title);
    });
    
    return item;
}

// Image Modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');

function openModal(src, caption) {
    modal.style.display = 'block';
    modalImg.src = src;
    modalCaption.textContent = caption;
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Load Testimonials from Firebase
async function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    
    try {
        const snapshot = await window.database.ref('reviews').once('value');
        const reviewsData = snapshot.val();
        
        if (!reviewsData) {
            testimonialsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d;">No reviews yet. Be the first to share your experience!</p>';
            return;
        }

        // Convert to array and filter approved reviews
        let reviews = [];
        Object.keys(reviewsData).forEach(key => {
            const data = reviewsData[key];
            if (data.approved) {
                reviews.push(data);
            }
        });
        
        // Sort by createdAt and limit to 6
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        reviews = reviews.slice(0, 6);

        testimonialsGrid.innerHTML = '';
        
        reviews.forEach(data => {
            const testimonial = createTestimonialCard(data);
            testimonialsGrid.appendChild(testimonial);
        });
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e74c3c;">Error loading reviews. Please check Firebase configuration.</p>';
    }
}

function createTestimonialCard(data) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    const initial = data.name.charAt(0).toUpperCase();
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
    
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-avatar">${initial}</div>
            <div class="testimonial-info">
                <h4>${data.name}</h4>
                <div class="testimonial-rating">${stars}</div>
            </div>
        </div>
        <p class="testimonial-text">"${data.review}"</p>
    `;
    
    return card;
}

// Rating Stars for Review Form
const ratingStars = document.getElementById('ratingStars');
let selectedRating = 0;

ratingStars.querySelectorAll('i').forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars(selectedRating);
    });
    
    star.addEventListener('mouseenter', () => {
        updateStars(index + 1);
    });
});

ratingStars.addEventListener('mouseleave', () => {
    updateStars(selectedRating);
});

function updateStars(rating) {
    ratingStars.querySelectorAll('i').forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// Review Form Submission
const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('🔍 Review form submission started...');
    console.log('Selected rating:', selectedRating);
    console.log('Firebase database available:', !!window.database);
    
    // Check if Firebase is available
    if (!window.database) {
        alert('Database connection not available. Please refresh the page and try again.');
        return;
    }
    
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const nameElement = document.getElementById('reviewName');
    const emailElement = document.getElementById('reviewEmail');
    const reviewElement = document.getElementById('reviewText');
    
    // Check if elements exist
    if (!nameElement || !emailElement || !reviewElement) {
        console.error('❌ Review form elements not found');
        alert('Form elements not found. Please refresh the page and try again.');
        return;
    }
    
    const name = nameElement.value;
    const email = emailElement.value;
    const review = reviewElement.value;
    
    // Check if values exist and are not empty
    if (!name || !email || !review) {
        alert('Please fill in all required fields.');
        return;
    }
    
    console.log('Form values:', { name, email, review });
    
    const submitButton = reviewForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        console.log('📝 Submitting review to Firebase...');
        
        const reviewData = {
            name: name.trim(),
            email: email.trim(), 
            review: review.trim(),
            rating: selectedRating,
            approved: false,
            createdAt: new Date().toISOString()
        };
        
        console.log('Review data:', reviewData);
        
        const reviewRef = await window.database.ref('reviews').push(reviewData);
        
        console.log('✅ Review submitted successfully! Key:', reviewRef.key);
        alert('Thank you for your review! It will be published after approval.');
        reviewForm.reset();
        selectedRating = 0;
        updateStars(0);
    } catch (error) {
        console.error('❌ Error submitting review:', error);
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        
        let errorMessage = 'Error submitting review. ';
        if (error.code === 'PERMISSION_DENIED') {
            errorMessage += 'Permission denied. Please check Firebase rules.';
        } else if (error.message.includes('network')) {
            errorMessage += 'Network error. Please check your connection.';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameElement = document.getElementById('contactName');
    const emailElement = document.getElementById('contactEmail');
    const phoneElement = document.getElementById('contactPhone');
    const serviceElement = document.getElementById('contactService');
    const messageElement = document.getElementById('contactMessage');
    
    // Check if elements exist
    if (!nameElement || !emailElement || !phoneElement || !serviceElement || !messageElement) {
        console.error('❌ Contact form elements not found');
        alert('Form elements not found. Please refresh the page and try again.');
        return;
    }
    
    const name = nameElement.value;
    const email = emailElement.value;
    const phone = phoneElement.value;
    const service = serviceElement.value;
    const message = messageElement.value;
    
    // Check if values exist and are not empty
    if (!name || !email || !phone || !service || !message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if Firebase is available
    if (!window.database) {
        alert('Database connection not available. Please refresh the page and try again.');
        return;
    }
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        await window.database.ref('contacts').push({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            service: service,
            message: message.trim(),
            createdAt: new Date().toISOString()
        });
        
        alert('Thank you for contacting us! We will get back to you soon.');
        contactForm.reset();
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('Error sending message. Please try again or contact us directly.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
    });
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            await window.database.ref('newsletter').push({
                email: email.trim(),
                createdAt: new Date().toISOString()
            });
            
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Error subscribing. Please try again.');
        }
    });
}

// Store contact data globally for reuse
let globalContactData = null;

// Load Site Information from Firebase
async function loadSiteInformation() {
    console.log('📄 Loading site information...');
    
    try {
        const snapshot = await window.database.ref('settings/siteInfo').once('value');
        const siteInfo = snapshot.val();
        
        if (siteInfo) {
            console.log('✅ Site info loaded:', siteInfo);
            
            // Update site name
            if (siteInfo.siteName) {
                const siteNameElement = document.getElementById('siteName');
                const footerSiteNameElement = document.getElementById('footerSiteName');
                
                if (siteNameElement) {
                    siteNameElement.textContent = siteInfo.siteName;
                }
                if (footerSiteNameElement) {
                    footerSiteNameElement.textContent = siteInfo.siteName;
                }
                
                // Update page title
                document.title = `${siteInfo.siteName} - Transform Your Space`;
            }
            
            // Update site icon
            if (siteInfo.siteIcon) {
                const siteIconElement = document.getElementById('siteIcon');
                const footerSiteIconElement = document.getElementById('footerSiteIcon');
                
                if (siteIconElement) {
                    siteIconElement.className = siteInfo.siteIcon;
                    console.log('✅ Site icon updated to:', siteInfo.siteIcon);
                }
                
                if (footerSiteIconElement) {
                    footerSiteIconElement.className = siteInfo.siteIcon;
                    console.log('✅ Footer site icon updated to:', siteInfo.siteIcon);
                }
            }
            
            // Update footer description if element exists
            const footerDescriptionElement = document.getElementById('footerDescription');
            if (footerDescriptionElement && siteInfo.description) {
                footerDescriptionElement.textContent = siteInfo.description;
            }
            
            // Update copyright text with dynamic site name
            const copyrightElement = document.getElementById('copyrightText');
            if (copyrightElement && siteInfo.siteName) {
                copyrightElement.textContent = `© ${new Date().getFullYear()} ${siteInfo.siteName}. All rights reserved.`;
            }
        }
        
        // Load contact information with a small delay to ensure Firebase is ready
        setTimeout(async () => {
            await loadContactInformation();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error loading site information:', error);
    }
}

// Load contact information from Firebase
async function loadContactInformation() {
    console.log('📞 Loading contact information...');
    
    try {
        if (!window.database) {
            console.error('❌ Firebase database not available');
            return;
        }
        
        const snapshot = await window.database.ref('settings/contactInfo').once('value');
        const contactInfo = snapshot.val();
        
        console.log('📄 Raw contact info from Firebase:', contactInfo);
        
        if (contactInfo && typeof contactInfo === 'object') {
            console.log('✅ Contact info loaded successfully:', contactInfo);
            
            // Update footer contact information
            const footerContactDiv = document.getElementById('footerContact');
            console.log('📍 Footer contact div found:', !!footerContactDiv);
            console.log('📧 Email exists:', !!contactInfo.email);
            console.log('📞 Phone exists:', !!contactInfo.phone);
            console.log('🏠 Address exists:', !!contactInfo.address);
            
            if (footerContactDiv) {
                // Always update even if some fields are missing
                const email = String(contactInfo.email || 'info@example.com');
                const phone = String(contactInfo.phone || '+1 (555) 000-0000');
                const address = String(contactInfo.address || 'Address not set');
                
                console.log('✅ Updating footer contact with:', { email, phone, address });
                
                footerContactDiv.innerHTML = `
                    <p><i class="fas fa-envelope"></i> ${email}</p>
                    <p><i class="fas fa-phone"></i> ${phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${address}</p>
                `;
            } else {
                console.error('❌ Footer contact div not found');
            }
            
                        // Update social links
            const socialDiv = document.getElementById('footerSocial');
            console.log('🔗 Social div found:', !!socialDiv);
            console.log('📱 Social links data:', contactInfo.socialLinks);
            
            if (socialDiv) {
                const socialLinks = [];
                
                if (contactInfo.socialLinks && typeof contactInfo.socialLinks === 'object') {
                    if (contactInfo.socialLinks.facebook && String(contactInfo.socialLinks.facebook).trim()) {
                        socialLinks.push(`<a href="${String(contactInfo.socialLinks.facebook)}" class="social-link" target="_blank"><i class="fab fa-facebook"></i></a>`);
                    }
                    if (contactInfo.socialLinks.instagram && String(contactInfo.socialLinks.instagram).trim()) {
                        socialLinks.push(`<a href="${String(contactInfo.socialLinks.instagram)}" class="social-link" target="_blank"><i class="fab fa-instagram"></i></a>`);
                    }
                    if (contactInfo.socialLinks.twitter && String(contactInfo.socialLinks.twitter).trim()) {
                        socialLinks.push(`<a href="${String(contactInfo.socialLinks.twitter)}" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>`);
                    }
                    if (contactInfo.socialLinks.linkedin && String(contactInfo.socialLinks.linkedin).trim()) {
                        socialLinks.push(`<a href="${String(contactInfo.socialLinks.linkedin)}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>`);
                    }
                }
                
                console.log('✅ Generated social links:', socialLinks.length);
                socialDiv.innerHTML = socialLinks.join('');
            } else {
                console.error('❌ Social div not found');
            }
            
            // Store contact info globally for forms
            globalContactData = contactInfo;
        } else {
            console.warn('⚠️ No contact info found in Firebase or invalid data type');
            console.log('📄 Received data:', contactInfo, typeof contactInfo);
        }
    } catch (error) {
        console.error('❌ Error loading contact information:', error);
        console.error('❌ Error details:', error.message);
    }
}

// Load Statistics from Firebase
async function loadStatistics() {
    try {
        console.log('📊 Loading statistics...');
        
        if (!window.database) {
            throw new Error('Firebase database not initialized');
        }
        
        // Use real-time listener instead of one-time read
        window.database.ref('settings/statistics').on('value', (snapshot) => {
            handleStatisticsUpdate(snapshot);
        });
        
        // Also do initial load
        const snapshot = await window.database.ref('settings/statistics').once('value');
        handleStatisticsUpdate(snapshot);
    } catch (error) {
        console.error('❌ Error loading statistics:', error);
    }
}

// Handle statistics data update (separated for real-time updates)
function handleStatisticsUpdate(snapshot) {
    try {
        const stats = snapshot.val();
        
        console.log('📈 Real-time Firebase statistics data:', stats);
        console.log('📈 Statistics keys:', Object.keys(stats || {}));
        console.log('📈 Company founded date:', stats?.companyFoundedDate);
        console.log('📈 Total projects:', stats?.totalProjectsCompleted);
        console.log('📈 Total clients:', stats?.totalHappyClients);
        
        if (!stats) {
            console.log('⚠️ Statistics not found, using default values');
            return;
        }
        
        // Calculate dynamic values
        const currentDate = new Date();
        const foundedDate = new Date(stats.companyFoundedDate);
        const yearsInBusiness = currentDate.getFullYear() - foundedDate.getFullYear();
        const daysSinceFoundation = Math.floor((currentDate - foundedDate) / (1000 * 60 * 60 * 24));
        
        console.log('📅 Calculated years in business:', yearsInBusiness);
        console.log('📅 Days since foundation:', daysSinceFoundation);
        
        // Update hero section statistics
        const heroExperience = document.getElementById('heroExperience');
        const heroProjects = document.getElementById('heroProjects');
        const heroClients = document.getElementById('heroClients');
        
        if (heroExperience) {
            // Reset animation for real-time updates
            heroExperience.removeAttribute('data-animated');
            animateCounter(heroExperience, yearsInBusiness, '+');
        }
        
        if (heroProjects) {
            heroProjects.removeAttribute('data-animated');
            animateCounter(heroProjects, stats.totalProjectsCompleted, '+');
        }
        
        if (heroClients) {
            heroClients.removeAttribute('data-animated');
            animateCounter(heroClients, stats.totalHappyClients, '+');
        }
        
        // Update about section statistics
        const aboutProjects = document.getElementById('aboutProjects');
        const aboutExperience = document.getElementById('aboutExperience');
        const aboutSatisfaction = document.getElementById('aboutSatisfaction');
        const aboutSquareFeet = document.getElementById('aboutSquareFeet');
        
        if (aboutProjects) {
            aboutProjects.removeAttribute('data-animated');
            animateCounter(aboutProjects, stats.totalProjectsCompleted, '+');
        }
        
        if (aboutExperience) {
            aboutExperience.removeAttribute('data-animated');
            animateCounter(aboutExperience, yearsInBusiness, '+');
        }
        
        if (aboutSatisfaction) {
            // Calculate satisfaction percentage (assume 95%+ satisfaction rate)
            const satisfactionRate = Math.min(98, Math.floor((stats.totalHappyClients / stats.totalProjectsCompleted) * 100));
            aboutSatisfaction.removeAttribute('data-animated');
            animateCounter(aboutSatisfaction, satisfactionRate, '%');
        }
        
        if (aboutSquareFeet) {
            const sqFtInK = Math.floor(stats.totalSquareFeetDesigned / 1000);
            aboutSquareFeet.removeAttribute('data-animated');
            animateCounter(aboutSquareFeet, sqFtInK, 'K+');
        }
        
        console.log('✅ Statistics updated and animated successfully');
        
    } catch (error) {
        console.error('❌ Error handling statistics update:', error);
    }
}

// Manual statistics reload function for testing
async function reloadStatistics() {
    console.log('🔄 Manually reloading statistics...');
    
    // Reset animation flags
    const statElements = [
        'heroExperience', 'heroProjects', 'heroClients',
        'aboutProjects', 'aboutExperience', 'aboutSatisfaction', 'aboutSquareFeet'
    ];
    
    statElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.removeAttribute('data-animated');
        }
    });
    
    // Reload statistics
    await loadStatistics();
}

// Animate counter numbers with intersection observer
function animateCounter(element, targetNumber, suffix = '') {
    // Check if element is in viewport before animating
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                startCounterAnimation(entry.target, targetNumber, suffix);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(element);
}

// Start counter animation
function startCounterAnimation(element, targetNumber, suffix = '') {
    const startNumber = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart);
        
        element.textContent = currentNumber + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetNumber + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Load Contact Information from Firebase
async function loadContactInfo() {
    const contactInfoDiv = document.getElementById('contactInfo');
    
    if (!contactInfoDiv) {
        console.error('❌ Contact info div not found');
        return;
    }
    
    try {
        console.log('📞 Loading contact information...');
        
        if (!window.database) {
            throw new Error('Firebase database not initialized');
        }
        
        const snapshot = await window.database.ref('settings/contactInfo').once('value');
        const data = snapshot.val();
        
        console.log('📄 Contact info data:', data);
        
        if (!data) {
            console.log('⚠️ Contact info not found');
            contactInfoDiv.innerHTML = `
                <p style="color: #e74c3c; padding: 1rem;">
                    Contact information not configured. Please add contactInfo data to Firebase Realtime Database under settings.
                </p>
            `;
            return;
        }
        console.log('📊 Contact info data:', data);
        globalContactData = data; // Store for reuse
        
        let contactHTML = '';
        
        // Address
        if (data.address) {
            contactHTML += `
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h4>Address</h4>
                        <p>${String(data.address)}</p>
                    </div>
                </div>
            `;
        }
        
        // Phone
        if (data.phone) {
            const phoneString = String(data.phone);
            const cleanPhone = phoneString.replace(/\s/g, '');
            contactHTML += `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>Phone</h4>
                        <p><a href="tel:${cleanPhone}">${phoneString}</a></p>
                    </div>
                </div>
            `;
        }
        
        // WhatsApp (if different from phone)
        if (data.whatsapp) {
            const whatsappString = String(data.whatsapp);
            const cleanWhatsapp = whatsappString.replace(/[^0-9]/g, '');
            contactHTML += `
                <div class="contact-item">
                    <i class="fab fa-whatsapp"></i>
                    <div>
                        <h4>WhatsApp</h4>
                        <p><a href="https://wa.me/${cleanWhatsapp}" target="_blank">${whatsappString}</a></p>
                    </div>
                </div>
            `;
        }
        
        // Email
        if (data.email) {
            contactHTML += `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>Email</h4>
                        <p><a href="mailto:${String(data.email)}">${String(data.email)}</a></p>
                    </div>
                </div>
            `;
        }
        
        // Business Hours
        if (data.businessHours) {
            contactHTML += `
                <div class="contact-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>Business Hours</h4>
                        <p>${String(data.businessHours)}</p>
                    </div>
                </div>
            `;
        }
        
        // Social Links with handles
        if (data.socialLinks) {
            contactHTML += '<div class="social-links-detailed">';
            
            if (data.socialLinks.facebook) {
                contactHTML += `
                    <a href="${String(data.socialLinks.facebook)}" target="_blank" class="social-link-detailed">
                        <i class="fab fa-facebook"></i>
                        <span>${String(data.socialLinks.facebookHandle || 'Facebook')}</span>
                    </a>
                `;
            }
            if (data.socialLinks.instagram) {
                contactHTML += `
                    <a href="${String(data.socialLinks.instagram)}" target="_blank" class="social-link-detailed">
                        <i class="fab fa-instagram"></i>
                        <span>${String(data.socialLinks.instagramHandle || 'Instagram')}</span>
                    </a>
                `;
            }
            
            contactHTML += '</div>';
            
            // Traditional icon-only social links
            contactHTML += '<div class="social-links">';
            
            if (data.socialLinks.facebook) {
                contactHTML += `<a href="${String(data.socialLinks.facebook)}" target="_blank" class="social-link" title="Facebook"><i class="fab fa-facebook"></i></a>`;
            }
            if (data.socialLinks.instagram) {
                contactHTML += `<a href="${String(data.socialLinks.instagram)}" target="_blank" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>`;
            }
            if (data.socialLinks.twitter) {
                contactHTML += `<a href="${String(data.socialLinks.twitter)}" target="_blank" class="social-link" title="Twitter"><i class="fab fa-twitter"></i></a>`;
            }
            if (data.socialLinks.linkedin) {
                contactHTML += `<a href="${String(data.socialLinks.linkedin)}" target="_blank" class="social-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
            }
            if (data.socialLinks.pinterest) {
                contactHTML += `<a href="${String(data.socialLinks.pinterest)}" target="_blank" class="social-link" title="Pinterest"><i class="fab fa-pinterest"></i></a>`;
            }
            
            contactHTML += '</div>';
        }
        
        contactInfoDiv.innerHTML = contactHTML;
        
        // Also populate footer
        populateFooterContact(data);
        
        console.log('✅ Contact info loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading contact info:', error);
        contactInfoDiv.innerHTML = `
            <p style="color: #e74c3c; padding: 1rem;">
                Error loading contact information: ${error.message}
            </p>
        `;
    }
}

// Populate Footer Contact Information
function populateFooterContact(data) {
    const footerContact = document.getElementById('footerContact');
    const footerSocial = document.getElementById('footerSocial');
    
    if (footerContact && data) {
        let footerHTML = '<div class="footer-info">';
        
        if (data.phone) {
            const phoneString = String(data.phone);
            const cleanPhone = phoneString.replace(/\s/g, '');
            footerHTML += `
                <p class="footer-info-item">
                    <i class="fas fa-phone"></i>
                    <a href="tel:${cleanPhone}">${phoneString}</a>
                </p>
            `;
        }
        
        if (data.email) {
            footerHTML += `
                <p class="footer-info-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${String(data.email)}">${String(data.email)}</a>
                </p>
            `;
        }
        
        if (data.socialLinks && data.socialLinks.instagram) {
            footerHTML += `
                <p class="footer-info-item">
                    <i class="fab fa-instagram"></i>
                    <a href="${String(data.socialLinks.instagram)}" target="_blank">${String(data.socialLinks.instagramHandle || '@eliteinteriors')}</a>
                </p>
            `;
        }
        
        if (data.socialLinks && data.socialLinks.facebook) {
            footerHTML += `
                <p class="footer-info-item">
                    <i class="fab fa-facebook"></i>
                    <a href="${String(data.socialLinks.facebook)}" target="_blank">${String(data.socialLinks.facebookHandle || 'Facebook')}</a>
                </p>
            `;
        }
        
        footerHTML += '</div>';
        footerContact.innerHTML = footerHTML;
    }
    
    if (footerSocial && data && data.socialLinks) {
        let socialHTML = '<div class="footer-social-links">';
        
        if (data.socialLinks.facebook) {
            socialHTML += `<a href="${data.socialLinks.facebook}" target="_blank" class="footer-social-link" title="Facebook"><i class="fab fa-facebook"></i></a>`;
        }
        if (data.socialLinks.instagram) {
            socialHTML += `<a href="${data.socialLinks.instagram}" target="_blank" class="footer-social-link" title="Instagram"><i class="fab fa-instagram"></i></a>`;
        }
        if (data.socialLinks.twitter) {
            socialHTML += `<a href="${data.socialLinks.twitter}" target="_blank" class="footer-social-link" title="Twitter"><i class="fab fa-twitter"></i></a>`;
        }
        if (data.socialLinks.linkedin) {
            socialHTML += `<a href="${data.socialLinks.linkedin}" target="_blank" class="footer-social-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
        }
        if (data.socialLinks.pinterest) {
            socialHTML += `<a href="${data.socialLinks.pinterest}" target="_blank" class="footer-social-link" title="Pinterest"><i class="fab fa-pinterest"></i></a>`;
        }
        
        socialHTML += '</div>';
        footerSocial.innerHTML = socialHTML;
    }
}

// Hero Slides Functionality
let currentSlide = 0;
let slides = [];

// Load Hero Slides from Firebase Gallery
async function loadHeroSlides() {
    const slidesContainer = document.getElementById('heroSlides');
    const indicatorsContainer = document.getElementById('slideIndicators');
    
    try {
        // Get all gallery items from Realtime Database
        const snapshot = await window.database.ref('gallery').once('value');
        const galleryData = snapshot.val();
        
        if (!galleryData) {
            // Fallback to static slides if no Firebase data
            loadStaticSlides();
            return;
        }

        // Convert to array, sort by date, and take top 5
        let galleryItems = [];
        Object.keys(galleryData).forEach(key => {
            galleryItems.push(galleryData[key]);
        });
        
        // Sort by createdAt and limit to 5
        galleryItems.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
        
        galleryItems = galleryItems.slice(0, 5);

        slides = [];
        let slidesHTML = '';
        let indicatorsHTML = '';
        
        galleryItems.forEach((data, index) => {
            slides.push(data);
            
            slidesHTML += `
                <div class="hero-slide ${index === 0 ? 'active' : ''}">
                    <img src="${data.imageUrl}" alt="${data.title}" loading="lazy">
                    <div class="slide-overlay">
                        <h3 class="slide-title">${data.title}</h3>
                        <p class="slide-category">${String(data.category || '').replace('-', ' ')}</p>
                    </div>
                </div>
            `;
            
            indicatorsHTML += `
                <span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
            `;
        });
        
        slidesContainer.innerHTML = slidesHTML;
        indicatorsContainer.innerHTML = indicatorsHTML;
        
        // Start auto-slide
        startAutoSlide();
        
    } catch (error) {
        console.error('Error loading hero slides:', error);
        loadStaticSlides();
    }
}

// Fallback static slides
function loadStaticSlides() {
    const slidesContainer = document.getElementById('heroSlides');
    const indicatorsContainer = document.getElementById('slideIndicators');
    
    const staticSlides = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
            title: 'Modern Living Room Design',
            category: 'residential'
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            title: 'Fine Dining Restaurant',
            category: 'restaurant'
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
            title: 'Recording Studio',
            category: 'studio'
        }
    ];
    
    slides = staticSlides;
    let slidesHTML = '';
    let indicatorsHTML = '';
    
    staticSlides.forEach((slide, index) => {
        slidesHTML += `
            <div class="hero-slide ${index === 0 ? 'active' : ''}">
                <img src="${slide.imageUrl}" alt="${slide.title}" loading="lazy">
                <div class="slide-overlay">
                    <h3 class="slide-title">${slide.title}</h3>
                    <p class="slide-category">${slide.category}</p>
                </div>
            </div>
        `;
        
        indicatorsHTML += `
            <span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
        `;
    });
    
    slidesContainer.innerHTML = slidesHTML;
    indicatorsContainer.innerHTML = indicatorsHTML;
    
    startAutoSlide();
}

// Change slide function
function changeSlide(direction) {
    const slideElements = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slideElements.length === 0) return;
    
    // Remove active class from current slide
    slideElements[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Calculate next slide
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Add active class to new slide
    slideElements[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Go to specific slide
function goToSlide(index) {
    const slideElements = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slideElements.length === 0) return;
    
    // Remove active class from current slide
    slideElements[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Set new slide
    currentSlide = index;
    
    // Add active class to new slide
    slideElements[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Auto-slide functionality
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// Pause auto-slide on hover
document.addEventListener('DOMContentLoaded', () => {
    const heroSlides = document.querySelector('.hero-slides');
    if (heroSlides) {
        heroSlides.addEventListener('mouseenter', stopAutoSlide);
        heroSlides.addEventListener('mouseleave', startAutoSlide);
    }
});

// Test Firebase connection and collections
async function testFirebaseConnection() {
    console.log('🧪 Testing Firebase Realtime Database connection...');
    
    try {
        // Test data paths exist
        const paths = ['gallery', 'reviews', 'projects', 'settings/contactInfo', 'settings/statistics'];
        
        for (const path of paths) {
            const snapshot = await window.database.ref(path).once('value');
            const data = snapshot.val();
            if (data) {
                const count = typeof data === 'object' ? Object.keys(data).length : 1;
                console.log(`� ${path} data exists:`, count, 'items');
            } else {
                console.log(`⚠️ ${path} data not found`);
            }
        }
        
        console.log('✅ Firebase Realtime Database connection test completed');
    } catch (error) {
        console.error('❌ Firebase Realtime Database connection test failed:', error);
    }
}

// Initialize Firebase and load data
async function initializeApp() {
    console.log('🚀 Initializing application...');
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK not loaded');
        return;
    }
    
    // Wait for Firebase to be ready
    let retries = 0;
    while (!window.database && retries < 10) {
        console.log('⏳ Waiting for Firebase Realtime Database initialization...', retries + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
    }
    
    if (!window.database) {
        console.error('❌ Firebase Realtime Database not available after waiting');
        return;
    }
    
    console.log('✅ Firebase is ready, loading data...');
    
    // Test Firebase connection first
    await testFirebaseConnection();
    
    try {
        // Load all data
        await Promise.all([
            loadSiteInformation(),
            loadHeroSlides(),
            loadGallery(),
            loadTestimonials(),
            loadContactInfo(),
            loadStatistics()
        ]);
        console.log('🎉 All data loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading data:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Add keyboard shortcut for manual statistics reload (Ctrl+Shift+R)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
            e.preventDefault();
            console.log('🔄 Manual statistics reload triggered');
            reloadStatistics();
        }
    });
    
    // Make functions available in console for debugging
    window.debugFunctions = {
        reloadStatistics,
        testFirebaseConnection: async () => {
            if (!window.database) {
                console.error('Firebase not initialized');
                return;
            }
            try {
                const snapshot = await window.database.ref('settings/statistics').once('value');
                const data = snapshot.val();
                console.log('🧪 Firebase statistics test:', data);
                return data;
            } catch (error) {
                console.error('🧪 Firebase test error:', error);
                return null;
            }
        }
    };
});

// Smooth scroll for anchor links
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
