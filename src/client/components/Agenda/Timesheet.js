import PropTypes from 'prop-types';
import { format } from 'date-fns';
import XLSX from 'xlsx';
import { length, map, prepend, reduce, values } from 'ramda';
import { getWorkingDaysInMonth } from '../../utils';

export const Leave = (events, workerId) => {
  if (!events[workerId]) return { leave: '', paidLeave: '', nbLeave: 0 };
  return reduce(
    (acc, event) => {
      return event[0].type === 'vacation'
        ? {
            ...acc,
            paidLeave: `${acc.paidLeave} ${format(
              new Date(event[0].from),
              'DD',
            )}${event[0].period !== 'DAY' ? `(${event[0].period})` : ''}`,
            nbLeave: acc.nbLeave + event[0].value,
          }
        : {
            ...acc,
            leave: `${acc.leave} ${format(
              new Date(event[0].from),
              'DD',
            )}${event[0].period !== 'DAY' ? `(${event[0].period})` : ''}`,
            nbLeave: acc.nbLeave + event[0].value,
          };
    },
    { leave: '', paidLeave: '', nbLeave: 0 },
    values(events[workerId]),
  );
};

const newTimesheet = (calendar, date, events, workers) => {
  const header = [
    ['Redpelicans', '', `Timesheet ${format(new Date(date), 'MMMM YYYY')}`],
    ['Jours Ouvrés', length(getWorkingDaysInMonth(calendar, date))],
  ];

  const colums = [
    'Nom du collaborateur',
    'Nombre de jours travaillés',
    "Jours d'absences",
    'Congés payés',
    'Nombre de jours de CP',
  ];

  const workersDatas = map(worker => {
    const { leave, paidLeave, nbLeave } = Leave(events, worker._id);
    const workingDays = length(getWorkingDaysInMonth(calendar, date)) - nbLeave;

    return [
      `${worker.firstName} ${worker.lastName}`,
      workingDays,
      leave,
      paidLeave,
      nbLeave ? nbLeave : '',
    ];
  }, workers);

  return prepend(header[0], prepend(header[1], prepend(colums, workersDatas)));
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
