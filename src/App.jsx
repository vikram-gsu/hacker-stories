import React from 'react';
import PropTypes from 'prop-types';

function List({ list }) {
  return (
    <div>
      {list.map((story) => (
        <div key={story.objectID}>
          <span>
            <a href={story.url}>{story.title}</a>
          </span>
          <span>{story.author}</span>
          <span>{story.num_comments}</span>
          <span>{story.points}</span>
        </div>
      ))}
    </div>
  );
}
List.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

function App() {
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
  return (
    <div>
      <h1>My hacker Stories</h1>
      <label htmlFor="search">
        Search:
        <input type="text" id="search" />
      </label>
      <List list={stories} />
    </div>
  );
}

export default App;
