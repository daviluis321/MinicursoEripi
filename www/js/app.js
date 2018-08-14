$(document).ready(function () {
  $('.modal').modal({
    outDuration: 100,
    inDuration: 100
  });
});


$(document).ready(function () {
  $('input#input_text, textarea#textarea2').characterCounter();
});

$('.dropdown-trigger').dropdown();

$(document).ready(function () {
  $('.fixed-action-btn').floatingActionButton({
    direction: 'left',
    hoverEnabled: false
  });
});

// lista de tarefas

$(function () {
  var meuLogin = "teste@email.com";
  var server = "http://livro-capitulo07.herokuapp.com";

  var $lastClicked; // Armazenar uma tarefa que estamos editando
  
  // Deletando o item  com o clique
  function onTarefaDeleteClick() {
    // O hide esconde o elemento
    $(this).parent(".tarefa-item").off("click").hide("slow", function () {
      $.post(server + "/tarefa",
        {
          usuario: meuLogin,
          _method: "DELETE",
          tarefa_id: $(this).children(".tarefa-id").text()
        });

      $(this).remove();
    });
  }

  function onTarefaItemClick() {
    if (!$(this).is($lastClicked)) {
      if ($lastClicked !== undefined) {
        savePendingEdition($lastClicked);
      }

      $lastClicked = $(this);

      var text = $lastClicked.children(".tarefa-texto").text();
      // guardamos o id da tarefa na edi��o
      var id = $lastClicked.children(".tarefa-id").text();

      var html = "<div class='tarefa-id'>" + id + "</div>" +
        "<input type='text' " + "class='tarefa-edit' value='" + text + "'>";

      $(this).html(html);

      $(".tarefa-edit").keydown(onTarefaEditKeydown);
    }
  }

  function onTarefaKeyDown() {
    if (event.which === 13) {
      addTarefa($("#input_text").val());
      $("#input_text").val("");
    }
  }

  function onTarefaEditKeydown(event) {
    if (event.which === 13) {
      savePendingEdition($lastClicked);
      $lastClicked = undefined;
    }
  }

  function addTarefa(text, id) {
    id = id || 0;

    var $tarefa = $("<div />")
      .addClass("tarefa-item")
      .append($("<div />")
        .addClass("tarefa-id")
        .text(id))
      .append($("<div />")
        .addClass("tarefa-texto")
        .text(text))
      .append($("<div />")
        .addClass("tarefa-delete"))
      .append($("<div />")
        .addClass("clear"));

    $("#tarefa-list").append($tarefa);

    $(".tarefa-delete").click(onTarefaDeleteClick);

    $(".tarefa-item").click(onTarefaItemClick);

    if (id === 0) {
      var div = $tarefa.children(".tarefa-id");
      console.log("id", div);
      newTarefa(text, $(div));
    }
  }

  function savePendingEdition($tarefa) {
    var text = $tarefa.children(".tarefa-edit").val();
    var id = $tarefa.children(".tarefa-id").text();

    $tarefa.empty();

    $tarefa.append("<div class='tarefa-id'>" + id + "</div>")
      .append("<div class='tarefa-texto'>" + text + "</div>")
      .append("<div class='tarefa-delete'></div>")
      .append("<div class='clear'></div>");

    updateTarefa(text, id);

    $(".tarefa-delete").click(onTarefaDeleteClick);

    $tarefa.click(onTarefaItemClick);
  }

  function loadTarefas() {
    $("#input_text").empty();

    $.getJSON(server + "/tarefas", { usuario: meuLogin })
      .done(function (data) {
        console.log("data: ", data);

        for (var tarefa = 0; tarefa < data.length; tarefa++) {
          addTarefa(data[tarefa].texto, data[tarefa].id);
        }
      });
  }

  function updateTarefa(texto, id) {
    $.post(server + "/tarefa", { tarefa_id: id, texto: texto })
  }

  function newTarefa(text, $div) {
    $.post(server + "/tarefa",
      {
        usuario: meuLogin,
        texto: text,
        _method: "PUT"
      })
      .done(function (data) {
        console.log($div);
        $div.text(data.id);
      });
  }

  // detectar o uso da tecla
  $("#input_text").keydown(onTarefaKeyDown);

  // detectar o uso do click
  $(".tarefa-delete").click(onTarefaDeleteClick);

  $(".tarefa-item").click(onTarefaItemClick);

  loadTarefas();
}
);