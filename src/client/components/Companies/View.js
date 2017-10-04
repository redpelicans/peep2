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
import { Title, Container, Spacer, ViewField, LinkButton } from '../widgets';
import Preview from '../People/Preview';
import { onTagClick, deletePeople } from '../../actions/people';
import MasonryLayout from '../widgets/MasonryLayout';
import { getPathByName } from '../../routes';

const StyledGrid = styled.div`
  display: grid;
  margin: 25px 0;
  width: 100%;
  gird-template-rows: auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-areas: 'type' 'website' 'street' 'zipcode' 'city' 'country';
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'type website' 'street zipcode' 'city country';
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-rows: auto auto auto;
    grid-template-areas: 'type website street' 'zipcode city country';
  }
`;

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '800px', columns: 2, gutter: 10 },
  { mq: '1100px', columns: 3, gutter: 10 },
  { mq: '1400px', columns: 4, gutter: 10 },
  { mq: '1700px', columns: 5, gutter: 10 },
];

const ArrayBlock = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 25px 0;
`;

const StyledLink = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledViewField = styled(ViewField)`grid-area: ${props => props.name};`;

const CompanyInfos = ({ company = {}, people }) => {
  const { type, website, address = {} } = company;
  const { street, zipcode, city, country } = address;
  return (
    <StyledWrapper>
      <StyledGrid>
        <StyledViewField name="type" label="Type" value={type} />
        <StyledViewField
          name="website"
          label={
            website && (
              <div>
                <span style={{ marginRight: 10 }}>Website</span>
                <StyledLink target="_blank" href={website}>
                  <i className="fa fa-external-link" />
                </StyledLink>
              </div>
            )
          }
          value={website}
        />
        <StyledViewField name="street" label="Street" value={street} />
        <StyledViewField name="zipcode" label="Zip code" value={zipcode} />
        <StyledViewField name="city" label="City" value={city} />
        <StyledViewField name="country" label="Country" value={country} />
      </StyledGrid>
      {people.length > 0 && (
        <div>
          <label>Contacts</label>
          <ArrayBlock>
            <MasonryLayout id="people" sizes={sizes}>
              {map(
                person => (
                  <Preview
                    key={person._id}
                    person={person}
                    company={company}
                    onTagClick={() => {}}
                    deletePeople={deletePeople}
                  />
                ),
                people,
              )}
            </MasonryLayout>
          </ArrayBlock>
        </div>
      )}
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
          <Avatar
            name={company.name}
            size="LARGE"
            color={company.avatar.color}
          />
          <Spacer />
          <Title title={`${company.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <LinkButton
            to={getPathByName('editCompany', id)}
            iconName="pt-icon-edit"
            className="pt-button pt-large"
          />
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
