import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { withState, withHandlers } from 'recompose';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { FormElem } from './Add';

const Edit = ({ isDialogOpen, showDialogHandler, changeColor }) => {
  const initialValues = {};
  return (
    <div>
      <Dialog isOpen={isDialogOpen} className="pt-dark">
        <div className="pt-dialog-body">
          Would you like to cancel this form?
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={() => showDialogHandler()}
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
      <FormElem
        initialValues={initialValues}
        changeColor={changeColor}
        history={history}
        showDialogHandler={showDialogHandler}
        title="Edit People"
      />
    </div>
  );
};

Edit.propTypes = {
  showDialogHandler: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool,
  changeColor: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withState('color', 'changeColor', ''),
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
    showDialogHandler: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
  connect(null, mapDispatchToProps),
);

export default enhance(Edit);
