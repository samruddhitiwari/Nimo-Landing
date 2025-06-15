// Supabase Configuration
const SUPABASE_URL = 'https://dnubzxtvwinfwfprydnv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudWJ6eHR2d2luZndmcHJ5ZG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjQzMTksImV4cCI6MjA2NTQwMDMxOX0.e8BNwHjnox-CvdaAppjsnR62ReWgue3j6ZRARqiwcXg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlist-form');
    const message = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !email) {
            message.textContent = 'Please fill in all fields.';
            message.style.color = 'red';
            return;
        }

        const { error } = await supabase.from('WaitList').insert([{ name, email }]);

        if (error) {
            message.textContent = 'Something went wrong. Try again.';
            message.style.color = 'red';
            console.error(error);
        } else {
            message.textContent = 'You have been added to the waitlist!';
            message.style.color = '#28a745';
            form.reset();
        }
    });

    // Initialize other features
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeModals();
    
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize modal functionality
function initializeModals() {
    // Close modal when clicking outside of modal content
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}



// Initialize scroll animations
function initializeScrollAnimations() {
    // Add scroll animation class to elements
    const animatedElements = document.querySelectorAll('.feature-card, .comparison-card, .use-case-card, .launch-item');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in-on-scroll');
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.fade-in-on-scroll');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


    // Scroll indicator click handler
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.what-is-nimo');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Utility function to create database table (for setup)
async function createWaitlistTable() {
    if (!supabase) {
        console.log('Supabase not initialized - cannot create table');
        return;
    }

    try {
        console.log('=== SUPABASE TABLE SETUP ===');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run this SQL command:');
        console.log(`
CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'landing_page'
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (allows anyone to add to waitlist)
CREATE POLICY "Allow insert for all users" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Create policy for selecting (optional, for admin access)
CREATE POLICY "Allow select for authenticated users" ON waitlist
    FOR SELECT USING (auth.role() = 'authenticated');
        `);
        console.log('4. Make sure to get your anon key from API settings');
        console.log('===============================');
    } catch (error) {
        console.error('Error with table creation info:', error);
    }
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize analytics (placeholder for future implementation)
function initializeAnalytics() {
    // Track page view
    console.log('Page view tracked');
    
    // Track waitlist signups
    const form = document.getElementById('waitlist-form');
    if (form) {
        form.addEventListener('submit', () => {
            console.log('Waitlist signup attempted');
        });
    }
}

// Error handling for the entire app
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Show user-friendly error message
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = 'Something went wrong. Please refresh the page and try again.';
        messageDiv.className = 'form-message error show';
    }
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for PWA functionality
        console.log('Service worker registration would happen here');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        addToWaitlist,
        createWaitlistTable
    };
}

// Configuration helpers
window.configureSupabase = function(url, anonKey) {
    console.log('Configuring Supabase credentials...');
    
    // Save to localStorage for persistence
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', anonKey);
    
    // Also set as window variables
    window.SUPABASE_URL = url;
    window.SUPABASE_ANON_KEY = anonKey;
    
    // Reinitialize Supabase
    initializeSupabase();
    
    console.log('Supabase reconfigured and saved. You can now test the form.');
};

window.testWaitlist = async function(name = 'Test User', email = 'test@example.com') {
    try {
        console.log('🧪 Testing waitlist submission...');
        await addToWaitlist(email, name);
        console.log('✅ Test successful!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('replit')) {
    window.nimoDevTools = {
        configure: window.configureSupabase,
        test: window.testWaitlist,
        createTable: createWaitlistTable,
        clearMessages: () => {
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.className = 'form-message';
                messageDiv.textContent = '';
            }
        },
        getStatus: () => {
            console.log('=== NIMO SUPABASE STATUS ===');
            console.log('Supabase client:', supabase ? '✅ Initialized' : '❌ Not initialized');
            console.log('URL configured:', window.SUPABASE_URL ? '✅ Yes' : '❌ No');
            console.log('Key configured:', window.SUPABASE_ANON_KEY ? '✅ Yes' : '❌ No');
            console.log('============================');
        }
    };
    
    console.log('🛠️ Development tools available:');
    console.log('- nimoDevTools.configure(url, anonKey) - Set Supabase credentials');
    console.log('- nimoDevTools.test() - Test waitlist submission');
    console.log('- nimoDevTools.getStatus() - Check configuration status');
    console.log('- nimoDevTools.createTable() - Show SQL for table creation');
    console.log('- nimoDevTools.clearMessages() - Clear form messages');
}
