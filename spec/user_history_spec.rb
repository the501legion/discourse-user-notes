# frozen_string_literal: true

require 'rails_helper'

describe UserHistory do
  let(:user) { Fabricate(:user, suspended_till: 7.days.from_now) }
  let(:admin) { Fabricate(:admin) }

  describe 'when a user suspension log is created' do
    context "staff notes plugin is enabled" do
      before do
        SiteSetting.staff_notes_enabled = true
      end

      it "should create staff note for suspension" do
        UserHistory.create!(action: UserHistory.actions[:suspend_user], target_user_id: user.id, acting_user_id: admin.id)

        expect(PluginStore.get('staff_notes', "notes:#{user.id}")).to be_present
      end
    end
  end
end
