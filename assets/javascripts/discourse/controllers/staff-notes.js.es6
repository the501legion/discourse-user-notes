import { default as computed, on } from 'ember-addons/ember-computed-decorators';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Controller.extend({
  newNote: null,
  saving: false,

  @on('init')
  reset() {
    this.setProperties({ newNote: null, saving: false });
  },

  @computed('newNote', 'saving')
  attachDisabled(newNote, saving) {
    return saving || !newNote || (newNote.length === 0);
  },

  actions: {
    attachNote() {
      const note = this.store.createRecord('staff-note');
      this.set('saving', true);
      note.save({ raw: this.get('newNote'), user_id: this.get('userId') }).then(() => {
        this.set('newNote', '');
        this.get('model').pushObject(note);
      }).catch(popupAjaxError).finally(() => this.set('saving', false));
    }
  }
});
