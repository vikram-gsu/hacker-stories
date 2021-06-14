import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function List({ list }) {
  return (
    <div>
      {list.map(
        ({
          objectID,
          url,
          title,
          author,
          num_comments: numComments,
          points,
        }) => (
          <div key={objectID}>
            <span>
              <a href={url}>{title}</a>
            </span>
            <span>{author}</span>
            <span>{numComments}</span>
            <span>{points}</span>
          </div>
        ),
      )}
    </div>
  );
}

List.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
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
  const stories = [
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
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <div>
      <h1>My hacker Stories</h1>
      <Search
        searchText={searchText}
        onSearchTextChange={handleSearch}
      />
      <List list={stories} />
    </div>
  );
}

export default App;
