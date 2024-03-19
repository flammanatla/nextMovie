import { useState, CSSProperties } from "react";

import {
  WatchlistButtonProps,
  StarProps,
  StarRatingProps,
} from "./StarRating.types";

const StarRating = ({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  isShrinked,
  onSetRating,
  onAddWatchlisted,
  onDeleteWatchlisted,
  isWatchlisted,
}: StarRatingProps): JSX.Element => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [tempRating, setTempRating] = useState<number>(0);
  const [isWatchlistBtnPressed, setIsWatchlistBtnPressed] =
    useState<boolean>(isWatchlisted);

  function handleRating(rating: number) {
    setRating(rating);
    onSetRating(rating);
  }

  function handleTempRating(rating: number) {
    setTempRating(rating);
  }

  function handleWatchlisting() {
    if (isWatchlistBtnPressed) {
      onDeleteWatchlisted();
    } else {
      onAddWatchlisted();
    }
    setIsWatchlistBtnPressed((isWatchlistBtnPressed) => !isWatchlistBtnPressed);
  }

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size}px`,
  };

  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.625rem",
    background: "#212529",
    gap: isShrinked ? "0.5rem" : "0rem",
    minWidth: isShrinked ? "unset" : "37rem",
    flexDirection: isShrinked ? "column" : "row",
  };

  const starContainerStyle: CSSProperties = {
    display: "flex",
    padding: "0.6rem 0rem 0.6rem 1.25rem",
  };

  return (
    <div style={containerStyle} className={className}>
      <>
        <div style={starContainerStyle}>
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              filled={tempRating ? tempRating > i : rating > i}
              onRate={() => handleRating(i + 1)}
              onHoverIn={() => handleTempRating(i + 1)}
              onHoverOut={() => handleTempRating(0)}
              color={color}
              size={size}
            />
          ))}
        </div>
        <p role="user-rating" style={textStyle}>
          {messages.length === maxRating
            ? messages[tempRating ? tempRating - 1 : rating - 1]
            : tempRating || rating || " "}
        </p>
      </>
      <WatchlistButton
        isWatchlistBtnPressed={isWatchlistBtnPressed}
        onAddWatchlisted={handleWatchlisting}
        isShrinked={isShrinked}
      />
    </div>
  );
};

export default StarRating;

const Star = ({
  filled,
  onRate,
  onHoverIn,
  onHoverOut,
  color,
  size,
}: StarProps): JSX.Element => {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        data-testid="star-svg"
        fill={filled ? color : "none"}
        stroke={color}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
};

const WatchlistButton = ({
  isWatchlistBtnPressed,
  onAddWatchlisted,
  isShrinked,
}: WatchlistButtonProps): JSX.Element => {
  const buttonStyle: CSSProperties = {
    borderRadius: isShrinked ? "0.625rem" : "0rem 0.625rem 0.625rem 0rem",
    marginBottom: isShrinked ? "0.5rem" : "0rem",
    padding: "0.75rem",
    fontSize: "1.5rem",
    width: "125px",
    border: "#212529 solid 1px",
    background: isWatchlistBtnPressed ? "#F5C519" : "#2B3035",
    color: isWatchlistBtnPressed ? "#2B3035" : "#F5C519",
  };

  return (
    <button
      data-testid="watchlist-btn"
      style={buttonStyle}
      onClick={onAddWatchlisted}
    >
      {isWatchlistBtnPressed ? "Watchlisted" : "add to Watchlist"}
    </button>
  );
};
