(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.IndexController', Controller);

    function Controller($window, UserService, FlashService, $scope) {
        var vm = this;
        vm.user = null;
        vm.users = [];

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

            UserService.GetAll().then(function(users){
                vm.users = users;
                console.log(users);
            });
        }
    }

})();