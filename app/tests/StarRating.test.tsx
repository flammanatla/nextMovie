import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StarRating from "../components/StarRating";
import { describe } from "node:test";

test("loads and displays component", () => {
  const props = { maxRating: 10 } as any;

  render(<StarRating {...props} />);

  expect(screen.getAllByRole("button")).toHaveLength(11);

  expect(screen.getByTestId("watchlist-btn")).toHaveTextContent(
    "add to Watchlist"
  );

  expect(screen.getByTestId("watchlist-btn")).toHaveStyle({
    borderRadius: "0rem 0.625rem 0.625rem 0rem",
    marginBottom: "0rem",
    padding: "0.75rem",
    fontSize: "1.5rem",
    width: "125px",
    border: "#212529 solid 1px",
    background: "#2B3035",
    color: "#F5C519",
  });
});

describe("Watchlist button", () => {
  it("tests that add to Watchlist button is pressed and changed its appearance", () => {
    const onAddWatchlistedMocked = jest.fn();
    const props = { onAddWatchlisted: onAddWatchlistedMocked } as any;

    render(<StarRating {...props} />);

    fireEvent.click(screen.getByTestId("watchlist-btn"));

    expect(screen.getByTestId("watchlist-btn")).toHaveTextContent(
      "Watchlisted"
    );
    expect(onAddWatchlistedMocked).toHaveBeenCalled();
  });

  it("tests that user can click Watchlisted button twice", () => {
    const onDeleteWatchlistedMocked = jest.fn();
    const onAddWatchlistedMocked = jest.fn();

    const props = {
      onAddWatchlisted: onAddWatchlistedMocked,
      onDeleteWatchlisted: onDeleteWatchlistedMocked,
    } as any;

    render(<StarRating {...props} />);

    fireEvent.click(screen.getByTestId("watchlist-btn"));
    fireEvent.click(screen.getByTestId("watchlist-btn"));

    expect(screen.getByTestId("watchlist-btn")).toHaveTextContent(
      "add to Watchlist"
    );
    expect(onDeleteWatchlistedMocked).toHaveBeenCalled();
  });
});

describe("Stars", () => {
  test.each`
    maxRating | expectedStars
    ${5}      | ${5}
    ${8}      | ${8}
  `(
    "should return number of stars equal to maxRating",
    ({ maxRating, expectedStars }) => {
      const onSetRatingMocked = jest.fn();

      const props = { maxRating: 10, onSetRating: onSetRatingMocked } as any;

      render(<StarRating {...props} />);

      fireEvent.click(screen.getAllByRole("button")[maxRating - 1]);

      expect(onSetRatingMocked).toHaveBeenCalledWith(expectedStars);
      expect(screen.getByRole("user-rating")).toHaveTextContent(expectedStars);
    }
  );

  it("tests that default rating fills equal amount of stars with color", () => {
    const maxRating = 5;
    const defaultRating = 2;

    const props = { maxRating, defaultRating } as any;

    render(<StarRating {...props} />);

    const stars = screen.getAllByTestId("star-svg");
    expect(stars).toHaveLength(maxRating);

    stars
      .slice(0, defaultRating)
      .forEach((star) => expect(star).toHaveAttribute("fill", "#fcc419"));
    stars
      .slice(defaultRating)
      .forEach((star) => expect(star).toHaveAttribute("fill", "none"));
  });

  it("tests that mouse hover over the star change its fill attribute", () => {
    const hoveredStar = 2;

    const props = { maxRating: 5 } as any;

    render(<StarRating {...props} />);

    const stars = screen.getAllByTestId("star-svg");

    fireEvent.mouseEnter(stars[hoveredStar - 1]);

    stars
      .slice(0, hoveredStar)
      .forEach((star) => expect(star).toHaveAttribute("fill", "#fcc419"));
    stars
      .slice(hoveredStar)
      .forEach((star) => expect(star).toHaveAttribute("fill", "none"));
  });

  it("tests that user can change rating score more than once", () => {});
});
