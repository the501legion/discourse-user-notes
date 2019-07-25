import showModal from "discourse/lib/show-modal";
import loadScript from "discourse/lib/load-script";

export function showUserNotes(store, userId, callback, opts) {
  opts = opts || {};

  return loadScript("defer/html-sanitizer-bundle").then(() => {
    return store.find("user-note", { user_id: userId }).then(model => {
      const controller = showModal("user-notes", {
        model,
        title: "user_notes.title",
        addModalBodyView: true
      });
      controller.reset();
      controller.set("userId", userId);
      controller.set("callback", callback);
      controller.set("postId", opts.postId);
      return controller;
    });
  });
}
