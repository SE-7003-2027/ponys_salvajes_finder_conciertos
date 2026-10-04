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
* Node.js and a package manager: npm or pnpm.
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
Create a .env file in the root directory to store your local credentials (Such as Spotify API, Ticketmaster API, and PostgreSQL connections URIs)
Note: Never commit this file,Make sure .env is listed in your .gitignore

4. **Run the development server:**
Start the local environment by running: 
npm run dev  
This application will be available in your browser

## Documentation

> [!NOTE]
> This section is under development. Detailed specifications will be added soon.

Further documentation is available in the project's GitHub Wiki.

<p align="center"><sub>Built with 🐴 by Ponys Salvajes</sub></p>
