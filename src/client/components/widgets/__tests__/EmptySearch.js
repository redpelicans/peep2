import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import EmptySearch from '../EmptySearch';

describe('<EmptySearch />', () => {
  test('should render an <EmptySearch />', () => {
    const tree = shallow(<EmptySearch />);
    expect(tree).toMatchSnapshot();
  });
  test('should <EmptySearch /> to be flex', () => {
    const tree = shallow(<EmptySearch />);
    expect(tree).toHaveStyleRule('display', 'flex');
  });
});
