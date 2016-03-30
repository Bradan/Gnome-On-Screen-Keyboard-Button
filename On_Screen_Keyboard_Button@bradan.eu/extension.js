// Copyright (c) 2016 Daniel Brall
// Licensed under GPLv2 (gnome shell is in this license)

const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;

const A11Y_APPLICATIONS_SCHEMA = 'org.gnome.desktop.a11y.applications';
const SHOW_KEYBOARD = 'screen-keyboard-enabled';

let oskButton;
let oskA11yApplicationsSettings;

function _toggleKeyboard() {
    if(Main.keyboard._keyboardVisible) {
        Main.keyboard.Hide();
    } else {
        // currently this needs two clicks. I would have to delay the execution otherwise:
        oskA11yApplicationsSettings.set_boolean(SHOW_KEYBOARD, true);
        Main.keyboard._sync();
        Main.keyboard.Show();
    }
}

function init() {
    oskA11yApplicationsSettings = new Gio.Settings({ schema_id: A11Y_APPLICATIONS_SCHEMA });

    oskButton = new St.Bin({ style_class: 'panel-button',
                            reactive: true,
                            can_focus: true,
                            x_fill: true,
                            y_fill: false,
                            track_hover: true });
    let icon = new St.Icon({ icon_name: 'format-text-bold-symbolic',
                            style_class: 'system-status-icon' });

    oskButton.set_child(icon);
    oskButton.connect('button-press-event', _toggleKeyboard);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(oskButton, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(oskButton);
}
