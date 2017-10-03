import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { getCalendar } from '../../selectors/calendar';
import { getWorkers } from '../../selectors/people';
import { getEventsByWorkerDate } from '../../selectors/events';
import { Container, Title, Spacer } from '../widgets';
import { defaultValues, getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Add = ({ history, cancel, addEvent, workers, events, calendar }) => {
  const { location: { state } = {} } = history;
  const worker = workers[state.workerId];
  if (!worker) return null;
  const workerEvents = events[worker._id];
  const selectedPeriod = [startOfDay(state.from), endOfDay(state.to)];
  const calendarPeriod = [
    startOfDay(subWeeks(state.from, 1)),
    endOfDay(addWeeks(state.to, 1)),
  ];
  const [minDate, maxDate] = calendarPeriod;
  const initialValues = {
    ...defaultValues,
    period: selectedPeriod,
    workerId: worker._id,
  };
  // getValidationSchema().isValid(initialValues) .then(x => console.log(x))

  return (
    <StyledContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={addEvent}
        render={({ isSubmitting, isValid, handleReset, dirty, ...props }) => {
          return (
            <div>
              <Header>
                <HeaderLeft>
                  <div className="pt-icon-standard pt-icon-calendar" />
                  <Spacer />
                  <Title>New Event</Title>
                </HeaderLeft>
                <HeaderRight>
                  <Button
                    form="addEvent"
                    type="submit"
                    disabled={isSubmitting}
                    className="pt-intent-success pt-large"
                  >
                    Create
                  </Button>
                  <Spacer />
                  <Button className="pt-intent-warning pt-large">Cancel</Button>
                  <Spacer />
                  <Button
                    className="pt-intent-danger pt-large"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                  >
                    Reset
                  </Button>
                </HeaderRight>
              </Header>
              <AddOrEdit
                worker={worker}
                minDate={minDate}
                maxDate={maxDate}
                calendar={calendar}
                event={event}
                events={workerEvents}
                cancel={cancel}
                {...props}
              />
            </div>
          );
        }}
      />
    </StyledContainer>
  );
};

Add.propTypes = {
  cancel: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  calendar: getCalendar(state),
  workers: getWorkers(state),
  events: getEventsByWorkerDate(state),
});

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
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle(componentLifecycle),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    addEvent: () => values => console.log(values),
  }),
)(Add);
