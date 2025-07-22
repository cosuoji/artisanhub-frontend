import {range} from "../utils/range.js"


export function usePagination({
  totalItems,
  perPage = 10,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / perPage);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const pages = range(1, totalPages);

  const PageButtons = () => (
    <div className="flex gap-2 justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            p === currentPage ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return { PageButtons, canPrev, canNext, totalPages };
}