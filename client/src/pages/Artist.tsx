import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistMusic, getArtistProfile } from '../services/artist-service';
import type { Artist as ArtistType, ArtistMusic } from '../types/artist';
import type { Concert } from '../types/concert';
import { ConcertGrid } from '../components/ConcertGrid';
import { SpotifyButton } from '../components/SpotifyButton';
import { ArtistMusicSection, type ArtistMusicState } from '../components/ArtistMusicSection';

export function Artist() {
  const { id } = useParams();
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [events, setEvents] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [musicResult, setMusicResult] = useState<{ artistId: string; music: ArtistMusic | null } | null>(null);

  // Derived instead of reset in the effect: a result for another artist means "still loading"
  const musicState: ArtistMusicState =
    !musicResult || musicResult.artistId !== id
      ? { status: 'loading' }
      : musicResult.music
        ? { status: 'ready', music: musicResult.music }
        : { status: 'unavailable' };

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      setLoading(true);

      const profile = await getArtistProfile(id);

      if (profile) {
        setArtist(profile.artist);
        setEvents(profile.events);
      }

      setLoading(false);
    }

    loadProfile();
  }, [id]);

  // Loaded separately so concerts never wait on (or break because of) music providers
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    getArtistMusic(id).then((music) => {
      if (isMounted) setMusicResult({ artistId: id, music });
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <p className="text-gray-400">Loading artist...</p>
      </main>
    );
  }

  if (!artist) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Artist not found</h1>
          <p className="text-gray-400">No data available for this artist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col items-center text-center mb-10 mt-6">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-32 h-32 rounded-full object-cover mb-4 shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 bg-brand rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
              {artist.name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight">{artist.name}</h1>
          <p className="text-brand font-semibold mt-1">{artist.genre}</p>
          {artist.bio && (
            <p className="text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed">
              {artist.bio}
            </p>
          )}
          {musicState.status === 'ready' && (
            <div className="mt-6">
              <SpotifyButton spotify={musicState.music.spotify} />
            </div>
          )}
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming concerts</h2>
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No upcoming events found.
            </p>
          ) : (
            <ConcertGrid concerts={events} />
          )}
        </section>

        <ArtistMusicSection state={musicState} />
      </div>
    </main>
  );
}
