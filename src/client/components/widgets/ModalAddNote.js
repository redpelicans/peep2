import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Colors, Button, Dialog } from '@blueprintjs/core';
import { withStateHandlers } from 'recompose';

const TextAreaStyled = styled.textarea`
  min-height: 150px;
  min-width: 100%;
`;

const MarkdownContainer = styled.div`
  background-color: ${Colors.DARK_GRAY3};
  padding: 25px;
  border-radius: 4px;
  min-height: 150px;
`;

const Buttons = styled.div`
  right: 0;
  align-self: flex-end;
  margin-bottom: 15px;
`;

const ButtonsStyled = styled(Buttons)`
  z-index: 0;
  margin-right: 20px;
`;

const TextStyled = styled.span`
  display: flex;
  font-size: 1em;
  margin-bottom: 20px;
`;

const ModalConfirmation = ({
  isOpen,
  accept,
  reject,
  displayTextArea,
  showTextArea,
  hideTextArea,
  value,
  handleChangeValue,
}) => (
  <Dialog isOpen={isOpen} className="pt-dark">
    <div className="pt-dialog-body">
      <TextStyled>Add Note</TextStyled>
      {displayTextArea && (
        <TextAreaStyled
          name={name}
          className="pt-input pt-fill"
          dir="auto"
          value={value}
          onChange={handleChangeValue}
        />
      )}
      {!displayTextArea && (
        <MarkdownContainer>
          <ReactMarkdown source={value} />
        </MarkdownContainer>
      )}
    </div>
    <ButtonsStyled className="pt-button-group pt-minimal">
      <button type="button" className="pt-button" onClick={showTextArea}>
        Edit
      </button>
      <button type="button" className="pt-button" onClick={hideTextArea}>
        View
      </button>
    </ButtonsStyled>
    <div className="pt-dialog-footer">
      <div className="pt-dialog-footer-actions">
        <Button onClick={reject} className="pt-intent-warning pt-large">
          Cancel
        </Button>
        <Button
          onClick={() => accept(value)}
          className="pt-intent-success pt-large"
        >
          Add
        </Button>
      </div>
    </div>
  </Dialog>
);

ModalConfirmation.propTypes = {
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  displayTextArea: PropTypes.bool.isRequired,
  showTextArea: PropTypes.func.isRequired,
  hideTextArea: PropTypes.func.isRequired,
  handleChangeValue: PropTypes.func.isRequired,
};

const enhance = withStateHandlers(
  {
    displayTextArea: true,
    value: '',
  },
  {
    showTextArea: () => () => ({ displayTextArea: true }),
    hideTextArea: () => () => ({ displayTextArea: false }),
    handleChangeValue: () => e => ({ value: e.target.value }),
  },
);

export default enhance(ModalConfirmation);
