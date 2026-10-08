import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistById, getArtistEvents, getArtistBio } from '../services/artist-service';
import type { Artist as ArtistType } from '../types/artist';
import type { Concert } from '../types/concert';

export function Artist() {
  const { id } = useParams();
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [events, setEvents] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      const artistData = await getArtistById(id);

      if (artistData) {
        // Obtener biografía de Wikipedia
        const bio = await getArtistBio(artistData.name);
        if (bio) artistData.bio = bio;

        setArtist(artistData);

        const eventsData = await getArtistEvents(artistData.name);
        setEvents(eventsData);
      }

      setLoading(false);
    }
    fetchData();
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
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col items-center text-center mb-10 mt-6">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-32 h-32 rounded-full object-cover mb-4 shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 bg-[#0457cb] rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
              {artist.name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight">{artist.name}</h1>
          <p className="text-[#0457cb] font-semibold mt-1">{artist.genre}</p>
          {artist.bio && (
            <p className="text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed">
              {artist.bio}
            </p>
          )}
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming concerts</h2>
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No upcoming events found.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {events.map((concert) => (
                <li
                  key={concert.id}
                  className="bg-[#121212] border border-[#262626] p-5 rounded-xl shadow-xl hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">{concert.venue}</p>
                    <p className="text-gray-400 text-sm">{concert.city}</p>
                    <p className="text-gray-400 text-sm">Date: {concert.date}</p>
                  </div>
                  <a
                    href={concert.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 bg-[#0457cb] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#0457cb]/80 transition-colors cursor-pointer"
                  >
                    Buy tickets
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}