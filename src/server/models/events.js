import mongobless from "mongobless";
import R from "ramda";

@mongobless({ collection: "events" })
export default class Event {
  static loadOne(id) {
    return Event.findOne({ isDeleted: { $ne: true }, _id: id });
  }
  static loadAll(query, ...params) {
    const baseQuery = { isDeleted: { $in: [null, false] } };
    return Event.findAll(R.merge(baseQuery, query), ...params);
  }
}
