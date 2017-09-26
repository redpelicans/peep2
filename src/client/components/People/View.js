import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { map } from 'ramda';
import { Colors } from '@blueprintjs/core';
import { getPathByName } from '../../routes';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import MasonryLayout from '../widgets/MasonryLayout';
import {
  Title,
  Container,
  Spacer,
  CompanyLink,
  ViewFieldString,
  LinkButton,
} from '../widgets';

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '800px', columns: 2, gutter: 10 },
  { mq: '1100px', columns: 3, gutter: 10 },
  { mq: '1400px', columns: 4, gutter: 10 },
  { mq: '1700px', columns: 5, gutter: 10 },
];

const StyledGrid = styled.div`
  display: grid;
  margin: 25px 0;
  width: 100%;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-rows: auto;
  grid-template-areas: 'prefix' 'firstName' 'lastName' 'company' 'type'
    'jobType' 'email';
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'prefix firstName' 'lastName company' 'type jobType'
      'email none';
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    grid-template-rows: auto auto auto;
    grid-template-areas: 'prefix firstName firstName firstName lastName lastName lastName'
      'company company type jobType email email email';
  }
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
      <label>Phones:</label>
      <ArrayBlock>
        {/* <MasonryLayout id="phones" sizes={sizes}> */}
        {phones.length > 0 && (
          <MasonryLayout id="phones" sizes={sizes}>
            {map(
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
          </MasonryLayout>
        )}
        {/* </MasonryLayout> */}
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
          <LinkButton iconName="pt-icon-edit" className="pt-button pt-large">
            Edit
          </LinkButton>
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
