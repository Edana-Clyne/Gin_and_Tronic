// 1. Initialize Supabase
const _supabase = supabase.createClient('https://gxgopzsqfhckjjqaiqye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z29wenNxZmhja2pqcWFpcXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTYwMDgsImV4cCI6MjA4NzE3MjAwOH0.NggJExSSWG0jNRA_twt-KJYod2fVqhs7EkTElXjspzQ');

// 2. Global Variables
let allPlaces = [], map, markersGroup, isAdmin = false;
let isReadAloudActive = false;
const synth = window.speechSynthesis;

// 3. Accessibility & Reading Functions
function toggleDropdown() { 
    document.getElementById("acc-menu").classList.toggle("show"); 
}

function setTheme(theme) {
    document.body.classList.remove('dark-mode', 'high-contrast');
    if (theme === 'dark') document.body.classList.add('dark-mode');
    if (theme === 'high-contrast') document.body.classList.add('high-contrast');
}

function toggleDyslexicFont() {
    const isDys = document.body.classList.toggle('dyslexic-font');
    const btn = document.getElementById('dyslexicBtn');
    if (btn) btn.innerText = isDys ? "Dyslexic Font: On" : "Dyslexic Font: Off";
}

function changeTextSize(size) { 
    document.documentElement.style.fontSize = size + 'px'; 
}

function toggleReadAloud() {
    isReadAloudActive = !isReadAloudActive;
    const btn = document.getElementById('readAloudBtn');
    if (isReadAloudActive) {
        btn.innerText = "🔊 Read Aloud: On";
        btn.style.backgroundColor = "#7D9D85";
        btn.style.color = "white";
        const welcome = new SpeechSynthesisUtterance("Read aloud active. Click text to hear it.");
        synth.speak(welcome);
    } else {
        btn.innerText = "🔊 Read Aloud: Off";
        btn.style.backgroundColor = "";
        btn.style.color = "";
        synth.cancel();
    }
}

// Global click listener for reading text
document.addEventListener('click', (e) => {
    if (!isReadAloudActive) return;
    if (['BUTTON', 'INPUT', 'LABEL', 'A'].includes(e.target.tagName)) return;
    if (e.target.closest('#map')) return;

    const text = e.target.innerText;
    if (text && text.trim().length > 0) {
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.9;
        synth.speak(utter);
    }
});

// 4. Map & Data Logic
function initMap() {
    if (map) return;
    map = L.map('map', { center: [53.5461, -113.4938], zoom: 11 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    markersGroup = L.layerGroup().addTo(map);
}

async function loadPlaces() {
    const { data, error } = await _supabase.from('Places').select('*').order('id', { ascending: true });
    if (!error) { allPlaces = data; filterPlaces(); }
}

function filterPlaces() {
    const list = document.getElementById('places-list');
    const term = document.getElementById('searchInput').value.toLowerCase();
    list.innerHTML = '';
    markersGroup.clearLayers();

    allPlaces.forEach(p => {
        if (p.name.toLowerCase().includes(term)) {
            if (p.lat && p.lng) L.marker([p.lat, p.lng]).addTo(markersGroup).bindPopup(p.name);
            list.innerHTML += `
                <div class="place-card" onclick="map.flyTo([${p.lat}, ${p.lng}], 15)">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.address || ''}</p>
                    </div>
                </div>`;
        }
    });
}

function showView(view) {
    document.getElementById('explore-view').style.display = view === 'explore' ? 'block' : 'none';
    document.getElementById('post-view').style.display = view === 'post' ? 'block' : 'none';
    if(view === 'explore') { initMap(); loadPlaces(); }
}

// 5. Initialize
window.onload = () => {
    initMap();
    loadPlaces();
};