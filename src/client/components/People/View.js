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
import {
  Title,
  Container,
  Spacer,
  CompanyLink,
  ViewField,
  LinkButton,
} from '../widgets';

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

const StyledPhoneWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 250px;
  height: 30px;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  padding-top: 5px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
`;

const StyledPhoneLabel = styled.label`margin-left: 15px;`;

const StyledPhoneNumber = styled.span`margin-right: 15px;`;

const PhoneField = ({ label, number }) => (
  <StyledPhoneWrap>
    <StyledPhoneLabel>{label}</StyledPhoneLabel>
    <StyledPhoneNumber>{number}</StyledPhoneNumber>
  </StyledPhoneWrap>
);

PhoneField.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
};
const StyledViewField = styled(ViewField)`grid-area: ${({ name }) => name};`;

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
        <StyledViewField name="prefix" label="Prefix" value={prefix} />
        <StyledViewField
          name="firstName"
          label="First Name"
          value={firstName}
        />
        <StyledViewField name="lastName" label="Last Name" value={lastName} />
        <StyledViewField
          name="company"
          label="Company"
          value={
            <CompanyLink to={getPathByName('company', companyId)}>
              {company}
            </CompanyLink>
          }
        />
        <StyledViewField name="type" label="Type" value={type} />
        <StyledViewField name="jobType" label="Job Type" value={jobType} />
        <StyledViewField name="email" label="Email" value={email} />
      </StyledGrid>
      {phones.length > 0 && (
        <div>
          <label>Phones</label>
          <ArrayBlock>
            {map(
              phone => (
                <PhoneField
                  key={phone.label}
                  label={phone.label}
                  number={phone.number}
                />
              ),
              phones,
            )}
          </ArrayBlock>
        </div>
      )}
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
          <Avatar name={person.name} size="LARGE" color={person.avatar.color} />
          <Spacer />
          <Title title={`${person.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <LinkButton
            to={getPathByName('editPerson', id)}
            iconName="pt-icon-edit"
            className="pt-button pt-large"
          />
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
