import React, { useState } from 'react';
import Filter from '../assets/icons/Filter';
import Cancel from '../assets/icons/Cancel';

const SearchableTagInput = ({ title, options, accent }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const handleSelect = (option) => {
    if (!selected.includes(option)) {
      setSelected([...selected, option]);
      setQuery('');
    }
  };

  const handleRemove = (tag) => {
    setSelected(selected.filter((item) => item !== tag));
  };

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(option),
  );

  return (
    <div>
      <h3 className="text-white-light border-white-dark border-b pb-3 text-xl font-bold">
        {title}
      </h3>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="bg-primary text-white-light flex items-center gap-1 rounded-full px-3 py-1 text-sm"
            >
              {tag}
              <button onClick={() => handleRemove(tag)}>
                <Cancel className="h-4 w-4" />
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
                className="text-white-light hover:bg-secondary cursor-pointer px-4 py-2"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative">
      <div className="mt-10 ml-10">
        <h1 className="font-heading text-white-light mb-3 text-4xl font-bold">
          Projects
        </h1>
        <hr className="border-primary mt-3 w-97 border-t-2" />
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="bg-primary text-white-light hover:bg-secondary mt-7 ml-10 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition"
      >
        <Filter /> Filter
      </button>

      {isSidebarOpen && (
        <div
          className="bg-opacity-10 fixed inset-0 z-40 bg-black backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-black-light fixed top-0 right-0 z-50 h-full w-80 transform shadow-xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="border-white-dark flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-white-light text-lg font-bold">Filters</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <Cancel />
          </button>
        </div>

        <div className="text-white-light h-[calc(100%-64px)] space-y-10 overflow-y-auto bg-[#1A1A1A] p-6">
          <div>
            <h3 className="text-white-light border-white-dark border-b pb-3 text-xl font-bold">
              Difficulty
            </h3>
            <div className="mt-4 space-y-5">
              {['Beginner', 'Intermediate', 'Expert', 'Master'].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-4 text-base hover:text-white"
                >
                  <input type="checkbox" className="accent-primary h-5 w-5" />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <SearchableTagInput
            title="Domain"
            options={[
              'Frontend',
              'Backend',
              'Web Development',
              'App Development',
              'AI/ML',
              'UI/UX',
              'Full Stack',
              'Blockchain',
              'Data Science',
              'Cloud Computing',
              'DevOps',
            ]}
            accent="accent-primary"
          />

          <SearchableTagInput
            title="Languages"
            options={[
              'C',
              'Python',
              'Java',
              'React',
              'Node',
              'HTML',
              'CSS',
              'JavaScript',
              'MongoDB',
              'PostgreSQL',
              'API',
              'Git',
              'React Native',
              'Angular',
              'Vue',
              'Express',
              'Django',
              'Flask',
              'TensorFlow',
              'Scikit Learn',
              'Pandas',
              'NumPy',
              'Kotlin',
              'Swift',
              'Firebase',
              'MySQL',
              'Docker',
              'AWS',
              'TypeScript',
              'GraphQL',
            ]}
            accent="accent-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
