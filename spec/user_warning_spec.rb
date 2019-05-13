# frozen_string_literal: true

require 'rails_helper'

describe UserWarning do
  let(:user) { Fabricate(:user) }
  let(:admin) { Fabricate(:admin) }
  let(:topic) { Fabricate(:topic) }

  describe 'when a user warning is created' do
    context "staff notes plugin is enabled" do
      before do
        SiteSetting.staff_notes_enabled = true
      end

      it "should create staff note for warning" do
        UserWarning.create(topic_id: topic.id, user_id: user.id, created_by_id: admin.id)

        expect(PluginStore.get('staff_notes', "notes:#{user.id}")).to be_present
      end
    end
  end
end
