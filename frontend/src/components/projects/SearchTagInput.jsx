import { useState } from 'react';
import { formatString } from '../../utils/formatters';
import Cancel from '../../assets/icons/Cancel';

const SearchTagInput = ({
  title,
  options,
  selected,
  setSelected,
  userDefined,
}) => {
  const [query, setQuery] = useState('');
  const handleSelect = (option) => {
    if (!selected.includes(option)) {
      setSelected([...selected, option]);
      setQuery('');
    }
  };

  const handleRemove = (tag) => {
    setSelected(selected.filter((item) => item !== tag));
  };

  const filteredOptions = options
    .filter(
      (option) =>
        option.toLowerCase().includes(query.toLowerCase()) &&
        !selected.includes(option),
    )
    .sort();
  if (userDefined) filteredOptions.push(query);

  return (
    <div>
      <span className="text-white-light border-white-dark text-md block border-b pb-3 font-bold">
        {title}
      </span>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="bg-primary text-white-light flex items-center gap-1 rounded-full px-3 py-1 text-sm"
            >
              {formatString(tag)}
              <button onClick={() => handleRemove(tag)}>
                <Cancel size="size-5 " />
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          placeholder={`Search ${title}`}
          className="w-full rounded-md bg-[#2A2A2A] px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && filteredOptions.length > 0 && (
          <div className="border-white-dark mt-2 max-h-40 overflow-y-auto rounded-md border bg-[#1A1A1A] shadow-lg">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="text-white-light hover:bg-primary cursor-pointer px-4 py-2"
                onClick={() => handleSelect(option)}
              >
                {formatString(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTagInput;
