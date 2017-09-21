import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Container, Title, TitleIcon } from '../widgets';
import { Header, HeaderLeft, HeaderRight } from '../Header';

const validate = () => {
  return {};
};

const Add = () => {
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <TitleIcon name="pt-icon-standard pt-icon-calendar" />
          <Title>New Event</Title>
        </HeaderLeft>
        <HeaderRight>
          <Button form="addEvent" type="submit" className="pt-intent-success">
            Create
          </Button>
        </HeaderRight>
      </Header>
    </Container>
  );
};

Add.propTypes = {};

const mapStateToProps = () => ({});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default compose(
  reduxForm({
    form: 'addEvent',
    validate,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Add);
