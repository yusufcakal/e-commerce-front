var app = angular.module("App", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/register", {
        templateUrl : "register.html"
    });
});


app.controller("registerController", function loginController($scope, $http){
    
    $scope.user;
    $scope.url = "http://localhost:3029/user/register";
    $scope.method = "POST"; 

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

app.controller("loginController", function loginController($scope, $http){
    
    $scope.user;
    $scope.url = "http://localhost:3029/user/login";
    $scope.method = "POST"; 

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
                    if(response.data == 0){
                        console.log("böyle bir email yok");
                    }else if(response.data == -1){
                        console.log("email onaylanmamış.");
                    }else{
                        console.log(response.data);
                    }
                }
           }, function(error){
                
           });
    }
});