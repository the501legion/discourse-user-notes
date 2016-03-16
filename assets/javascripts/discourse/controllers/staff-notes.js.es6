import { default as computed, on } from 'ember-addons/ember-computed-decorators';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Controller.extend({
  newNote: null,
  saving: false,
  user: null,

  @on('init')
  reset() {
    this.setProperties({ newNote: null, saving: false, callback: null });
  },

  @computed('newNote', 'saving')
  attachDisabled(newNote, saving) {
    return saving || !newNote || (newNote.length === 0);
  },

  _refreshCount() {
    const callback = this.get('callback');
    if (callback) {
      callback(this.get('model.length'));
    }
  },

  actions: {
    attachNote() {
      const note = this.store.createRecord('staff-note');
      const userId = parseInt(this.get('userId'));

      this.set('saving', true);
      note.save({ raw: this.get('newNote'), user_id: userId }).then(() => {
        this.set('newNote', '');
        this.get('model').pushObject(note);
        this._refreshCount();
      }).catch(popupAjaxError).finally(() => this.set('saving', false));
    },

    removeNote(note) {
      note.destroyRecord().then(() => {
        const notes = this.get('model');
        notes.removeObject(note);
        this._refreshCount();
      }).catch(popupAjaxError);
    }
  }
});
