import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormField } from '../../fields';
import { getField } from '../../forms/companies';

const CompagnyForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'Type' 'Name' 'Website' 'Zipcode' 'Street' 'Country'
    'City' 'Tags' 'Note';
  @media (min-width: 700px) {
    grid-template-areas: 'Type Name Website' 'Zipcode Street Street'
      'Country City City' 'Tags Tags Tags' 'Note Note Note';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.label};
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
    <CompagnyForm id="addCompany" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('type')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('name')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('website')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('street')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('zipcode')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('city')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        creatable={true}
      />
      <StyledFormField
        field={getField('country')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        creatable={true}
      />
      <StyledFormField
        field={getField('tags')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        creatable={true}
      />
      <StyledFormField
        field={getField('notes')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
    </CompagnyForm>
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
