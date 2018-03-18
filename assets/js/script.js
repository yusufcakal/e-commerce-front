var loginApp = angular.module("loginApp", []);

loginApp.controller("loginController", function loginController($scope, $http, $sce){
    $scope.user;
    $scope.url = "http://localhost:8080/user/register";
    $scope.method = "JSONP"; 

    $scope.send = function(){
        $http.post({url: $scope.url, data: $scope.user})
        .then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
                }, function(response) {
            $scope.data = response.data || 'Request failed';
            $scope.status = response.status;
        });
        console.log($scope.data);   
    }
    
});