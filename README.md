![Ponys Salvajes Banner](img/imgBanner.png)

# 🐴 Ponys Salvajes | Concert Finder 🎸

<div align="center">

  **Gallop towards music: The app that connects your musical tastes with the stage.**

  <p>
    <a href="#what-this-is">What this is</a> ·
    <a href="#team-members">Team members</a> ·
    <a href="#features">Features</a> ·
    <a href="#stack">Stack</a> ·
    <a href="#how-to-run-it">How to run it</a> ·
    <a href="#documentation">Documentation</a>
  </p>

</div>

## What this is

**Concert Finder** is a web application to search, discover, and track concerts
and musical events.

Find details about your favorite artists and bands, and discover which events
suit you best based on your location, preferred dates, price range, and more.

If you are unsure where to start, the app recommends events tailored to your
music taste.

## Team members

Our team is **Ponys Salvajes**, composed of:

- García Nelson
- Corona Alexis
- Monroy Sofia
- Gómez Jesús
- Hernandez Carlos

## Features

We work following the _User Story Mapping_ framework, delivering incremental
value every two-week sprint to continuously improve the user experience.

**Key features** include:

- **Personalized recommendations** based on your listening history.
- **Search filters** to quickly find events by city, date, or venue.
- **A review system** to rate and share feedback on past events.
- **Artist profiles** with confirmed tour dates, embedded audio player, discography, and direct ticket links.

Detailed planning is documented in [`USM.md`](/USM.md).

## Stack

| Component / Layer | Technology |
| --- | --- |
| **Frontend** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript |
| **Backend** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Music APIs** | [Spotify Web API](https://developer.spotify.com/documentation/web-api) & [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API) |
| **Ticketing API** | [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) |

## How to run it

### Requirements
* **Node.js** 20 or newer and a package manager (`npm` or `pnpm`).
* **PostgreSQL** (v15 or newer) running locally.
* **Git**

### Setup Instructions

1. **Clone the repository:**
   Open your terminal and run:
   ```bash
   git clone [https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos.git](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos.git)
   cd ponys_salvajes_finder_conciertos
   ```

2. **Database Setup (PostgreSQL):**
   Make sure your local PostgreSQL service is running, then create the `concert_finder` database and initialize the tables using `server/schema.sql`:
   ```bash
   sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'admin';"
   sudo -u postgres createdb concert_finder
   sudo -u postgres psql -d concert_finder -f server/schema.sql
   ```

3. **Environment Variables:** 
   The `client` and the `server` each have their own `.env` file. Copy the example templates and fill in the values shared by the team:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```
   * **Database & Auth (`server/.env`):** `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `PORT`, and `JWT_SECRET` for PostgreSQL connection and session signing.
   * **Ticketmaster (`server/.env` & `client/.env`):** `TICKETMASTER_API_KEY` (server) and `VITE_TICKETMASTER_API_KEY` (client) from the [Ticketmaster Discovery API](https://developer.ticketmaster.com/).
   * **Spotify (`server/.env` & `client/.env`):** `VITE_SPOTIFY_CLIENT_ID` (client), along with `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, and `ENCRYPTION_KEY` (server). The artist discography uses Spotify when credentials are set and falls back to MusicBrainz otherwise.

   > **Note:** Never commit `.env` files. They are already listed in `.gitignore`.

4. **Run the server and the client** (in two separate terminals):

   **Terminal 1 — Backend (`http://localhost:3000`):**
   ```bash
   cd server
   npm install
   npm run start   # (or npm run dev)
   ```

   **Terminal 2 — Frontend (`http://127.0.0.1:5173`):**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Run the server unit tests anytime with:
   ```bash
   cd server && npm test
   ```

   > ⚠️ **Important for Spotify Login:** 
   > 1. Always open the frontend in your browser using **`http://127.0.0.1:5173`** instead of `localhost`. Spotify's OAuth security strictly requires the exact IP registered in the Redirect URI (`http://127.0.0.1:5173/spotify/callback`).
   > 2. Because the Spotify app is in *Development Mode*, make sure your Spotify account email is registered under **User Management** in the team's Spotify Developer Dashboard before logging in with Spotify.

## Documentation

Detailed technical specifications and project management guidelines are maintained in the project's [GitHub Wiki](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki).

**Core Documentation:**
* **[Project Overview & Stack](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Home):** User Story Mapping and technology stack.
* **[Authentication & Sessions](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Authentication):** JWT handling and session persistence.
* **[Event Data & Caching](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Event-Data):** Ticketmaster API integration and localStorage specs.
* **[Search & Routing](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Search-and-Routing):** Live search and dynamic artist profiles.

<p align="center"><sub>Built with 🐴 by Ponys Salvajes</sub></p>