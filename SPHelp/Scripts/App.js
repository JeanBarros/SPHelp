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

var statusList = {
    RASCUNHO: 'Rascunho',
    AGUARDANDO_APROVACAO: 'Aguardando aprovação',
    APROVADO: 'Aprovado',
    REJEITADO: 'Rejeitado',
    ANDAMENTO: 'Em andamento',
    FECHADO: 'Fechado',    
    AGUARDANDO_INFO: 'Aguardando informações',
    REABERTO: 'Reaberto'
}

// Atualiza a caluna status
function updateStatus(status) {   

    var oListItem = requestList.getItemById(itemId);
    clientContext.load(oListItem);

    switch (status) {
        
        case statusList.APROVADO:
            oListItem.set_item('observacoes', $('.ms-formtable tr:nth-child(8) td:last-child textarea').val());
            oListItem.set_item('statusSolicitacao', status)
            break;
        case statusList.REJEITADO:
            oListItem.set_item('justificativaRejeicao', $('.ms-formtable tr:nth-child(9) td:last-child textarea').val());
            oListItem.set_item('statusSolicitacao', status)
            break;        
        case statusList.ANDAMENTO:
            oListItem.set_item('statusSolicitacao', status)
            break;
        case statusList.FECHADO:
            oListItem.set_item('statusSolicitacao', status)
            oListItem.set_item('resolucao', $('.ms-formtable tr:nth-child(10) td:last-child textarea').val());
            break;
        case statusList.AGUARDANDO_INFO:
            oListItem.set_item('InformacoesAdicionais', $('.ms-formtable tr:nth-child(9) td:last-child textarea').val());
            oListItem.set_item('statusSolicitacao', status)
            break;
        case statusList.REABERTO:
            oListItem.set_item('justificativaRejeicao', $('.ms-formtable tr:nth-child(8) td:last-child textarea').val());
            oListItem.set_item('statusSolicitacao', status)
    }

    oListItem.update();

    clientContext.executeQueryAsync(onQuerySucceeded, onFailedCallback);
}

function onQuerySucceeded() {    
    window.location.replace(clientContext.$v_0 + "/Lists/Chamados/AllItems.aspx");      
}

