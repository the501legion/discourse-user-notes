import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from 'discourse/lib/show-modal';

export default {
  name: 'enable-staff-notes',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (!siteSettings.staff_notes_enabled) { return; }

    withPluginApi('0.2', api => {
      api.decorateWidget('poster-name:after', dec => {
        const cfs = dec.attrs.userCustomFields || {};
        if (cfs.has_staff_notes) {
          return dec.attach('staff-notes-icon');
        }
      });

      api.createWidget('staff-notes-icon', {
        tagName: 'span.staff-notes-icon',

        html() {
          return this.attach('emoji', { name: 'pencil' });
        },

        click() {
          return this.store.find('staff-note', { user_id: this.attrs.user_id }).then(model => {
            const controller = showModal('staff-notes', { model, title: 'staff_notes.title' });
            controller.reset();
            controller.set('userId', this.attrs.user_id);
          });
        }
      });
    });
  },
};
