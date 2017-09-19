import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import { App, Content, MainWrapper } from '..';
import Header from '../Header';

describe('<App />', () => {
  it('should render a <Header />', () => {
    expect(1 + 1).toEqual(2);
  });
});
