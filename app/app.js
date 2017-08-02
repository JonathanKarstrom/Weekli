(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm'
            })
            .state('recipes', {
                url: '/recipes',
                templateUrl: 'recipes/recipes.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            })
            .state('addrecipes', {
                url: '/addrecipes',
                templateUrl: 'add-recipes/addrecipe.html',
                controller: 'Input.IndexController',
                controllerAs: 'vm'
            })
            .state('shoppinglist', {
                url: '/shoppinglist',
                templateUrl: 'shoppinglist/shoppinglist.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();