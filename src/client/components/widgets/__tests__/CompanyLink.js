import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import CompanyLink from '../CompanyLink';

describe('<CompanyLink />', () => {
  test('should render an <EmptySearch />', () => {
    const tree = shallow(<CompanyLink to="" />);
    expect(tree).toMatchSnapshot();
  });
  test('should <CompanyLink /> have text transform', () => {
    const tree = shallow(<CompanyLink to="" />);
    expect(tree).toHaveStyleRule('text-transform', 'capitalize');
  });
});
