const FILTERS = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

function FilterBar({ activeFilter, onChangeFilter }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChangeFilter(filter.value)}
          className={activeFilter === filter.value ? "active" : ""}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
