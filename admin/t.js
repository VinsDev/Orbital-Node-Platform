function updateData() {
    $.LoadingOverlay("show");

    $.ajax({
        url: '/admin/<%= school_obj.name %>/getSubjectsResultsList',
        type: 'POST',
        data: JSON.stringify({
            class: $("#selected-class").val(),
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var payload = data.payload;
            var content = '';
            if (payload < 1) {
                $('#myTable tbody').html('Subjects not added yet');
                return;
            }

            payload.forEach((item, index) => {
                content += `
                    <tr data-url="/admin/<%= school_obj.name %>/assessment/${item.class}/${item.name}">
                      <th scope="row">${index + 1}</th>
                      <td>${item.name}</td>
                      <td>${item.teacher}</td>
                      <td>${item.class}</td> 
                  </tr>`
            });
            $('#myTable tbody').html(content);
            update();
        },
        complete: function () {
            $.LoadingOverlay("hide", true);
        },
    });

    return;
}
