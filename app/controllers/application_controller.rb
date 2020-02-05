class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def not_group_member
    @group = Group.find(params[:group_id])
    @events = @group.events
    @group_user = @group.group_users
    member = []
    @group_user.each do |user|
      member << user.user_id
    end
    unless member.include?(current_user.id)
      redirect_to root_path
    end
  end

  def not_correct_user
    if params[:id].present?
      @user = User.find_by(id: params[:id])
      if @user.id != current_user.id
        redirect_to root_path
      end
    end
  end
end
