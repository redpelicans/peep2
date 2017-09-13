import debug from 'debug';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import { Note } from '../models';
import { emitEvent, formatOutput } from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'notes';

const outMaker = (note) => {
  return note;
};
export const outMakerMany = R.map(outMaker);

const inMaker = (data) => {
  const attrs = ['content', 'entityType', 'assigneesIds', 'notification', 'status'];
  const res = R.pick(attrs, data);
  if (data.dueDate) res.dueDate = moment(data.dueDate).toDate()
  if (data.entityId){
    res.entityId = ObjectId(data.entityId)
  }else{
    res.entityId = undefined
    res.entityType = undefined
  }
  return res
}

export const notes = {
  load() {
    return Note.loadAll();
  },

  del(id) {
    const deleteOne = () => Note.collection.updateOne({ _id: id }, { $set: { updatedAt: new Date(), isDeleted: true } });
    return deleteOne().then(() => ({ _id: id }));
  },

  add(note) {
    const newNote = inMaker(note);
    newNote.authorId = this.user._id;
    const loadOne = id => Note.loadOne(id);
    const insertOne = p => Note.collection.insertOne(p).then(R.prop('insertedId'));
    return insertOne(newNote).then(loadOne);
  },

  update(note) {
    const newVersion = inMaker(note);
    newVersion.authorId = this.user._id;
    newVersion._id = ObjectId(note._id);
    const loadOne = ({ _id: id }) => Note.loadOne(id);
    const update = nextVersion => (previousVersion) => {
      nextVersion.updatedAt = new Date();
      return Note.collection.updateOne({ _id: previousVersion._id }, { $set: nextVersion }).then(() => ({ _id: previousVersion._id }));
    };

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },
};

const init = (evtx) => {
  evtx.use(SERVICE_NAME, notes);
  evtx.service(SERVICE_NAME)
    .after({
      load: [formatOutput(outMakerMany)],
      loadOne: [formatOutput(outMaker)],
      add: [formatOutput(outMaker), emitEvent('note:added')],
      del: [emitEvent('note:deleted')],
      update: [formatOutput(outMaker), emitEvent('note:updated')],
    });


  loginfo('notes service registered');
};

export default init;
