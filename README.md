# Gin_and_Tronic

AccessifiED | Accessible Spaces Explorer
AccessifiED is a community-driven web application designed to help people—particularly those with mobility, sensory, or cognitive needs—find and share accessible local businesses. By focusing on detailed accessibility metadata and user-verified voting, we aim to make navigating the city more predictable and inclusive.

 Key Features
 Discovery & Filtering
Dynamic Map: Integrated Leaflet.js map with custom markers for business locations.

Smart Search: Real-time search by business name.

Multi-Category Filters: Filter locations by specific needs:

Physical: Wheelchair access, Automatic doors.

Sensory: Low noise, Low sensory environment, Low interaction.

Communication: ASL-trained staff, Written info, Screen reader compatibility.

 Accessibility First (Built-in)
Read Aloud Mode: Text-to-speech integration for users with visual impairments.

Dyslexic Font: A toggleable font-style to assist users with dyslexia.

High Contrast & Dark Mode: Specialized themes for light sensitivity and visual clarity.

Responsive Scaling: User-controlled text sizing from 14px to 32px.
Community Contribution
Add a Place: A simple form to register new locations using the Nominatim (OpenStreetMap) API for address autocomplete.

User Verification: A "Did you find this place accessible?" voting system (👍/👎) allows the community to verify business claims.

 Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript.

Typography: Lexend (Designed to reduce visual noise) and OpenDyslexic.

Mapping: Leaflet.js with OpenStreetMap tiles.

Backend & Database: Supabase (PostgreSQL + Storage for image uploads).

Geocoding: Nominatim API.

 Database Schema
The application relies on a Supabase table named Places with the following key columns:

name (Text)

address (Text)

lat, lng (Float)

likes, dislikes (Integer)

image_url (Text)

Accessibility booleans: wheel_chair, low_noise_level, service_animals, etc.

⚙️ Setup & Installation
Clone the repository:

Bash
git clone https://github.com/your-username/accessified.git
Open index.html:
Since this is a client-side application, you can run it directly in a browser or via a Live Server extension in VS Code.

Supabase Configuration:
Ensure your Supabase project has a bucket named place-images set to Public to allow photo uploads.

 Contributing
We welcome contributions! If you have ideas for new accessibility tags or UI improvements:

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

Built with ❤️ for a more accessible world.


