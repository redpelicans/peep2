import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormField } from '../../fields';
import { getField } from '../../forms/people';

const PeopleForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'prefix' 'firstName' 'lastName' 'type' 'email' 'jobType'
    'companyId' 'phones' 'tags' 'roles' 'notes';
  @media (min-width: 700px) {
    grid-template-areas: 'prefix firstName lastName' 'type email jobType'
      'companyId companyId companyId' 'phones phones phones' 'tags tags tags'
      'roles roles roles' 'notes notes notes';
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
  type,
}) => {
  return (
    <PeopleForm id="peopleForm" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('prefix')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('firstName')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('lastName')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('type')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('email')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('jobType')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      {values.type === 'worker' ? (
        <StyledFormField
          field={getField('companyId')}
          values={values}
          touched={touched}
          disabled={true}
          errors={errors}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
      ) : (
        <StyledFormField
          field={getField('companyId')}
          values={values}
          touched={touched}
          errors={errors}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
      )}
      <StyledFormField
        field={getField('phones')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('tags')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        creatable={true}
      />
      <StyledFormField
        field={getField('roles')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        multi={true}
      />
      {type === 'add' && (
        <StyledFormField
          field={getField('notes')}
          values={values}
          errors={errors}
          touched={touched}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
      )}
    </PeopleForm>
  );
};

AddOrEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default AddOrEditForm;
