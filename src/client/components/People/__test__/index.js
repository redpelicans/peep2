import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import { Companies } from '../';

const { describe, it } = global;
const { expect } = chai;
const companies = [];
const loadCompanies = () => {};


describe('[UT] <Companies />', () => {
  const path = <Companies companies={companies} loadCompanies={loadCompanies} />;
  it('Should render a <List />', () => {
    expect(shallow(path).find(List)).to.have.length(1);
  });
});
