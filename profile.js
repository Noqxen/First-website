const SUPABASE_URL = 'https://dasyfwepnpfhvmltxywf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3lmd2VwbnBmaHZtbHR4eXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjMyMTEsImV4cCI6MjA4Njk5OTIxMX0.0G7DW_aubEGE4siP1m79bzxfgEAnlZDNv5xgaYHvpNE';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load current user data
async function loadProfile() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        document.getElementById('profileName').value = user.user_metadata?.name || '';
        document.getElementById('profileUsername').value = user.user_metadata?.username || '';
    } else {
        window.location.href = 'login.html';
    }
}

// Update profile
const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('profileName').value;
    const username = document.getElementById('profileUsername').value;

    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        alert('Username can only contain lowercase letters, numbers, and underscores!');
        return;
    }

    const { data, error } = await supabaseClient.auth.updateUser({
        data: { name, username }
    });

    if (error) {
        alert('Error: ' + error.message);
    } else {
        alert('Profile updated successfully!');
        window.location.href = 'index.html';
    }
});

// Prevent invalid characters in username
document.getElementById('profileUsername').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-z0-9_]/g, '');
});

loadProfile();
