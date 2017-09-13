import R from 'ramda';
import mongobless from 'mongobless';

@mongobless({ collection: 'notes' })
export default class Note {
  static loadOne(id) {
    return Note.findOne({ isDeleted: { $ne: true }, _id: id });
  }

  static loadAll(query, ...params){
    const baseQuery = { isDeleted: { $in: [null, false] } };
    return Note.findAll(R.merge(baseQuery, query), ...params);
  }

  static loadAll(query, ...params) {
    const baseQuery = { isDeleted: { $in: [null, false] } };
    return Note.findAll(R.merge(baseQuery, query), ...params);
  }

  static create(content, user, entity) {
    if (!content) return Promise.resolve({ entity });
    const newNote = {
      entityId: entity._id,
      createdAt: new Date(),
      authorId: user._id,
      content,
    };
    return Note.collection.insertOne(newNote).then(res => ({ entity, note: { ...newNote, _id: res.insertedId } }));
  }

  static deleteForEntity(id) {
    return Note.collection.updateMany({ entityId: id }, { $set: { updatedAt: new Date(), isDeleted: true } }).then(() => id);
  }

  static loadAllForEntity({ _id }) {
    return Note.findAll({ entityId: _id, isDeleted: { $ne: true } });
  }
}
