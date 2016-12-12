import { showStaffNotes } from 'discourse/plugins/staff-notes/discourse-staff-notes/lib/staff-notes';
import { getOwner } from 'discourse-common/lib/get-owner';

export default {
  shouldRender(args, component) {
    const { siteSettings, currentUser } = component;
    return siteSettings.staff_notes_enabled && currentUser && currentUser.staff;
  },

  setupComponent(args, component) {
    const { model } = args;
    component.set('staffNotesCount', model.get('custom_fields.staff_notes_count') || 0);
  },

  actions: {
    showStaffNotes() {
      const store = getOwner(this).lookup('store:main');
      const user = this.get('args.model');
      showStaffNotes(store, user.get('id'), count => this.set('staffNotesCount', count));
    }
  }
};
