import React from 'react';
import PropTypes from 'prop-types';
import { compose, sum, pluck } from 'ramda';
import styled from 'styled-components';
import { freeEventsFromPeriod } from '../../utils/events';
import PeriodPicker from './PeriodPicker';
import { getField } from '../../forms/events';
import { FormField } from '../../fields';
import WorkerCalendar from './Calendar/Worker';

const StyledForm = styled.div`
  display: flex;
  justify-content: center;
`;

const VSpacer = styled.div`
  margin-top: 15px;
  grid-area: spacer;
`;

const Form = styled.form`
  padding: 20px;
  margin-top: 50px;
  width: 90%;
  display: grid;
  grid-gap: 20px;
  justify-content: center;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'calendar' 'period' 'valueUnit' 'type' 'workerId'
    'status' 'description';
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-areas: 'calendar calendar calendar' 'period period period'
      'valueUnit valueUnit valueUnit' 'type workerId status'
      'description description description';
  }
`;

const StyledCalendar = styled(WorkerCalendar)`
  justify-content: center;
  grid-area: calendar;
`;

const StyledFormField = styled(FormField)`
  justify-content: center;
  grid-area: ${({ field }) => field.name};
`;
const StyledValueUnit = styled.div`
  grid-area: valueUnit;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  font-size: 3em;
`;

const ValueUnit = ({ value, unit }) => (
  <StyledValueUnit>{`${value} ${unit(value)}`}</StyledValueUnit>
);

ValueUnit.propTypes = {
  value: PropTypes.number.isRequired,
  unit: PropTypes.func.isRequired,
};

const AddOrEditForm = ({
  values,
  worker,
  events,
  calendar,
  minDate,
  maxDate,
  handleSubmit,
  setFieldTouched,
  setFieldValue,
  touched,
  errors,
}) => {
  const [from, to] = values['period'];
  const newEvents = freeEventsFromPeriod({
    from,
    to,
    events,
    calendar,
  });
  const daysCount = compose(sum, pluck('value'))(newEvents);
  return (
    <StyledForm>
      <Form id="AddOrEdit" onSubmit={handleSubmit}>
        <StyledCalendar
          startDate={minDate}
          endDate={maxDate}
          from={from}
          to={to}
          events={events}
          worker={worker}
          calendar={calendar}
          type={values['type']}
        />
        <PeriodPicker
          field={getField('period')}
          from={from}
          to={to}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          minDate={minDate}
          maxDate={maxDate}
          events={events}
        />
        <StyledFormField
          field={getField('workerId')}
          values={values}
          touched={touched}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
        />

        <ValueUnit
          name="valueUnit"
          value={daysCount}
          unit={count => (count > 1 ? 'working days' : 'working day')}
        />

        <StyledFormField
          field={getField('type')}
          values={values}
          errors={errors}
          touched={touched}
          type="text"
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
        />

        <StyledFormField
          field={getField('status')}
          values={values}
          errors={errors}
          touched={touched}
          type="text"
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
        />
        <VSpacer />
        <StyledFormField
          field={getField('description')}
          values={values}
          errors={errors}
          touched={touched}
          type="text"
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          height="10em"
        />
      </Form>
    </StyledForm>
  );
};

AddOrEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  worker: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object,
  values: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default AddOrEditForm;
