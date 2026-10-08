import { Link } from 'react-router-dom';
import type { Concert } from '../types/concert';

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${concert.venue}${concert.address || concert.city}`
  )}`;

  return (
    <li className="bg-[#121212] border border-[#262626] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-gray-500 transition-all shadow-lg hover:shadow-2xl overflow-hidden">

      {concert.imageUrl && (
        <div className="w-full h-36 rounded-lg overflow-hidden bg-[#1a1a1a]">
          <img
            src={concert.imageUrl}
            alt={concert.artist}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Link
          to={`/artist/${concert.artistId}`}
          className="group flex items-center gap-1.5 text-lg font-bold text-white tracking-tight hover:text-[#FE9511] transition-colors"
        >
          <span className="truncate">{concert.artist}</span>
          <span className="text-sm text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-[#FE9511]">
            →
          </span>
        </Link>
        <p className="text-xs text-gray-400 font-medium">{concert.venue} ({concert.city})</p>

        {concert.address && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-blue-400 hover:underline truncate"
          >
            🏟️ {concert.address}
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="w-fit px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a1a1a] text-gray-300 border border-[#262626]">
          Date: {concert.date}
        </p>

        {concert.priceRange && (
          <p className="w-fit px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a1a1a] text-emerald-400 border border-[#262626]">
            {concert.priceRange}
          </p>
        )}
      </div>

      <a
        href={concert.ticketUrl}
        rel="noreferrer"
        target="_blank"
        className="block w-full py-2.5 rounded-lg bg-[#0457CB] hover:bg-emerald-600 text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-md"
      >
        Buy your tickets here!
      </a>
    </li>
  );
}
