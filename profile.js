const SUPABASE_URL = 'https://dasyfwepnpfhvmltxywf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3lmd2VwbnBmaHZtbHR4eXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjMyMTEsImV4cCI6MjA4Njk5OTIxMX0.0G7DW_aubEGE4siP1m79bzxfgEAnlZDNv5xgaYHvpNE';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let profilePicFile = null;

// Load current user data
async function loadProfile() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        document.getElementById('profileName').value = user.user_metadata?.name || '';
        document.getElementById('profileUsername').value = user.user_metadata?.username || '';
        
        if (user.user_metadata?.profile_pic) {
            document.getElementById('profileImage').src = user.user_metadata.profile_pic;
        }
        
        checkUpdateLimits(user);
    } else {
        window.location.href = 'login.html';
    }
}

// Check update limits
function checkUpdateLimits(user) {
    const now = Date.now();
    const nameLastUpdated = user.user_metadata?.name_updated_at || 0;
    const usernameLastUpdated = user.user_metadata?.username_updated_at || 0;
    
    const nameDays = Math.floor((now - nameLastUpdated) / (1000 * 60 * 60 * 24));
    const usernameDays = Math.floor((now - usernameLastUpdated) / (1000 * 60 * 60 * 24));
    
    if (nameDays < 10) {
        document.getElementById('nameWarning').textContent = `You can change your name in ${10 - nameDays} days`;
        document.getElementById('nameWarning').style.display = 'block';
        document.getElementById('profileName').disabled = true;
    }
    
    if (usernameDays < 60) {
        document.getElementById('usernameWarning').textContent = `You can change your username in ${60 - usernameDays} days`;
        document.getElementById('usernameWarning').style.display = 'block';
        document.getElementById('profileUsername').disabled = true;
    }
}

// Handle profile picture upload
document.getElementById('profilePicInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        profilePicFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

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

    let profilePicUrl = null;
    if (profilePicFile) {
        const reader = new FileReader();
        profilePicUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(profilePicFile);
        });
    }

    const updateData = {};
    if (!document.getElementById('profileName').disabled) {
        updateData.name = name;
        updateData.name_updated_at = Date.now();
    }
    if (!document.getElementById('profileUsername').disabled) {
        updateData.username = username;
        updateData.username_updated_at = Date.now();
    }
    if (profilePicUrl) {
        updateData.profile_pic = profilePicUrl;
    }

    const { data, error } = await supabaseClient.auth.updateUser({
        data: updateData
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
