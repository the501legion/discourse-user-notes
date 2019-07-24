import { showStaffNotes } from "discourse/plugins/discourse-user-notes/discourse-staff-notes/lib/staff-notes";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  shouldRender(args, component) {
    return component.siteSettings.user_notes_enabled;
  },

  setupComponent(args, component) {
    let model = args.flaggedPost.get("user");
    component.set(
      "staffNotesCount",
      model.get("custom_fields.staff_notes_count") || 0
    );
  },

  actions: {
    showStaffNotes() {
      const store = getOwner(this).lookup("store:main");
      const user = this.get("args.flaggedPost.user");
      showStaffNotes(store, user.get("id"), count =>
        this.set("staffNotesCount", count)
      );
    }
  }
};
