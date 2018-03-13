import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import XLSX from 'xlsx';
import { length, map, prepend, reduce, values } from 'ramda';
import { getWorkingDaysInMonth } from '../../utils';

const Leave = (events, workerId) => {
  if (!events[workerId]) return { leave: 0, paidLeave: 0 };
  // console.log(events[workerId])
  // map(event => console.log(event[0].type), events[workerId])
  return reduce(
    (acc, event) => {
      return event[0].type === 'vacation'
        ? { ...acc, paidLeave: acc.paidLeave + event[0].value }
        : { ...acc, leave: acc.leave + event[0].value };
    },
    { leave: 0, paidLeave: 0 },
    values(events[workerId]),
  );
};

const workingDays = (calendar, date, event, workers) => {
  return getWorkingDaysInMonth(calendar, date);
};

workingDays.propTypes = {
  calendar: PropTypes.array,
  date: PropTypes.object,
  events: PropTypes.object,
  workers: PropTypes.object,
};

const newTimesheet = (calendar, date, events, workers) => {
  const colums = [
    'Nom du collaborateur',
    'Nombre de jours travaillés',
    "Jours d'absences",
    'Congés payés',
    'Nombre de jours de CP',
  ];

  return prepend(
    colums,
    map(worker => {
      const { leave, paidLeave } = Leave(events, worker._id);
      const workingDays =
        length(getWorkingDaysInMonth(calendar, date)) - leave - paidLeave;

      return [
        `${worker.firstName} ${worker.lastName}`,
        workingDays,
        leave,
        paidLeave,
      ];
    }, workers),
  );
};

newTimesheet.propTypes = {
  calendar: PropTypes.array,
  date: PropTypes.object,
  events: PropTypes.object,
  workers: PropTypes.object,
};

const ExportTimesheet = (calendar, date, events, workers) => {
  const ws = XLSX.utils.aoa_to_sheet(
    newTimesheet(calendar, date, events, workers),
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(
    wb,
    `redpelicans_timesheet_${format(new Date(), 'YYYYMMDD')}.xlsx`,
  );
};

ExportTimesheet.propTypes = {
  calendar: PropTypes.array,
  date: PropTypes.object,
  events: PropTypes.object,
  workers: PropTypes.object,
};

export default ExportTimesheet;
