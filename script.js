
    // 1. Initialize Supabase
    const _supabase = supabase.createClient('https://gxgopzsqfhckjjqaiqye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z29wenNxZmhja2pqcWFpcXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTYwMDgsImV4cCI6MjA4NzE3MjAwOH0.NggJExSSWG0jNRA_twt-KJYod2fVqhs7EkTElXjspzQ');
    
    // 2. Global Variables
    let allPlaces = [], map, markersGroup, isAdmin = false;
    let isReadAloudActive = false; 
    const synth = window.speechSynthesis; 

    // 3. Accessibility & Reading Functions
    function toggleDropdown() { document.getElementById("acc-menu").classList.toggle("show"); }
    
    function setTheme(theme) {
        document.body.classList.remove('dark-mode', 'high-contrast');
        if(theme === 'dark') document.body.classList.add('dark-mode');
        if(theme === 'high-contrast') document.body.classList.add('high-contrast');
    }

    function toggleDyslexicFont() {
        const isDys = document.body.classList.toggle('dyslexic-font');
        document.getElementById('dyslexicBtn').innerText = isDys ? "Dyslexic Font: On" : "Dyslexic Font: Off";
    }

    function changeTextSize(size) { document.documentElement.style.fontSize = size + 'px'; }

    // --- READ ALOUD FEATURE ---
    function toggleReadAloud() {
        isReadAloudActive = !isReadAloudActive;
        const btn = document.getElementById('readAloudBtn');
        if (isReadAloudActive) {
            btn.innerText = "🔊 Read Aloud: On";
            btn.style.backgroundColor = "var(--accent)";
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

    document.addEventListener('click', (e) => {
        if (!isReadAloudActive) return;
        if (['BUTTON', 'INPUT', 'LABEL'].includes(e.target.tagName)) return;
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
        const southWest = L.latLng(53.2, -114.1);
        const northEast = L.latLng(53.9, -112.9);
        const bounds = L.latLngBounds(southWest, northEast);

        map = L.map('map', {
            center: [53.5461, -113.4938],
            zoom: 11,
            minZoom: 10,
            maxBounds: bounds,
            maxBoundsViscosity: 0.5
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        markersGroup = L.layerGroup().addTo(map);
    }

    async function loadPlaces() {
        const { data, error } = await _supabase.from('Places').select('*');
        if (!error) { allPlaces = data; filterPlaces(); }
    }

    function filterPlaces() {
        const list = document.getElementById('places-list');
        const term = document.getElementById('searchInput').value.toLowerCase();
        const activeFilters = Array.from(document.querySelectorAll('.filter:checked')).map(cb => cb.id);
        
        list.innerHTML = '';
        markersGroup.clearLayers();

        allPlaces.forEach(p => {
            const matchesName = p.name.toLowerCase().includes(term);
            const matchesFeatureSearch = 
                (term.includes("wheel") && p.wheel_chair) ||
                (term.includes("noise") && p.low_noise_level) ||
                (term.includes("asl") && p.ASL_accessible) ||
                (term.includes("sensory") && p.low_sensory);

            const matchesSidebarFilters = activeFilters.every(f => p[f] === true);

            if ((matchesName || matchesFeatureSearch || term === "") && matchesSidebarFilters) {
                if (p.lat && p.lng) { 
                    L.marker([p.lat, p.lng]).addTo(markersGroup).bindPopup(p.name); 
                }

                let tagsHtml = '<div class="tag-container">';
                if(p.wheel_chair) tagsHtml += '<span class="tag-item">Wheelchair</span>';
                if(p.low_noise_level) tagsHtml += '<span class="tag-item">Quiet</span>';
                if(p.ASL_accessible) tagsHtml += '<span class="tag-item">ASL</span>';
                if(p.low_sensory) tagsHtml += '<span class="tag-item">Low Sensory</span>';
                tagsHtml += '</div>';

                list.innerHTML += `
                    <div class="place-card" onclick="map.flyTo([${p.lat}, ${p.lng}], 15)">
                        ${p.image_url ? `<img src="${p.image_url}" style="width:100%; height:160px; object-fit:cover;">` : ''}
                        <div class="card-content">
                            <h3 style="margin:0; color:var(--accent)">${p.name}</h3>
                            ${tagsHtml}
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

    window.onload = () => { initMap(); loadPlaces(); };

