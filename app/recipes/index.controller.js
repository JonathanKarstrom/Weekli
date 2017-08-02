
angular.module('app')
    .controller('Stopwatch.IndexController', ['$scope', function($scope){

        $scope.stopwatches = [
            {
                label:'Ändringshantering',
                interval: 1000,
                log: []
            }
        ];
        
        $scope.nameLabel = ' ';
        $scope.selected = {value: 0};

        $scope.addTimer = function(){
            $scope.stopwatches.push({label:$scope.nameLabel, interval: 1000, log: [], elapsedTime:new Date(0)});
            $scope.nameLabel = ' ';
        };
        $scope.removeTimer = function(index){
            $scope.stopwatches.splice(index,1)
        };

        $scope.writeToStore = function(){
            localStorage.setItem('dataStorage', JSON.stringify($scope.stopwatches));
            console.log("written:" + JSON.stringify($scope.stopwatches));
        };
        $scope.readFromStore = function(){
            $scope.stopwatches = JSON.parse(localStorage.getItem('dataStorage'));
            console.log("read:" + JSON.parse(localStorage.getItem('dataStorage')));
        };

}])

    .filter('stopwatchTime', function () {
        return function (input) {
            if(input){

                var elapsed = input.getTime();
                var hours = parseInt(elapsed / 3600000,10);
                elapsed %= 3600000;
                var mins = parseInt(elapsed / 60000,10);
                elapsed %= 60000;
                var secs = parseInt(elapsed / 1000,10);

                if(secs<10 && mins <10){
                    return hours + ':0' + mins + ':0' + secs;
                }
                if(secs<10){
                    return hours + ':' + mins + ':0' + secs;
                }
                if(mins<10){
                    return hours + ':0' + mins + ':' + secs;
                }
                else{
                    return hours + ':' + mins + ':' + secs;

                }

            }
        };
    })
    .directive('bbStopwatch', ['StopwatchFactory', function(StopwatchFactory){
        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, elem, attrs){

                var stopwatchService = new StopwatchFactory(scope[attrs.options]);

                scope.startTimer = stopwatchService.startTimer;
                scope.stopTimer = stopwatchService.stopTimer;
                scope.resetTimer = stopwatchService.resetTimer;

            }
        };
    }])
    .factory('StopwatchFactory', ['$interval', function($interval){

        return function(options){

            var startTime = 0,
                currentTime = null,
                offset = 0,
                interval = null,
                self = this;

            if(!options.interval){
                options.interval = 100;
            }

            if(!options.elapsedTime){
            options.elapsedTime = new Date(0);
            }

            self.running = false;

            function pushToLog(lap){
                if(options.log !== undefined){
                    options.log.push(lap);
                }
            }

            self.updateTime = function(){
                currentTime = new Date().getTime();
                var timeElapsed = offset + (currentTime - startTime);
                options.elapsedTime.setTime(timeElapsed);
            };

            self.startTimer = function(){
                if(self.running === false){
                    startTime = new Date().getTime();
                    interval = $interval(self.updateTime,options.interval);
                    self.running = true;
                }
            };

            self.stopTimer = function(){
                if( self.running === false) {
                    return;
                }
                self.updateTime();
                offset = offset + currentTime - startTime;
                pushToLog(currentTime - startTime);
                $interval.cancel(interval);
                self.running = false;
            };

            self.resetTimer = function(){
                startTime = new Date().getTime();
                options.elapsedTime.setTime(0);
                timeElapsed = offset = 0;
            };

            self.cancelTimer = function(){
                $interval.cancel(interval);
            };


            return self;

        };


    }]);

