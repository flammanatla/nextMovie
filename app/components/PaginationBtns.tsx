import { RESULTS_PER_PAGE } from "../utils/config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PaginationBtns({
  totalSearchResults,
  currentPage,
  onPageNavigation,
  isLoading,
}) {
  const numPages = Math.ceil(totalSearchResults / RESULTS_PER_PAGE);

  const backBtn = (
    <button
      data-goto={currentPage - 1}
      className="pagination__btn pagination__btn--back"
      onClick={() => onPageNavigation(currentPage - 1)}
    >
      <span>Page {currentPage - 1}</span>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );

  const fwdBtn = (
    <button
      data-goto={currentPage + 1}
      className="pagination__btn pagination__btn--fwd"
      onClick={() => onPageNavigation(currentPage + 1)}
    >
      <span>Page {currentPage + 1}</span>
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
  );

  // do not show pagination if search results are loading
  if (isLoading) {
    return "";
  }

  // current page 1, there are other pages
  if (currentPage === 1 && numPages > 1) {
    return <div className="pagination">{fwdBtn}</div>;
  }

  // current page is last one
  if (currentPage === numPages && numPages > 1) {
    return <div className="pagination">{backBtn}</div>;
  }

  // current page is somewhere in the middle, there are pages before and after
  if (currentPage < numPages) {
    return (
      <div className="pagination">
        {backBtn}
        {fwdBtn}
      </div>
    );
  }

  // current page 1, there are no more pages
  return "";
}
