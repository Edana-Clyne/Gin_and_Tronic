// 1. Initialize Supabase
const _supabase = supabase.createClient(
    'https://gxgopzsqfhckjjqaiqye.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Use your full key here
);

// 2. Global Variables
let allPlaces = [], map, markersGroup, isAdmin = false;

// 3. Map Setup (Constrained to Edmonton + 50km)
function initMap() {
    if (map) return;
    
    // Coordinates for the Edmonton "Box"
    const southWest = L.latLng(53.2, -114.1);
    const northEast = L.latLng(53.9, -112.9);
    const bounds = L.latLngBounds(southWest, northEast);

    map = L.map('map', {
        center: [53.5461, -113.4938],
        zoom: 11,
        minZoom: 9,
        maxBounds: bounds,         // Invisible walls
        maxBoundsViscosity: 1.0    // Snap-back strength
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    markersGroup = L.layerGroup().addTo(map);
}

// 4. Admin Perspective Logic
function adminLogin() {
    const pass = prompt("Enter Admin Password:");
    if (pass === "EDMONTON2026") {
        isAdmin = true;
        alert("Admin Mode Active. Delete buttons are now visible on cards.");
        filterPlaces(); // Refresh cards to show delete buttons
    } else {
        alert("Access Denied.");
    }
}

async function deletePlace(id) {
    if (!confirm("Are you sure you want to delete this business?")) return;
    
    const { error } = await _supabase
        .from('Places')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Error: " + error.message);
    } else {
        // Refresh the local list after deletion
        loadPlaces();
    }
}

// 5. Navigation & Data Loading
function showView(view) {
    document.getElementById('explore-view').style.display = view === 'explore' ? 'block' : 'none';
    document.getElementById('post-view').style.display = view === 'post' ? 'block' : 'none';
    if(view === 'explore') { 
        initMap(); 
        loadPlaces(); 
    }
}

async function loadPlaces() {
    const { data, error } = await _supabase.from('Places').select('*');
    if (!error) { 
        allPlaces = data; 
        filterPlaces(); 
    }
}

// 6. Filtering & Rendering Cards
function filterPlaces() {
    const list = document.getElementById('places-list');
    const term = document.getElementById('searchInput').value.toLowerCase();
    const activeFilters = Array.from(document.querySelectorAll('.filter:checked')).map(cb => cb.id);
    
    list.innerHTML = '';
    markersGroup.clearLayers();

    allPlaces.forEach(p => {
        const matchesSearch = p.name.toLowerCase().includes(term);
        const matchesFilters = activeFilters.every(f => p[f] === true);

        if (matchesSearch && matchesFilters) {
            // Add Marker to Map
            if (p.lat && p.lng) {
                L.marker([p.lat, p.lng]).addTo(markersGroup).bindPopup(p.name);
            }
            
            // Add Card to List
            list.innerHTML += `
                <div class="place-card" onclick="document.getElementById('map').scrollIntoView({behavior:'smooth'}); map.flyTo([${p.lat}, ${p.lng}], 15)">
                    ${p.image_url ? `<img src="${p.image_url}" style="width:100%; height:150px; object-fit:cover;">` : ''}
                    <div class="card-content">
                        <h3 style="margin:0; color:var(--accent)">${p.name}</h3>
                        <small style="display:block; margin: 5px 0;">Languages: ${p.languages || 'English'}</small>
                        
                        ${isAdmin ? `
                            <button class="delete-btn" onclick="event.stopPropagation(); deletePlace('${p.id}')">
                                Delete Business
                            </button>
                        ` : ''}
                    </div>
                </div>`;
        }
    });
}

// 7. Autocomplete (Edmonton Bounded)
const nameInput = document.getElementById('name');
const resDiv = document.getElementById('autocomplete-results');

nameInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 3) return resDiv.style.display = 'none';

    // Restricting search results to Edmonton area
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=-114.1,53.9,-112.9,53.2&bounded=1&limit=5`);
    const data = await resp.json();

    resDiv.innerHTML = '';
    resDiv.style.display = 'block';
    data.forEach(place => {
        const d = document.createElement('div');
        d.className = 'suggestion-item';
        d.innerText = place.display_name;
        d.onclick = () => {
            nameInput.value = place.display_name.split(',')[0];
            document.getElementById('lat').value = place.lat;
            document.getElementById('lng').value = place.lon;
            resDiv.style.display = 'none';
        };
        resDiv.appendChild(d);
    });
});

// 8. Handle New Submissions
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Uploading...';

    const file = document.getElementById('image-upload').files[0];
    let imageUrl = "";

    // Upload image to Supabase Bucket if file exists
    if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: upData, error: upErr } = await _supabase.storage.from('place-images').upload(fileName, file);
        if (!upErr) {
            const { data: urlData } = _supabase.storage.from('place-images').getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }
    }

    // Insert data into "Places" table
    const { error } = await _supabase.from('Places').insert([{
        name: nameInput.value,
        lat: parseFloat(document.getElementById('lat').value),
        lng: parseFloat(document.getElementById('lng').value),
        image_url: imageUrl,
        languages: document.getElementById('language-input').value,
        wheel_chair: document.getElementById('wheel-check').checked,
        ASL_accessible: document.getElementById('asl-check').checked,
        service_animals: document.getElementById('service-check').checked,
        low_noise_level: document.getElementById('noise-check').checked
    }]);

    if (error) {
        alert(error.message);
    } else {
        alert("Spot Added!");
        showView('explore');
    }
    btn.innerText = 'Submit Spot';
});

// 9. Utility Functions
window.onload = () => { initMap(); loadPlaces(); };
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

