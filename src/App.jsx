import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const allStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function List({ stories }) {
  return (
    <ul>
      {stories.map(({ objectID, ...story }) => (
        <ListItem key={objectID} story={story} />
      ))}
    </ul>
  );
}

List.propTypes = {
  stories: PropTypes.instanceOf(Array).isRequired,
};

function ListItem({
  story: { url, title, author, num_comments: numComments, points },
}) {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{numComments}</span>
      <span>{points}</span>
    </li>
  );
}

ListItem.propTypes = {
  story: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    num_comments: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
};

function Search({ searchText, onSearchTextChange }) {
  return (
    <label htmlFor="search">
      Search:
      <input
        type="text"
        id="search"
        value={searchText}
        onChange={onSearchTextChange}
      />
    </label>
  );
}
Search.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
};
const useSemiPersistentStorage = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState,
  );
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

function App() {
  const [searchText, setSearchText] = useSemiPersistentStorage(
    'search',
    'React',
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const searchedStories = allStories.filter(({ title }) =>
    title.toLowerCase().includes(searchText.toLowerCase()),
  );
  return (
    <div>
      <h1>My hacker Stories</h1>
      <Search
        searchText={searchText}
        onSearchTextChange={handleSearch}
      />
      <List stories={searchedStories} />
    </div>
  );
}

export default App;
