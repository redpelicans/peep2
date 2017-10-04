import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from '@blueprintjs/core';

const ModalConfirmation = ({ isOpen = false, title, accept, reject }) => (
  <Dialog isOpen={isOpen} className="pt-dark">
    <div className="pt-dialog-body"> {title} </div>
    <div className="pt-dialog-footer">
      <div className="pt-dialog-footer-actions">
        <Button onClick={reject} className="pt-intent-warning pt-large">
          No
        </Button>
        <Button onClick={accept} className="pt-intent-success pt-large">
          Yes
        </Button>
      </div>
    </div>
  </Dialog>
);

ModalConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
};

export default ModalConfirmation;
