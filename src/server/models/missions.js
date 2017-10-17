import mongobless from 'mongobless';
import R from 'ramda';

@mongobless({ collection: 'missions' })
export default class Mission {
  static loadOne(id) {
    return Mission.findOne({ isDeleted: { $ne: true }, _id: id });
  }

  static loadAll(query, ...params) {
    const baseQuery = { isDeleted: { $in: [null, false] } };
    return Mission.findAll(R.merge(baseQuery, query), ...params);
  }
}
