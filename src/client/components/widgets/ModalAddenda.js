import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Dialog } from '@blueprintjs/core';
import FormikAdd from '../Addenda/Add';
import FormikEdit from '../Addenda/Edit';

const DialogStyled = styled(Dialog)`width: 70%;`;

const ModalAddenda = ({
  isOpen,
  value,
  type,
  defaultValues,
  accept,
  reject,
  missionId,
}) => (
  <DialogStyled isOpen={isOpen} className="pt-dark">
    {type === 'add' ? (
      <FormikAdd accept={accept} cancel={reject} missionId={missionId} />
    ) : (
      <FormikEdit
        accept={accept}
        cancel={reject}
        defaultValues={defaultValues}
      />
    )}
  </DialogStyled>
);

ModalAddenda.propTypes = {
  isOpen: PropTypes.bool,
  value: PropTypes.object,
  type: PropTypes.string.isRequired,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  missionId: PropTypes.string,
  defaultValues: PropTypes.object,
};

export default ModalAddenda;
