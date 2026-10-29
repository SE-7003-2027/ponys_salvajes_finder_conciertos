# ADR 0001: Music data for the artist profile

**Status:** Proposed

**Date:** 2026-10-24

**Related issue:** #42 (Sprint 3: link to the artist's Spotify profile and discography preview)

## Context

Issue #42 asks the artist page to show the artist's discography, let users hear a preview of some songs, and link to the artist's Spotify profile.

Spotify changed its Web API for development mode apps in February 2026:

- `GET /artists/{id}/top-tracks` was removed, so we cannot list popular songs through the API.
- Search returns at most 10 results.
- The owner of a development mode app needs a Spotify Premium account, and new apps allow 5 users.
- New apps no longer receive `preview_url` for tracks (since November 2024).

`GET /artists/{id}` and `GET /artists/{id}/albums` are still available. Since Sprint 3 the team shares one Spotify app (also used for Spotify login, #39), so every teammate uses the same `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`. That app is the single point of failure: if its owner's Premium lapses, every Spotify call stops working.

Until now the client called Ticketmaster directly with `VITE_TICKETMASTER_API_KEY`, which ships the key to every browser. The Spotify client secret cannot be handled that way.

## Decision

1. **The server owns the integration.** A new endpoint, `GET /api/artists/:id/music`, takes the Ticketmaster attraction id that the `/artist/:id` page already uses and returns our own shape (`spotify` + `discography`). The client never sees Spotify, MusicBrainz or Ticketmaster payloads for this feature.
2. **Spotify ids come from Ticketmaster first.** Ticketmaster attractions usually include `externalLinks.spotify` and `externalLinks.musicbrainz`, so most artists need no search at all.
3. **Previews use the Spotify embedded player** (`open.spotify.com/embed/artist/{id}`). It needs no API call or credentials and plays the artist's popular tracks.
4. **The discography uses Spotify when credentials exist, and MusicBrainz otherwise.** MusicBrainz is free, needs no key, and covers most artists. Cover art comes from the Cover Art Archive.
5. **Provider failures never break the page.** Each provider call is isolated; the page loads music separately from concerts. Results are cached in memory for 6 hours.

## Consequences

**Pros**

- The feature keeps working if the shared Spotify app stops working (expired Premium, revoked credentials): the player still embeds and the discography switches to MusicBrainz.
- Adding Spotify credentials later switches the discography source with no client change.
- No secret reaches the browser, and the client depends on one stable contract.
- The endpoint is the first step to moving all Ticketmaster calls to the server.

**Cons**

- The server needs its own `TICKETMASTER_API_KEY` (same key as the client for now).
- MusicBrainz allows about 1 request per second; we throttle requests and cache results, but a burst of new artists will be slow.
- MusicBrainz data and covers can be incomplete for small or regional artists.
- The in-memory cache is lost on restart and is not shared between server instances.

## Alternatives considered

- **Call Spotify from the client:** rejected, it would expose the client secret.
- **Wait for Spotify user OAuth (#39):** not needed, because the Client Credentials flow covers public artist data.
- **iTunes Search API for previews:** works without a key, but mixes a second streaming brand into a Spotify feature.
