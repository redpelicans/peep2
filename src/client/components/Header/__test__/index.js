import React from 'react';
import chai from 'chai'; // eslint-disable-line
import { shallow } from 'enzyme'; // eslint-disable-line

const { describe, it } = global;
const { expect } = chai;

import { Icon } from 'antd';

import {
  HeaderLeftElt,
  HeaderRightElt,
  HeaderElt,
  TimeElt,
  HeaderLeft,
  HeaderRight,
  Header,
} from '../';

const props = { obj: { createdAt: { fromNow: () => 1  }, updateAt: { fromNow: () => 1  } }, children: [] }

describe('<Header />', () => {
  it('should render a <HeaderElt />', () => {
    expect(shallow(<Header {...props} />)
      .find(HeaderElt)).to.have.lengthOf(1);
  });
});

const HeaderLeftProps = { children: [] };

describe('<HeaderLeft />', () => {
  it('should render a <HeaderLeftElt />', () => {
    expect(shallow(<HeaderLeft {...HeaderLeftProps} />)
      .find(HeaderLeftElt)).to.have.lengthOf(1);
  });

  it('should render a <Icon />', () => {
    expect(shallow(<HeaderLeft {...HeaderLeftProps}><Icon /></HeaderLeft>)
      .find(Icon)).to.have.lengthOf(1);
  });
});

describe('<HeaderRight />', () => {
  it('should render a <HeaderRightElt />', () => {
    expect(shallow(<HeaderRight {...HeaderLeftProps} />)
      .find(HeaderRightElt)).to.have.lengthOf(1);
  });

  it('should render a <Icon />', () => {
    expect(shallow(<HeaderRight {...HeaderLeftProps}><Icon /></HeaderRight>)
      .find(Icon)).to.have.lengthOf(1);
  });
});
