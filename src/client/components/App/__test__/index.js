import React from 'react';
import chai from 'chai'; // eslint-disable-line
import { shallow } from 'enzyme'; // eslint-disable-line
import { App, Content, MainWrapper } from '..';
import Navbar from '../../Navbar/';

const { describe, it } = global;
const { expect } = chai;

describe('<App />', () => {
  it('should render a <Navbar />', () => {
    expect(shallow(<App />)
      .find(Navbar)).to.have.lengthOf(1);
  });

  it('should render a <Content />', () => {
    expect(shallow(<App />)
      .find(Content)).to.have.lengthOf(1);
  });

  it('should render a <MainWrapper />', () => {
    expect(shallow(<App />)
      .find(MainWrapper)).to.have.lengthOf(1);
  });

});
