import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { map, prop } from 'ramda';
import { Colors } from '@blueprintjs/core';
import { getPathByName } from '../../routes';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import {
  Title,
  Container,
  Spacer,
  CompanyLink,
  ViewFieldString,
} from '../widgets';

const StyledGrid = styled.div`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-column-gap: 25px;
  grid-template-columns: minmax(100px, auto);
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 'prefix firstName firstName lastName lastName'
    'company company company company company' 'type jobType email email email'
    'mobile fixe none none none' 'tags tags tags tags tags';
`;

const ArrayBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PersonInfos = ({ person = {} }) => {
  const {
    prefix,
    firstName,
    lastName,
    company,
    type,
    jobType,
    email,
    phones = [],
    companyId,
  } = person;
  return (
    <StyledWrapper>
      <StyledGrid>
        <ViewFieldString name="prefix" label="Prefix" value={prefix} />
        <ViewFieldString
          name="firstName"
          label="First Name"
          value={firstName}
        />
        <ViewFieldString name="lastName" label="Last Name" value={lastName} />
        <ViewFieldString
          name="company"
          label="Company"
          value={
            <CompanyLink to={getPathByName('company', companyId)}>
              {company}
            </CompanyLink>
          }
        />
        <ViewFieldString name="type" label="Type" value={type} />
        <ViewFieldString name="jobType" label="Job Type" value={jobType} />
        <ViewFieldString name="email" label="Email" value={email} />
      </StyledGrid>
      <label>Phones</label>
      <ArrayBlock>
        {phones.length > 0 &&
          map(
            phone => (
              <ViewFieldString
                key={phone.number}
                name={phone.label}
                label={phone.label}
                value={phone.number}
              />
            ),
            phones,
          )}
      </ArrayBlock>
    </StyledWrapper>
  );
};

PersonInfos.propTypes = {
  person: PropTypes.object,
};

const StyledGoBack = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

const GoBack = ({ history }) => (
  <StyledGoBack onClick={() => history.goBack()}>
    <i className="pt-icon-arrow-left" />
  </StyledGoBack>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

const Person = ({
  people = {},
  companies = {},
  history,
  match: { params: { id } },
}) => {
  const person = people[id];
  if (!person || !companies) return null;
  const company = companies[person.companyId];
  person.company = company ? company.name : '';
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          <Avatar name={name} color={person.avatar.color} to="#" />
          <Spacer />
          <Title title={`${person.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <div />
        </HeaderRight>
      </Header>
      <PersonInfos person={person} />
    </Container>
  );
};

Person.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
});

const actions = { getPeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Person);
