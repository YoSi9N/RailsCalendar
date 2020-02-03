class Event < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to_active_hash :color
  belongs_to :user
  belongs_to :group, optional: true
end
