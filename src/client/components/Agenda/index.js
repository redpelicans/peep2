import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleIcon, Header, HeaderLeft, Title } from '../Header';
import Calendar from './Calendar';
import Day from './Day';

const today = new Date();

const Container = styled.div`
  display:flex;
  flex-direction:column;
  position:relative;
  padding: 20px;
  width:95%;
  margin:auto;
  margin-top:25px;
  margin-bottom:25px;
  background-color: #394b59;
  border-radius: 2px;
`;

const Agenda = ({ calendar }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <TitleIcon name="pt-icon-standard pt-icon-home" />
        <Title title="Agenda" />
      </HeaderLeft>
    </Header>
    <Calendar
      date={today}
      dayComponent={Day}
      calendar={calendar}
      onPeriodSelection={console.log}
    />
  </Container>
);


Agenda.propTypes = {
  calendar: PropTypes.object,
};

const mapStateToProps = state => ({
  calendar: state.calendar,
});


export default connect(mapStateToProps)(Agenda);
