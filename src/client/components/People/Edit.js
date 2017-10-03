import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { withState, withHandlers } from 'recompose';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { FormElem } from './Add';
import { updatePeople } from '../../actions/people';
import { getPathByName } from '../../routes';
import { getPerson } from '../../selectors/people';

const Edit = ({
  updatePeople,
  people,
  isDialogOpen,
  showDialogHandler,
  changeColor,
  history,
}) => {
  const getInitialValues = p => ({
    ...p,
    phones: p.phones.map(phone => ({
      type: phone.label,
      number: phone.number,
    })),
    color: p.avatar.color,
  });
  const initialValues = getInitialValues(people);
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
        submit={updatePeople}
      />
    </div>
  );
};

Edit.propTypes = {
  people: PropTypes.object.isRequired,
  showDialogHandler: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool,
  changeColor: PropTypes.func.isRequired,
  history: PropTypes.object,
  match: PropTypes.object,
  updatePeople: PropTypes.func.isRequired,
};

const actions = { updatePeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} }, history } = props;
  if (getPerson(state.people, id) === undefined) {
    history.push(getPathByName('notfound'));
  }
  return {
    people: getPerson(state.people, id),
  };
};

const enhance = compose(
  withState('color', 'changeColor', ''),
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
    showDialogHandler: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Edit);
