import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormField } from '../../fields';
import { getField } from '../../forms/missions';
import { startOfYear, subYears, endOfYear } from 'date-fns';

const MissionForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'clientId' 'name' 'dates' 'partnerId' 'billedTarget'
    'managerId' 'allowWeekends' 'note';
  @media (min-width: 700px) {
    grid-template-areas: 'clientId name name' 'dates dates none'
      'partnerId partnerId billedTarget' 'managerId managerId allowWeekends'
      'note note note';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.name};
`;

const AddOrEditForm = ({
  handleSubmit,
  values,
  touched,
  errors,
  setFieldTouched,
  setFieldValue,
}) => {
  return (
    <MissionForm id="missionForm" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('name')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('dates')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        maxDate={endOfYear(new Date())}
        minDate={startOfYear(subYears(new Date(), 20))}
      />
      <StyledFormField
        field={getField('clientId')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('partnerId')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('billedTarget')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('managerId')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('note')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('allowWeekends')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
    </MissionForm>
  );
};

AddOrEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
};

export default AddOrEditForm;
