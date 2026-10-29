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
- **Artist profiles** with confirmed tour dates and direct ticket links.

Detailed planning is documented in [`USM.md`](/USM.md).

## Stack

| Component / Layer | Technology |
| --- | --- |
| **Frontend** | [React](https://react.dev/) |
| **Backend** | [Express](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Music API** | [Spotify Web API](https://developer.spotify.com/documentation/web-api) |
| **Ticketing API** | [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) |

## How to run it
**Requirements**
* Node.js 20 or newer and a package manager: npm or pnpm.
* Git
* Vite

**Setup Instructions** 
1. **Clone the repository:**
Open your terminal and run:
git clone [https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos.git](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos.git)
   cd ponys_salvajes_finder_conciertos

2. **Install dependencies:**
Install the required packages by running:
npm install or pnpm install if you are using pnpm

3. **Environment Variables:** 
The client and the server each have their own `.env`. Copy the examples and fill in your values:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```
   * `TICKETMASTER_API_KEY` (server) and `VITE_TICKETMASTER_API_KEY` (client): your [Ticketmaster Discovery API](https://developer.ticketmaster.com/) key.
   * `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` (server, optional): credentials of a Spotify app. Without them the artist discography comes from MusicBrainz, and the Spotify button and player still work. Creating a Spotify app in development mode requires a Spotify Premium account.

   Note: never commit these files. `.env` is already listed in `.gitignore`.

4. **Run the server and the client** (in two terminals):
   ```bash
   cd server && npm install && npm run dev   # API on http://localhost:3000
   cd client && npm install && npm run dev   # app on http://localhost:5173
   ```
   Run the server tests with `cd server && npm test`.

## Documentation

Detailed technical specifications and project management guidelines are maintained in the project's [GitHub Wiki](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki).

**Core Documentation:**
* **[Project Overview & Stack](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Home):** User Story Mapping and technology stack.
* **[Authentication & Sessions](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Authentication):** JWT handling and session persistence.
* **[Event Data & Caching](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Event-Data):** Ticketmaster API integration and localStorage specs.
* **[Search & Routing](https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos/wiki/Search-and-Routing):** Live search and dynamic artist profiles.
<p align="center"><sub>Built with 🐴 by Ponys Salvajes</sub></p>
