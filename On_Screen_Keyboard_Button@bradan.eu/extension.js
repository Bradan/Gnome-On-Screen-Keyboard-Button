// Copyright (c) 2016 Daniel Brall
// Licensed under GPLv2 (gnome shell is in this license)

const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;

const A11Y_APPLICATIONS_SCHEMA = 'org.gnome.desktop.a11y.applications';
const SHOW_KEYBOARD = 'screen-keyboard-enabled';

let _oskButton;
let _oskButtonEventHandler;
let _oskA11yApplicationsSettings;

function _toggleKeyboard() {
    if(Main.keyboard._keyboardVisible) {
        Main.keyboard.Hide();
    } else {
        // currently this needs two clicks. I would have to delay the execution otherwise:
        _oskA11yApplicationsSettings.set_boolean(SHOW_KEYBOARD, true);
        Main.keyboard._sync();
        Main.keyboard.Show();
    }
}

function init() {
    _oskA11yApplicationsSettings = new Gio.Settings({ schema_id: A11Y_APPLICATIONS_SCHEMA });
}

function enable() {
    _oskButton = new St.Bin({ style_class: 'panel-button',
                            reactive: true,
                            can_focus: true,
                            x_fill: true,
                            y_fill: false,
                            track_hover: true });
    let icon = new St.Icon({ icon_name: 'format-text-bold-symbolic',
                            style_class: 'system-status-icon' });

    _oskButton.set_child(icon);
    _oskButtonEventHandler = _oskButton.connect('button-press-event', _toggleKeyboard);

    Main.panel._rightBox.insert_child_at_index(_oskButton, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(_oskButton);

    _oskButton.disconnect(_oskButtonEventHandler);
    delete _oskButton;
}
