var app = angular.module("App", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
    }).when("/dashboard", {
        templateUrl : "dashboard.html"
    }).when("/category", {
        templateUrl : "category.html"
    }).when("/register", {
        templateUrl : "register.html"
    }).otherwise({ redirectTo: '/' });
});


app.controller("registerController", function loginController($scope, $http, $window){
    
    $scope.ui = { alert: false};
    $scope.message = "";
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

        if(!validateEmail($scope.user.email)){
            $scope.message = "Lütfen doğru bir mail adresi giriniz.";
            $scope.ui.alert = true; // email yanlış girilmiş.
        }else{
            $http(request).then(function(response){
                if(response.status == 201){
                    $scope.ui.alert = true;
                    $scope.message = "Kayıt Başarılı. Mail adresinize gelen iletiyi onaylayınız.";
                }
           }, function(error){
                if(error.status == 409){
                    $scope.ui.alert = true;
                    $scope.message = "Böyle bir kullanıcı zaten kayıtlı.";
                }
           });
        }

    }
});

app.controller("loginController", function loginController($scope, $http, $window){

    $scope.ui = { alert: false };
    $scope.message = ""
    $scope.token;
    $scope.user;
    $scope.url = "http://localhost:3029/user/login";
    $scope.method = "POST"; 

    $scope.controlSession = function(){
        $scope.token = $window.localStorage.getItem("token");
            if($scope.token != "null"){
                $window.location.href = '/dashboard'
            }
    }

    $scope.directRegister = function(){
        $window.location.href = '/register';
    }

    $scope.userLogin = function(){

        if(!validateEmail($scope.user.email)){
            $scope.message = "Lütfen doğru bir mail adresi giriniz.";
            $scope.ui.alert = true; // email yanlış girilmiş.
        }else{
            $scope.ui.alert = false; // email adresi doğru.
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
                        $scope.message = "Böyle bir kullanıcı yok.";
                        $scope.ui.alert = true; // email yanlış girilmiş.
                    }else if(response.data == -1){ // onaylanmamış hesap
                        $scope.message = "Lütfen email adresinizi doğrulayınız";
                        $scope.ui.alert = true; // email yanlış girilmiş.
                    }else{ // giriş başarılı -> token
                        $window.localStorage.setItem("token", response.data);
                        $window.location.href = '/dashboard';
                    }
                }
            }, function(error){
                
            });
        }
    }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider

        // route for the about page
        .when('/category', {
            templateUrl : 'category.html',
            controller  : 'categoryController'
        })

        // route for the contact page
        .when('/main', {
            templateUrl : 'main.html',
            controller  : 'mainPageController'
        })

        // route for the contact page
        .when('/product', {
            templateUrl : 'product.html',
            controller  : 'productController'
        });
});

scotchApp.controller('mainController', function($scope, $window) {

    $scope.token = $window.localStorage.getItem("token");
    $scope.init = function () {
        if($scope.token.length < 7){
            $window.location.href = '/';
        }
    }
    
    $scope.userLogout = function(){
        $window.localStorage.setItem("token", null);
        $window.location.href = '/';
    }
    
});

scotchApp.controller('categoryController', function($scope, $http) {
    
    $scope.method = "GET";
    $scope.url = "http://localhost:3029/categories";
    $scope.categories;
    $scope.saveUrl = "http://localhost:3029/categories/add";
    $scope.saveMethod = "POST";
    $scope.deleteUrl = "http://localhost:3029/categories/delete/";
    $scope.deleteMethod = "DELETE";

    $('table').on('click', 'button[id="delete"]', function(e){
        var id = $(this).closest('tr').children('th:first').text();

        var request = {
            method: $scope.deleteMethod,
            url: $scope.deleteUrl + id,
            headers: {
                'Content-Type': "application/json"
            },
        };

        $http(request).then(function(response){
            if(response.status == 200){
                $scope.categories = response.data;
            }
        });

    });

    $scope.saveCategory = function(){

        var data = {name : $scope.categoryName};

        if(($scope.categoryName) == null){
            alert("boş olamaz");
        }else{
        $http.post($scope.saveUrl, data, {headers: {'Content-Type': 'application/json'} })
        .then(function (response) {
            $scope.init();
        });
        }

    }

    $scope.init = function(){
        var request = {
            method: $scope.method,
            url: $scope.url,
            headers: {
                'Content-Type': "application/json"
            },
            };

        $http(request).then(function(response){
            if(response.status == 200){
                $scope.categories = response.data;
            }
        });
    }
    

});

scotchApp.controller('productController', function($scope, $http) {
    
    $scope.method = "GET";
    $scope.categpryUrl = "http://localhost:3029/categories";
    $scope.productUrl = "http://localhost:3029/products/add";
    $scope.productMethod = "POST";

    $scope.getCategories = function(){   

        var request = {
            method: $scope.method,
            url: $scope.categpryUrl,
            headers: {
                'Content-Type': "application/json"
            }
        };

        $http(request).then(function(response){
            if(response.status == 200){
                $scope.categories = response.data;
            }
        });

    }

    $scope.saveProduct = function(){

        var product = {
            name: "Yeni Ürün Test12342342asdasdadasdasd34",
            price: 60.00,
            stock: 30,
            category_id: 17
        }
        
        $http({
            url: $scope.productUrl,
            method: $scope.productMethod,
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("product", product);
                formData.append("file", $scope.files);
                return formData;
            }
        }).then(function (response) {
            alert(response.data);
        });
        
    }

});

scotchApp.controller('mainPageController', function($scope) {
    $scope.message = 'Main Page';
});