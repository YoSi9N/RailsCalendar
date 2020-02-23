class EventsController < ApplicationController
  before_action :not_group_member, only: [:index]
  before_action :authenticate_user!, except: [:top]
  def index
    respond_to do |format|
      format.html
      format.json { render json: @events }
    end
  end

  def new
  end

  def create
    if params[:"start(4i)"]
      setting_allday_false
      if @start_allday_false < @end_allday_false
        @event = Event.create(event_params)
      end
    elsif params[:"start(1i)"]
      setting_allday_true
      if @start_allday_true <= @end_allday_true
        @event = Event.create(event_params)
      end
    else
      @event = Event.create(event_params_allday)
    end
    if @event.save   
      respond_to do |format|
        format.html
        format.json
      end
    else
      render :index
    end
  end
  def update
    @event = Event.find(params[:id])
    @event.update(time_params)
    
    if  @event.save
      respond_to do |format|
        format.html
        format.json
      end
    else
      render :index
    end
  end

  def destroy
    event = Event.find(params[:id])
    event.destroy
  end

  def top
    @user = User.new
  end
  private
  def event_params
    params.permit(:title,:start, :end, :color_id, :allDay, :group_id).merge(user_id: current_user.id)
  end
  def event_params_allday
    params.require(:event).permit(:title,:start,:end, :color_id,:allDay, :group_id).merge(user_id: current_user.id)
  end
  def time_params
    params.require(:event).permit(:title,:start,:end, :color_id)
  end
  def setting_allday_false
    @start_allday_false = params[:"start(1i)"] + params[:"start(2i)"] + params[:"start(3i)"] + params[:"start(4i)"] + params[:"start(5i)"]
    @end_allday_false = params[:"end(1i)"] + params[:"end(2i)"] + params[:"end(3i)"] + params[:"end(4i)"] + params[:"end(5i)"]
  end
  def setting_allday_true
    @start_allday_true = params[:"start(1i)"] + params[:"start(2i)"] + params[:"start(3i)"]
    @end_allday_true = params[:"end(1i)"] + params[:"end(2i)"] + params[:"end(3i)"]
  end
end

