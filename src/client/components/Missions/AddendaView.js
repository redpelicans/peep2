import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, values, isEmpty } from 'ramda';
import { Button } from '@blueprintjs/core';
import { compose, withStateHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ModalAddenda from '../widgets/ModalAddenda';
import { getAddenda } from '../../selectors/addenda';
import { getPeople } from '../../selectors/people';
import MasonryLayout from '../widgets/MasonryLayout';
import Preview from '../Addenda/Preview';
import { updateAddendum, deleteAddendum } from '../../actions/addenda';

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '800px', columns: 2, gutter: 10 },
  { mq: '1100px', columns: 3, gutter: 10 },
  { mq: '1400px', columns: 4, gutter: 10 },
  { mq: '1700px', columns: 5, gutter: 10 },
];

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
  isModalOpen,
  showModal,
  hideModal,
  addenda,
  people,
  type,
  payload,
  isAddForm,
  isEditForm,
  updateAddendum,
  deleteAddendum,
}) => {
  return (
    <StyledWrapper>
      <ModalAddenda
        isOpen={isModalOpen}
        reject={() => {
          hideModal();
        }}
        accept={value => {
          hideModal();
        }}
        type={type}
        defaultValues={payload}
        missionId={missionId}
      />
      <TitleContainer>
        <span>Addenda</span>
        <StyledButton
          className="pt-small pt-button"
          iconName="pt-icon-plus"
          onClick={() => {
            isAddForm();
            showModal();
          }}
        />
      </TitleContainer>
      {!isEmpty(people) && (
        <MasonryLayout id="addenda" sizes={sizes}>
          {map(
            addendum => (
              <Preview
                key={addendum._id}
                addendum={addendum}
                people={people}
                isEditForm={isEditForm}
                showModal={showModal}
                deleteAddendum={deleteAddendum}
                updateAddendum={updateAddendum}
              />
            ),
            values(addenda),
          )}
        </MasonryLayout>
      )}
    </StyledWrapper>
  );
};

AddendaView.propTypes = {
  addenda: PropTypes.array,
  people: PropTypes.object,
  missionId: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  deleteAddendum: PropTypes.func.isRequired,
  updateAddendum: PropTypes.func.isRequired,
  type: PropTypes.string,
  payload: PropTypes.object,
  isAddForm: PropTypes.func,
  isEditForm: PropTypes.func,
};

const mapStateToProps = state => ({
  addenda: getAddenda(state),
  people: getPeople(state),
});

const mapDispatchToProps = {
  updateAddendum,
  deleteAddendum,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(
    {
      isModalOpen: false,
      type: 'add',
      payload: {},
    },
    {
      showModal: () => () => ({ isModalOpen: true }),
      hideModal: () => () => ({ isModalOpen: false }),
      isAddForm: () => () => ({ type: 'add' }),
      isEditForm: () => addendum => ({ type: 'edit', payload: addendum }),
    },
  ),
);

export default enhance(AddendaView);
