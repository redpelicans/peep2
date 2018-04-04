import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import { getNote } from '../../selectors/notes';
import { getPathByName } from '../../routes';
import { getValidationSchema } from '../../forms/notes';
import { updateNote } from '../../actions/notes';
import { Prompt } from 'react-router';
import { Spacer, Title, Container, ModalConfirmation } from '../widgets';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

export const Edit = compose(
  withState('isCancelDialogOpen', 'showCancelDialog', false),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    requestCancel: ({ history, showCancelDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showCancelDialog(true);
    },
    toggleDialog: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
)(
  ({
    values,
    isSubmitting,
    isValid,
    dirty,
    handleSubmit,
    handleReset,
    setFieldTouched,
    setFieldValue,
    isCancelDialogOpen,
    showCancelDialog,
    cancel,
    requestCancel,
    ...props
  }) => (
    <StyledContainer>
      <Prompt
        when={!isCancelDialogOpen && dirty && !isSubmitting}
        message="Would you like to cancel this form ?"
      />
      <ModalConfirmation
        isOpen={isCancelDialogOpen}
        title="Would you like to cancel this form ?"
        reject={() => showCancelDialog(false)}
        accept={cancel}
      />
      <Header>
        <HeaderLeft>
          <Spacer size={15} />
          <Title title={'Edit Note'} />
        </HeaderLeft>
        <HeaderRight>
          <Button
            form="addNote"
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="pt-intent-success pt-large"
          >
            Update
          </Button>
          <Spacer />
          <Button
            onClick={requestCancel(dirty)}
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
      <AddOrEdit
        type="edit"
        handleSubmit={handleSubmit}
        values={values}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        {...props}
      />
    </StyledContainer>
  ),
);

Edit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  person: PropTypes.object,
};

const actions = { updateNote };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});
const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} }, history } = props;
  if (getNote(state, id) === undefined) {
    history.push(getPathByName('notfound'));
  }
  return {
    note: getNote(state, id),
  };
};

const FormikEdit = ({ updateNote, note = {}, history, ...props }) => (
  <Formik
    initialValues={{
      ...note,
      note: note.content,
      entityType: note.entityType === null ? undefined : note.entityType,
      person: note.entityId,
      company: note.entityId,
      dueDate: note.dueDate ? new Date(note.dueDate) : undefined,
    }}
    validationSchema={getValidationSchema()}
    onSubmit={({ _id, note, entityType, entityId, dueDate, assigneesIds }) => {
      updateNote(
        _id,
        note,
        entityType === undefined ? null : entityType,
        !entityType ? null : entityId,
        dueDate,
        assigneesIds,
      );
      history.goBack();
    }}
    render={({ ...others }) => (
      <Edit history={history} {...props} {...others} />
    )}
  />
);

FormikEdit.propTypes = {
  updateNote: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(FormikEdit);
