import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'ramda';
import { Button } from '@blueprintjs/core';
import { compose, withStateHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ModalAddenda from '../widgets/ModalAddenda';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  width: 35px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const AddendaView = ({ missionId, isModalOpen, showModal, hideModal }) => {
  return (
    <StyledWrapper>
      <ModalAddenda
        isOpen={isModalOpen}
        reject={() => {
          hideModal();
        }}
        accept={value => {
          console.log('ValueAddenda!', value);
          hideModal();
        }}
        type="Add"
        missionId={missionId}
      />
      <TitleContainer>
        <span>Addenda</span>
        <StyledButton
          className="pt-small pt-button"
          iconName="pt-icon-plus"
          onClick={() => showModal()}
        />
      </TitleContainer>
    </StyledWrapper>
  );
};

AddendaView.propTypes = {
  missionId: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
};

const enhance = compose(
  withStateHandlers(
    {
      isModalOpen: false,
    },
    {
      showModal: () => () => ({ isModalOpen: true }),
      hideModal: () => () => ({ isModalOpen: false }),
    },
  ),
);

export default enhance(AddendaView);
