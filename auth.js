// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://dasyfwepnpfhvmltxywf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3lmd2VwbnBmaHZtbHR4eXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjMyMTEsImV4cCI6MjA4Njk5OTIxMX0.0G7DW_aubEGE4siP1m79bzxfgEAnlZDNv5xgaYHvpNE';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Prevent invalid characters in username field
const usernameInput = document.getElementById('signupUsername');
if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-z0-9_]/g, '');
    });
}

// Sign Up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Password validation
        const passwordRegex = /^(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        const usernameRegex = /^[a-z0-9_]+$/;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (!passwordRegex.test(password)) {
            alert('Password must be at least 8 characters and contain at least one number or special character!');
            return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    username: username
                }
            }
        });

        if (error) {
            alert('Error: ' + error.message);
        } else {
            alert('Sign up successful! Check your email for verification.');
            window.location.href = 'login.html';
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error: ' + error.message);
        } else {
            alert('Login successful!');
            window.location.href = 'index.html';
        }
    });
}

// Check if user is logged in and update UI
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// Update header based on auth state
async function updateHeader() {
    const user = await checkAuth();
    const loginBtn = document.querySelector('.login-btn');
    const hamburger = document.querySelector('.hamburger');
    
    if (user && loginBtn) {
        loginBtn.style.display = 'none';
        
        // Create profile picture
        const profilePic = document.createElement('div');
        profilePic.className = 'profile-pic';
        profilePic.textContent = user.user_metadata?.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
        profilePic.onclick = logout;
        
        hamburger.parentNode.insertBefore(profilePic, hamburger);
    }
}

// Call on page load
if (document.querySelector('.login-btn')) {
    updateHeader();
}

// Logout function
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    }
}
