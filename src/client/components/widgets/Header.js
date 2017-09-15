import React, { PropTypes } from 'react';
import styled from 'styled-components';

export const HeaderLeftElt = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  flex: 1;
`;

export const HeaderRightElt = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export const HeaderElt = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  padding-bottom: 1em;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color:rgb(41, 55, 66);
  border-radius: 2px;
`;

const TitleStyle = styled.div`
  color: white;
`;

export const TimeElt = styled.div`
  font-size: '.7rem';
  font-style: 'italic';
  display: 'block';
  float: 'right';
`;

const SearchBar = styled.input`
  margin-right:20px;
`;
export const HeaderLeft = ({ children }) =>
  (<HeaderLeftElt>
    {children}
  </HeaderLeftElt>)
;

HeaderLeft.propTypes = {
  children: PropTypes.node,
};

export const HeaderRight = ({ children }) =>
  (<HeaderRightElt>
    {children}
  </HeaderRightElt>)
;

HeaderRight.propTypes = {
  children: PropTypes.node,
};

export const Header = ({ obj, children }) => {
  const left = () => React.Children.toArray(children).find(child => child.type === HeaderLeft);
  const right = () => React.Children.toArray(children).find(child => child.type === HeaderRight);
  const timeLabels = (o) => {
    if (!o || !o.createdAt) return <span />;
    const res = [`Created ${o.createdAt.fromNow()}`];
    if (o.updatedAt) res.push(`Updated ${o.updatedAt.fromNow()}`);
    return <span>{res.join(' - ')}</span>;
  };

  const time = () => {
    if (!obj) return '';
    return (
      <TimeElt>
        {timeLabels(obj)}
      </TimeElt>
    );
  };
  return (
    <div>
      <HeaderElt>
        {left()}
        {right()}
      </HeaderElt>
      {time()}
    </div>
  );
};

Header.propTypes = {
  obj: PropTypes.object,
  children: PropTypes.node,
};

export const Search = ({ onChange, filter }) => (
  <SearchBar
    className="pt-input"
    type="text"
    placeholder="Enter your filter ..."
    dir="auto"
    value={filter}
    onChange={onChange}
  />
);

Search.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  filter: React.PropTypes.string,
};

export const Title = ({ title }) => (
  <TitleStyle>
    {title}
  </TitleStyle>
);

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

const IconElt = styled.div`
  margin-right: 10px;
`;

export const TitleIcon = ({ name }) => (
  <IconElt type={name} />
);

TitleIcon.propTypes = {
  name: PropTypes.string.isRequired,
};
