class EventsController < ApplicationController
  before_action :startTime, :endTime, only: [:create]
  def index
    @events = Event.all
    respond_to do |format|
      format.html
      format.json { render json: @events }
    end
  end
  def new
  end
  def create
    
    if startTime < endTime
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
  private
  def event_params
    params.permit(:title, :start, :end, :color_id)
  end
  def time_params
    params.require(:event).permit(:title,:start,:end, :color_id)
  end
  def startTime
    timestart = params[:"start(1i)"] + params[:"start(2i)"] + params[:"start(3i)"] + params[:"start(4i)"] + params[:"start(5i)"]
  end
  def endTime
   timeend = params[:"end(1i)"] + params[:"end(2i)"] + params[:"end(3i)"] + params[:"end(4i)"] + params[:"end(5i)"]
  end
end