function onSucceededCallback(sender, args) {
    var enumerator = completedItems.getEnumerator();
    
    var listElements;
    while (enumerator.moveNext()) {
        var listItem = enumerator.get_current();
    }

    // Verifica o status da solicitação
    if (listItem.get_item('statusSolicitacao') == "Rascunho") {

        listElements = $(".ms-formtable tr:nth-child(4), .ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(10),"
            + ".ms-formtable tr:nth-child(11), .ms-formtable tr:nth-child(12)").remove()
    }

    if (listItem.get_item('statusSolicitacao') == "Aguardando aprovação") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Aprovadores", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                listElements = $(".ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(11), .ms-formtable tr:nth-child(12)").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('idSolicitacao'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('criticidade'))

                $('.ms-formtable tr:nth-child(9)').hide()

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(8) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                $('.ms-toolbar:nth-child(3) input').remove() // Save button
                $('.ms-toolbar:nth-child(3)').append('<input class = "btnAprovar" type = "button" value = "Aprovar" onclick = updateStatus(statusList.APROVADO) />')
                $('.ms-toolbar:nth-child(3)').append("<input class = 'btnRejeitar' type = 'button' value = 'Rejeitar' onclick = 'PreSaveAction()' >")                
            }                
            else {
                listElements = $(".ms-formtable tr:nth-child(7), .ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(10),"
                    + ".ms-formtable tr:nth-child(11), .ms-formtable tr:nth-child(12)").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // Remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove() // Ribbon
                $('.ms-toolbar:nth-child(3)').remove() // Save button

                // Altera o texto do botão "Cancelar" para "Fechar"
                $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button
            }
        });        
    }

    if (listItem.get_item('statusSolicitacao') == "Aberto") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                listElements = $(".ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(10), .ms-formtable tr:nth-child(12)").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('observacoes'))

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                $('.ms-toolbar:nth-child(3) input').remove() // Save button
                $('.ms-toolbar:nth-child(3)').append('<input id = "btnSolicitarInformacoes" type = "button" value = "Solicitar informações" onclick = updateStatus(statusList.AGUARDANDO_INFO) />')
                $('.ms-toolbar:nth-child(3)').append('<input id = "btnAtender" type = "button" value = "Atender chamado" onclick = updateStatus(statusList.ANDAMENTO) />')
            }
            else {
                listElements = $(".ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(9)," + 
                    ".ms-formtable tr:nth-child(10), .ms-formtable tr:nth-child(11), .ms-formtable tr:nth-child(12)").remove()                

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // Remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove() // Ribbon
                $('.ms-toolbar:nth-child(3)').remove() // Save button

                // Altera o texto do botão "Cancelar" para "Fechar"
                $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Aguardando informações") {

        listElements = $(".ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(9),"
            + ".ms-formtable tr:nth-child(10), .ms-formtable tr:nth-child(12)").remove()

        $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
        $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
        $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
        $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
        $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
        $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))

        if (listItem.get_item('urlPaginaAfetada') == null)
            $('.ms-formtable tr:nth-child(7) td:last-child').empty()
        else
            $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)
    }

    if (listItem.get_item('statusSolicitacao') == "Em andamento") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {

                listElements = $(".ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(10)").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('observacoes'))
                $('.ms-formtable tr:nth-child(9) td:last-child textarea').remove()
                
                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                $('.ms-toolbar:nth-child(3) input').remove() // Save button
                $('.ms-toolbar:nth-child(3)').append('<input id = "btnFecharChamado" type = "button" value = "Fechar chamado" onclick = PreSaveAction() />')

            }
            else {

                listElements = $(".ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(9),"
                    + ".ms-formtable tr:nth-child(10), .ms-formtable tr:nth-child(12)").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child textarea').remove()

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // Remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove() // Ribbon
                $('.ms-toolbar:nth-child(3)').remove() // Save button

                // Altera o texto do botão "Cancelar" para "Fechar"
                $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Fechado") {

        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {
                listElements = $(".ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(10),"
                    + ".ms-formtable tr:nth-child(11) td:last-child textarea").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('observacoes'))
                $('.ms-formtable tr:nth-child(10) td:last-child').text(listItem.get_item('resolucao'))

                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // Remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove() // Ribbon
                $('.ms-toolbar:nth-child(3)').remove() // Save button

                // Altera o texto do botão "Cancelar" para "Fechar"
                $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button
            }
            else {
                listElements = $(".ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(9),"
                    + ".ms-formtable tr:nth-child(11) td:last-child textarea").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(10) td:last-child').text(listItem.get_item('resolucao'))
                
                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                $('.ms-toolbar:nth-child(3) input').remove() // Save button
                $('.ms-toolbar:nth-child(3)').append('<input id = "btnReabrirChamado" type = "button" value = "Reabrir chamado" onclick = PreSaveAction() />')
            }
        });        
    }

    if (listItem.get_item('statusSolicitacao') == "Reaberto") {

        // Verifica se o usuário atual é membro do grupo especificado
        CurrentUserMemberOfGroup("Suporte", function (isCurrentUserInGroup) {
            if (isCurrentUserInGroup) {

                listElements = $(".ms-formtable tr:nth-child(9), .ms-formtable tr:nth-child(10) td:last-child textarea, .ms-formtable tr:nth-child(11) td:last-child textarea, .ms-formtable tr:nth-child(12) td:last-child textarea").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('observacoes'))
                $('.ms-formtable tr:nth-child(9) td:last-child').text(listItem.get_item('justificativaRejeicao'))
                
                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)


                $('.ms-toolbar:nth-child(3) input').remove() // Save button
                $('.ms-toolbar:nth-child(3)').append('<input id = "btnAtender" type = "button" value = "Atender chamado" onclick = updateStatus(statusList.ANDAMENTO) />')
                    
            }
            else {

                listElements = $(".ms-formtable tr:nth-child(8), .ms-formtable tr:nth-child(9),"
                    + ".ms-formtable tr:nth-child(11) td:last-child textarea").remove()

                $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
                $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
                $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
                $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
                $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
                $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
                $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('justificativaRejeicao'))
                $('.ms-formtable tr:nth-child(10) td:last-child').text(listItem.get_item('resolucao'))
                
                if (listItem.get_item('urlPaginaAfetada') == null)
                    $('.ms-formtable tr:nth-child(7) td:last-child').empty()
                else
                    $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

                // Remove a ribbon e o botão de salvar do form
                $("#s4-ribbonrow").remove() // Ribbon
                $('.ms-toolbar:nth-child(3)').remove() // Save button

                // Altera o texto do botão "Cancelar" para "Fechar"
                $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button                
            }
        });
    }

    if (listItem.get_item('statusSolicitacao') == "Rejeitado") {

        listElements = $(".ms-formtable tr:nth-child(7), .ms-formtable tr:nth-child(9),"
            + ".ms-formtable tr:nth-child(10), .ms-formtable tr:nth-child(11)").remove()

        $('.ms-formtable tr:first-child td:last-child').text(listItem.get_item('Title'))
        $('.ms-formtable tr:nth-child(2) td:last-child').text(listItem.get_item('categoriaSolicitacao'))
        $('.ms-formtable tr:nth-child(3) td:last-child').text(listItem.get_item('descricaoSolicitacao'))
        $('.ms-formtable tr:nth-child(4) td:last-child').text(listItem.get_item('statusSolicitacao'))
        $('.ms-formtable tr:nth-child(5) td:last-child').text(listItem.get_item('prioridadeSolicitacao'))
        $('.ms-formtable tr:nth-child(6) td:last-child').text(listItem.get_item('criticidade'))
        $('.ms-formtable tr:nth-child(8) td:last-child').text(listItem.get_item('justificativaRejeicao'))

        if (listItem.get_item('urlPaginaAfetada') == null)
            $('.ms-formtable tr:nth-child(7) td:last-child').empty()
        else
            $('.ms-formtable tr:nth-child(7) td:last-child').text(listItem.get_item('urlPaginaAfetada').$1_1)

        // Remove a ribbon e o botão de salvar do form
        $("#s4-ribbonrow").remove() // Ribbon
        $('.ms-toolbar:nth-child(3)').remove() // Save button

        // Altera o texto do botão "Cancelar" para "Fechar"
        $('.ms-toolbar:nth-child(4) input').prop('value', 'Fechar') // Cancel button
    }
}

