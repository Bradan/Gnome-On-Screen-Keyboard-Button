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
        if(typeof Main.keyboard.Hide === 'function') {
            Main.keyboard.Hide(); // up to 3.28
        } else if(typeof Main.keyboard.hide === 'function') {
            Main.keyboard.hide(); // 3.28 to 3.31.2
        } else {
            Main.keyboard.close(); // since 3.31.2
        }
    } else {
        if(!_oskA11yApplicationsSettings.get_boolean(SHOW_KEYBOARD)) {
            // currently this needs two clicks. I would have to delay the execution otherwise:
            _oskA11yApplicationsSettings.set_boolean(SHOW_KEYBOARD, true);
            if (typeof Main.keyboard._sync === 'function') {
                Main.keyboard._sync(); // deprecated since 3.25.90
            }
        }
        if(typeof Main.keyboard.Show === 'function') {
            Main.keyboard.Show(); // up to 3.28
        } else if(typeof Main.keyboard.show === 'function') {
            Main.keyboard.show(0); // 3.28 to 3.31.2
        } else {
            Main.keyboard.open(0) // since 3.31.2
        }
    }
}

function init() {
}

function enable() {
    _oskA11yApplicationsSettings = new Gio.Settings({ schema_id: A11Y_APPLICATIONS_SCHEMA });

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
    _oskButton = null;
    _oskButtonEventHandler = null;

    _oskA11yApplicationsSettings = null;
}
