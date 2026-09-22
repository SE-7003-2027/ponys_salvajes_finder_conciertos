import { Link } from 'react-router-dom';
import type { Concert } from '../types/concert';
Link

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <li className="bg-[#121212] border border-[#262626] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-gray-500 transition-all shadow-lg hover:shadow-2xl ">
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
      <p className="w-fit px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a1a1a] text-gray-300 border border-[#262626]">Date: {concert.date}</p>
      <a
        href="https://www.ticketmaster.com/"
        rel="noreferrer"
        target="_blank"
        className="block w-full py-2.5 rounded-lg bg-[#0457CB] hover:bg-emerald-600 text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-md"
      >
        Buy your tickets here!
      </a>
    </li>
  );
}
