var app = angular.module('myApp', ["ngRoute"]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainCtrl'
        })
        .when('/recipes', {
            templateUrl: 'views/recipes.html',
            controller: 'mainCtrl'
        })
        .when('/addrecipe', {
            templateUrl: 'views/addrecipe.html',
            controller: 'inputCtrl'
        })
        .when('/shoppinglist', {
            templateUrl: 'views/shoppinglist.html',
            controller: 'mainCtrl'
        });
}]);

app.controller('mainCtrl', function ($scope, $http) {
    $scope.recipes = [];
    $scope.tags = [];
    $scope.search = [];
    $scope.week = [];

    $scope.getRecipes = function () {
        $http({
            method: 'GET',
            url: '/api/recipes'
        }).then(function successCallback(response) {
            $scope.recipes = response.data;
            $scope.getWeek();

            for (var i = 0; i < $scope.recipes.length; i++) {

                var tempArr = $scope.recipes[i].tags;

                for (var j = 0; j < tempArr.length; j++) {
                    if ($scope.tags.indexOf(tempArr[j]) < 0) {
                        $scope.tags.push(tempArr[j]);
                    }
                }
            }
        }, function errorCallback(response) {
            console.log("ERROR: " + response);
        });
    };

    $scope.getWeek = function () {
        $http({
            method: 'GET',
            url: '/api/recipes/week'
        }).then(function successCallback(response) {
            $scope.week = response.data;

        }, function errorCallback(response) {
            console.log("ERROR: " + response);
        });
    };

    $scope.initController = function () {
        for (var i = 0; i < $scope.week.length; i++) {
            $scope.setCourse(i);
        }
    };

    $scope.setWeek = function (id, recipe) {
        $http({
            url: '/api/recipes/setweek',
            method: "POST",
            data: {
                'id': id,
                'recipe': recipe
            }
        })
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

    $scope.setCourse = function (id) {
        var possibleCourses = [];

        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.week[id].tags.length == 0) {
                possibleCourses.push($scope.recipes[i]);
            }
            else {
                for (var j = 0; j < $scope.week[id].tags.length; j++) {

                    if ($scope.recipes[i].tags.indexOf($scope.week[id].tags[j]) > -1) {
                        possibleCourses.push($scope.recipes[i]);
                    }
                }
            }
        }
        $scope.setWeek(id, possibleCourses[Math.floor((Math.random() * possibleCourses.length))]);
        $scope.getWeek();
    };

    $scope.tagFilter = function (item) {
        if ($scope.search.length == 0) return item;

        for (var i = 0; i < $scope.search.length; i++) {
            if (item.tags.indexOf($scope.search[i]) >= 0)
                return item;
        }
    };
});

app.controller('inputCtrl', function ($scope, $http) {
    $scope.name = "";
    $scope.tag = "";
    $scope.tags = [];
    $scope.ingredients = [];
    $scope.ingredient = {};
    $scope.time = 0;

    $scope.addTag = function () {
        $scope.tags.push($scope.tag.toLowerCase());
        $scope.tag = "";
    };

    $scope.removeTag = function (index) {
        $scope.tags.splice(index, 1);
    };

    $scope.addIngredient = function () {
        $scope.ingredient.name = $scope.ingredient.name.toLowerCase();
        $scope.ingredients.push($scope.ingredient);
        $scope.ingredient = {};
    };

    $scope.removeIngredient = function (index) {
        $scope.ingredients.splice(index, 1);
    };

    $scope.addRecipe = function () {
        $scope.name = $scope.name.toLowerCase();
        $scope.name = $scope.name.capitalize();
        var recipe = {
            name: $scope.name,
            tags: $scope.tags,
            time: $scope.time,
            ingredients: $scope.ingredients
        };
        $http({
            url: '/api/recipes/addrecipe',
            method: "POST",
            data: {'recipe': recipe}
        })
    };

});

String.prototype.capitalize = function () {
    return this.replace(/^./, function (match) {
        return match.toUpperCase();
    });
};






