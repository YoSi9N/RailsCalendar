$(function(){
  function addUser(user) {
    let html = `
      <div class="group-user search-remove">
        <p class="group-user-name">${user.name}</p>
        <div class="user-search-add add-btn" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
      </div>
    `;
    $(".form_group__box--add").append(html);
  }
  function addNoUser() {
    let html = `
      <div class="group-user search-remove">
        <p class="group-user__not-name">ユーザーが見つかりません</p>
      </div>
    `;
    $(".form_group__box--add").append(html);
  }
  function addDeleteUser(name, id) {
    let html = `
    <div class="group-user" id="${id}" data-user-id="${id}">
      <p class="group-user-name">${name}</p>
      <div class="user-search-remove remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
    </div>`;
    $(".add-user").append(html);
  }
  function addMember(userId) {
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    $(`#${userId}`).append(html);
  }
  $("#name-search").on("keyup",function(){
    var input = $("#name-search").val()
    $.ajax({
      type: "GET",
      url: "/users",
      data: { keyword: input},
      dataType: "json"
    })
    .done(function(users) {
      $(".form_group__box--add").empty();
      if (users.length !== 0) {
        users.forEach(function(user) {
          addUser(user);
        });
      } else if (input.length == 0) {
        return false;
      } else {
        addNoUser();
      }
    })
    .fail(function() {
      alert("失敗です");
    });
  })
  $(".form_group__box--add").on("click", ".add-btn", function() {
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    $(this)
      .parent()
      .remove();
    addDeleteUser(userName, userId);
    addMember(userId);

  });

  $(document).on("click", ".user-search-remove", function(){
    $(this).parent().remove();
  });
})