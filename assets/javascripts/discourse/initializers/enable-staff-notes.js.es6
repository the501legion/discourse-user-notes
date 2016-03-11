import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from 'discourse/lib/show-modal';

export default {
  name: 'enable-staff-notes',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (!siteSettings.staff_notes_enabled) { return; }

    withPluginApi('0.2', api => {
      function showStaffNotes() {
        const userId = this.attrs.user_id;
        return this.store.find('staff-note', { user_id: userId }).then(model => {
          const controller = showModal('staff-notes', { model, title: 'staff_notes.title' });
          controller.reset();
          controller.set('userId', userId);
        });
      }

      api.decorateWidget('poster-name:after', dec => {
        const cfs = dec.attrs.userCustomFields || {};
        if (cfs.has_staff_notes) {
          return dec.attach('staff-notes-icon');
        }
      });

      api.decorateWidget('post-admin-menu:after', dec => {
        return dec.attach('post-admin-menu-button', {
          icon: 'pencil',
          label: 'staff_notes.attach',
          action: 'showStaffNotes'
        });
      });

      api.attachWidgetAction('post-admin-menu', 'showStaffNotes', showStaffNotes);

      api.createWidget('staff-notes-icon', {
        tagName: 'span.staff-notes-icon',
        click: showStaffNotes,

        html() {
          return this.attach('emoji', { name: 'pencil' });
        }
      });
    });
  },
};
