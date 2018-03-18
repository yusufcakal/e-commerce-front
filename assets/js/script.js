var app = angular.module("App", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html",
        controller : "loginController"
    }).when("/login", {
        templateUrl : "login.html",
        controller : "loginController"
    })
    .when("/register", {
        templateUrl : "register.html",
        controller : "registerController"
    });
});

app.controller("registerController", function loginController($scope, $http){
    
    $scope.user;
    $scope.url = "http://localhost:8080/user/register";
    $scope.method = "POST"; 

    $scope.userRegister = function(){

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/user/register',
            headers: {
              'Content-Type': "application/json"
            },
            data: $scope.user
           };
        
           $http(request).then(function(response){
                if(response.status == 201){
                    console.log("Kayıt Başarılı lütfen mail adresine gelen linke tıklayarak hesabınızı onaylayınız.");
                }
           }, function(error){
                if(error.status == 409){
                    console.log("Böyle Bir kullanıcı zaten var.");
                }
           });
    }
});

app.controller("loginController", function loginController($scope, $http){
    
    $scope.user;
    $scope.url = "http://localhost:8080/user/login";
    $scope.method = "POST"; 

    $scope.userLogin = function(){

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/user/login',
            headers: {
              'Content-Type': "application/json"
            },
            data: $scope.user
           };
        
           $http(request).then(function(response){
                if(response.status == 200){
                    console.log(response.data);
                }
           }, function(error){
                
           });
    }
});