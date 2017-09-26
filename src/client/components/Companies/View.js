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
import { Title, Container, Spacer, ViewFieldString } from '../widgets';
import Preview from '../People/Preview';
import { onTagClick, deletePeople } from '../../actions/people';

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

const ArrayBlock = styled.div`
  display: flex;
  flex-direction: row;
  wrap: wrap;
`;

const StyledLink = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompanyInfos = ({ company = {}, people }) => {
  const { type, website, address = {} } = company;
  const { street, zipcode, city, country } = address;
  return (
    <StyledWrapper>
      <StyledGrid>
        <ViewFieldString name="type" label="Type" value={type} />
        <ViewFieldString
          name="website"
          label="Website"
          value={<StyledLink href={website}>{website}</StyledLink>}
        />
        <ViewFieldString name="street" label="Street" value={street} />
        <ViewFieldString name="zipcode" label="Zip code" value={zipcode} />
        <ViewFieldString name="city" label="City" value={city} />
        <ViewFieldString name="country" label="Country" value={country} />
      </StyledGrid>
      <label>Contacts</label>
      <ArrayBlock>
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
      </ArrayBlock>
    </StyledWrapper>
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
