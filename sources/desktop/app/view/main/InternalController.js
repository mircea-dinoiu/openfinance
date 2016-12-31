Ext.define('Financial.view.main.InternalController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal',

    onTabChange: function () {
        setTimeout(function () {
            Financial.app.getController('Data').syncReports();
        }, 0);
    }
});