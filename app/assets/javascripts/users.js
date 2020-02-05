
  $(document).ready(function(){
    if(document.getElementById("user-js-key") != null){
    var user_id = $(".form-content").data("login-user") 
    $('#calendar').fullCalendar({
      
      header:{
        left:'prev,today,next',
        center:'title,eventListButton',
        right:'month agendaWeek agendaDay'
    },
    
    events: `/users/${user_id}`,
    customButtons:{
      eventListButton:{
          text: 'イベント追加',
          click:function(){
            $(".form-content").fadeIn()
        }
      }
    },
    eventAfterAllRender: function()
    {
      $("#calendar").css("z-index",1)
    },
    eventRender: function(event, element) {
      color_id = (event.color_id)
      if(color_id == 1){
        $(element).addClass("event-red");
      }else if(color_id == 2){
        $(element).addClass("event-blue");
      }else if(color_id == 3){
        $(element).addClass("event-yellow");
      }else if(color_id == 4){
        $(element).addClass("event-black");
      }else if(color_id == 5){
        $(element).addClass("event-white");
      }else if(color_id == 6){
        $(element).addClass("event-gray");
      }else if(color_id == 7){
        $(element).addClass("event-green");
      }else if(color_id == 8){
        $(element).addClass("event-orange");
      }else if(color_id == 9){
        $(element).addClass("event-pink");
      }else if(color_id == 10){
        $(element).addClass("event-purple");
      }else if(color_id == 11){
        $(element).addClass("event-brown");
      }else{

      }
      if(event.allDay == true){
        $(element).css("text-align", "center")
      }
    },
    eventLimit: true,
    editable: true,        // 編集可
    selectable: true,      // 選択可
    selectHelper: true,    // 選択時にプレースホルダーを描画
    ignoreTimezone: false, // 自動選択解除
    slotDuration: '00:30:00',              // 表示する時間軸の細かさ
    snapDuration: '00:01:00',
    axisFormat: 'H:mm',
    timeFormat: 'H:mm',              
    height : 625,
    allDaySlot: false,
    
    select: function(start,end){

      var set_start = new Date(start)
      var set_end = new Date(end)
      start_1 = set_start.setDate(set_start.getDate() + 1)
      end_1 = set_end.setDate(set_end.getDate())
      eventdata ={
        event:{
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD"),
          color_id: 1,
          allDay: true,
        }
      }
      if(start_1 != end_1){
      $.ajax({
        url: "/events",
        type: "post",
        data: eventdata,
        dataType: "json"
      })
      .done(function(){
        $("#calendar").fullCalendar('refetchEvents')
        
      })
      .fail(function(){
        alert('作成できませんでした');
      })
      }
    },
    
    eventClick: function(event) { //イベントをクリックしたときに実行
      //編集
      $(".update-form").fadeIn()
      $(".update-title").val(event.title)
      $(".form__cancel").click(function(){
        $(".update-form").hide()
        event = ""
      })
      $("#update").on("submit",function(e){
        var url = `/events/${event.id}`
        e.preventDefault()
        title = $(".update-title").val()
        color = $("#update-color_id").val()
        eventdata = 
          {event:{
            title: title,
            color_id: color
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
        if (event == ""){ //イベントデータがないならイベント終わり
          return false
        }
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
          event = ""
        })
        .fail(function(){
          $(".send").prop("disabled", false)
          event = ""
        })
      })
    },
    eventResize: function(event) {
      var start = event.start;
      var end = event.end || start;
      eventdata = 
      {event:{
      id : event.id,
      start: event.start.format(),
      end: end.format()
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
      var start = event.start;
      var end = event.end || start;
      if(event.allDay == true){
        eventdata = 
          {event:{
          id : event.id,
          start: event.start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD")
          }
        }
      }else{
          eventdata = 
          {event:{
          id : event.id,
          start: event.start.format(),
          end: event.end.format()
          }
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
    start_select = $(".form__start--select").html()
    end_select = $(".form__end--select").html()

    $(".form__cancel").click(function(){
      $(".form-content").hide()
      $("#allDay").removeAttr('checked').prop('checked', false).change()
      $(".form__start--select").html(start_select)
      $(".form__end--select").html(end_select)
      $(".form__start").css("color", "black")
      $(".form__end").css("color", "black")
      $(".title").val("")
      
    })
    $("#allDay").click(function(){
      
      if($("#allDay").prop("checked")){
        $(".form__start").css("color", "rgb(223, 247, 253)")
        $("#_start_4i").remove()
        $("#_start_5i").remove()
        $(".form__end").css("color", "rgb(223, 247, 253)")
        $("#_end_4i").remove()
        $("#_end_5i").remove()
      }else{
        $(".form__start--select").html(start_select)
        $(".form__end--select").html(end_select)
        $(".form__start").css("color", "black")
        $(".form__end").css("color", "black")
      }

    })
    
    $("#send").on("submit",function(e){
      
      e.preventDefault()
      $(".form-content").hide()
      var formData = new FormData(this);
      

      $.ajax({
        url: "/events",
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(){
        $(".send").prop("disabled", false);
        $("#send")[0].reset();
        $("#calendar").fullCalendar('refetchEvents')
      })
      .fail(function(){
        $(".send").prop("disabled", false);
        alert('終了をスタートより遅い時間にしてください');
      })

    })
  }
  });


