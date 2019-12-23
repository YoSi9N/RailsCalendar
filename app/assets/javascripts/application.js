// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require moment
//= require moment/ja.js
//= require fullcalendar
//= require fullcalendar/lang/ja
//= require rails-ujs
//= require activestorage

//= require_tree .
$(document).ready(function(){
  
  $('#calendar').fullCalendar({
    
    header:{
      left:'prev,next,today',
      center:'title,eventListButton',
      right:'month agendaWeek agendaDay'
  },
   events: '/events',
  customButtons:{
    eventListButton:{
        text: 'イベント追加',
        click:function(){
          $(".form-content").fadeIn()
      }
    }
  },
  eventLimit: true,
  editable: true,        // 編集可
  selectable: true,      // 選択可
  selectHelper: true,    // 選択時にプレースホルダーを描画
  ignoreTimezone: false, // 自動選択解除
  slotDuration: '00:30:00',              // 表示する時間軸の細かさ
  snapDuration: '00:01:00',              // スケジュールをスナップするときの動かせる細かさ
  allDaySlot: false,
  height : 600,
  eventColor: 'red',
  
  eventClick: function(event) { //イベントをクリックしたときに実行
    //編集
    $(".update-form").fadeIn()
    $(".update-title").val(event.title)
    $(".form__cancel").click(function(){
      $(".update-form").hide()
    })
    $("#update").on("submit",function(e){
      var url = `/events/${event.id}`
      e.preventDefault()
      title = $(".update-title").val()
      eventdata = 
        {event:{
          title: title
        }
      }
      if (event == ""){ //イベントデータがないならイベント終わり
        return false
      }
      $.ajax({
        url: url,
        type: "PATCH",
        data: eventdata,
        dataType : "json"
      })
      .done(function(){
        $(".update-form").hide()
        $("#calendar").fullCalendar('refetchEvents')
        $(".send").prop("disabled", false);
        event = "" //イベントデータを消す
      })
      .fail(function(){
        alert('変更できませんでした');
        event = ""
      })
    })

    $(".form__destroy").click(function(){
      url = `/events/${event.id}`
      $.ajax({
        url: url,
        type: "delete",
        data: event.id,
        dataType: "json"
      })
      .done(function(){
        $(".update-form").hide()
        $("#calendar").fullCalendar('refetchEvents')
        $(".send").prop("disabled", false)
      })
      .fail(function(){
        $(".send").prop("disabled", false)

      })
    })
  },
  eventResize: function(event) {
    eventdata = 
    {event:{
    id : event.id,
    start: event.start.format(),
    end: event.end.format()
    }
  }
  var url = `/events/${event.id}`
  $.ajax({
    url: url,
    type: "PATCH",
    data: eventdata,
    dataType : "json"
  })
  .fail(function(){
    alert('日付の変更ができませんでした。');
  })
  },
  eventDrop: function(event) { // ドラック＆ドロップした時
    eventdata = 
      {event:{
      id : event.id,
      start: event.start.format(),
      end: event.end.format()
      }
    }
    var url = `/events/${event.id}`
    $.ajax({
      url: url,
      type: "PATCH",
      data: eventdata,
      dataType : "json"
    })
    .fail(function(){
      alert('日付の変更ができませんでした。');
    })
  }
    
  });
  $(".form__cancel").click(function(){
    $(".form-content").hide()
  })


  $("#send").on("submit",function(e){
    e.preventDefault()
    $(".form-content").hide()
    var formData = new FormData(this);
    var url = $(this).attr("action");
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(date){
      $(".send").prop("disabled", false);
      $("#send")[0].reset();
      $("#calendar").fullCalendar('refetchEvents')
    })
    .fail(function(){
      $(".send").prop("disabled", false);
      alert('作成できませんでした');
    })

  })
});
