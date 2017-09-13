import debug from 'debug';
import R from 'ramda';
import { Person } from '../models';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'skills';
export const baseskills = [
  'AngularJS',
  'React',
  'Redux',
  'FP',
  'SocketIO',
  'D3',
  'Backbone',
  'Bootstrap',
  'JQuery',
  'KnockOut',
  'NodeJS',
  'Redis',
  'NoSql',
  'Docker',
];

export const skills = {
  load() {
    return Person.loadAll({ skills: { $exists: true } }, { skills: 1 })
      .then((people) => {
        const loadedSkills = R.compose(R.flatten, R.map(R.prop('skills')));
        return R.compose(R.sortBy(R.prop(0)), R.uniq, R.concat(baseskills), loadedSkills)(people);
      });
  },
};

const init = (evtx) => {
  evtx.use(SERVICE_NAME, skills);
  loginfo('skills service registered');
};

export default init;
