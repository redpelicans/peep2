import React from 'react';
import PropTypes from 'prop-types';
import { withHandlers } from 'recompose';
import { format } from 'date-fns';
import XLSX from 'xlsx';
import styled from 'styled-components';
import { Button, Dialog } from '@blueprintjs/core';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Spacer, Title } from '../widgets';
// import SheetJSApp from './index';

const DialogStyled = styled(Dialog)`width: 70%;`;

const ModalTimesheet = ({ values, isOpen, hideModal, exportFile }) => {
  const { cols, data } = values;

  return (
    <DialogStyled isOpen={isOpen} className="pt-dark">
      <Header>
        <HeaderLeft>
          <div className="pt-icon-th" />
          <Spacer />
          <Title>Timesheet</Title>
        </HeaderLeft>
        <HeaderRight>
          <Button
            className="pt-intent-primary pt-large"
            onClick={values => exportFile(values)}
            text="Download"
          />
          <Spacer />
          <Button
            className="pt-intent-warning pt-large"
            onClick={() => hideModal()}
            text="Close"
          />
        </HeaderRight>
      </Header>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>{cols.map(c => <th key={c.key}>{c.name}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>{cols.map(c => <td key={c.key}>{r[c.key]}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <SheetJSApp /> */}
    </DialogStyled>
  );
};

ModalTimesheet.propTypes = {
  values: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  exportFile: PropTypes.func.isRequired,
};

const TimesheetView = ({ values, isModalOpen, hideModal, exportFile }) => {
  return (
    <ModalTimesheet
      values={values}
      isOpen={isModalOpen}
      hideModal={hideModal}
      exportFile={exportFile}
    />
  );
};

TimesheetView.propTypes = {
  values: PropTypes.object,
  isModalOpen: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  exportFile: PropTypes.func.isRequired,
};

const enhance = withHandlers({
  exportFile: ({ values }) => () => {
    const ws = XLSX.utils.aoa_to_sheet(values.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(
      wb,
      `redpelicans_timesheet_${format(new Date(), 'YYYYMMDD')}.xlsx`,
    );
  },
});

export default enhance(TimesheetView);
