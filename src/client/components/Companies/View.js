import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { map } from 'ramda';
import { Colors } from '@blueprintjs/core';
import Avatar from '../Avatar';
import { getCompanies } from '../../selectors/companies';
import { getPeopleFromCompany } from '../../selectors/people';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Title, Container, Spacer, Tag, Tags } from '../widgets';
import Preview from '../People/Preview';
import { onTagClick, deletePeople } from '../../actions/people';

const FieldStyled = styled.div`grid-area: ${props => props.name};`;

const StyledBlock = styled.div`
  text-align: left;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  width: 100%;
  height: 30%;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const StyledBlockContent = styled.div`
  padding-top: 5px;
  margin-left: 15px;
  color: ${Colors.LIGHT_GRAY5} !important;
`;

const StyledGrid = styled.div`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-column-gap: 25px;
  grid-template-columns: minmax(100px, auto) auto auto;
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 'type type website website website website'
    'street street zipcode city city country' 'tags tags tags tags tags tags';
`;

const StyledLink = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

const CompanyInfos = ({ company = {}, people }) => {
  const { type, website, address = {}, tags = [] } = company;
  const { street, zipcode, city, country } = address;
  return (
    <StyledGrid>
      <FieldStyled name="type">
        <h4>Type : </h4>
        <StyledBlock>
          {type && <StyledBlockContent>{type}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="website">
        <h4>Website : </h4>
        <StyledBlock>
          {website && (
            <StyledBlockContent>
              <StyledLink href={website}>{website}</StyledLink>
            </StyledBlockContent>
          )}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="street">
        <h4>Street : </h4>
        <StyledBlock>
          {street && <StyledBlockContent>{street}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="zipcode">
        <h4>Zipcode : </h4>
        <StyledBlock>
          {zipcode && <StyledBlockContent>{zipcode}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="city">
        <h4>City : </h4>
        <StyledBlock>
          {city && <StyledBlockContent>{city}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="country">
        <h4>Country : </h4>
        <StyledBlock>
          {country && <StyledBlockContent>{country}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <h4>Contacts :</h4>
      {people.length > 0 &&
        map(
          person => (
            <Preview
              key={person._id}
              person={person}
              company={company}
              onTagClick={onTagClick}
              deletePeople={deletePeople}
            />
          ),
          people,
        )}
      <FieldStyled name="tags">
        <h4>Tags : </h4>
        <StyledBlock>
          {tags && <Tags>{map(tag => <Tag key={tag}>{tag}</Tag>, tags)}</Tags>}
        </StyledBlock>
      </FieldStyled>
    </StyledGrid>
  );
};

CompanyInfos.propTypes = {
  company: PropTypes.object,
  people: PropTypes.array,
};

const GoBack = ({ history }) => (
  <StyledLink onClick={() => history.goBack()}>
    <i className="pt-icon-arrow-left" />
  </StyledLink>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

const Company = ({
  people,
  companies = {},
  history,
  match: { params: { id } },
}) => {
  //eslint-disable-line
  const company = companies[id];
  if (!company) return null;
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          <Avatar name={name} color={company.avatar.color} to="#" />
          <Spacer />
          <Title title={`${company.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <div />
        </HeaderRight>
      </Header>
      <CompanyInfos company={company} people={people} />
    </Container>
  );
};

Company.propTypes = {
  companies: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  people: PropTypes.array,
};

const mapStateToProps = (state, props) => ({
  companies: getCompanies(state),
  people: getPeopleFromCompany(state, props),
});

const actions = { getCompanies, onTagClick, deletePeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Company);
