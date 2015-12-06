class ContactController {
    constructor(Auth, API, $location, $scope, $modal) {
        this.API = API;
        this.$modal = $modal;

        this.user = Auth.tryGetUser();
        this.text = '';

        if (this.user) {
            this.name = this.user.username;
            this.email = this.user.email;
        }

        this.is_working = false;

        $scope.$watch(() => this.name, () => {
            this.error_no_name = 0;
        }, true);
        $scope.$watch(() => this.email, () => {
            this.error_no_email = 0;
        }, true);
    }

    validate_email(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(email)) {
            return false;
        }

        return true;
    }

    send_mail() {
        const text = this.text;

        let validationPassed = 1;
        if (!this.name) {
            validationPassed = 0;
            this.error_no_name = 1;
        }
        if (this.validate_email(this.email)) {
            validationPassed = 0;
            this.error_no_email = 1;
        }

        if (validationPassed) {
            this.is_working = true;

            const data = { 'name': this.name, 'email': this.email.replace('@', '(@)'), 'text': text };
            this.API.post('contact/send-mail', data).success(() => {
                this.is_working = false;
                this.email_send = true;
                this.open();
            });
        }
    }

    open() {
        this.$modal.open({ templateUrl: 'myModalContent.html' });
    }
}

angular.module('crucioApp').controller('ContactController', ContactController);
