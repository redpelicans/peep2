import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Dialog } from '@blueprintjs/core';
import FormikAdd from '../Addenda/Add';

const DialogStyled = styled(Dialog)`width: 70%;`;

const ModalAddenda = ({ isOpen, value, type, accept, reject }) => (
  <DialogStyled isOpen={isOpen} className="pt-dark">
    <FormikAdd accept={accept} cancel={reject} />
  </DialogStyled>
);

ModalAddenda.propTypes = {
  isOpen: PropTypes.bool,
  value: PropTypes.object,
  type: PropTypes.string.isRequired,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
};

export default ModalAddenda;
