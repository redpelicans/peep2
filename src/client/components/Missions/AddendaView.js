import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'ramda';
import { Button } from '@blueprintjs/core';
import { compose, withStateHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import MasonryLayout from '../widgets/MasonryLayout';
import Preview from '../Notes/Preview';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getMissions } from '../../selectors/missions';
import ModalAddenda from '../widgets/ModalAddenda';
// import { addNote, updateNote } from '../../actions/notes';

// const sizes = [
//   { columns: 1, gutter: 10 },
//   { mq: '800px', columns: 2, gutter: 10 },
//   { mq: '1100px', columns: 3, gutter: 10 },
//   { mq: '1400px', columns: 4, gutter: 10 },
//   { mq: '1700px', columns: 5, gutter: 10 },
// ];

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

const AddendaView = ({
  missionId,
  people,
  isModalOpen,
  showModal,
  hideModal,
}) => {
  return (
    <StyledWrapper>
      <ModalAddenda
        isOpen={isModalOpen}
        title="Add Addendum"
        reject={() => hideModal()}
        defaultValue={{}}
        accept={value => {
          hideModal(),
            console.log(
              'ValueAddenda!',
              value,
            ) /*, addAddendum(missionId, value)*/;
        }}
        type="Add"
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
  people: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
};

// const actions = { addNote, updateNote };
// const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = state => ({
  people: getPeople(state),
  missions: getMissions(state),
});

const enhance = compose(
  connect(mapStateToProps /*, mapDispatchToProps*/),
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
