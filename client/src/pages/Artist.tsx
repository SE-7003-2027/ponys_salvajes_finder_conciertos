import { useParams } from 'react-router-dom';
import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock';

export function Artist() {
  const { id } = useParams();

  const artistConcerts = INITIAL_MOCK_CONCERTS.filter(
    (concert) => concert.artistId === id
  );

  if (artistConcerts.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Artist not found</h1>
          <p className="text-gray-400">No concerts found for this artist.</p>
        </div>
      </main>
    );
  }

  const artistName = artistConcerts[0].artist;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header del artista */}
        <header className="flex flex-col items-center text-center mb-10 mt-6">
          <div className="w-32 h-32 bg-[#0457cb] rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
            {artistName.charAt(0)}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{artistName}</h1>
          <p className="text-gray-400 mt-2 max-w-lg">
            Artist biography (placeholder). Real information will be added in the future.
          </p>
        </header>

        {/* Lista de conciertos */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming concerts</h2>
          <ul className="flex flex-col gap-4">
            {artistConcerts.map((concert) => (
              <li
                key={concert.id}
                className="bg-[#121212] border border-[#262626] p-5 rounded-xl shadow-xl hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">{concert.venue}</p>
                  <p className="text-gray-400 text-sm">{concert.city}</p>
                  <p className="text-gray-400 text-sm">Date: {concert.date}</p>
                </div>
                <button className="mt-4 bg-[#0457cb] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#0457cb]/80 transition-colors cursor-pointer">
                  Buy tickets
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}