function onFailedCallback(sender, args) {
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
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

// Executa antes de submeter os dados do form
function PreSaveAction() {

    // Verifica se "Salvar como rascunho" está selecionado
    //if ($('.ms-formtable tr:nth-child(7) td:last-child input').is(":checked")) {
    //    return false;
    //}

    // Valida campo justificativa se o aprovador rejeitar a solicitação
    if ($('.ms-formtable tr:nth-child(4) td:last-child').text() == statusList.AGUARDANDO_APROVACAO) {
        if ($('.ms-formtable tr:nth-child(9) td:last-child textarea').val() == "") {
            alert('Preencha o campo Justificativa')
            $('.ms-formtable tr:nth-child(8)').hide()
            $('.ms-formtable tr:nth-child(9)').show('slow')
            $(".btnAprovar").attr("disabled", true)
            return false;
        }
        else
            updateStatus(statusList.REJEITADO)
    }

    // Valida campo resolução quando o analista fechar a solicitação
    if ($('.ms-formtable tr:nth-child(4) td:last-child').text() == statusList.ANDAMENTO) {
        if ($('.ms-formtable tr:nth-child(10) td:last-child textarea').val() == "") {
            alert('Preencha o campo Resolução')            
            return false;
        }
        else
            updateStatus(statusList.FECHADO)
    }

    // Valida campo justificativa quando o solicitante reabrir o chamado
    if ($('.ms-formtable tr:nth-child(4) td:last-child').text() == statusList.FECHADO) {
        if ($('.ms-formtable tr:nth-child(8) td:last-child textarea').val() == "") {
            alert('Preencha o campo Justificativa')
            return false;
        }
        else
            updateStatus(statusList.REABERTO)
    }

    return true;
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