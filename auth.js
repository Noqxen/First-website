// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://dasyfwepnpfhvmltxywf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3lmd2VwbnBmaHZtbHR4eXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjMyMTEsImV4cCI6MjA4Njk5OTIxMX0.0G7DW_aubEGE4siP1m79bzxfgEAnlZDNv5xgaYHvpNE';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Sign Up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
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

// Check if user is logged in
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// Logout function
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    }
}
