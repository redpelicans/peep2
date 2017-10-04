import React from 'react';
import PropTypes from 'prop-types';
import { prop, compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withState, withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import { getCalendar } from '../../selectors/calendar';
import { addEventGroup } from '../../actions/events';
import { getWorker, getWorkers } from '../../selectors/people';
import { getWorkerEventsByDate } from '../../selectors/events';
import { Container, Title, Spacer, ModalConfirmation } from '../widgets';
import { defaultValues, getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';
import AddOrEdit from './AddOrEdit';
import { freeEventsFromPeriod } from '../../utils/events';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Add = ({
  worker,
  period,
  cancel,
  requestCancel,
  events,
  calendar,
  isCancelDialogOpen,
  showCancelDialog,
  isSubmitting,
  isValid,
  handleReset,
  handleSubmit,
  dirty,
  ...props
}) => {
  if (!worker) return null;
  const calendarPeriod = [
    startOfDay(subWeeks(period[0], 1)),
    endOfDay(addWeeks(period[1], 1)),
  ];
  const [minDate, maxDate] = calendarPeriod;

  return (
    <StyledContainer>
      <div>
        <ModalConfirmation
          isOpen={isCancelDialogOpen}
          title="Would you like to cancel this form ?"
          reject={() => showCancelDialog(false)}
          accept={cancel}
        />

        <Header>
          <HeaderLeft>
            <div className="pt-icon-standard pt-icon-calendar" />
            <Spacer />
            <Title>New Event</Title>
          </HeaderLeft>
          <HeaderRight>
            <Button
              form="AddOrEdit"
              type="submit"
              disabled={isSubmitting}
              className="pt-intent-success pt-large"
            >
              Create
            </Button>
            <Spacer />
            <Button
              className="pt-intent-warning pt-large"
              disabled={isSubmitting}
              onClick={requestCancel(dirty)}
            >
              Cancel
            </Button>
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
          events={events}
          handleSubmit={handleSubmit}
          {...props}
        />
      </div>
    </StyledContainer>
  );
};

Add.propTypes = {
  period: PropTypes.array.isRequired,
  worker: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object,
  cancel: PropTypes.func.isRequired,
  requestCancel: PropTypes.func.isRequired,
  showCancelDialog: PropTypes.func.isRequired,
  isCancelDialogOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { history }) => {
  const { location: { state: { from, to, workerId } } = {} } = history;
  return {
    calendar: getCalendar(state),
    worker: getWorker(workerId)(state),
    events: getWorkerEventsByDate(workerId)(state),
    period: [startOfDay(from), endOfDay(to)],
  };
};

const actions = { addEventGroup };
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
  withFormik({
    handleSubmit: (
      { type, workerId, status, period, description },
      { props },
    ) => {
      const { calendar, events, addEventGroup, history } = props;
      const [from, to] = period;
      const newEvents = freeEventsFromPeriod({ from, to, events, calendar });
      addEventGroup({
        type,
        workerId,
        status,
        from,
        to,
        description,
        events: newEvents,
      });
      history.goBack();
    },
    validationSchema: getValidationSchema(),
    mapPropsToValues: ({ worker, period }) => ({
      ...defaultValues,
      period,
      workerId: prop('_id', worker || {}),
    }),
  }),
  withState('isCancelDialogOpen', 'showCancelDialog', false),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    requestCancel: ({ history, showCancelDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showCancelDialog(true);
    },
  }),
)(Add);
