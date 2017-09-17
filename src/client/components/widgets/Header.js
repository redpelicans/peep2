import React, { PropTypes } from 'react';
import styled from 'styled-components';

export const HeaderLeftElt = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  margin-left:25px;
  margin-right:25px;
  flex: 1;
`;

export const HeaderRightElt = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  margin-right:25px;
  margin-left:25px;
  flex: 1;
`;

export const HeaderElt = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  padding-bottom: 2em;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1px solid white;
`;

const SearchBar = styled.div`
  margin-right:25px;
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
    className="pt-input-group"
  >
    <span className="pt-icon pt-icon-search" />
    <input
      className="pt-input"
      type="search"
      placeholder="Enter your filter ..."
      dir="auto"
      value={filter}
      onChange={onChange}
    />
  </SearchBar>
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
  margin-left: 10px;
`;

export const TitleIcon = ({ name }) => (
  <IconElt className={name} />
);

TitleIcon.propTypes = {
  name: PropTypes.string.isRequired,
};
