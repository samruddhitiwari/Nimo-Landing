// Supabase Configuration
const SUPABASE_URL = 'https://dnubzxtvwinfwfprydnv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudWJ6eHR2d2luZndmcHJ5ZG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjQzMTksImV4cCI6MjA2NTQwMDMxOX0.e8BNwHjnox-CvdaAppjsnR62ReWgue3j6ZRARqiwcXg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start confetti animation
    createConfetti();
    
    // Initialize invite form
    initializeInviteForm();
    
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Create confetti animation
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FF6B6B', '#4ECDC4', '#FF9FF3', '#FFD700', '#FF69B4'];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        container.style.opacity = '0';
        setTimeout(() => {
            container.remove();
        }, 1000);
    }, 5000);
}

// Initialize invite form functionality
function initializeInviteForm() {
    const addFriendBtn = document.getElementById('add-friend-btn');
    const inviteForm = document.getElementById('invite-form');
    const inviteMessage = document.getElementById('invite-message');
    
    // Add friend button functionality
    addFriendBtn.addEventListener('click', addFriendInput);
    
    // Form submission
    inviteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleInviteSubmission();
    });
    
    // Update remove button visibility on initial load
    updateRemoveButtons();
}

// Add new friend input group
function addFriendInput() {
    const friendInputs = document.getElementById('friend-inputs');
    const newGroup = document.createElement('div');
    newGroup.className = 'friend-input-group';
    
    newGroup.innerHTML = `
        <input type="text" placeholder="Friend's name" class="friend-name" required>
        <input type="email" placeholder="Friend's email" class="friend-email" required>
        <button type="button" class="remove-friend" onclick="removeFriendInput(this)">
            <i data-feather="x"></i>
        </button>
    `;
    
    friendInputs.appendChild(newGroup);
    
    // Reinitialize feather icons for new elements
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Update remove button visibility
    updateRemoveButtons();
    
    // Focus on the new name input
    newGroup.querySelector('.friend-name').focus();
}

// Remove friend input group
function removeFriendInput(button) {
    const group = button.closest('.friend-input-group');
    group.remove();
    updateRemoveButtons();
}

// Update remove button visibility
function updateRemoveButtons() {
    const groups = document.querySelectorAll('.friend-input-group');
    groups.forEach(group => {
        const removeBtn = group.querySelector('.remove-friend');
        if (groups.length > 1) {
            removeBtn.style.display = 'flex';
        } else {
            removeBtn.style.display = 'none';
        }
    });
}

// Handle invite form submission
async function handleInviteSubmission() {
    const submitBtn = document.getElementById('invite-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('invite-loader');
    const messageDiv = document.getElementById('invite-message');
    
    // Get all friend inputs
    const friendGroups = document.querySelectorAll('.friend-input-group');
    const friends = [];
    
    // Validate and collect friend data
    for (let group of friendGroups) {
        const name = group.querySelector('.friend-name').value.trim();
        const email = group.querySelector('.friend-email').value.trim();
        
        if (name && email) {
            if (!isValidEmail(email)) {
                showMessage('Please enter valid email addresses for all friends.', 'error');
                return;
            }
            friends.push({ name, email });
        }
    }
    
    if (friends.length === 0) {
        showMessage('Please add at least one friend to invite.', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Add friends to waitlist
        const results = [];
        for (let friend of friends) {
            try {
                const { error } = await supabase.from('WaitList').insert([{
                    name: friend.name,
                    email: friend.email,
                
                }]);
                
                if (error && error.code !== '23505') { // Ignore duplicate email errors
                    throw error;
                }
                results.push({ success: true, friend });
            } catch (error) {
                results.push({ success: false, friend, error });
            }
        }
        
        // Show results
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        if (successful > 0) {
            const message = `Successfully invited ${successful} friend${successful > 1 ? 's' : ''}! 🎉`;
            showMessage(message, 'success');
            
            // Clear form after successful submission
            setTimeout(() => {
                clearInviteForm();
            }, 2000);
        }
        
        if (failed > 0) {
            const message = `${failed} invitation${failed > 1 ? 's' : ''} failed (possibly already on waitlist).`;
            showMessage(message, 'error');
        }
        
    } catch (error) {
        console.error('Invite submission error:', error);
        showMessage('Something went wrong. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Set loading state
function setLoadingState(loading) {
    const submitBtn = document.getElementById('invite-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('invite-loader');
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.add('active');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.remove('active');
    }
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('invite-message');
    messageDiv.textContent = message;
    messageDiv.className = `invite-message ${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Clear invite form
function clearInviteForm() {
    const friendInputs = document.getElementById('friend-inputs');
    
    // Remove all but the first friend input group
    const groups = friendInputs.querySelectorAll('.friend-input-group');
    for (let i = 1; i < groups.length; i++) {
        groups[i].remove();
    }
    
    // Clear the remaining group
    const firstGroup = friendInputs.querySelector('.friend-input-group');
    firstGroup.querySelector('.friend-name').value = '';
    firstGroup.querySelector('.friend-email').value = '';
    
    // Update remove button visibility
    updateRemoveButtons();
}

// Add some extra celebratory effects
function addCelebrationEffects() {
    // Add bounce effect to success section
    const successSection = document.querySelector('.success-section');
    successSection.style.animation = 'bounce 0.6s ease-out';
    
    // Add pulse effect to party emoji
    const partyEmoji = document.querySelector('.party-emoji');
    setInterval(() => {
        partyEmoji.style.transform = 'scale(1.2)';
        setTimeout(() => {
            partyEmoji.style.transform = 'scale(1)';
        }, 200);
    }, 2000);
}

// Call celebration effects after a short delay
setTimeout(addCelebrationEffects, 1000);
