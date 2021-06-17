import React, { useEffect, useState, useMemo } from 'react';
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

const getAsyncResponses = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: { allStories },
        }),
      2000,
    ),
  );
function List({ stories, onRemoveItem }) {
  return (
    <ul>
      {stories.map((story) => (
        <ListItem
          key={story.objectID}
          story={story}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
}

List.propTypes = {
  stories: PropTypes.instanceOf(Array).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

function ListItem({
  story: {
    url,
    objectID,
    title,
    author,
    num_comments: numComments,
    points,
  },
  onRemoveItem,
}) {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{numComments}</span>
      <span>{points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(objectID)}>
          Dismiss
        </button>
      </span>
    </li>
  );
}

ListItem.propTypes = {
  story: PropTypes.shape({
    url: PropTypes.string.isRequired,
    objectID: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    num_comments: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

function InputWithLabel({
  id,
  children,
  value,
  type,
  onValueChange,
}) {
  return (
    <label htmlFor={id}>
      {children} &nbsp;
      <input
        type={type}
        id={id}
        value={value}
        onChange={onValueChange}
      />
    </label>
  );
}

InputWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
};

InputWithLabel.defaultProps = {
  type: 'text',
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
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAsyncResponses()
      .then((response) => {
        setStories(response.data.allStories);
        setIsLoading(false);
      })
      .catch(() => setError(true));
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleRemoveStory = (objectID) => {
    const newStories = stories.filter(
      (story) => story.objectID !== objectID,
    );
    setStories(newStories);
  };

  const searchedStories = useMemo(
    () =>
      stories.filter((story) =>
        story.title.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [searchText, stories],
  );

  return (
    <div>
      {error && <p>Something went wrong...</p>}

      <div>
        <h1>My hacker Stories</h1>
        <InputWithLabel
          id="search"
          value={searchText}
          onValueChange={handleSearch}
        >
          Search:
        </InputWithLabel>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <List
            stories={searchedStories}
            onRemoveItem={handleRemoveStory}
          />
        )}
      </div>
    </div>
  );
}

export default App;
