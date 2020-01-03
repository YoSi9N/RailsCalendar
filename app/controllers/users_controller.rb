class UsersController < ApplicationController
  def show
    @events = Event.where(user_id: current_user.id)
    @events = @events.where(group_id: nil)
    respond_to do |format|
      format.html
      format.json { render json: @events }
    end
  end
  def create
    if params[:"start(4i)"]
      setting_allday_false
      if @start_allday_false < @end_allday_false
        @event = Event.create(event_params)
        if @event.save
        else
          render :index
        end
        respond_to do |format|
          format.html
          format.json
        end
      end
    elsif params[:"start(1i)"]
      setting_allday_true
      if @start_allday_true <= @end_allday_true
        
        @event = Event.create(event_params)
        if @event.save
        else
          render :index
        end
        respond_to do |format|
          format.html
          format.json
        end
      end
    else
      
      @event = Event.create(event_params_allday)
      if @event.save
      else
        render :index
      end
      respond_to do |format|
        format.html
        format.json
      end
    end


    private
    def event_params
      params.permit(:title,:start, :end, :color_id, :allDay).merge(user_id: current_user.id)
    end
    def event_params_allday
      params.require(:event).permit(:title,:start,:end, :color_id,:allDay).merge(user_id: current_user.id)
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
end
