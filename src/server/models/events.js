import mongobless from 'mongobless';

@mongobless({ collection: 'events' })
export default class Event {
  static loadOne(id) {
    return Event.findOne({ isDeleted: { $ne: true }, _id: id });
  }
}

