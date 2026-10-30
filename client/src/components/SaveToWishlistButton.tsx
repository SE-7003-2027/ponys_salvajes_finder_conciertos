import { IoHeart, IoHeartOutline } from 'react-icons/io5';

interface SaveToWishlistButtonProps {
  saved: boolean;
  onToggle: () => void;
}

export function SaveToWishlistButton({ saved, onToggle }: SaveToWishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? 'Remove concert from wishlist' : 'Save concert to wishlist'}
      className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${saved
          ? 'border-accent/60 bg-accent/10 text-accent hover:bg-accent/20'
          : 'border-line bg-surface-raised text-gray-300 hover:border-accent/60 hover:text-accent'
        }`}
    >
      {saved ? (
        <IoHeart className="h-3.5 w-3.5" />
      ) : (
        <IoHeartOutline className="h-3.5 w-3.5" />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
