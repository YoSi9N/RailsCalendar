class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string     :title
      t.datetime   :start
      t.datetime   :end 
      t.integer    :color_id
      t.boolean    :allDay, default: false, null: false
      t.references :user
      t.references :group
      t.timestamps
    end
  end
end
