import { useState } from 'react';
import { formatString } from '../../utils/formatters';
import Cancel from '../../assets/icons/Cancel';

const SearchTagInput = ({
  id = { undefined },
  title = '',
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
      {title && (
        <span className="text-white-light border-white-dark text-md mb-4 block border-b pb-3 font-bold">
          {title}
        </span>
      )}

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
        id={id}
        placeholder={`Search ${title}`}
        className="focus:outline-primary outline-black-lighter dark:bg-black-light w-full rounded-md px-3 py-2 placeholder-gray-500 outline outline-1 focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && filteredOptions.length > 0 && (
        <div className="border-white-dark dark:border-black-light dark:bg-black-dark absolute z-50 mt-2 max-h-40 overflow-y-auto rounded-md border bg-zinc-100 p-2 shadow-lg">
          {filteredOptions.map((option) => (
            <button
              key={option}
              className="hover:bg-primary focus:bg-primary my-2 block w-full cursor-pointer rounded-md px-4 py-2 text-left outline-none hover:text-white focus:text-white"
              onClick={() => handleSelect(option)}
            >
              {formatString(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTagInput;
