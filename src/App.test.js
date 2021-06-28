import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import App, {
  storiesReducer,
  InputWithLabel,
  SearchForm,
  List,
  ListItem,
} from './App';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};
const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  it('initializes state', () => {
    const action = {
      type: 'SET_STORIES_INIT',
    };
    const currentState = {
      data: [],
      isLoading: false,
      hasError: false,
    };

    const newState = storiesReducer(currentState, action);
    const expectedState = {
      data: [],
      isLoading: true,
      hasError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('sets new state', () => {
    const action = {
      type: 'SET_STORIES_SUCCESS',
      payload: [stories],
    };
    const currentState = {
      data: [],
      isLoading: true,
      hasError: false,
    };

    const newState = storiesReducer(currentState, action);
    const expectedState = {
      data: [stories],
      isLoading: false,
      hasError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
  it('fails if data fetch fails', () => {
    const action = {
      type: 'SET_STORIES_FAILURE',
    };
    const currentState = {
      data: [],
      isLoading: true,
      hasError: false,
    };

    const newState = storiesReducer(currentState, action);
    const expectedState = {
      data: [],
      isLoading: false,
      hasError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: 1 };
    const currentState = {
      data: stories,
      isLoading: false,
      hasError: false,
    };

    const newState = storiesReducer(currentState, action);
    const expectedState = {
      data: [storyOne],
      isLoading: false,
      hasError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  // test('renders learn react link', () => {
  //   render(<App />);
  //   const linkElement = screen.getByText(/Dan/i);
  //   expect(linkElement).toBeInTheDocument();
  // });
});

describe('ListItem component', () => {
  test('renders all properties', () => {
    render(<ListItem story={storyOne} onRemoveItem={() => {}} />);

    // screen.debug();
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/',
    );
  });

  test('renders clickable dismiss button', () => {
    render(<ListItem story={storyOne} onRemoveItem={() => {}} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button invokes the callback handler', () => {
    const handleRemoveItem = jest.fn();

    render(
      <ListItem story={storyOne} onRemoveItem={handleRemoveItem} />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleRemoveItem).toBeCalledTimes(1);
  });
});

describe('SearchForm', () => {
  const searchProps = {
    searchText: 'React',
    handleSearchClick: jest.fn(),
    handleSearch: jest.fn(),
  };
  test('renders input field with value', () => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<SearchForm {...searchProps} />);

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  test('renders label', () => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<SearchForm {...searchProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test('handles input field value change', () => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<SearchForm {...searchProps} />);

    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });

    expect(searchProps.handleSearch).toHaveBeenCalledTimes(1);
  });

  test('handles form submit event', ()=> {
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<SearchForm {...searchProps} />);

    fireEvent.submit(screen.getByRole('button'));

    expect(searchProps.handleSearchClick).toHaveBeenCalledTimes(1);
  })
});
