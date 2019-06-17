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

    $('#contentRow').css('text-align', '-webkit-center')
    $('#onetIDListForm').css({ 'padding': '10px', 'background-color': '#f9f9f9', 'box-shadow': '0px 5px 8px #ccc' })
    //$('.ms-formtable').css('background-color', '#f5f5f5');    
}