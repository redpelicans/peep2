import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button, Dialog } from '@blueprintjs/core';
import { compose } from 'ramda';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import {
  defaultValues,
  getValidationSchema,
  getField,
} from '../../forms/peoples';
import { Spacer, Title, Container, AvatarSelector } from '../widgets';
import { FormField } from '../../fields';

const PeopleForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'Prefix' 'FirstName' 'LastName' 'Types' 'Email' 'JobType'
    'Company' 'Phones' 'Tags' 'Roles' 'Notes';
  @media (min-width: 700px) {
    grid-template-areas: 'Prefix FirstName LastName' 'Types Email JobType'
      'Company Company Company' 'Phones Phones Phones' 'Tags Tags Tags'
      'Roles Roles Roles' 'Notes Notes Notes';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.key};
`;

class AddPeople extends Component {
  state = {
    isDialogOpen: false,
  };
  handleShowDialog = () => {
    this.setState({ isDialogOpen: !this.state.isDialogOpen });
  };
  render() {
    const { isDialogOpen } = this.state;
    const { changeColor, history } = this.props;
    const initialValues = {
      ...defaultValues,
    };
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        isInitialValid={({ validationSchema, initialValues }) =>
          validationSchema.isValid(initialValues)}
        onSubmit={values => console.log('submit!, values:', values)}
        render={({
          values,
          isValid,
          errors,
          handleSubmit,
          handleReset,
          setFieldTouched,
          dirty,
          setFieldValue,
          isSubmitting,
        }) => (
          <Container>
            <Dialog isOpen={isDialogOpen}>
              <div className="pt-dialog-body">Cancel this form?</div>
              <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                  <Button
                    onClick={this.handleShowDialog}
                    className="pt-intent-warning pt-large"
                  >
                    No
                  </Button>
                  <Button
                    onClick={() => history.goBack()}
                    className="pt-intent-success pt-large"
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </Dialog>
            <Header>
              <HeaderLeft>
                <Spacer size={15} />
                <AvatarSelector
                  name={values.Name}
                  handleChangeColor={changeColor}
                />
                <Spacer />
                <Title title="New People" />
              </HeaderLeft>
              <HeaderRight>
                <Button
                  form="addCompany"
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="pt-intent-success pt-large"
                >
                  Create
                </Button>
                <Spacer />
                <Button
                  onClick={() => {
                    if (!dirty) {
                      history.goBack();
                    } else {
                      this.handleShowDialog();
                    }
                  }}
                  className="pt-intent-warning pt-large"
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
                <Spacer size={20} />
              </HeaderRight>
            </Header>
            <PeopleForm id="addCompany" onSubmit={handleSubmit}>
              <StyledFormField
                field={getField('prefix')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('firstName')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('lastName')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('types')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('email')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('jobType')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('company')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('phones')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('tags')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('roles')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('notes')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
            </PeopleForm>
          </Container>
        )}
      />
    );
  }
}

AddPeople.propTypes = {
  changeColor: PropTypes.func.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withState('color', 'changeColor', ''),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
  }),
);

export default enhance(AddPeople);
