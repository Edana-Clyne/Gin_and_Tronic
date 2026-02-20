/// <reference path="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />

var map = L.map('map').setView([53.5461, -113.4938], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// A test marker for the Alberta Legislature Building
L.marker([53.5333, -113.5065]).addTo(map)
    .bindPopup('Alberta Legislature Building<br>Accessible Entrance on West Side.')
    .openPopup();