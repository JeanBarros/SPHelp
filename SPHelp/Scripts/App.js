'use strict';

var clientContext = SP.ClientContext.get_current();
var requestList = clientContext.get_web().get_lists().getByTitle('Chamados');
var completedItems;

var itemId = GetUrlKeyValue("ID", false, location.href);

ObterItensDaLista(itemId)

function ObterItensDaLista( itemId) {

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + itemId + "</Value></Eq></Where></Query></View>");
    completedItems = requestList.getItems(camlQuery);

    clientContext.load(completedItems);
    clientContext.executeQueryAsync(onSucceededCallback, onFailedCallback);

    return false;
}

function onSucceededCallback(sender, args) {
    var enumerator = completedItems.getEnumerator();
    var listItens = 'Itens na lista: <br><br>';
    while (enumerator.moveNext()) {
        var listItem = enumerator.get_current();
        listItens += 'Title: ' + listItem.get_item('Title') + '<br>';
        listItens += 'ID: ' + listItem.get_id() + '<br><br>';
        listItens += 'Status: ' + listItem.get_item('statusSolicitacao') + '<br>';
    }

    // Verifica o status da solicitação
    if (listItem.get_item('statusSolicitacao') == "Rascunho") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Aprovadores", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                console.log('user is member of the group');

            }
            else {
                console.log('user is not member of the group');
                $('.ms-formtable tr:nth-child(4)').remove()
                $('.ms-formtable tr:nth-child(6)').remove()
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Aguardando aprovação") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Aprovadores", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(9)').remove()
                $('.ms-formtable tr:nth-child(9)').remove()
                $('.ms-formtable tr:nth-child(9)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
            }
            else {
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove()
                $('.ms-toolbar:nth-child(3)').remove()
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Aberto") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
            }
            else {
                console.log('user is not member of the group')
                // Manipula os campos de acordo com o status
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove()
                $('.ms-toolbar:nth-child(3)').remove()
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Em andamento") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
            }
            else {
                console.log('user is not member of the group')
                // Manipula os campos de acordo com o status
                $('.ms-formtable tr:nth-child(7)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()
                $('.ms-formtable tr:nth-child(8)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove()
                $('.ms-toolbar:nth-child(3)').remove()
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Fechado") {

        $('.ms-formtable tr:nth-child(10)').remove()
        $('.ms-formtable tr:nth-child(10)').remove()
        $('.ms-formtable tr:nth-child(10)').remove()

        $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
        $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
        $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
        $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
        $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
        $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('resolucao'))
        $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
    }

    if (listItem.get_item('statusSolicitacao') == "Reaberto") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {

                $('.ms-formtable tr:nth-child(10)').remove()
                $('.ms-formtable tr:nth-child(10)').remove()
                $('.ms-formtable tr:nth-child(10)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
                $('.ms-formtable tr:nth-child(9) td:last-child').text(listItem.get_item('observacoes'))
            }
            else {

                $('.ms-formtable tr:nth-child(10)').remove()
                $('.ms-formtable tr:nth-child(10)').remove()
                $('.ms-formtable tr:nth-child(10)').remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('resolucao'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
                $('.ms-formtable tr:nth-child(9) td:last-child').text(listItem.get_item('observacoes'))

                // remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove()
                $('.ms-toolbar:nth-child(3)').remove()
            }
        });
    }
}

function onFailedCallback(sender, args) {
    var myText = '<p>The request failed: <br>';
    myText += 'Message: ' + args.get_message() + '<br>';
    
    console.log(myText)
}

function CurrentUserMemberOfGroup(groupName, OnComplete) {
    var currentUser = clientContext.get_web().get_currentUser();
    clientContext.load(currentUser);

    var Groups = currentUser.get_groups();
    clientContext.load(Groups);

    var group = Groups.getByName(groupName);
    clientContext.load(group);

    var groupUsers = group.get_users();
    clientContext.load(groupUsers);

    clientContext.executeQueryAsync(
        function (sender, args) {
            var userInGroup = UserInGroup(currentUser, group);
            OnComplete(userInGroup);
        },
        function OnFailure(sender, args) {
            OnComplete(false);
        }
    );

    function UserInGroup(user, group) {
        var groupUsers = group.get_users();
        var userInGroup = false;
        var groupUserEnumerator = groupUsers.getEnumerator();
        while (groupUserEnumerator.moveNext()) {
            var groupUser = groupUserEnumerator.get_current();
            if (groupUser.get_id() == user.get_id()) {
                userInGroup = true;
                break;
            }
        }
        return userInGroup;
    }
}

// Código original do arquivo

//'use strict';

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

//function initializePage()
//{
//    var context = SP.ClientContext.get_current();
//    var user = context.get_web().get_currentUser();

//    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
//    $(document).ready(function () {
//        getUserName();

//        alert('I am alive')
//    });

//    // This function prepares, loads, and then executes a SharePoint query to get the current users information
//    function getUserName() {
//        context.load(user);
//        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//    }

//    // This function is executed if the above call is successful
//    // It replaces the contents of the 'message' element with the user name
//    function onGetUserNameSuccess() {
//        $('#message').text('Hello ' + user.get_title());
//    }

//    // This function is executed if the above call fails
//    function onGetUserNameFail(sender, args) {
//        alert('Failed to get user name. Error:' + args.get_message());
//    }
//}