import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const SET_STORIES_INIT = 'SET_STORIES_INIT';
const SET_STORIES_SUCCESS = 'SET_STORIES_SUCCESS';
const SET_STORIES_FAILURE = 'SET_STORIES_FAILURE';
const REMOVE_STORY = 'REMOVE_STORY';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case SET_STORIES_INIT:
      return { ...state, isLoading: true, hasError: false };
    case SET_STORIES_SUCCESS:
      return {
        isLoading: false,
        hasError: false,
        data: action.payload,
      };
    case SET_STORIES_FAILURE:
      return { ...state, isLoading: false, hasError: true };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload,
        ),
      };

    default:
      throw new Error();
  }
};

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

const SearchForm = ({
  handleSearchClick,
  handleSearch,
  searchText,
}) => (
  <form onSubmit={handleSearchClick}>
    <h1>My hacker Stories</h1>
    <InputWithLabel
      id="search"
      value={searchText}
      onValueChange={handleSearch}
    >
      Search:
    </InputWithLabel>
    <button type="submit" disabled={!searchText}>
      Search
    </button>
  </form>
);

SearchForm.propTypes = {
  handleSearchClick: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
};
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [searchText, setSearchText] = useSemiPersistentStorage(
    'search',
    'React',
  );
  const [stories, dispatch] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    hasError: false,
  });
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchText}`);

  const handleStoriesFetch = useCallback(async () => {
    dispatch({
      type: SET_STORIES_INIT,
    });

    try {
      const { data } = await axios.get(url);
      dispatch({
        type: 'SET_STORIES_SUCCESS',
        payload: data.hits,
      });
    } catch (e) {
      dispatch({
        type: SET_STORIES_FAILURE,
      });
    }
  }, [url]);

  useEffect(() => {
    handleStoriesFetch();
  }, [handleStoriesFetch]);

  const handleRemoveStory = (objectID) => {
    dispatch({
      type: REMOVE_STORY,
      payload: objectID,
    });
  };

  const handleSearchClick = (event) => {
    setUrl(`${API_ENDPOINT}${searchText}`);
    event.preventDefault();
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // const searchedStories = useMemo(
  //   () =>
  //     console.log(stories) ||
  //     stories.data.filter((story) =>
  //       story.title.toLowerCase().includes(searchText.toLowerCase()),
  //     ),
  //   [searchText, stories],
  // );

  return (
    <div>
      {stories.hasError && <p>Something went wrong...</p>}
      <SearchForm
        handleSearch={handleSearch}
        handleSearchClick={handleSearchClick}
        searchText={searchText}
      />
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          stories={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
}

export default App;

export { storiesReducer, InputWithLabel, SearchForm, List, ListItem };
