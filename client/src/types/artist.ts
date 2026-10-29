export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  bio: string;
}

export type ReleaseType = 'album' | 'single' | 'ep' | 'other';

export type DiscographySource = 'spotify' | 'musicbrainz';

export interface Release {
  id: string;
  title: string;
  year: number | null;
  type: ReleaseType;
  imageUrl: string | null;
  url: string;
}

export interface SpotifyProfile {
  /** null when the artist could not be matched; profileUrl is then a Spotify search */
  id: string | null;
  profileUrl: string;
  embedUrl: string | null;
}

export interface ArtistMusic {
  artistId: string;
  name: string;
  spotify: SpotifyProfile;
  discography: {
    source: DiscographySource | null;
    releases: Release[];
  };
}
