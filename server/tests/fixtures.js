/** Trimmed copies of real API payloads used across tests. */

const SPOTIFY_ID = '6M2wZ9GZgrQXHCFfjv46we';
const MUSICBRAINZ_ID = '6f1a58bf-9b1b-49cf-a44a-6cefad7ae04f';

const attractionWithLinks = {
  id: 'K8vZ9175rX7',
  name: 'Dua Lipa',
  externalLinks: {
    spotify: [{ url: `https://open.spotify.com/artist/${SPOTIFY_ID}?si=abc` }],
    musicbrainz: [{ id: MUSICBRAINZ_ID, url: `https://musicbrainz.org/artist/${MUSICBRAINZ_ID}` }],
  },
};

const attractionWithoutLinks = {
  id: 'K8vZ917Gku7',
  name: 'Beyoncé',
};

const releaseGroups = {
  'release-groups': [
    { id: 'rg-1', title: 'Future Nostalgia', 'primary-type': 'Album', 'secondary-types': [], 'first-release-date': '2020-03-27' },
    { id: 'rg-2', title: 'Radical Optimism', 'primary-type': 'Album', 'secondary-types': [], 'first-release-date': '2024-05-03' },
    { id: 'rg-3', title: 'Club Future Nostalgia', 'primary-type': 'Album', 'secondary-types': ['Remix'], 'first-release-date': '2020-08-28' },
    { id: 'rg-4', title: 'Live at Wembley', 'primary-type': 'Album', 'secondary-types': ['Live'], 'first-release-date': '2022-01-01' },
    { id: 'rg-5', title: 'Be the One', 'primary-type': 'Single', 'secondary-types': [], 'first-release-date': '2015' },
  ],
};

const spotifyAlbums = {
  items: [
    {
      id: 'al-1',
      name: 'Future Nostalgia',
      album_type: 'album',
      release_date: '2020-03-27',
      images: [
        { url: 'https://i.scdn.co/640.jpg', width: 640 },
        { url: 'https://i.scdn.co/300.jpg', width: 300 },
        { url: 'https://i.scdn.co/64.jpg', width: 64 },
      ],
      external_urls: { spotify: 'https://open.spotify.com/album/al-1' },
    },
    {
      id: 'al-2',
      name: 'Future Nostalgia',
      album_type: 'album',
      release_date: '2020-03-27',
      images: [],
      external_urls: { spotify: 'https://open.spotify.com/album/al-2' },
    },
    {
      id: 'al-3',
      name: 'Houdini',
      album_type: 'single',
      release_date: '2023-11',
      images: [{ url: 'https://i.scdn.co/houdini.jpg', width: 640 }],
      external_urls: { spotify: 'https://open.spotify.com/album/al-3' },
    },
  ],
};

module.exports = {
  SPOTIFY_ID,
  MUSICBRAINZ_ID,
  attractionWithLinks,
  attractionWithoutLinks,
  releaseGroups,
  spotifyAlbums,
};
