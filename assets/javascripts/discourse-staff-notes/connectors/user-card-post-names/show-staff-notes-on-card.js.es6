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
  }
};
