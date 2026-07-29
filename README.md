# Emergency Assistance Platform

## MCA Major Project

An open-source Emergency Assistance Platform designed to quickly provide help during critical situations, without requiring login from regular users.

### Features
- **SOS Functionality**: Get immediate geolocation and critical emergency contacts.
- **Nearby Services**: Locate nearby hospitals, police stations, and fire stations using Map integration.
- **First Aid Guides**: Step-by-step procedures to follow during emergencies.
- **Admin Dashboard**: Secured via JWT, allowing CRUD operations for services, guides, and feedback management.

### Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Leaflet, Axios.
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt.
- **Deployment**: Dockerized for easy deployment on Render.

### Running Locally with Docker

1. Clone the repository.
2. Ensure you have an `.env` file in the `server` directory with `MONGO_URI` and `JWT_SECRET`.
3. Run `docker-compose up --build`.

### Future Scope
- Push notifications for registered emergency contacts.
- Live ambulance tracking.
- Voice-activated SOS.
