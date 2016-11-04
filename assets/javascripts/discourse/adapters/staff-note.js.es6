import RestAdapter from 'discourse/adapters/rest';
import { ajax } from 'discourse/lib/ajax';

export default RestAdapter.extend({
  destroyRecord(store, type, record) {
    const path = this.pathFor(store, type, record.get('id'));
    const userId = record.get('user_id');
    return ajax(`${path}?user_id=${userId}`, { method: 'DELETE' });
  }
});
