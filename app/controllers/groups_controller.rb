class GroupsController < ApplicationController
  def show
    
  end
  def new
    @group = Group.new
    @group.users << current_user
  end
  def create
    @group = Group.create(group_params)
    if @group.save
      redirect_to user_path(current_user.id)
    else
      render :new
    end
  end
  private
  def group_params
    params.require(:group).permit(:name, user_ids: [] )
  end
end
