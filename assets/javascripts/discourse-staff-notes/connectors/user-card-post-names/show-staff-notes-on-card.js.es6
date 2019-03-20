import { showStaffNotes } from "discourse/plugins/discourse-staff-notes/discourse-staff-notes/lib/staff-notes";
import { getOwner } from "discourse-common/lib/get-owner";
import { emojiUrlFor } from "discourse/lib/text";

export default {
  shouldRender(args, component) {
    const { siteSettings, currentUser } = component;
    return siteSettings.staff_notes_enabled && currentUser && currentUser.staff;
  },

  setupComponent(args, component) {
    const { user } = args;
    const count =
      user.get("staff_notes_count") ||
      user.get("custom_fields.staff_notes_count") ||
      0;
    component.set("staffNotesCount", count);
    component.set("emojiEnabled", component.siteSettings.enable_emoji);
    component.set("emojiUrl", emojiUrlFor("pencil"));
    component.set("user", user);
    component.set("staffNotesTitle", I18n.t("staff_notes.show", { count }));
  },

  actions: {
    showStaffNotes() {
      this.parentView.parentView._close();
      const store = getOwner(this).lookup("store:main");
      const user = this.get("args.user");
      showStaffNotes(store, user.get("id"), count =>
        this.set("staffNotesCount", count)
      );
    }
  }
};
