(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, $scope, $http) {
        var vm = this;
        $scope.recipes = [];
        $scope.tags = [];
        $scope.search = [];
        $scope.week = []

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $scope.recipes = vm.user.recipes;
                $scope.week = vm.user.week;
                console.log($scope.week);
                $scope.getTags();
            });
        }
        
        $scope.getTags = function () {
            for (var i = 0; i < $scope.recipes.length; i++) {
                var tempArr = $scope.recipes[i].tags;
                for (var j = 0; j < tempArr.length; j++) {
                    if ($scope.tags.indexOf(tempArr[j]) < 0) {
                        $scope.tags.push(tempArr[j]);
                    }
                }
            }

        };
        $scope.setTags = function (id) {
            $http({
                url: '/api/recipes/settags',
                method: "POST",
                data: {
                    'id': id,
                    'tags': $scope.week[id].tags
                }
            })
        };
    }

})();