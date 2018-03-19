var app = angular.module("App", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
    }).when("/dashboard", {
        templateUrl : "dashboard.html"
    }).when("/register", {
        templateUrl : "register.html"
    }).otherwise({ redirectTo: '/' });
});


app.controller("registerController", function loginController($scope, $http, $window){
    
    $scope.user;
    $scope.url = "http://localhost:3029/user/register";
    $scope.method = "POST"; 
    
    $scope.directLogin = function(){
        $window.location.href = '/';
    }

    $scope.userRegister = function(){

        var request = {
            method: $scope.method,
            url: $scope.url,
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

app.controller("loginController", function loginController($scope, $http, $window){
    
    $scope.token;
    $scope.user;
    $scope.url = "http://localhost:3029/user/login";
    $scope.method = "POST"; 

    $scope.directRegister = function(){
        $window.location.href = '/register';
    }

    $scope.userLogin = function(){

        var request = {
            method: $scope.method,
            url: $scope.url,
            headers: {
              'Content-Type': "application/json"
            },
            data: $scope.user
           };
        
           $http(request).then(function(response){
                if(response.status == 200){
                    if(response.data == 0){ // yanlış veri
                        console.log(response.data);
                    }else if(response.data == -1){ // onaylanmamış hesap
                        console.log(response.data);
                    }else{ // giriş başarılı -> token
                        $scope.token = console.log(response.data);
                        $window.localStorage.setItem("token", response.data);
                        $window.location.href = '/dashboard';
                    }
                }
           }, function(error){
                
           });
    }
});

app.controller("dashboardController", function dashboardController($scope, $http, $window){

    $scope.token = $window.localStorage.getItem("token");
    $scope.init = function () {
        if($scope.token == "null"){
            $window.location.href = '/';
        }
    }
    
    $scope.userLogout = function(){
        $window.localStorage.setItem("token", null);
        $window.location.href = '/';
    }

});
