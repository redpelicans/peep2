import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Container, Title, Spacer } from '../widgets';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';

const validate = () => {
  return {};
};

const Form = styled.form`
  margin-top: 25px;
  width: 100%;
  display: grid;
  flex-direction: column;
  grid-template-areas: 'values type' 'toto';
`;

const StyledField = styled(Field)`grid-area: ${({ name }) => name};`;

const Add = ({ valid, cancel, handleSubmit, addEvent, reset }) => {
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-calendar" />
          <Spacer />
          <Title>New Event</Title>
        </HeaderLeft>
        <HeaderRight>
          <Button form="addEvent" type="submit" disabled={!valid} className="pt-intent-success pt-large">
            Create
          </Button>
          <Spacer />
          <Button className="pt-intent-warning pt-large" onClick={cancel}>
            Cancel
          </Button>
          <Spacer />
          <Button className="pt-intent-danger pt-large" onClick={reset}>
            Reset
          </Button>
        </HeaderRight>
      </Header>
      <Form id="addEvent" onSubmit={handleSubmit(addEvent)}>
        <StyledField name="value" component="input" type="text" className="pt-input" />
        <StyledField name="type" component="input" type="text" className="pt-input" />
        <StyledField name="toto" component="input" type="text" className="pt-input" />
      </Form>
    </Container>
  );
};

Add.propTypes = {
  cancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  companieForm: PropTypes.object,
  addEvent: PropTypes.func.isRequired,
  valid: PropTypes.bool,
};

const mapStateToProps = state => ({});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const componentLifecycle = {
  componentWillMount() {
    const { history } = this.props;
    const { location: { state } } = history;
    if (!state) return history.replace(getPathByName('agenda'));
  },
};

export default compose(
  lifecycle(componentLifecycle),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    addEvent: () => values => console.log(values),
  }),
  reduxForm({
    form: 'addEvent',
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Add);
