import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';
import { List } from '../List';
import { Actions } from '../../widgets';
import { StyledFooterLine } from '../Preview';
import { MarkdownConvertor } from '../../widgets/Markdown';
import enhancedPreview, { Preview, CardContent } from '../Preview';
import Footer, { StyledFooter } from '../Footer';

const { describe, it } = global;

describe('List component', () => {
  it('should not render anything', () => {
    const wrapper = shallow(
      <List
        notes={[]}
        people={{}}
        companies={{}}
        findEntity={() => {}}
        deletePeople={() => {}}
      />,
    );
    should(wrapper.find(enhancedPreview)).have.length(0);
  });
  it('should render 3 enhancedPreview component', () => {
    const wrapper = shallow(
      <List
        people={{}}
        findEntity={() => {}}
        companies={{}}
        deletePeople={() => {}}
        notes={[
          {
            _id: 0,
          },
          {
            _id: 1,
          },
          {
            _id: 2,
          },
        ]}
      />,
    );
    should(wrapper.find(enhancedPreview)).have.length(3);
  });
});

describe('Preview component', () => {
  it('Should not render actions buttons', () => {
    const wrapper = shallow(
      <Preview
        people={{}}
        entity={{}}
        note={{
          _id: 0,
        }}
        showActions={false}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(0);
  });
  it('Should render actions buttons', () => {
    const wrapper = shallow(
      <Preview
        people={{}}
        entity={{}}
        note={{
          _id: 0,
        }}
        showActions={true}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(1);
  });
  it('Should render a CardContent component', () => {
    const wrapper = shallow(
      <Preview
        people={{}}
        entity={{}}
        note={{
          _id: 0,
        }}
        showActions={true}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
      />,
    );
    should(wrapper.find(CardContent)).have.length(1);
  });
});

describe('CardContent component', () => {
  it('Should render basic CardContent', () => {
    const wrapper = shallow(<CardContent note={{}} person={{}} entity={{}} />);
    should(wrapper.find('div')).have.length(1);
  });
  it('Should render a MarkdownConvertor component', () => {
    const wrapper = shallow(<CardContent note={{}} person={{}} entity={{}} />);
    should(wrapper.contains(<MarkdownConvertor />)).eql(true);
  });
  it('Should render a StyledFooterLine component', () => {
    const wrapper = shallow(<CardContent note={{}} person={{}} entity={{}} />);
    should(wrapper.contains(<StyledFooterLine />)).eql(true);
  });
  it('Should render a Footer component', () => {
    const wrapper = shallow(<CardContent note={{}} person={{}} entity={{}} />);
    should(wrapper.contains(<Footer note={{}} entity={{}} person={{}} />)).eql(
      true,
    );
  });
});

describe('Footer component', () => {
  it('Should render null', () => {
    const wrapper = shallow(
      <Footer note={undefined} entity={{}} person={{}} />,
    );
    should(wrapper.find(StyledFooter)).have.length(0);
  });
  it('Should not render null)', () => {
    const wrapper = shallow(<Footer note={{}} entity={{}} person={{}} />);
    should(wrapper.find(StyledFooter)).have.length(1);
  });
});
