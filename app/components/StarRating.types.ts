export interface StarRatingProps {
  maxRating: number;
  color: string;
  size: string;
  className: string;
  messages: number[];
  defaultRating: number;
  isShrinked: boolean;
  onSetRating: (x: number) => void;
  onAddWatchlisted: () => void;
  onDeleteWatchlisted: () => void;
  isWatchlisted: boolean;
}

export interface StarProps {
  filled: boolean;
  onRate: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  color: string;
  size: string;
}

export interface WatchlistButtonProps {
  isWatchlistBtnPressed: boolean;
  onAddWatchlisted: () => void;
  isShrinked: boolean;
}
