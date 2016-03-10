# name: staff-notes
# about: Gives the ability for staff members to attach notes to users
# version: 0.0.1
# authors: Robin Ward

enabled_site_setting :staff_notes_enabled

register_asset 'stylesheets/staff_notes.scss'

after_initialize do

  require_dependency 'user'

  module ::DiscourseStaffNotes
    class Engine < ::Rails::Engine
      engine_name "discourse_staff_notes"
      isolate_namespace DiscourseStaffNotes
    end

    def self.key_for(user_id)
      "notes:#{user_id}"
    end

    def self.notes_for(user_id)
      PluginStore.get('staff_notes', key_for(user_id)) || []
    end

    def self.add_note(user_id, raw, created_by)
      notes = notes_for(user_id)
      record = { id: SecureRandom.hex(16), raw: raw, created_by: created_by, created_at: Time.now }
      notes << record
      ::PluginStore.set("staff_notes", key_for(user_id), notes)

      record
    end

  end

  require_dependency 'application_serializer'
  class ::StaffNoteSerializer < ApplicationSerializer
    attributes :id, :raw, :created_by, :created_at

    def id
      object[:id]
    end

    def raw
      object[:raw]
    end

    def created_by
      user = User.where(id: object[:created_by]).first
      return nil if user.blank?

      BasicUserSerializer.new(user, scope: scope, root: false)
    end

    def created_at
      object[:created_at]
    end
  end

  require_dependency 'application_controller'
  class DiscourseStaffNotes::StaffNotesController < ::ApplicationController
    before_filter :ensure_logged_in
    before_filter :ensure_staff

    def index
      user = User.where(id: params[:user_id]).first
      raise Discourse::NotFound if user.blank?

      notes = ::DiscourseStaffNotes.notes_for(params[:user_id])
      render json: {
        extras: { username: user.username },
        staff_notes: serialize_data(notes, ::StaffNoteSerializer)
      }
    end

    def create
      user_id = params[:staff_note][:user_id]

      user = User.where(id: user_id).first
      raise Discourse::NotFound if user.blank?
      staff_note = ::DiscourseStaffNotes.add_note(user.id, params[:staff_note][:raw], current_user.id)

      render json: serialize_data(staff_note, ::StaffNoteSerializer)
    end
  end

  DiscourseStaffNotes::Engine.routes.draw do
    get '/' => 'staff_notes#index'
    post '/' => 'staff_notes#create'
  end

  Discourse::Application.routes.append do
    mount ::DiscourseStaffNotes::Engine, at: "/staff_notes"
  end

end
