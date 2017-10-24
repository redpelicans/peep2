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

const DialogStyled = styled(Dialog)`width: 70%;`;

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

const ModalNote = ({
  isOpen,
  accept,
  reject,
  displayTextArea,
  showTextArea,
  hideTextArea,
  value,
  defaultValue,
  handleChangeValue,
  title,
  type,
}) => (
  <DialogStyled isOpen={isOpen} className="pt-dark">
    <div className="pt-dialog-body">
      <TextStyled>{title}</TextStyled>
      {displayTextArea && (
        <TextAreaStyled
          name={name}
          className="pt-input pt-fill"
          dir="auto"
          defaultValue={defaultValue ? defaultValue : value}
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
          onClick={() => {
            handleChangeValue({ target: { value: '' } });
            showTextArea();
            accept(value);
          }}
          disabled={defaultValue === value}
          className="pt-intent-success pt-large"
        >
          {type}
        </Button>
      </div>
    </div>
  </DialogStyled>
);

ModalNote.propTypes = {
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  displayTextArea: PropTypes.bool.isRequired,
  showTextArea: PropTypes.func.isRequired,
  hideTextArea: PropTypes.func.isRequired,
  handleChangeValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

const enhance = withStateHandlers(
  ({ defaultValue }) => ({
    displayTextArea: true,
    value: defaultValue,
  }),
  {
    showTextArea: () => () => ({ displayTextArea: true }),
    hideTextArea: () => () => ({ displayTextArea: false }),
    handleChangeValue: () => e => ({ value: e.target.value }),
  },
);

export default enhance(ModalNote);
