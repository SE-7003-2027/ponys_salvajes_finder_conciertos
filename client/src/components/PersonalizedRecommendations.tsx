import { useEffect, useState } from 'react';
import { ConcertGrid } from './ConcertGrid';
import { getPersonalizedRecommendations } from '../services/recommendation-service';
import type { Concert } from '../types/concert';
import type { SpotifyArtist } from '../types/spotifyArtist';

interface PersonalizedRecommendationsProps {
  enabled?: boolean;
  isSearching?: boolean;
}

function describeArtists(artists: SpotifyArtist[]): string {
  const names = artists.slice(0, 3).map((artist) => artist.name);

  if (artists.length <= 3) {
    return names.join(', ');
  }

  return `${names.join(', ')}, and ${artists.length - 3} more`;
}

export function PersonalizedRecommendations({
  enabled = true,
  isSearching = false,
}: PersonalizedRecommendationsProps) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || isSearching) return;

    let active = true;

    getPersonalizedRecommendations()
      .then((result) => {
        if (!active) return;
        setArtists(result.artists);
        setConcerts(result.concerts);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setFailed(false);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, isSearching]);

  if (!enabled || isSearching) return null;

  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Based on your top artists</h2>
        <p className="text-sm text-gray-400 mt-1">Finding concerts for your artists...</p>
      </section>
    );
  }

  if (failed) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Based on your top artists</h2>
        <p className="text-sm text-gray-500 mt-2">
          Could not load recommendations for your artists.
        </p>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">Based on your top artists</h2>
      <p className="text-sm text-gray-400 mt-1">{describeArtists(artists)}</p>

      {concerts.length === 0 ? (
        <p className="text-center py-8 text-gray-500 text-sm">
          No upcoming concerts for your top artists right now.
        </p>
      ) : (
        <ConcertGrid concerts={concerts} />
      )}
    </section>
  );
}
