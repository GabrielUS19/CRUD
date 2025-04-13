export class TogglePassword {
    constructor() {
        this.passwordInput = document.querySelectorAll(".password-input");
        this.toggleButton = document.querySelectorAll(".eye-icon");
    }

    bindClick(handler) {
        this.toggleButton.forEach((button, index) => {
            button.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                handler(index);
            });
        })
    }

    toggle(index) {
        const password = this.passwordInput[index]
        const icon = this.toggleButton[index]


        if (password.type === "password") {
            password.type = "text";
            icon.src = "../imgs/open-eye.svg"; // Change to open eye icon
        } else {
            password.type = "password";
            icon.src = "../imgs/close-eye.svg"; // Change to closed eye icon
        }
    }
}