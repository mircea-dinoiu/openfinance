/*
 This file is generated and updated by Sencha Cmd. You can edit this file as
 needed for your application, but these edits will have to be merged by
 Sencha Cmd when it performs code generation tasks such as generating new
 models, controllers or views and when running "sencha app upgrade".

 Ideally changes to this file would be limited and most work would be done
 in other places (such as Controllers). If Sencha Cmd cannot merge your
 changes and its generated code, it will produce a "merge conflict" that you
 will need to resolve manually.
 */

Ext.application({
    name: 'Financial',

    requires: [
        'Ext.MessageBox'
    ],

    controllers: [
        'Main',
        'Login'
    ],

    views: [
        'Main',
        'Login'
    ],

    icon: {
        '57': 'mobile/resources/icons/Icon.png',
        '72': 'mobile/resources/icons/Icon~ipad.png',
        '114': 'mobile/resources/icons/Icon@2x.png',
        '144': 'mobile/resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'mobile/resources/startup/320x460.jpg',
        '640x920': 'mobile/resources/startup/640x920.png',
        '768x1004': 'mobile/resources/startup/768x1004.png',
        '748x1024': 'mobile/resources/startup/748x1024.png',
        '1536x2008': 'mobile/resources/startup/1536x2008.png',
        '1496x2048': 'mobile/resources/startup/1496x2048.png'
    },

    launch: function () {
        Ext.Viewport.setMasked({
            xtype: 'loadmask'
        });

        Ext.Ajax.request({
            url: Ext.String.format('{0}/get-data', Financial.baseURL),
            success: function (response) {
                Financial.data = response.responseText;

                Ext.Viewport.setMasked(false);
                Ext.Viewport.removeAll();
                Ext.Viewport.add(Ext.create('Financial.view.Main'));
            },
            failure: function (response) {
                Ext.Viewport.setMasked(false);
                Ext.Viewport.removeAll();
                Ext.Viewport.add(Ext.create('Financial.view.Login'));
            }
        });
    },

    onUpdated: function () {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function (buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
