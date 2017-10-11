import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import Container from '../Container';

describe('<Container />', () => {
  test('should render a <Container />', () => {
    const tree = shallow(<Container />);
    expect(tree).toMatchSnapshot();
  });
  test('should <Container /> be flex', () => {
    const tree = shallow(<Container />);
    expect(tree).toHaveStyleRule('display', 'flex');
  });
});
