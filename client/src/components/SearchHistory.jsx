export default function SearchHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <h3>Recent searches</h3>
      <ul>
        {history.map((city) => (
          <li key={city}>
            <button onClick={() => onSelect(city)}>{city}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
