import { useParams } from 'react-router-dom';
import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock';

export function Artist() {
  const { id } = useParams();

  const artistConcerts = INITIAL_MOCK_CONCERTS.filter(
    (concert) => concert.id === id
  );

  if (artistConcerts.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Artist not found</h1>
        <p className="text-gray-600">No concerts found for this artist.</p>
      </main>
    );
  }

  const artistName = artistConcerts[0].artist;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center text-white text-5xl mb-4">
          {artistName.charAt(0)}
        </div>
        <h1 className="text-4xl font-bold">{artistName}</h1>
        <p className="text-gray-600 mt-2">
          Artist biography (placeholder). Real information will be added in the future.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming concerts</h2>
        <ul className="space-y-4">
          {artistConcerts.map((concert) => (
            <li key={concert.id} className="border p-4 rounded-lg shadow-sm">
              <p><strong>Venue:</strong> {concert.venue}</p>
              <p><strong>City:</strong> {concert.city}</p>
              <p><strong>Date:</strong> {concert.date}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Buy tickets
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}