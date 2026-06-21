// INTEGRATED CREDENTIALS HERE
const SUPABASE_URL = "https://rajnjailyrkvlztazipz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u8noafAc4uo6rnozuSLVsA_bv4dX-1j";
const ACADEMY_WHATSAPP_NUMBER = "923479290925"; // replace with your whatsapp number

// Initialize Supabase Client Connection
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

// Initial setup on layout render
updateUserInterfaceStatus();

// Handles shifting view between different class pages
function switchClass(classId) {
    document.querySelectorAll('.class-btn').forEach(btn => btn.className = "class-btn shrink-0 w-48 bg-slate-800/80 text-slate-400 font-bold rounded-xl p-4 text-center border border-slate-700/60 transition-all");
    document.getElementById('btn-' + classId).className = "class-btn shrink-0 w-48 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl p-4 text-center border border-blue-400/50 transition-all";
    
    if(classId === 'class9') {
        document.getElementById('class9-page').classList.remove('hidden');
        document.getElementById('fallback-page').classList.add('hidden');
    } else {
        document.getElementById('class9-page').classList.add('hidden');
        document.getElementById('fallback-page').classList.remove('hidden');
    }
}

// Modal Toggle Controllers
function openAuthModal(tab) {
    document.getElementById('auth-modal').classList.remove('hidden');
    toggleAuthTabs(tab);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthTabs(tab) {
    if(tab === 'login') {
        document.getElementById('login-tab').classList.remove('hidden');
        document.getElementById('signup-tab').classList.add('hidden');
    } else {
        document.getElementById('login-tab').classList.add('hidden');
        document.getElementById('signup-tab').classList.remove('hidden');
    }
}

// SUPABASE BACKEND REGISTRATION QUERY
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-pass').value;

    const { data, error } = await _supabase
        .from('students')
        .insert([{ name: name, email: email, password: password }])
        .select();

    if (error) {
        alert("Database Error: " + error.message);
    } else {
        alert("Account created successfully in your Supabase table!");
        saveLoginSession({ name, email });
    }
}

// SUPABASE BACKEND LOGIN RECORD CHECKER
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const { data, error } = await _supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .eq('password', password);

    if (error) {
        alert("Authentication Error: " + error.message);
    } else if (data && data.length > 0) {
        alert("Welcome Back!");
        saveLoginSession({ name: data[0].name, email: data[0].email });
    } else {
        alert("Invalid account credentials or wrong password confirmation.");
    }
}

// Session state memory variables
function saveLoginSession(userObj) {
    localStorage.setItem('loggedInUser', JSON.stringify(userObj));
    currentUser = userObj;
    updateUserInterfaceStatus();
    closeAuthModal();
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    currentUser = null;
    updateUserInterfaceStatus();
}

// Renders profile layout variations depending on login status
function updateUserInterfaceStatus() {
    const container = document.getElementById('auth-status-container');
    if(currentUser) {
        container.innerHTML = `
            <span class="text-xs text-slate-400 mr-3">Student: <b>${currentUser.name}</b></span>
            <button onclick="handleLogout()" class="bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs px-3 py-1.5 rounded border border-red-800">Logout</button>
        `;
    } else {
        container.innerHTML = `
            <button onclick="openAuthModal('login')" class="bg-blue-600 hover:bg-blue-500 text-sm font-semibold px-4 py-2 rounded-lg transition">Student Login</button>
        `;
    }
}

// WhatsApp Redirection Query Builder
function handlePurchase(className, subjectKey) {
    if(!currentUser) {
        alert("Authentication required! Please sign in or register an account first.");
        openAuthModal('login');
        return;
    }

    const selectId = 'chap-' + subjectKey;
    const selectedChapter = document.getElementById(selectId).value;
    
    const customMsg = `Hello Modern Science Academy!%0A%0AI am a registered student: *${currentUser.name}* (${currentUser.email}). I want to buy notes for:%0A%0A📌 *Class:* ${className}%0A📚 *Subject:* ${subjectKey}%0A📖 *Chapter:* ${selectedChapter}`;
    
    window.open(`https://wa.me/${ACADEMY_WHATSAPP_NUMBER}?text=${customMsg}`, '_blank');
}
