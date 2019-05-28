(function () {

    (window.jQuery || document.write('<script src="../../Scripts/jquery-3.4.1.min.js"><\/script>'));
    (window.document.write('<script src="/_layouts/15/sp.runtime.js"><\/script>'));
    (window.document.write('<script src="/_layouts/15/sp.js"><\/script>'));
    (window.document.write('<script src="../../Scripts/App.js"><\/script>'))

    var formContext = {};
    formContext.OnPreRender = FormOnPreRender;

    formContext.Templates = {};

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(formContext);

})();

function FormOnPreRender(ctx) {

    $('.ms-formtable').css('background-color', '#f5f5f5');
    $('.ms-formtable tr:nth-child(5) input').attr('readonly', true);

    if ($('.ms-formtable tbody tr:first-child td:last-child input').val() == "this is it") {
        alert('bingo')
        $('.ms-formtable tbody tr:first-child td:last-child input').attr('disabled', 'disabled');
    }
}