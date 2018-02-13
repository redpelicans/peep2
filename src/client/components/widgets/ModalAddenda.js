import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Colors, Button, Dialog } from '@blueprintjs/core';
import { withStateHandlers } from 'recompose';
import { FormField, DateField } from '../../fields';
import { getField } from '../../forms/missions';
import { LinkButton } from '../widgets';
import { getPathByName } from '../../routes';
import FormikAdd from '../Addenda/Add';

const DialogStyled = styled(Dialog)`width: 70%;`;

const ModalAddenda = ({ isOpen, accept, reject, value, title }) => (
  <DialogStyled isOpen={isOpen} className="pt-dark">
    <FormikAdd accept={accept} cancel={reject} />
  </DialogStyled>
);

ModalAddenda.propTypes = {
  value: PropTypes.object,
  isOpen: PropTypes.bool,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ModalAddenda;
