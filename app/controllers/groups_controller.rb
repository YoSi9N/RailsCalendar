class GroupsController < ApplicationController
  before_action :authenticate_user!
  
  def show
  end

  def new
    @user = User.find(current_user.id)
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
  
  def edit
    @user = User.find(current_user.id)
    @group = Group.find(params[:id])
  end

  def update
    @user = User.find(current_user.id)
    @group = Group.find(params[:id])
    if @group.update(group_params)
      redirect_to group_events_path(@group.id)
    else
      render :new
    end
  end

  def destroy
    @group = Group.find(params[:id])
    if @group.destroy
      redirect_to root_path
    else
      render :edit
    end
  end
  private
  def group_params
    params.require(:group).permit(:name, user_ids: [] )
  end
end
