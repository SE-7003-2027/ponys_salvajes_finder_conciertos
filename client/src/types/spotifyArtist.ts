interface SpotifyImg {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  url: string;
  image: SpotifyImg | null
}
