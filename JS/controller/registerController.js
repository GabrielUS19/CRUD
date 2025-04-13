import * as view from '../view/registerView.js';

class TogglePasswordController{
    constructor() {
        this.TogglePassword = new view.TogglePassword();
        this.TogglePassword.bindClick(this.handleToggle.bind(this));
    }

    handleToggle(index) {
        this.TogglePassword.toggle(index);
    }
}

new TogglePasswordController();
