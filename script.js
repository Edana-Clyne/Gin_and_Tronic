// 1. Initialize Map
const map = L.map('map').setView([53.5461, -113.4938], 12);

// 2. Define a custom icon (Using a direct PNG link)
const coffeeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 3. Load Map Tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 4. Data List
const accessiblePlaces = [
    { name: "Kind Ice Cream", lat: 53.5181, lng: -113.4772, info: "Level entry, automatic doors." },
    { name: "Stanley Milner Library", lat: 53.5419, lng: -113.4901, info: "Full elevator access." },
    { name: "Remedy Cafe (Whyte Ave)", lat: 53.5195, lng: -113.4991, info: "Ramp access at side entrance." }
];

// 5. FUNCTION: Load onto map
function loadPlaces(placesArray) {
    placesArray.forEach(place => {
        // FIXED: The icon is now correctly passed into the marker options
        const marker = L.marker([place.lat, place.lng], { icon: coffeeIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="font-family: sans-serif; line-height: 1.4;">
                <h3 style="margin:0; color: #d35400;">${place.name}</h3>
                <p style="margin: 5px 0;"><strong>♿ Accessibility:</strong> ${place.info}</p>
                <hr>
                <small>Source: Team Gin & Tronic Verified</small>
            </div>
        `);
    });
}

// 6. Run it
loadPlaces(accessiblePlaces);

// 7. Form Submission Function
function addBusinessFromForm(name, lat, lng, info) {
    const newBiz = { name: name, lat: lat, lng: lng, info: info };
    loadPlaces([newBiz]);
    map.flyTo([lat, lng], 14);
}

