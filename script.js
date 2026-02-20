/// <reference path="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />

var map = L.map('map').setView([53.5461, -113.4938], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);



