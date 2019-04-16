(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/Core/_guards/auth.guard.ts":
/*!********************************************!*\
  !*** ./src/app/Core/_guards/auth.guard.ts ***!
  \********************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        var currentUser = this.authService.currentUserValue;
        if (currentUser) {
            // User authorized so return true
            return true;
        }
        // not logged in so redirect to login page via UrlTree
        var url = '/login';
        var tree = this.router.parseUrl(url);
        return tree;
    };
    AuthGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/Core/_models/form-validation.ts":
/*!*************************************************!*\
  !*** ./src/app/Core/_models/form-validation.ts ***!
  \*************************************************/
/*! exports provided: CustomFormValidation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomFormValidation", function() { return CustomFormValidation; });
var CustomFormValidation = /** @class */ (function () {
    function CustomFormValidation() {
        this.eduEmailValidation = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+.[e]+[d]+[u]+$';
        this.regularEmailValidation = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
        this.passwordValidation = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$';
    }
    return CustomFormValidation;
}());



/***/ }),

/***/ "./src/app/Core/_models/user.ts":
/*!**************************************!*\
  !*** ./src/app/Core/_models/user.ts ***!
  \**************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());



/***/ }),

/***/ "./src/app/Core/_services/auth.service.ts":
/*!************************************************!*\
  !*** ./src/app/Core/_services/auth.service.ts ***!
  \************************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
        this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    Object.defineProperty(AuthService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    //
    // ─── SEND SIGN UP REQUEST TO SERVER ─────────────────────────────────────────────
    //
    AuthService.prototype.signup = function (fname, lname, universityId, username, password) {
        console.log(fname, lname, universityId, username, password);
        return;
    };
    // ─────────────────────────────────────────────────────────────────
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + "/okta/login", { username: username, password: password })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (user) {
            var user_id = user._embedded.user.id;
            console.log(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            _this.currentUserSubject.next(user);
            return _this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + "/chatkit/createtoken", { user_id: user_id });
        }))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (data) {
            console.log(data);
            localStorage.setItem('chatkitToken', JSON.stringify(data));
            return data;
        }));
    };
    AuthService.prototype.logout = function () {
        // TODO: Add logout function to authentication API - this is fine for now
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/Core/_services/messaging.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/Core/_services/messaging.service.ts ***!
  \*****************************************************/
/*! exports provided: MessagingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessagingService", function() { return MessagingService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var _pusher_chatkit_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pusher/chatkit-client */ "./node_modules/@pusher/chatkit-client/dist/web/chatkit.js");
/* harmony import */ var _pusher_chatkit_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_pusher_chatkit_client__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MessagingService = /** @class */ (function () {
    function MessagingService(authenticationService) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.notifications = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](0);
        this.notificationCount = this.notifications.asObservable();
        this.messages = [];
        this._message = '';
        this.authenticationService.currentUser.subscribe(function (x) {
            _this.currentUser = x;
            _this.chatManager = new _pusher_chatkit_client__WEBPACK_IMPORTED_MODULE_2__["ChatManager"]({
                instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
                userId: _this.currentUser._embedded.user.id,
                tokenProvider: new _pusher_chatkit_client__WEBPACK_IMPORTED_MODULE_2__["TokenProvider"]({
                    url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
                })
            });
        });
        // TODO: Add this to an addUser function - only call when necessary
        // this.chatManager
        // .connect()
        // .then(currentUser => {
        //   console.log('Connected as user ', currentUser);
        //   this.chatkitUser = currentUser;
        // })
        // .catch(error => {
        //   console.error('error:', error);
        // });
    }
    Object.defineProperty(MessagingService.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    MessagingService.prototype.setRoomsWithNotifications = function (count) {
        // Get current notification count
        var currNotificationCount = this.notifications.value;
        // Update the globabl total
        this.notifications.next(count);
    };
    // Send a message
    MessagingService.prototype.sendMessage = function (room, message) {
        this.chatkitUser.sendSimpleMessage({
            roomId: room.id,
            text: 'Hi there!',
        })
            .then(function (messageId) {
            // console.log(`Added message to ${myRoom.name}`);
            console.log("Added message to " + room.name);
        })
            .catch(function (err) {
            // console.log(`Error adding message to ${myRoom.name}: ${err}`);
            console.log("Error adding message to " + room.name + ": " + err);
        });
    };
    // Join a room
    // joinRoom(roomID) {
    //   return this.chatkitUser.joinRoom( { roomId: roomID } )
    //   .then(room => {
    //     console.log(`Joined room with ID: ${room.id}`);
    //     // Subscribe to room to receive notifications
    //     return room;
    //   })
    //   .catch(err => {
    //     console.log(`Error joining room ${roomID}: ${err}`);
    //   });
    // }
    // Subscribe to room
    MessagingService.prototype.subscribeToRoom = function (roomID) {
        return this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    console.log('received message', message);
                    return message;
                }
            },
            messageLimit: 10
        });
    };
    // Fetch messages from room
    MessagingService.prototype.fetchMessages = function (roomID) {
        return this.chatkitUser
            .fetchMultipartMessages({
            roomId: roomID,
            direction: 'older',
            limit: 10,
        })
            .then(function (messages) { return messages; })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
        });
    };
    MessagingService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"]])
    ], MessagingService);
    return MessagingService;
}());



/***/ }),

/***/ "./src/app/Core/callback/callback.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/Core/callback/callback.component.ts ***!
  \*****************************************************/
/*! exports provided: CallbackComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallbackComponent", function() { return CallbackComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @okta/okta-angular */ "./node_modules/@okta/okta-angular/dist/index.js");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_okta_okta_angular__WEBPACK_IMPORTED_MODULE_1__);
// callback.component.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// tslint:disable-next-line:max-line-length
/* In order to handle the redirect back from Okta, we need to capture the token values from the URL. Use the /callback route to handle the logic of storing these tokens and redirecting back to the main page. */


var CallbackComponent = /** @class */ (function () {
    function CallbackComponent(okta) {
        this.okta = okta;
        // Handles the response from Okta and parses tokens
        okta.handleAuthentication();
    }
    CallbackComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({ template: "" }),
        __metadata("design:paramtypes", [_okta_okta_angular__WEBPACK_IMPORTED_MODULE_1__["OktaAuthService"]])
    ], CallbackComponent);
    return CallbackComponent;
}());



/***/ }),

/***/ "./src/app/Core/protected/protected.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/Core/protected/protected.component.ts ***!
  \*******************************************************/
/*! exports provided: ProtectedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProtectedComponent", function() { return ProtectedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
// protected.component.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ProtectedComponent = /** @class */ (function () {
    function ProtectedComponent() {
        console.log('Protected endpont!');
    }
    ProtectedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-secure',
            template: ""
        }),
        __metadata("design:paramtypes", [])
    ], ProtectedComponent);
    return ProtectedComponent;
}());



/***/ }),

/***/ "./src/app/Error-Views/error/error.component.css":
/*!*******************************************************!*\
  !*** ./src/app/Error-Views/error/error.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL0Vycm9yLVZpZXdzL2Vycm9yL2Vycm9yLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/Error-Views/error/error.component.html":
/*!********************************************************!*\
  !*** ./src/app/Error-Views/error/error.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  error works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/Error-Views/error/error.component.ts":
/*!******************************************************!*\
  !*** ./src/app/Error-Views/error/error.component.ts ***!
  \******************************************************/
/*! exports provided: ErrorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorComponent", function() { return ErrorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ErrorComponent = /** @class */ (function () {
    function ErrorComponent() {
    }
    ErrorComponent.prototype.ngOnInit = function () {
    };
    ErrorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-error',
            template: __webpack_require__(/*! ./error.component.html */ "./src/app/Error-Views/error/error.component.html"),
            styles: [__webpack_require__(/*! ./error.component.css */ "./src/app/Error-Views/error/error.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ErrorComponent);
    return ErrorComponent;
}());



/***/ }),

/***/ "./src/app/Error-Views/page-not-found/page-not-found.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/Error-Views/page-not-found/page-not-found.component.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL0Vycm9yLVZpZXdzL3BhZ2Utbm90LWZvdW5kL3BhZ2Utbm90LWZvdW5kLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/Error-Views/page-not-found/page-not-found.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/Error-Views/page-not-found/page-not-found.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n\r\n  </head>\r\n  <body>\r\n    <!-- Main Container Div -->\r\n    <section class=\"py-5\" style=\"min-height:100vh;\">\r\n      <div class=\"container-fluid\">\r\n        <div class=\"text-center mt-5\">\r\n          <h1 class=\"display-1 text-secondary\">404 Error</h1>\r\n          <p class=\"h2 text-light text-light-weight mt-3 mb-5\">&mdash; Page Not Found &mdash;</p>\r\n          <div class=\"pt-5 pb-3\">\r\n            <a [routerLink]=\"['/home']\"><button class=\"btn btn-primary px-4 py-2\">Return Home</button></a>\r\n          </div>\r\n          <div>\r\n            <a [routerLink]=\"['/login']\">Login</a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </body> "

/***/ }),

/***/ "./src/app/Error-Views/page-not-found/page-not-found.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/Error-Views/page-not-found/page-not-found.component.ts ***!
  \************************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PageNotFoundComponent = /** @class */ (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/Error-Views/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.css */ "./src/app/Error-Views/page-not-found/page-not-found.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/Home/view-friends-home/view-friends-home.component.css":
/*!************************************************************************!*\
  !*** ./src/app/Home/view-friends-home/view-friends-home.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".user-card{\r\n    background-color: white;\r\n    border: 1px solid #DAE6ED;\r\n    border-radius: 5px;\r\n}\r\n.user-card:hover{\r\n    background-color: transparent;\r\n}\r\n.card-img{\r\n    max-width: 40px;\r\n    border-width: 2px !important;\r\n    border: 2px solid #96B7C9;\r\n}\r\n.border-online{\r\n    border: 2px solid #00e600;\r\n}\r\n#search{\r\n    border-radius: 20px;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvSG9tZS92aWV3LWZyaWVuZHMtaG9tZS92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksdUJBQXVCO0lBQ3ZCLHlCQUF5QjtJQUN6QixrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLDZCQUE2QjtBQUNqQztBQUNBO0lBQ0ksZUFBZTtJQUNmLDRCQUE0QjtJQUM1Qix5QkFBeUI7QUFDN0I7QUFDQTtJQUNJLHlCQUF5QjtBQUM3QjtBQUNBO0lBQ0ksbUJBQW1CO0FBQ3ZCIiwiZmlsZSI6InNyYy9hcHAvSG9tZS92aWV3LWZyaWVuZHMtaG9tZS92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItY2FyZHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgI0RBRTZFRDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxufVxyXG4udXNlci1jYXJkOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbn1cclxuLmNhcmQtaW1ne1xyXG4gICAgbWF4LXdpZHRoOiA0MHB4O1xyXG4gICAgYm9yZGVyLXdpZHRoOiAycHggIWltcG9ydGFudDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkICM5NkI3Qzk7XHJcbn1cclxuLmJvcmRlci1vbmxpbmV7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjMDBlNjAwO1xyXG59XHJcbiNzZWFyY2h7XHJcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/Home/view-friends-home/view-friends-home.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/Home/view-friends-home/view-friends-home.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid mt-4\">\r\n\r\n  <app-small [user]=\"connection\" [isConnection]=\"isConnection\"></app-small>\r\n\r\n  <!-- Add connection -->\r\n  <button type=\"button\" class=\"btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#addConnectionModal\">\r\n    Add Connection\r\n  </button>\r\n\r\n  <!-- Add conecction modal -->\r\n  <div class=\"modal fade\" id=\"addConnectionModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addConnectionModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"addConnectionModalLabel\">Add connection</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form (ngSubmit)=\"addConnection()\">\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" [formControl]=\"connectionToAdd\" id=\"name\" required aria-describedby=\"addConnectionHelpBlock\">\r\n                <small id=\"addConnectionHelpBlock\" class=\"form-text text-muted\">\r\n                    Enter the email of the connection you wish to add:\r\n                </small>\r\n            </div>\r\n          <button type=\"submit\" class=\"btn btn-primary\">Send</button>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!--Search connections-->\r\n  <div>\r\n      <form [formGroup]=\"searchForm\">\r\n\r\n          <!--Search Bar-->\r\n          <div class=\"form-group mb-3\">\r\n              <input type=\"search\" required class=\"form-control primary-border\" id=\"search\" name=\"search\" placeholder=\"Search\" \r\n              formControlName=\"search\" (input)=\"onSearch()\">\r\n          </div>\r\n      </form>\r\n  </div>\r\n\r\n  <!--Connection search results-->\r\n  <div class=\"my-3 search-results\" *ngIf=\"(submitted && !searchForm.invalid)\">\r\n    <div *ngIf=\"(results.length > 0)\">\r\n        <div *ngFor=\"let result of results\">\r\n            <button class=\"btn btn-block text-left px-3 py-2 my-2 user-card\" data-toggle=\"modal\" data-target=\"#profileModal\"\r\n             (click)=\"setUser(result.id)\">\r\n                <img src=\"...\" onerror=\"this.src='../../assets/images/DefaultProfile.png'\"\r\n                class=\"circle img-fluid rounded-circle card-img\" [ngClass]=\"{ 'border-online': result.active }\"/> \r\n    \r\n                <span class=\"text-secondary ml-3\">{{ result.firstName }} {{ result.lastName }}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <img *ngIf=\"loading\" class=\"ml-2\"\r\n      src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n\r\n    <div *ngIf=\"(results.length == 0)\">\r\n      <span class=\"text-light\">Sorry, we could not find any results.</span>\r\n    </div>\r\n\r\n    <hr *ngIf=\"(results.length > 0)\">\r\n  </div>\r\n\r\n  <!--Online connections-->\r\n  <div class=\"mt-4 mb-5\">\r\n    <div class=\"text-light\">Online Connections</div>\r\n    <hr>\r\n\r\n    <div *ngFor=\"let c of connections\">\r\n        <button class=\"btn btn-block text-left px-3 py-2 my-2 user-card\" data-toggle=\"modal\" data-target=\"#profileModal\"\r\n         (click)=\"setUser(c.id)\" *ngIf=\"c.active\">\r\n            <img src=\"...\" onerror=\"this.src='../../assets/images/DefaultProfile.png'\"\r\n            class=\"circle img-fluid rounded-circle card-img\" [ngClass]=\"{ 'border-online': c.active }\"/> \r\n\r\n            <span class=\"text-secondary ml-3\">{{ c.firstName }} {{ c.lastName }}</span>\r\n        </button>\r\n    </div>\r\n  </div>\r\n\r\n  <!--All connections-->\r\n  <div class=\"my-5\">\r\n      <div class=\"text-light\">All Connections</div>\r\n      <hr>\r\n  \r\n      <div *ngFor=\"let c of connections\" class=\"my-2 user-card\">\r\n          <button class=\"btn btn-block text-left px-3 py-2\" data-toggle=\"modal\" data-target=\"#profileModal\"\r\n           (click)=\"setUser(c.id)\">\r\n              <img src=\"...\" onerror=\"this.src='../../assets/images/DefaultProfile.png'\"\r\n              class=\"circle img-fluid rounded-circle card-img\" [ngClass]=\"{ 'border-online': c.active }\"/> \r\n  \r\n              <span class=\"text-secondary ml-3\">{{ c.firstName }} {{ c.lastName }}</span>\r\n          </button>\r\n      </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/Home/view-friends-home/view-friends-home.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/Home/view-friends-home/view-friends-home.component.ts ***!
  \***********************************************************************/
/*! exports provided: ViewFriendsHomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewFriendsHomeComponent", function() { return ViewFriendsHomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../environments/environment.prod */ "./src/environments/environment.prod.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ViewFriendsHomeComponent = /** @class */ (function () {
    //
    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
    //
    function ViewFriendsHomeComponent(http, formBuilder) {
        this.http = http;
        this.formBuilder = formBuilder;
        this.loading = false;
        this.submitted = false;
        this.isConnection = false;
        // Field for connection
        this.connectionToAdd = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
    }
    ViewFriendsHomeComponent.prototype.ngOnInit = function () {
        // Setup search box
        this.searchForm = this.formBuilder.group({
            search: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
        // DELETE THIS TEST DATA WHEN USER SERVICE IS AVAILABLE
        this.connections = [
            {
                id: 1,
                firstName: 'Richie',
                lastName: 'Tarkowski',
                username: '',
                password: '',
                university: null,
                profile: {
                    bio: 'This is my bio!',
                    major: 'CIS',
                    graduationYear: 2021,
                    interests: 'NA',
                    clubs: 'none'
                },
                active: true
            },
            {
                id: 2,
                firstName: 'Connor',
                lastName: 'Hansen',
                username: '',
                password: '',
                university: null,
                profile: {
                    bio: 'Hello World!',
                    major: 'CS',
                    graduationYear: 2020,
                    interests: 'Web Design',
                    clubs: 'Robotics'
                },
                active: true
            },
            {
                id: 3,
                firstName: 'Scott',
                lastName: 'Peterson',
                username: '',
                password: '',
                university: null,
                profile: {
                    bio: 'Hi, everyone!',
                    major: 'Engineering',
                    graduationYear: 2019,
                    interests: 'Lacross',
                    clubs: 'Engineering Club'
                },
                active: false
            },
            {
                id: 4,
                firstName: 'Noah',
                lastName: 'Osterhout',
                username: '',
                password: '',
                university: null,
                profile: {
                    bio: 'Progammer',
                    major: 'Computer Information Systems',
                    graduationYear: 2021,
                    interests: 'Programming',
                    clubs: 'CIS Club'
                },
                active: false
            },
            {
                id: 5,
                firstName: 'Cati',
                lastName: 'Kujawski',
                username: '',
                password: '',
                university: null,
                profile: {
                    bio: 'Hello World',
                    major: 'FSU',
                    graduationYear: 2018,
                    interests: 'Soccer',
                    clubs: 'Soccer Club'
                },
                active: true
            }
        ];
        this.connection = this.connections[0];
    };
    Object.defineProperty(ViewFriendsHomeComponent.prototype, "f", {
        //
        // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
        //
        get: function () { return this.searchForm.controls; },
        enumerable: true,
        configurable: true
    });
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── ADD CONNECTION ─────────────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.addConnection = function () {
        var _this = this;
        console.log(this.connectionToAdd.value);
        // Get okta user by login (email)
        this.http.get(_environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + "/okta/GetUserByLogin/" + this.connectionToAdd.value)
            .toPromise()
            .then(function (oktaUser) {
            console.log(oktaUser);
            // Get the user from Chatkit by matching the IDs
            _this.http.get(_environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + "/chatkit/GetUserById/" + oktaUser['id'])
                .toPromise()
                .then(function (chatkitUser) {
                // Found user => add 'connection request marker' to custom data field
                // TODO: Check if users are already connected
            })
                .catch(function (error) {
                console.log('Chatkit user not found!');
            });
        })
            .catch(function (error) {
            console.log('Okta user not found!');
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.getUser = function (_id) {
        return this.connections.find(function (c) { return c.id === _id; });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.getUsersByName = function (_name) {
        _name = _name.toLowerCase();
        this.results = this.connections.filter(function (c) {
            return (c.firstName.toLowerCase() + ' ' + c.lastName.toLowerCase()).includes(_name);
        }).slice(0, 5);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── CHECK IF USERS ARE FRIENDS ─────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.isConnected = function (_id) {
        this.isConnection = (_id % 2 === 1) ? true : false; // DELETE THIS LINE
        // Get current user data
        // Check if this user is on the other user's connections list
        // Toggle isConnection variable
        return;
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE CLICK USER BUTTON ───────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.setUser = function (_id) {
        this.connection = this.getUser(_id);
        this.isConnected(_id);
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.onSearch = function () {
        this.submitted = true;
        this.loading = true;
        if (this.searchForm.invalid) {
            this.submitted = false;
            this.loading = false;
            return;
        }
        var query = this.searchForm.get('search').value;
        this.getUsersByName(query);
        this.loading = false;
    };
    ViewFriendsHomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-view-friends-home',
            template: __webpack_require__(/*! ./view-friends-home.component.html */ "./src/app/Home/view-friends-home/view-friends-home.component.html"),
            styles: [__webpack_require__(/*! ./view-friends-home.component.css */ "./src/app/Home/view-friends-home/view-friends-home.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], ViewFriendsHomeComponent);
    return ViewFriendsHomeComponent;
}());



/***/ }),

/***/ "./src/app/Home/view-latest-news/view-latest-news.component.css":
/*!**********************************************************************!*\
  !*** ./src/app/Home/view-latest-news/view-latest-news.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".custom-shadow{\r\n    box-shadow: 0 0px 2px #26B1FF;\r\n}\r\n.custom-shadow:hover{\r\n    box-shadow: 0 0px 4px #26B1FF;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvSG9tZS92aWV3LWxhdGVzdC1uZXdzL3ZpZXctbGF0ZXN0LW5ld3MuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLDZCQUE2QjtBQUNqQztBQUNBO0lBQ0ksNkJBQTZCO0FBQ2pDIiwiZmlsZSI6InNyYy9hcHAvSG9tZS92aWV3LWxhdGVzdC1uZXdzL3ZpZXctbGF0ZXN0LW5ld3MuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jdXN0b20tc2hhZG93e1xyXG4gICAgYm94LXNoYWRvdzogMCAwcHggMnB4ICMyNkIxRkY7XHJcbn1cclxuLmN1c3RvbS1zaGFkb3c6aG92ZXJ7XHJcbiAgICBib3gtc2hhZG93OiAwIDBweCA0cHggIzI2QjFGRjtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/Home/view-latest-news/view-latest-news.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/Home/view-latest-news/view-latest-news.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"p-4\">\r\n  <div class=\"text-center border rounded my-4 p-5 mr-3 custom-shadow\" style=\"background-color: white;\">\r\n    <img src=\"/assets/images/logo-mark-64.png\" class=\"img-fluid img-responsive mx-auto mb-4\" width=\"64px\"\r\n      alt=\"Chatversity Logo Mark\">\r\n    <div class=\"text-secondary h2 text-light-weight\">Introducing Chatversity</div>\r\n    <p class=\"text-light pt-3\">Connecting and collaborating with your fellow classmates has never been easier.</p>\r\n  </div>\r\n  <div class=\"text-left border rounded my-4 p-5 mr-3 custom-shadow\" style=\"background-color: white;\">\r\n    <div class=\"text-secondary h2 text-light-weight\">Connect with your Peers</div>\r\n    <p class=\"text-light mb-4\">Chatversity is the newest platform for college and university students across the world. Ready to connect?</p>\r\n    <a [routerLink]=\"['/messages']\" [queryParams]=\"{view:'friends'}\"><button type=\"submit\" class=\"btn btn-primary text-uppercase px-4\" style=\"padding-top: 10px; padding-bottom: 10px;\">Get Started!</button></a>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/Home/view-latest-news/view-latest-news.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/Home/view-latest-news/view-latest-news.component.ts ***!
  \*********************************************************************/
/*! exports provided: ViewLatestNewsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewLatestNewsComponent", function() { return ViewLatestNewsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ViewLatestNewsComponent = /** @class */ (function () {
    function ViewLatestNewsComponent() {
    }
    ViewLatestNewsComponent.prototype.ngOnInit = function () {
    };
    ViewLatestNewsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-view-latest-news',
            template: __webpack_require__(/*! ./view-latest-news.component.html */ "./src/app/Home/view-latest-news/view-latest-news.component.html"),
            styles: [__webpack_require__(/*! ./view-latest-news.component.css */ "./src/app/Home/view-latest-news/view-latest-news.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ViewLatestNewsComponent);
    return ViewLatestNewsComponent;
}());



/***/ }),

/***/ "./src/app/Home/view-navigation-home/view-navigation-home.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/Home/view-navigation-home/view-navigation-home.component.css ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".custom-btn{\r\n    border-radius: 5px;\r\n    color: #96B7C9;\r\n    background-color: #F1F8FC;\r\n}\r\n.custom-btn:hover{\r\n    background-color: white;\r\n    color: #0E425F;\r\n    border: 1px solid #bddef1;\r\n}\r\n.active{\r\n    background-color: white !important;\r\n    color: #0E425F;\r\n    border: 1px solid #bddef1;\r\n}\r\n  \r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvSG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCx5QkFBeUI7QUFDN0I7QUFDQTtJQUNJLHVCQUF1QjtJQUN2QixjQUFjO0lBQ2QseUJBQXlCO0FBQzdCO0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsY0FBYztJQUNkLHlCQUF5QjtBQUM3QiIsImZpbGUiOiJzcmMvYXBwL0hvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jdXN0b20tYnRue1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgY29sb3I6ICM5NkI3Qzk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjFGOEZDO1xyXG59XHJcbi5jdXN0b20tYnRuOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBjb2xvcjogIzBFNDI1RjtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiZGRlZjE7XHJcbn1cclxuXHJcbi5hY3RpdmV7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6ICMwRTQyNUY7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYmRkZWYxO1xyXG59XHJcbiAgIl19 */"

/***/ }),

/***/ "./src/app/Home/view-navigation-home/view-navigation-home.component.html":
/*!*******************************************************************************!*\
  !*** ./src/app/Home/view-navigation-home/view-navigation-home.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\" style=\"height:100vh;\">\r\n\r\n  <app-top-bar [viewName]=\"'Home'\" [headerText]=\"headerText\"></app-top-bar>\r\n\r\n  <div class=\"row page-content\">\r\n    <div class=\"col-12 col-lg-3\" style=\"background-color:#F1F8FC; border-bottom:1px solid #DAE6ED;\">\r\n      <div class=\"my-3 px-1\">\r\n        <button class=\"btn btn-block custom-btn text-left mr-4 my-2 p-3\" (click)=\"showHomeView()\"\r\n        [ngClass]=\"{ 'active': HomeView.current }\">Latest News</button>\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showFriendsView()\"\r\n        [ngClass]=\"{ 'active': FriendsView.current }\">Connections</button>\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showProfileView()\"\r\n        [ngClass]=\"{ 'active': ProfileView.current }\">My Profile</button>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"col-12 col-lg-9\" style=\"background-color: #fafdff; border-left:1px solid #DAE6ED;\">\r\n      <div *ngIf=\"HomeView.current\">\r\n        <app-view-latest-news></app-view-latest-news>\r\n      </div>\r\n      <div *ngIf=\"FriendsView.current\">\r\n        <app-view-friends-home></app-view-friends-home>\r\n      </div>\r\n      <div *ngIf=\"ProfileView.current\">\r\n        <app-profile></app-profile>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/Home/view-navigation-home/view-navigation-home.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/Home/view-navigation-home/view-navigation-home.component.ts ***!
  \*****************************************************************************/
/*! exports provided: ViewNavigationHomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewNavigationHomeComponent", function() { return ViewNavigationHomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ViewNavigationHomeComponent = /** @class */ (function () {
    function ViewNavigationHomeComponent(activatedRoute) {
        this.activatedRoute = activatedRoute;
        this.HomeView = { id: 1, name: 'Latest News', current: false };
        this.FriendsView = { id: 2, name: 'Connections', current: false };
        this.ProfileView = { id: 3, name: 'Profile', current: false };
        this.views = [this.HomeView, this.FriendsView, this.ProfileView];
    }
    ViewNavigationHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.HomeView.current = true;
        this.headerText = this.HomeView.name;
        // [routerLink]="['/home']" [queryParams]="{view:'param'}"
        this.activatedRoute.queryParams.subscribe(function (params) {
            var view = params['view'];
            _this.handleViewParam(view);
        });
    };
    // Display home view
    ViewNavigationHomeComponent.prototype.showHomeView = function () {
        this.showPage(this.HomeView.id);
    };
    // Display friends view
    ViewNavigationHomeComponent.prototype.showFriendsView = function () {
        this.showPage(this.FriendsView.id);
    };
    // Display profile view
    ViewNavigationHomeComponent.prototype.showProfileView = function () {
        this.showPage(this.ProfileView.id);
    };
    // Display view by id
    ViewNavigationHomeComponent.prototype.showPage = function (_id) {
        this.hideAllViews();
        switch (_id) {
            case 2:
                this.FriendsView.current = true;
                this.headerText = this.FriendsView.name;
                break;
            case 3:
                this.ProfileView.current = true;
                this.headerText = this.ProfileView.name;
                break;
            default:
                this.HomeView.current = true;
                this.headerText = this.HomeView.name;
                break;
        }
    };
    // Hide all home views
    ViewNavigationHomeComponent.prototype.hideAllViews = function () {
        this.views.forEach(function (view) {
            view.current = false;
        });
    };
    // Display views based on url param
    ViewNavigationHomeComponent.prototype.handleViewParam = function (param) {
        switch (param) {
            case 'profile':
                this.showProfileView();
                break;
            case 'connections':
                this.showFriendsView();
                break;
            default:
                this.showHomeView();
                break;
        }
    };
    ViewNavigationHomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-view-navigation-home',
            template: __webpack_require__(/*! ./view-navigation-home.component.html */ "./src/app/Home/view-navigation-home/view-navigation-home.component.html"),
            styles: [__webpack_require__(/*! ./view-navigation-home.component.css */ "./src/app/Home/view-navigation-home/view-navigation-home.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], ViewNavigationHomeComponent);
    return ViewNavigationHomeComponent;
}());



/***/ }),

/***/ "./src/app/Onboarding/forgot/forgot.component.css":
/*!********************************************************!*\
  !*** ./src/app/Onboarding/forgot/forgot.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* {\r\n    font-family: 'Poppins', sans-serif;\r\n}\r\n\r\n::-webkit-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\r\n\r\n:-ms-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\r\n\r\n::-ms-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\r\n\r\n::placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvT25ib2FyZGluZy9mb3Jnb3QvZm9yZ290LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxrQ0FBa0M7QUFDdEM7O0FBRUE7SUFDSSxjQUFjO0lBQ2QsVUFBVTtFQUNaOztBQUhGO0lBQ0ksY0FBYztJQUNkLFVBQVU7RUFDWjs7QUFIRjtJQUNJLGNBQWM7SUFDZCxVQUFVO0VBQ1o7O0FBSEY7SUFDSSxjQUFjO0lBQ2QsVUFBVTtFQUNaIiwiZmlsZSI6InNyYy9hcHAvT25ib2FyZGluZy9mb3Jnb3QvZm9yZ290LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIqIHtcclxuICAgIGZvbnQtZmFtaWx5OiAnUG9wcGlucycsIHNhbnMtc2VyaWY7XHJcbn1cclxuXHJcbjo6cGxhY2Vob2xkZXIgeyBcclxuICAgIGNvbG9yOiAjOTZCN0M5O1xyXG4gICAgb3BhY2l0eTogMTsgXHJcbiAgfSJdfQ== */"

/***/ }),

/***/ "./src/app/Onboarding/forgot/forgot.component.html":
/*!*********************************************************!*\
  !*** ./src/app/Onboarding/forgot/forgot.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n\r\n  </head>\r\n  <body>\r\n    <!-- Main Container Div -->\r\n    <section class=\"d-flex align-items-center\" style=\"margin-top: 40px; margin-bottom: 20px;\">\r\n        <div class=\"container-fluid\">\r\n          <div class=\"row text-center\">\r\n            <div class=\"col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4\">\r\n              <div>\r\n                <img src=\"/assets/images/forgot_circle-lock.png\" alt=\"Circle Lock\">\r\n              </div>\r\n              <div class=\"px-5\">\r\n                <p class=\"text-secondary mt-5 text-strong\">Trouble logging in?</p>\r\n                <p class=\"text-light\">Enter Your Email And We'll Send You A Link To Get Back Into Your Account.</p>\r\n              </div>\r\n              <form [formGroup]=\"forgotForm\" (ngSubmit)=\"onSubmit()\">\r\n                <div class=\"justify-content-center px-4 py-3\">\r\n                  <div class=\"form-group\">\r\n                    <input type=\"email\" class=\"form-control\" id=\"emailInput\"\r\n                      aria-describedby=\"emailHelp\" placeholder=\"Email\" formControlName=\"email\"\r\n                      [ngClass]=\"{ 'is-invalid': submitted && f.email.errors }\" />\r\n                    <div *ngIf=\"submitted && f.email.errors\" class=\"invalid-feedback text-left\">\r\n                      <div *ngIf=\"f.email.errors.required\">Please provide your email.</div>\r\n                      <div *ngIf=\"f.email.errors.email || f.email.errors.pattern\">The email {{ f.email.value }} is invalid.</div>\r\n                    </div>\r\n\r\n                    <button type=\"submit\" class=\"btn btn-primary btn-block mt-3 py-3\" value=\"Send Email\">SEND LOGIN LINK</button>\r\n                  </div>\r\n                </div>\r\n              </form>\r\n              <div>\r\n                <p class=\"mb-4\">OR</p>\r\n                <a [routerLink]=\"['/signup']\"><p class=\"text-primary\">CREATE NEW ACCOUNT</p></a>\r\n              </div>\r\n              <div class=\"mt-5\">\r\n                <a [routerLink]=\"['/login']\"><p class=\"mt-5\" style=\"color: #115073; font-weight: bold;\"><i class=\"fas fa-long-arrow-left\"></i> <span class=\"pl-3\">BACK TO LOGIN</span></p></a>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </section>\r\n      <app-footer></app-footer>\r\n  </body>\r\n</html>"

/***/ }),

/***/ "./src/app/Onboarding/forgot/forgot.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/Onboarding/forgot/forgot.component.ts ***!
  \*******************************************************/
/*! exports provided: ForgotComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotComponent", function() { return ForgotComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Core/_models/form-validation */ "./src/app/Core/_models/form-validation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ForgotComponent = /** @class */ (function () {
    function ForgotComponent(formBuilder, route, router) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.loading = false;
        this.submitted = false;
        this.appTitle = 'Forgot Password';
        this.formValidation = new _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_3__["CustomFormValidation"]();
    }
    ForgotComponent.prototype.ngOnInit = function () {
        this.forgotForm = this.formBuilder.group({
            email: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.formValidation.regularEmailValidation)])]
        });
        this.returnUrl = '/';
    };
    Object.defineProperty(ForgotComponent.prototype, "f", {
        // Convenience getter for easy access to form fields
        get: function () { return this.forgotForm.controls; },
        enumerable: true,
        configurable: true
    });
    ForgotComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.loading = true;
        // http.post(`${environment.apiUrl}/recovery/forgot`);
        // stop here if form is invalid
        if (this.forgotForm.invalid) {
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append input to form data
        formData.append('password', this.forgotForm.get('email').value);
        this.loading = false;
    };
    ForgotComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forgot',
            template: __webpack_require__(/*! ./forgot.component.html */ "./src/app/Onboarding/forgot/forgot.component.html"),
            styles: [__webpack_require__(/*! ./forgot.component.css */ "./src/app/Onboarding/forgot/forgot.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ForgotComponent);
    return ForgotComponent;
}());



/***/ }),

/***/ "./src/app/Onboarding/login/login.component.css":
/*!******************************************************!*\
  !*** ./src/app/Onboarding/login/login.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "::-webkit-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\n:-ms-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\n::-ms-input-placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\n::placeholder { \r\n    color: #96B7C9;\r\n    opacity: 1; \r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvT25ib2FyZGluZy9sb2dpbi9sb2dpbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksY0FBYztJQUNkLFVBQVU7RUFDWjtBQUhGO0lBQ0ksY0FBYztJQUNkLFVBQVU7RUFDWjtBQUhGO0lBQ0ksY0FBYztJQUNkLFVBQVU7RUFDWjtBQUhGO0lBQ0ksY0FBYztJQUNkLFVBQVU7RUFDWiIsImZpbGUiOiJzcmMvYXBwL09uYm9hcmRpbmcvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjo6cGxhY2Vob2xkZXIgeyBcclxuICAgIGNvbG9yOiAjOTZCN0M5O1xyXG4gICAgb3BhY2l0eTogMTsgXHJcbiAgfSJdfQ== */"

/***/ }),

/***/ "./src/app/Onboarding/login/login.component.html":
/*!*******************************************************!*\
  !*** ./src/app/Onboarding/login/login.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <!-- import fonts -->\r\n    <link href=\"https://fonts.googleapis.com/css?family=Nunito|Poppins|Roboto\" rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n    <div class=\"container my-4 pt-5 pb-3\">\r\n        <!--  -->\r\n        <!-- Title header -->\r\n        <!--  -->\r\n        <div class=\"row\">\r\n            <div class=\"col-12 col-lg-8 offset-lg-2 text-center\">\r\n                <img src=\"/assets/images/logo-mark-64.png\" class=\"img-fluid img-responsive mx-auto mb-4\" width=\"64px\"\r\n                    alt=\"Chatversity Logo Mark\">\r\n                <h1 class=\"text-center h4 text-secondary\">Login to Chatversity</h1>\r\n            </div>\r\n        </div>\r\n        <!--  -->\r\n        <!-- Login Form -->\r\n        <!--  -->\r\n        <div class=\"row mt-5\">\r\n            <div class=\"col-12 col-md-8 offset-md-2 col-lg-4 offset-lg-4\">\r\n                <form [formGroup]=\"loginForm\" (ngSubmit)=\"onSubmit()\">\r\n                    <div *ngIf=\"submitted && f.username.errors\">\r\n                        <div *ngIf=\"f.username.errors.invalid\" class=\"alert alert-danger\" role=\"alert\">Incorrect\r\n                            username or password.</div>\r\n                    </div>\r\n\r\n                    <!-- Username -->\r\n                    <div class=\"form-group\">\r\n                        <label for=\"username\" class=\"text-secondary\">Username</label>\r\n                        <input type=\"text\" name=\"username\" formControlName=\"username\" placeholder=\"Enter your username\"\r\n                            class=\"form-control\" tabindex=1 [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\" />\r\n                        <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.username.errors.required\">Username is required.</div>\r\n                            <div *ngIf=\"f.username.errors.email || f.username.errors.pattern\">The username {{ f.username.value }} is invalid.</div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Password -->\r\n                    <div class=\"form-group\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-6\">\r\n                                <label for=\"password\" class=\"text-secondary\">Password</label>\r\n                            </div>\r\n                            <div class=\"col-6 text-right\">\r\n                                <a [routerLink]=\"['/forgot']\" class=\"small\"tabindex=7>Forgot Password?</a>\r\n                            </div>\r\n                        </div>\r\n                        <input type=\"password\" formControlName=\"password\" placeholder=\"Enter your password\"\r\n                            class=\"form-control\" tabindex=2 [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\" />\r\n                        <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.password.errors.required\">Password is required.</div>\r\n                        </div>\r\n                        <button [disabled]=\"loading\" class=\"btn btn-login btn-primary btn-block mt-4 py-3\" tabindex=3><span *ngIf=\"!loading\">LOGIN</span>\r\n                            <img *ngIf=\"loading\"\r\n                            src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n                        </button>\r\n                        \r\n                    </div>\r\n                </form>\r\n            </div>\r\n            <!--  -->\r\n            <!-- Signup link -->\r\n            <!--  -->\r\n            <div class=\"col-12\">\r\n                <p class=\"text-center text-secondary\">New to Chatversity? &nbsp; <a [routerLink]=\"['/signup']\" tabindex=4>Sign up</a></p>\r\n            </div>\r\n        </div>\r\n        <!--  -->\r\n        <!-- Google Play and Apple Store Badges -->\r\n        <!--  -->\r\n        <div class=\"col-8 offset-2 mt-3\">\r\n            <div class=\"row\">\r\n                <div class=\"col-6 col-lg-3 offset-lg-3\">\r\n                    <a href=\"#\"tabindex=5>\r\n                        <img src=\"/assets/images/GooglePlayBadge.png\" class=\"img-fluid img-responsive mx-auto\"\r\n                            style=\"min-width: 75px; min-height: 30px;\">\r\n                    </a>\r\n                </div>\r\n                <div class=\"col-6 col-lg-3\"tabindex=6>\r\n                    <a href=\"#\">\r\n                        <img src=\"/assets/images/AppStoreBadge.png\" class=\"img-fluid img-responsive mx-auto\"\r\n                            style=\"min-width: 75px; min-height: 30px;\">\r\n                    </a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    \r\n</body>\r\n<footer>\r\n    <!-- import footer -->\r\n    <app-footer></app-footer>\r\n</footer>\r\n</html>"

/***/ }),

/***/ "./src/app/Onboarding/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/Onboarding/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Core/_models/form-validation */ "./src/app/Core/_models/form-validation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
var LoginComponent = /** @class */ (function () {
    // username = new FormControl('');
    function LoginComponent(formBuilder, route, router, auth) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.auth = auth;
        this.loading = false;
        this.submitted = false;
        this.formValidation = new _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_6__["CustomFormValidation"]();
    }
    LoginComponent.prototype.ngOnInit = function () {
        // TODO: Check if already logged in, redirect
        this.loginForm = this.formBuilder.group({
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.formValidation.regularEmailValidation)])],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.returnUrl = '/';
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append username and password to form data
        formData.append('username', this.loginForm.get('username').value);
        formData.append('password', this.loginForm.get('password').value);
        console.log(formData);
        // Send the obj to our user auth function
        // this.auth.login(this.f.username.value, this.f.password.value).pipe()
        // .subscribe(
        //     data => {
        //         this.router.navigate([this.returnUrl]);
        //     },
        //     error => {
        //         // this.alertService.error(error);
        //         this.loading = false;
        //         this.f.username.setErrors({invalid: true});
        //     });
        this.auth.login(this.f.username.value, this.f.password.value).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["first"])()).subscribe(function (data) {
            _this.router.navigate([_this.returnUrl]);
        }, function (error) {
            _this.loading = false;
            _this.f.username.setErrors({ invalid: true });
        });
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/Onboarding/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/Onboarding/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/Onboarding/new-user/new-user.component.css":
/*!************************************************************!*\
  !*** ./src/app/Onboarding/new-user/new-user.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".styled-btn{\r\n    height: 50px;\r\n    width: 150px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvT25ib2FyZGluZy9uZXctdXNlci9uZXctdXNlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksWUFBWTtJQUNaLFlBQVk7QUFDaEIiLCJmaWxlIjoic3JjL2FwcC9PbmJvYXJkaW5nL25ldy11c2VyL25ldy11c2VyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3R5bGVkLWJ0bntcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxNTBweDtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/Onboarding/new-user/new-user.component.html":
/*!*************************************************************!*\
  !*** ./src/app/Onboarding/new-user/new-user.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container w-100 h-100\" style=\"background-color: white;\">\r\n    <div class=\"row\">\r\n      <div class=\"col-12 text-center\">\r\n        <div class=\"mt-5\">\r\n            <p class=\"h1 text-secondary my-5 text-strong\">Thank you for signing up with <span class=\"text-primary\">Chatversity</span> \r\n              <img src=\"/assets/images/logo-mark-64.png\" class=\"img-fluid img-responsive mx-auto mb-3\" width=\"64px\" style=\"padding-left:10px;\"\r\n              alt=\"Chatversity Logo Mark\">\r\n            </p>\r\n\r\n            <div style=\"margin-top: 10%;\">\r\n                <p class=\"text-light\" style=\"font-size:1.2em;\">\r\n                  Would you like to set up your profile now?\r\n                </p>\r\n                <div class=\"mt-5\">\r\n                  <a [routerLink]=\"['/profile']\"><button class=\"btn btn-primary mt-2 styled-btn\">Yes</button></a> &nbsp;\r\n                  <a [routerLink]=\"['/dashboard']\"><button class=\"btn btn-outline-primary mt-2 styled-btn\">No</button></a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/Onboarding/new-user/new-user.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/Onboarding/new-user/new-user.component.ts ***!
  \***********************************************************/
/*! exports provided: NewUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewUserComponent", function() { return NewUserComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NewUserComponent = /** @class */ (function () {
    function NewUserComponent() {
    }
    NewUserComponent.prototype.ngOnInit = function () {
    };
    NewUserComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-new-user',
            template: __webpack_require__(/*! ./new-user.component.html */ "./src/app/Onboarding/new-user/new-user.component.html"),
            styles: [__webpack_require__(/*! ./new-user.component.css */ "./src/app/Onboarding/new-user/new-user.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NewUserComponent);
    return NewUserComponent;
}());



/***/ }),

/***/ "./src/app/Onboarding/signup/signup.component.css":
/*!********************************************************!*\
  !*** ./src/app/Onboarding/signup/signup.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".signup-pic{\r\n  background: url('signup-pic-100.png'); \r\n  background-size: cover;\r\n  height: 100vh;\r\n  background-repeat: no-repeat;\r\n  position: -webkit-sticky;\r\n  position: sticky;\r\n  top: 0;\r\n}\r\n.col-override{\r\n  padding: 0;\r\n  max-width: 100%;\r\n}\r\n.signup-text{\r\n  padding-left: 0%;\r\n  padding-top: 50%;\r\n  text-align: center;\r\n}\r\n.pic-title{\r\n  font-size: 2.5rem;\r\n  margin-bottom: 15px;\r\n}\r\n.pic-msg{\r\n  display: none;\r\n}\r\n.pic-msg-mobile{\r\n  display: block;\r\n}\r\n.signup-btn{\r\n  display: inline-block;\r\n}\r\n.offset-override{\r\n  max-width: 500px;\r\n  margin-right: 0%;\r\n  margin-left: 0%;\r\n  margin: 0 auto;\r\n}\r\n.primary-border{\r\n  border: 1px solid rgba(38, 177, 255, .35);\r\n}\r\n.danger-border{\r\n  border: 1px solid #ff4136;\r\n}\r\n::-webkit-input-placeholder { \r\n  color: #96B7C9;\r\n  opacity: 1; \r\n}\r\n:-ms-input-placeholder { \r\n  color: #96B7C9;\r\n  opacity: 1; \r\n}\r\n::-ms-input-placeholder { \r\n  color: #96B7C9;\r\n  opacity: 1; \r\n}\r\n::placeholder { \r\n  color: #96B7C9;\r\n  opacity: 1; \r\n}\r\n@media (min-width: 576px){ /*Small*/\r\n  .signup-text{\r\n    padding-top: 30%;\r\n  }\r\n}\r\n@media (min-width: 768px){ /*Medium*/\r\n  .col-override{\r\n    max-width: 570px;\r\n  }\r\n  .signup-text{\r\n    padding-left: 10%;\r\n    padding-top: 70%;\r\n    text-align: left;\r\n  }\r\n  .signup-btn{\r\n    display: none;\r\n  }\r\n  .pic-title{\r\n    font-size: 1.5rem;\r\n    margin-bottom: 5px;\r\n  }\r\n  .pic-msg{\r\n    display: block;\r\n  }\r\n  .pic-msg-mobile{\r\n    display: none;\r\n  }\r\n  .offset-override{\r\n    margin-right: 3%;\r\n    margin-left: 3%;\r\n  }\r\n  .mobile-fixed{\r\n    position: relative;\r\n  }\r\n}\r\n@media (min-width: 992px){ /*Large*/\r\n  .offset-override{\r\n    margin-right: 8%;\r\n    margin-left: 8%;\r\n  }\r\n}\r\n@media (min-width: 1200px){ /*Extra-Large*/\r\n  .offset-override{\r\n    margin-right: 10%;\r\n    margin-left: 10%;\r\n    margin: 0 auto;\r\n  }\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvT25ib2FyZGluZy9zaWdudXAvc2lnbnVwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQ0FBNEQ7RUFDNUQsc0JBQXNCO0VBQ3RCLGFBQWE7RUFDYiw0QkFBNEI7RUFDNUIsd0JBQWdCO0VBQWhCLGdCQUFnQjtFQUNoQixNQUFNO0FBQ1I7QUFDQTtFQUNFLFVBQVU7RUFDVixlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsaUJBQWlCO0VBQ2pCLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxxQkFBcUI7QUFDdkI7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLGNBQWM7QUFDaEI7QUFFQTtFQUNFLHlDQUF5QztBQUMzQztBQUVBO0VBQ0UseUJBQXlCO0FBQzNCO0FBRUE7RUFDRSxjQUFjO0VBQ2QsVUFBVTtBQUNaO0FBSEE7RUFDRSxjQUFjO0VBQ2QsVUFBVTtBQUNaO0FBSEE7RUFDRSxjQUFjO0VBQ2QsVUFBVTtBQUNaO0FBSEE7RUFDRSxjQUFjO0VBQ2QsVUFBVTtBQUNaO0FBRUEsMkJBQTJCLFFBQVE7RUFDakM7SUFDRSxnQkFBZ0I7RUFDbEI7QUFDRjtBQUVBLDJCQUEyQixTQUFTO0VBQ2xDO0lBQ0UsZ0JBQWdCO0VBQ2xCO0VBQ0E7SUFDRSxpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtFQUNsQjtFQUNBO0lBQ0UsYUFBYTtFQUNmO0VBQ0E7SUFDRSxpQkFBaUI7SUFDakIsa0JBQWtCO0VBQ3BCO0VBQ0E7SUFDRSxjQUFjO0VBQ2hCO0VBQ0E7SUFDRSxhQUFhO0VBQ2Y7RUFDQTtJQUNFLGdCQUFnQjtJQUNoQixlQUFlO0VBQ2pCO0VBQ0E7SUFDRSxrQkFBa0I7RUFDcEI7QUFDRjtBQUVBLDJCQUEyQixRQUFRO0VBQ2pDO0lBQ0UsZ0JBQWdCO0lBQ2hCLGVBQWU7RUFDakI7QUFDRjtBQUVBLDRCQUE0QixjQUFjO0VBQ3hDO0lBQ0UsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixjQUFjO0VBQ2hCO0FBQ0YiLCJmaWxlIjoic3JjL2FwcC9PbmJvYXJkaW5nL3NpZ251cC9zaWdudXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zaWdudXAtcGlje1xyXG4gIGJhY2tncm91bmQ6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltYWdlcy9zaWdudXAtcGljLTEwMC5wbmcnKTsgXHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XHJcbiAgcG9zaXRpb246IHN0aWNreTtcclxuICB0b3A6IDA7XHJcbn1cclxuLmNvbC1vdmVycmlkZXtcclxuICBwYWRkaW5nOiAwO1xyXG4gIG1heC13aWR0aDogMTAwJTtcclxufVxyXG4uc2lnbnVwLXRleHR7XHJcbiAgcGFkZGluZy1sZWZ0OiAwJTtcclxuICBwYWRkaW5nLXRvcDogNTAlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG4ucGljLXRpdGxle1xyXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xyXG4gIG1hcmdpbi1ib3R0b206IDE1cHg7XHJcbn1cclxuLnBpYy1tc2d7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufVxyXG4ucGljLW1zZy1tb2JpbGV7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuLnNpZ251cC1idG57XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG59XHJcblxyXG4ub2Zmc2V0LW92ZXJyaWRle1xyXG4gIG1heC13aWR0aDogNTAwcHg7XHJcbiAgbWFyZ2luLXJpZ2h0OiAwJTtcclxuICBtYXJnaW4tbGVmdDogMCU7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbn1cclxuXHJcbi5wcmltYXJ5LWJvcmRlcntcclxuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM4LCAxNzcsIDI1NSwgLjM1KTtcclxufVxyXG5cclxuLmRhbmdlci1ib3JkZXJ7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmNDEzNjtcclxufVxyXG5cclxuOjpwbGFjZWhvbGRlciB7IFxyXG4gIGNvbG9yOiAjOTZCN0M5O1xyXG4gIG9wYWNpdHk6IDE7IFxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogNTc2cHgpeyAvKlNtYWxsKi9cclxuICAuc2lnbnVwLXRleHR7XHJcbiAgICBwYWRkaW5nLXRvcDogMzAlO1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KXsgLypNZWRpdW0qL1xyXG4gIC5jb2wtb3ZlcnJpZGV7XHJcbiAgICBtYXgtd2lkdGg6IDU3MHB4O1xyXG4gIH1cclxuICAuc2lnbnVwLXRleHR7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDEwJTtcclxuICAgIHBhZGRpbmctdG9wOiA3MCU7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIH1cclxuICAuc2lnbnVwLWJ0bntcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgfVxyXG4gIC5waWMtdGl0bGV7XHJcbiAgICBmb250LXNpemU6IDEuNXJlbTtcclxuICAgIG1hcmdpbi1ib3R0b206IDVweDtcclxuICB9XHJcbiAgLnBpYy1tc2d7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICB9XHJcbiAgLnBpYy1tc2ctbW9iaWxle1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbiAgLm9mZnNldC1vdmVycmlkZXtcclxuICAgIG1hcmdpbi1yaWdodDogMyU7XHJcbiAgICBtYXJnaW4tbGVmdDogMyU7XHJcbiAgfVxyXG4gIC5tb2JpbGUtZml4ZWR7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpeyAvKkxhcmdlKi9cclxuICAub2Zmc2V0LW92ZXJyaWRle1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA4JTtcclxuICAgIG1hcmdpbi1sZWZ0OiA4JTtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiAxMjAwcHgpeyAvKkV4dHJhLUxhcmdlKi9cclxuICAub2Zmc2V0LW92ZXJyaWRle1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMCU7XHJcbiAgICBtYXJnaW4tbGVmdDogMTAlO1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgfVxyXG59Il19 */"

/***/ }),

/***/ "./src/app/Onboarding/signup/signup.component.html":
/*!*********************************************************!*\
  !*** ./src/app/Onboarding/signup/signup.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito|Poppins|Roboto\" rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n  <div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n      <!--Sign Up Picture-->\r\n      <div class=\"col col-12 col-md col-lg col-override\" style=\"min-height: 100vh;\">\r\n        <div class=\"signup-pic\">\r\n          <div class=\"signup-text\">\r\n            <h4 class=\"text-white text-strong pb-2 pic-title\">Chatversity</h4>\r\n            <h5 class=\"text-secondary text-strong pic-msg-mobile\">Simplifying Communication</h5>\r\n            <h1 class=\"text-secondary text-strong pic-msg\">Simplifying <br/> Communication.</h1>\r\n\r\n            <div class=\"mt-5 signup-btn\">\r\n                <button id=\"signup-button\" class=\"btn btn-secondary mt-5 px-4 py-3\"\r\n                onclick=\"document.getElementById('signup-top').scrollIntoView();\">Sign Up Today!</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div> \r\n\r\n      <!--Sign Up Form-->\r\n      <div class=\"col col-12 col-md col-lg offset-override\" style=\"min-height: 100vh;\">\r\n        <div class=\"w-100 mx-auto text-center mb-5 mt-4\">\r\n          <img src=\"../../../../assets/images/Logo-Name.png\" class=\"img-fluid img-responsive mx-auto w-75\" id=\"signup-top\"/>\r\n        </div>\r\n        <form [formGroup]=\"signupForm\" (ngSubmit)=\"onSubmit()\">\r\n\r\n            <!--Summary Error Alert-->\r\n          <div *ngIf=\"submitted && checkForFormErrors()\">\r\n              <!--<div *ngIf=\"f.username.errors.invalid\" class=\"alert alert-danger\" role=\"alert\">The username {{ f.username.value }} is invalid.</div>\r\n              <div *ngIf=\"f.password.errors.invalid\" class=\"alert alert-danger\" role=\"alert\">Your password is too weak.</div>-->\r\n          </div>\r\n\r\n          <div class=\"row\">\r\n            <div class=\"col-12 col-sm-6 col-md-6\">\r\n  \r\n              <!--First Name-->\r\n              <div class=\"form-group mb-3\">\r\n                <label for=\"firstname\" class=\"text-secondary\">First Name <span class=\"text-danger\">*</span></label>\r\n                <input type=\"text\" required class=\"form-control primary-border\" id=\"firstname\" name=\"firstname\" placeholder=\"John\" \r\n                formControlName=\"firstname\"\r\n                [ngClass]=\"{ 'is-invalid': submitted && f.firstname.errors, 'danger-border': submitted && f.firstname.errors }\">\r\n\r\n                <div *ngIf=\"submitted && f.firstname.errors\" class=\"invalid-feedback\">\r\n                  <div *ngIf=\"f.firstname.errors.required\">Please provide your first name.</div>\r\n                </div>\r\n                </div>\r\n              </div>\r\n  \r\n              <!--Last Name-->\r\n              <div class=\"col-12 col-sm-6 col-md-6\">\r\n                <div class=\"form-group mb-3\">\r\n                  <label for=\"lastname\" class=\"text-secondary\">Last Name <span class=\"text-danger\">*</span></label>\r\n                  <input type=\"text\" required class=\"form-control primary-border\" id=\"lastname\" name=\"lastname\" placeholder=\"Doe\" \r\n                  formControlName=\"lastname\"\r\n                  [ngClass]=\"{ 'is-invalid': submitted && f.lastname.errors, 'danger-border': submitted && f.lastname.errors }\">\r\n\r\n                <div *ngIf=\"submitted && f.lastname.errors\" class=\"invalid-feedback\">\r\n                  <div *ngIf=\"f.lastname.errors.required\">Please provide your last name.</div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n            <!--University Select-->\r\n            <!--ToDo: Loop through list of universities-->\r\n            <div class=\"form-group mb-3\">\r\n              <label for=\"university\" class=\"text-secondary\">University <span class=\"text-danger\">*</span></label>\r\n              <select name=\"university\" required formControlName=\"university\" class=\"form-control primary-border\"\r\n                  [ngClass]=\"{ 'is-invalid': submitted && f.university.errors, 'danger-border': submitted && f.university.errors }\">\r\n                  <option [value]=\"\" [disabled]=\"true\" [selected]=\"true\">&mdash; Please Select a University &mdash;</option>\r\n                  <option *ngFor=\"let uni of universities\" [value]=\"uni.id\">{{ uni.name }}</option>\r\n              </select>\r\n\r\n              <div *ngIf=\"submitted && f.university.errors\" class=\"invalid-feedback\">\r\n                  <div *ngIf=\"f.university.errors.required\">Please select your university.</div>\r\n                  <div *ngIf=\"f.university.errors.invalid\">Invalid university.</div>\r\n              </div>\r\n          </div>\r\n\r\n            <!--Username (Email) Textbox-->\r\n            <div class=\"form-group mb-3\">\r\n                <label for=\"username\" class=\"text-secondary\">Email <span class=\"text-danger\">*</span></label>\r\n                <input type=\"email\" required name=\"username\" formControlName=\"username\" placeholder=\"you@university.edu\" \r\n                    class=\"form-control primary-border\"\r\n                    [ngClass]=\"{ 'is-invalid': submitted && f.username.errors, 'danger-border': submitted && f.username.errors }\" (change)=\"findUniversity(f.username.value)\" />\r\n                  <div class=\"text-primary\" *ngIf=\"!submitted || !f.username.errors\">\r\n                    <small><span class=\"text-danger\">*</span> PLEASE ENTER YOUR SCHOOL EMAIL</small>\r\n                  </div>\r\n                    <!-- TODO: Add search university filter here -->\r\n                  \r\n                <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\r\n                    <div *ngIf=\"f.username.errors.required\">Please provide your school email.</div>\r\n                    <div *ngIf=\"f.username.errors.email || f.username.errors.pattern\">The username {{ f.username.value }} is invalid.</div>\r\n                </div>\r\n            </div>\r\n\r\n            <!--Password-->\r\n            <div class=\"form-group\">\r\n                <label for=\"password\" class=\"text-secondary\">Password <span class=\"text-danger\">*</span></label>\r\n                <input type=\"password\" required formControlName=\"password\" placeholder=\"Create a password\"\r\n                    class=\"form-control primary-border\" [ngClass]=\"{ 'is-invalid': submitted && f.password.errors, 'danger-border': submitted && f.password.errors }\" />\r\n                \r\n                <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\r\n                    <div *ngIf=\"f.password.errors.required\">Please choose a password.</div>\r\n                    <div *ngIf=\"f.password.errors.minlength || f.password.errors.pattern\">Your password must have atleast: <br>\r\n                      <div style=\"padding-left:20px\">▶&nbsp; 6 characters <br> ▶&nbsp; 1 uppercase letter <br> ▶&nbsp; 1 number</div>\r\n                    </div>\r\n                </div>\r\n\r\n                <button [disabled]=\"loading\" class=\"btn btn-login btn-primary btn-block mt-4 py-3\"><span *ngIf=\"!loading\">SIGN UP FOR CHATVERSITY</span>\r\n                  <img *ngIf=\"loading\"\r\n                    src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n                </button>\r\n\r\n            </div>\r\n\r\n            <div class=\"text-secondary text-center mt-4 mb-3\">\r\n                Already have an account? &nbsp; <a [routerLink]=\"['/login']\" class=\"text-primary\">Login</a>\r\n            </div>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>"

/***/ }),

/***/ "./src/app/Onboarding/signup/signup.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/Onboarding/signup/signup.component.ts ***!
  \*******************************************************/
/*! exports provided: SignupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupComponent", function() { return SignupComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Core/_models/form-validation */ "./src/app/Core/_models/form-validation.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
var SignupComponent = /** @class */ (function () {
    function SignupComponent(formBuilder, route, router, auth, http) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.auth = auth;
        this.http = http;
        this.loading = false;
        this.submitted = false;
        this.searchingForSchool = false;
        this.formValidation = new _Core_models_form_validation__WEBPACK_IMPORTED_MODULE_5__["CustomFormValidation"]();
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.signupForm = this.formBuilder.group({
            firstname: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            lastname: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            university: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.formValidation.eduEmailValidation)
                ])],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.formValidation.passwordValidation)
                ])]
        });
        this.returnUrl = '/new-user';
    };
    //
    // ─── CHECK FOR USERNAME OR PASSWORD ERRORS ──────────────────────────────────────
    //
    SignupComponent.prototype.checkForFormErrors = function () {
        if (this.f.username.errors || this.f.password.errors) {
            return true;
        }
        return false;
    };
    Object.defineProperty(SignupComponent.prototype, "f", {
        //
        // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
        //
        get: function () { return this.signupForm.controls; },
        enumerable: true,
        configurable: true
    });
    //
    // ─── CHECK FOR VALID UNIVERSITY ─────────────────────────────────────────────────
    //
    SignupComponent.prototype.checkUniversity = function (_id) {
        console.log('University Id:' + _id);
        return (this.universities.find(function (x) { return x.id.toString() === _id.toString(); })) ? true : false;
    };
    //
    // ─── SEARCH FOR UNIVERSITY FROM JSON STORE ──────────────────────────────────────
    //
    SignupComponent.prototype.findUniversity = function (query) {
        var _this = this;
        this.searchingForSchool = true;
        console.log(query);
        this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].apiUrl + "/university/" + query)
            .toPromise()
            .then(function (university) {
            console.log(university);
        })
            .catch(function (error) {
            _this.searchingForSchool = false;
        });
    };
    //
    // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
    //
    SignupComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.signupForm.invalid) {
            this.loading = false;
            return;
        }
        // Stop if invalid university
        if (!(this.checkUniversity(this.signupForm.get('university').value))) {
            console.log('Invalid University.');
            this.f.university.setErrors({ 'invalid': true });
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append input to form data
        formData.append('firstname', this.signupForm.get('firstname').value);
        formData.append('lastname', this.signupForm.get('lastname').value);
        formData.append('university', this.signupForm.get('university').value);
        formData.append('username', this.signupForm.get('username').value);
        formData.append('password', this.signupForm.get('password').value);
        this.auth.signup(this.f.firstname.value, this.f.lastname.value, this.f.university.value, this.f.username.value, this.f.password.value);
        this.loading = false;
    };
    SignupComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-signup',
            template: __webpack_require__(/*! ./signup.component.html */ "./src/app/Onboarding/signup/signup.component.html"),
            styles: [__webpack_require__(/*! ./signup.component.css */ "./src/app/Onboarding/signup/signup.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], SignupComponent);
    return SignupComponent;
}());



/***/ }),

/***/ "./src/app/Profile-Views/profile/profile.component.css":
/*!*************************************************************!*\
  !*** ./src/app/Profile-Views/profile/profile.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#user-image{\r\n    max-width: 200px;\r\n    max-height: 200px;\r\n    border: 1px solid #0E425F;\r\n}\r\n#profile-picture-container > img{\r\n    margin: left;\r\n}\r\n#profile-content{\r\n    margin-top: 20px;\r\n}\r\n@media (min-width: 992px){ /*Large*/\r\n    #profile-content{\r\n        margin-top: 0px;\r\n    }\r\n    #profile-picture-container > img{\r\n        margin: 0 auto;\r\n    }\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvUHJvZmlsZS1WaWV3cy9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIseUJBQXlCO0FBQzdCO0FBQ0E7SUFDSSxZQUFZO0FBQ2hCO0FBQ0E7SUFDSSxnQkFBZ0I7QUFDcEI7QUFDQSwyQkFBMkIsUUFBUTtJQUMvQjtRQUNJLGVBQWU7SUFDbkI7SUFDQTtRQUNJLGNBQWM7SUFDbEI7QUFDSiIsImZpbGUiOiJzcmMvYXBwL1Byb2ZpbGUtVmlld3MvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjdXNlci1pbWFnZXtcclxuICAgIG1heC13aWR0aDogMjAwcHg7XHJcbiAgICBtYXgtaGVpZ2h0OiAyMDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwRTQyNUY7XHJcbn1cclxuI3Byb2ZpbGUtcGljdHVyZS1jb250YWluZXIgPiBpbWd7XHJcbiAgICBtYXJnaW46IGxlZnQ7XHJcbn1cclxuI3Byb2ZpbGUtY29udGVudHtcclxuICAgIG1hcmdpbi10b3A6IDIwcHg7XHJcbn1cclxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KXsgLypMYXJnZSovXHJcbiAgICAjcHJvZmlsZS1jb250ZW50e1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDBweDtcclxuICAgIH1cclxuICAgICNwcm9maWxlLXBpY3R1cmUtY29udGFpbmVyID4gaW1ne1xyXG4gICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgfVxyXG59Il19 */"

/***/ }),

/***/ "./src/app/Profile-Views/profile/profile.component.html":
/*!**************************************************************!*\
  !*** ./src/app/Profile-Views/profile/profile.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid py-3\">\r\n    <div class=\"text-center\">\r\n        <div class=\"row mt-5 mb-3\">\r\n            <div class=\"col-12 col-lg-4 mt-1 pr-2\" id=\"profile-picture-container\">\r\n                <!-- Profile Image -->\r\n                <img src=\"...\" onerror=\"this.src='../../assets/images/DefaultProfile.png'\" id=\"user-image\"\r\n                class=\"rounded img-fluid mb-1 d-block\" >\r\n            </div>\r\n\r\n            <div class=\"col-12 col-lg-7 text-left\" id=\"profile-content\">\r\n                <ng-container *ngIf=\"this.user\">\r\n                    <!-- User Name -->\r\n                    <div class=\"h2 text-secondary text-light-weight\">{{ this.user.name }}</div>\r\n                    <!-- {{ this.user.avatarURL }} -->\r\n                    <!-- <ng-container *ngIf=\"this.user.presence.state\">\r\n                        User is online!\r\n                    </ng-container> -->\r\n                </ng-container>\r\n\r\n                <!-- User Major and Graduation Year -->\r\n                <div>\r\n                    <!-- <span class=\"text-light\" style=\"font-weight:100;\">Class of {{ this.user.profile.graduationYear }}</span><br> -->\r\n                    <!-- <span class=\"text-primary\" style=\"font-weight:100;\">{{ this.user.profile.major }}</span> -->\r\n                </div>\r\n\r\n                <!--User Bio-->\r\n                <div class=\"text-left mt-3\">\r\n                    <!-- <p>{{this.user.profile.bio}}</p> -->\r\n                </div>\r\n\r\n                <!--User Clubs-->\r\n                <div class=\"text-left\">\r\n                    <!-- <p><span class=\"text-secondary-light\">Clubs: &nbsp;</span> {{this.user.profile.clubs}}</p> -->\r\n                </div>\r\n\r\n                <!--User Interests-->\r\n                <div class=\"text-left\">\r\n                    <!-- <p><span class=\"text-secondary-light\">Interests: &nbsp;</span> {{this.user.profile.interests}}</p> -->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/Profile-Views/profile/profile.component.ts":
/*!************************************************************!*\
  !*** ./src/app/Profile-Views/profile/profile.component.ts ***!
  \************************************************************/
/*! exports provided: ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return ProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Core/_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/_services/messaging.service */ "./src/app/Core/_services/messaging.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(formBuilder, route, router, authService, msgService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.msgService = msgService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        //
        // ─── CONNECT TO CHAKIT ───────────────────────────────────────────
        //
        var _this = this;
        this.msgService.chatManager
            .connect()
            .then(function (user) {
            _this.user = user;
            console.log(user); // ! TESTING ONLY
        });
        // ─────────────────────────────────────────────────────────────────
    };
    ProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__(/*! ./profile.component.html */ "./src/app/Profile-Views/profile/profile.component.html"),
            styles: [__webpack_require__(/*! ./profile.component.css */ "./src/app/Profile-Views/profile/profile.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_4__["MessagingService"]])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),

/***/ "./src/app/Profile-Views/settings-profile/settings-profile.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/Profile-Views/settings-profile/settings-profile.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n  <div class=\"w-100 h-100\" style=\"background-color:white;\">\r\n    <div class=\"row\">\r\n      <div class=\"col-12 col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-4\">\r\n        <div class=\"text-center mb-5 mt-3\">\r\n          <h2 class=\"text-secondary\">Profile</h2>\r\n        </div>\r\n        <form [formGroup]=\"profileForm\" (ngSubmit)=\"onSubmit()\">\r\n\r\n          <div *ngIf=\"submitted && (f.firstname.errors || f.lastname.errors)\">\r\n            <div class=\"alert alert-danger\" role=\"alert\">Unable to update profile.</div>\r\n          </div>\r\n\r\n          <button *ngIf=\"!editMode\" class=\"btn btn-primary btn-block my-3 py-3\" (click)=\"onClickEdit()\">EDIT PROFILE</button>\r\n          \r\n          <div class=\"row\">\r\n            <div class=\"col-12 col-sm-6 col-md-6\">\r\n  \r\n              <!--First Name-->\r\n              <div class=\"form-group mb-3\">\r\n                <label for=\"firstname\" class=\"text-secondary\">First Name <span class=\"text-danger\" *ngIf=\"editMode\">*</span></label>\r\n                <input type=\"text\" class=\"form-control\" id=\"firstname\" name=\"firstname\" placeholder=\"John\" required\r\n                formControlName=\"firstname\"\r\n                [ngClass]=\"{ 'is-invalid': submitted && f.firstname.errors }\">\r\n\r\n                <div *ngIf=\"submitted && f.firstname.errors\" class=\"invalid-feedback\">\r\n                  <div *ngIf=\"f.firstname.errors.required\">Please provide your first name.</div>\r\n                </div>\r\n                </div>\r\n              </div>\r\n  \r\n              <!--Last Name-->\r\n              <div class=\"col-12 col-sm-6 col-md-6\">\r\n                <div class=\"form-group mb-3\">\r\n                  <label for=\"lastname\" class=\"text-secondary\">Last Name <span class=\"text-danger\" *ngIf=\"editMode\">*</span></label>\r\n                  <input type=\"text\" class=\"form-control\" id=\"lastname\" name=\"lastname\" placeholder=\"Doe\" required\r\n                  formControlName=\"lastname\"\r\n                  [ngClass]=\"{ 'is-invalid': submitted && f.lastname.errors }\">\r\n\r\n                <div *ngIf=\"submitted && f.lastname.errors\" class=\"invalid-feedback\">\r\n                  <div *ngIf=\"f.lastname.errors.required\">Please provide your last name.</div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n     \r\n          <!--Bio-->\r\n          <div class=\"form-group mb-3\">\r\n            <label for=\"bio\" class=\"text-secondary\">Bio</label>\r\n            <textarea class=\"form-control\" id=\"bio\" name=\"bio\" maxlength=\"200\" formControlName=\"bio\" data-gramm_editor=\"false\"></textarea>\r\n          </div>\r\n\r\n          <div class=\"row\">\r\n            <div class=\"col-12 col-sm-8 col-md-8\">\r\n\r\n              <!--Major-->\r\n              <div class=\"form-group mb-3\">\r\n                <label for=\"major\" class=\"text-secondary\">Major</label>\r\n                <input type=\"text\" class=\"form-control\" id=\"major\" name=\"major\" placeholder=\"Computer Science\" maxlength=\"100\"\r\n                formControlName=\"major\">\r\n              </div>\r\n            </div>\r\n\r\n            <!--Graduation Year-->\r\n            <div class=\"col-12 col-sm-4 col-md-4\">\r\n              <div class=\"form-group mb-3\">\r\n                <label for=\"graduationYear\" class=\"text-secondary\">Graduation Year</label>\r\n                <input type=\"number\" class=\"form-control\" id=\"graduationYear\" name=\"graduationYear\" placeholder=\"2025\"\r\n                formControlName=\"graduationYear\">\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n          <!--Interests-->\r\n          <div class=\"form-group mb-3\">\r\n            <label for=\"major\" class=\"text-secondary\">Interests</label>\r\n            <input type=\"text\" class=\"form-control\" id=\"interests\" name=\"interests\" placeholder=\"What are your interests?\" maxlength=\"100\"\r\n            formControlName=\"interests\">\r\n          </div>\r\n\r\n          <!--Clubs-->\r\n          <div class=\"form-group mb-3\">\r\n            <label for=\"clubs\" class=\"text-secondary\">Clubs</label>\r\n            <input type=\"text\" class=\"form-control\" id=\"clubs\" name=\"clubs\" placeholder=\"Which clubs are you involved in?\" maxlength=\"100\"\r\n            formControlName=\"clubs\">\r\n          </div>\r\n     \r\n          <button *ngIf=\"editMode\" [disabled]=\"loading\" type=\"submit\" class=\"btn btn-secondary btn-block mt-4 mb-3 py-3\">UPDATE PROFILE</button>\r\n          <div class=\"text-center\">\r\n              <img *ngIf=\"loading\"\r\n              src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />  \r\n          </div>\r\n\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/Profile-Views/settings-profile/settings-profile.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/Profile-Views/settings-profile/settings-profile.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "input[disabled], textarea[disabled] {\n  background-color: #f7f7f7;\n  border: none;\n  border-radius: 0px;\n  border-bottom: 1px solid #26B1FF;\n  resize: none; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvUHJvZmlsZS1WaWV3cy9zZXR0aW5ncy1wcm9maWxlL0M6XFxydGFya293c2tpXFxOTUNcXFllYXIgMlxcU3ByaW5nIDIwMTlcXENJVCAyODBcXENoYXR2ZXJzaXR5XFxDaGF0dmVyc2l0eV9BcHAvc3JjXFxhcHBcXFByb2ZpbGUtVmlld3NcXHNldHRpbmdzLXByb2ZpbGVcXHNldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx5QkFBeUI7RUFDekIsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixnQ0FBZ0M7RUFDaEMsWUFBWSxFQUFBIiwiZmlsZSI6InNyYy9hcHAvUHJvZmlsZS1WaWV3cy9zZXR0aW5ncy1wcm9maWxlL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbnB1dFtkaXNhYmxlZF0sIHRleHRhcmVhW2Rpc2FibGVkXSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICMyNkIxRkY7XHJcbiAgICByZXNpemU6IG5vbmU7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/Profile-Views/settings-profile/settings-profile.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/Profile-Views/settings-profile/settings-profile.component.ts ***!
  \******************************************************************************/
/*! exports provided: SettingsProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsProfileComponent", function() { return SettingsProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SettingsProfileComponent = /** @class */ (function () {
    function SettingsProfileComponent(formBuilder, route, router) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.loading = false;
        this.submitted = false;
        this.editMode = false;
    }
    SettingsProfileComponent.prototype.ngOnInit = function () {
        //
        // ToDo: Get user data from service
        //
        // Create test user
        this.user = {
            id: 1,
            firstName: 'Richie',
            lastName: 'Tarkowski',
            username: 'tarkowr@mail.nmc.edu',
            password: undefined,
            university: { id: 3, name: 'NMC', state: 'MI', domains: null },
            profile: { bio: "Hello world!", major: "CIS", graduationYear: 2021, interests: "Running, NBA, and CS", clubs: "bball" },
            active: false
        };
        this.profile = this.user.profile;
        // Build new form
        this.profileForm = this.formBuilder.group({
            firstname: [{ value: this.user.firstName, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            lastname: [{ value: this.user.lastName, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            bio: [{ value: this.profile.bio, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["MaxLengthValidator"]],
            major: [{ value: this.profile.major, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["MaxLengthValidator"]],
            graduationYear: [{ value: this.profile.graduationYear, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["MaxLengthValidator"]],
            interests: [{ value: this.profile.interests, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["MaxLengthValidator"]],
            clubs: [{ value: this.profile.clubs, disabled: !this.editMode }, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["MaxLengthValidator"]]
        });
    };
    Object.defineProperty(SettingsProfileComponent.prototype, "f", {
        // Convenience getter for easy access to form fields
        get: function () { return this.profileForm.controls; },
        enumerable: true,
        configurable: true
    });
    // Activate edit mode
    SettingsProfileComponent.prototype.onClickEdit = function () {
        this.editMode = true;
        this.profileForm.enable();
    };
    // Validation and other actions upon form submission
    SettingsProfileComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.profileForm.invalid) {
            this.loading = false;
            return;
        }
        // Disable form so user cannot edit
        this.profileForm.disable();
        this.editMode = false;
        // Get updated profile data from user
        var _fname = this.profileForm.get('firstname').value;
        var _lname = this.profileForm.get('lastname').value;
        var _bio = this.profileForm.get('bio').value;
        var _major = this.profileForm.get('major').value;
        var _gradYr = this.profileForm.get('graduationYear').value;
        var _interests = this.profileForm.get('interests').value;
        var _clubs = this.profileForm.get('clubs').value;
        // Update the user object
        this.user.firstName = _fname;
        this.user.lastName = _lname;
        this.user.profile.bio = _bio;
        this.user.profile.major = _major;
        this.user.profile.graduationYear = _gradYr;
        this.user.profile.interests = _interests;
        this.user.profile.clubs = _clubs;
        console.log(this.user);
        // Create obj to hold formdata
        var formData = new FormData();
        // Append input to form data
        formData.append('firstname', _fname);
        formData.append('lastname', _lname);
        formData.append('bio', _bio);
        formData.append('major', _major);
        formData.append('graduationYear', _gradYr.toString());
        formData.append('interests', _interests);
        formData.append('clubs', _clubs);
        //
        // ToDo: Send FormData to service to update Pusher/MongoDB
        //
        this.loading = false;
    };
    SettingsProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-settings-profile',
            template: __webpack_require__(/*! ./settings-profile.component.html */ "./src/app/Profile-Views/settings-profile/settings-profile.component.html"),
            styles: [__webpack_require__(/*! ./settings-profile.component.scss */ "./src/app/Profile-Views/settings-profile/settings-profile.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], SettingsProfileComponent);
    return SettingsProfileComponent;
}());



/***/ }),

/***/ "./src/app/Profile-Views/small/small.component.css":
/*!*********************************************************!*\
  !*** ./src/app/Profile-Views/small/small.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#user-image{\r\n    max-width: 100px;\r\n    max-height: 100px;\r\n    border: 1px solid #0E425F;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvUHJvZmlsZS1WaWV3cy9zbWFsbC9zbWFsbC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGlCQUFpQjtJQUNqQix5QkFBeUI7QUFDN0IiLCJmaWxlIjoic3JjL2FwcC9Qcm9maWxlLVZpZXdzL3NtYWxsL3NtYWxsLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjdXNlci1pbWFnZXtcclxuICAgIG1heC13aWR0aDogMTAwcHg7XHJcbiAgICBtYXgtaGVpZ2h0OiAxMDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwRTQyNUY7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/Profile-Views/small/small.component.html":
/*!**********************************************************!*\
  !*** ./src/app/Profile-Views/small/small.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Modal -->\r\n<div class=\"modal hide fade col-10 offset-1 col-md-6 offset-md-3\" id=\"profileModal\" tabindex=\"-1\"\r\n  role=\"dialog\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">\r\n    <div class=\"modal-content text-center\">\r\n\r\n      <!--Header-->\r\n      <div class=\"modal-header\" style=\"border:none;\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\" style=\"font-size:1.75rem;\">&times;</span>\r\n        </button>\r\n      </div>\r\n\r\n      <!--Body-->\r\n      <div class=\"modal-body\">\r\n        <!-- Profile Image -->\r\n        <img src=\"...\" onerror=\"this.src='../../assets/images/DefaultProfile.png'\" id=\"user-image\"\r\n        class=\"rounded img-fluid mx-auto mb-1 d-block\">\r\n\r\n        <!-- User's Name -->\r\n        <div class=\"h3 text-secondary text-light-weight mt-3\">{{ this.user.firstName }} {{ this.user.lastName }} </div>\r\n\r\n        <!-- User's Info -->\r\n        <p class=\"text-primary\">&mdash; Class of {{this.user.profile.graduationYear}} &mdash;</p>\r\n        <p class=\"text-secondary mt-2\">{{this.user.profile.bio}}</p>\r\n      </div>\r\n\r\n      <!-- Footer -->\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-primary mx-auto py-2 px-3 text-uppercase\" (click)=\"addConnection()\"\r\n        *ngIf=\"!isConnection\">Add Connection</button>\r\n        <span class=\"text-light mx-auto py-2\" *ngIf=\"isConnection\">You are connected with this user!</span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/Profile-Views/small/small.component.ts":
/*!********************************************************!*\
  !*** ./src/app/Profile-Views/small/small.component.ts ***!
  \********************************************************/
/*! exports provided: SmallComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SmallComponent", function() { return SmallComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _Core_models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Core/_models/user */ "./src/app/Core/_models/user.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SmallComponent = /** @class */ (function () {
    function SmallComponent() {
        this.isConnection = false;
    }
    SmallComponent.prototype.ngOnInit = function () {
    };
    SmallComponent.prototype.addConnection = function () {
        this.isConnection = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _Core_models_user__WEBPACK_IMPORTED_MODULE_1__["User"])
    ], SmallComponent.prototype, "user", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], SmallComponent.prototype, "isConnection", void 0);
    SmallComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-small',
            template: __webpack_require__(/*! ./small.component.html */ "./src/app/Profile-Views/small/small.component.html"),
            styles: [__webpack_require__(/*! ./small.component.css */ "./src/app/Profile-Views/small/small.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SmallComponent);
    return SmallComponent;
}());



/***/ }),

/***/ "./src/app/Settings-Views/connection-settings/connection-settings.component.css":
/*!**************************************************************************************!*\
  !*** ./src/app/Settings-Views/connection-settings/connection-settings.component.css ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL1NldHRpbmdzLVZpZXdzL2Nvbm5lY3Rpb24tc2V0dGluZ3MvY29ubmVjdGlvbi1zZXR0aW5ncy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/Settings-Views/connection-settings/connection-settings.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/Settings-Views/connection-settings/connection-settings.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  connection-settings works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/Settings-Views/connection-settings/connection-settings.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/Settings-Views/connection-settings/connection-settings.component.ts ***!
  \*************************************************************************************/
/*! exports provided: ConnectionSettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionSettingsComponent", function() { return ConnectionSettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ConnectionSettingsComponent = /** @class */ (function () {
    function ConnectionSettingsComponent() {
    }
    ConnectionSettingsComponent.prototype.ngOnInit = function () {
    };
    ConnectionSettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-connection-settings',
            template: __webpack_require__(/*! ./connection-settings.component.html */ "./src/app/Settings-Views/connection-settings/connection-settings.component.html"),
            styles: [__webpack_require__(/*! ./connection-settings.component.css */ "./src/app/Settings-Views/connection-settings/connection-settings.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ConnectionSettingsComponent);
    return ConnectionSettingsComponent;
}());



/***/ }),

/***/ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/Settings-Views/privacy-settings/privacy-settings.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL1NldHRpbmdzLVZpZXdzL3ByaXZhY3ktc2V0dGluZ3MvcHJpdmFjeS1zZXR0aW5ncy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/Settings-Views/privacy-settings/privacy-settings.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  privacy-settings works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/Settings-Views/privacy-settings/privacy-settings.component.ts ***!
  \*******************************************************************************/
/*! exports provided: PrivacySettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrivacySettingsComponent", function() { return PrivacySettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PrivacySettingsComponent = /** @class */ (function () {
    function PrivacySettingsComponent() {
    }
    PrivacySettingsComponent.prototype.ngOnInit = function () {
    };
    PrivacySettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-privacy-settings',
            template: __webpack_require__(/*! ./privacy-settings.component.html */ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.html"),
            styles: [__webpack_require__(/*! ./privacy-settings.component.css */ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PrivacySettingsComponent);
    return PrivacySettingsComponent;
}());



/***/ }),

/***/ "./src/app/Settings-Views/security-settings/security-settings.component.css":
/*!**********************************************************************************!*\
  !*** ./src/app/Settings-Views/security-settings/security-settings.component.css ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL1NldHRpbmdzLVZpZXdzL3NlY3VyaXR5LXNldHRpbmdzL3NlY3VyaXR5LXNldHRpbmdzLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/Settings-Views/security-settings/security-settings.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/Settings-Views/security-settings/security-settings.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  security-settings works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/Settings-Views/security-settings/security-settings.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/Settings-Views/security-settings/security-settings.component.ts ***!
  \*********************************************************************************/
/*! exports provided: SecuritySettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecuritySettingsComponent", function() { return SecuritySettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SecuritySettingsComponent = /** @class */ (function () {
    function SecuritySettingsComponent() {
    }
    SecuritySettingsComponent.prototype.ngOnInit = function () {
    };
    SecuritySettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-security-settings',
            template: __webpack_require__(/*! ./security-settings.component.html */ "./src/app/Settings-Views/security-settings/security-settings.component.html"),
            styles: [__webpack_require__(/*! ./security-settings.component.css */ "./src/app/Settings-Views/security-settings/security-settings.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SecuritySettingsComponent);
    return SecuritySettingsComponent;
}());



/***/ }),

/***/ "./src/app/Settings-Views/settings/settings.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/Settings-Views/settings/settings.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\" style=\"height:100vh;\">\r\n\r\n  <app-top-bar [viewName]=\"'Settings'\" [headerText]=\"headerText\"></app-top-bar>\r\n  \r\n  <div class=\"row page-content\" id=\"settings-content\">\r\n    <div class=\"col-12 col-lg-3\" style=\"background-color:#F1F8FC; border-bottom:1px solid #DAE6ED;\">\r\n      <div class=\"my-3 px-1\">\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showProfileView()\"\r\n        [ngClass]=\"{ 'active': ProfileView.current }\">My Profile</button>\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showPrivacyView()\"\r\n        [ngClass]=\"{ 'active': PrivacyView.current }\">Privacy</button>\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showSecurityView()\"\r\n        [ngClass]=\"{ 'active': SecurityView.current }\">Security</button>\r\n        <button class=\"btn btn-block custom-btn text-left my-2 p-3\" (click)=\"showConnectionsView()\"\r\n        [ngClass]=\"{ 'active': ConnectionsView.current }\">Connections</button>\r\n      </div>\r\n    </div>\r\n  \r\n  <div class=\"col-12 col-lg-9\" style=\"background-color: #fafdff; border-left:1px solid #DAE6ED;\" id=\"settings-right\">\r\n    <div *ngIf=\"ProfileView.current\">\r\n      <app-settings-profile></app-settings-profile>\r\n    </div>\r\n  </div>\r\n\r\n  </div>\r\n</div>\r\n      "

/***/ }),

/***/ "./src/app/Settings-Views/settings/settings.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/Settings-Views/settings/settings.component.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL1NldHRpbmdzLVZpZXdzL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/Settings-Views/settings/settings.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/Settings-Views/settings/settings.component.ts ***!
  \***************************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SettingsComponent = /** @class */ (function () {
    function SettingsComponent() {
        this.ProfileView = { id: 1, name: 'Profile', current: false };
        this.PrivacyView = { id: 2, name: 'Privacy', current: false };
        this.SecurityView = { id: 3, name: 'Security', current: false };
        this.ConnectionsView = { id: 3, name: 'Connections', current: false };
        this.views = [this.ProfileView, this.PrivacyView, this.SecurityView, this.ConnectionsView];
    }
    SettingsComponent.prototype.ngOnInit = function () {
        this.ProfileView.current = true;
        this.headerText = this.ProfileView.name;
    };
    // Display profile view
    SettingsComponent.prototype.showProfileView = function () {
        this.hideAllViews();
    };
    // Display privacy view
    SettingsComponent.prototype.showPrivacyView = function () {
        this.hideAllViews();
    };
    // Display security view
    SettingsComponent.prototype.showSecurityView = function () {
        this.hideAllViews();
    };
    // Display connections view
    SettingsComponent.prototype.showConnectionsView = function () {
        this.hideAllViews();
    };
    // Hide all settings views
    SettingsComponent.prototype.hideAllViews = function () {
        this.views.forEach(function (view) {
            view.current = false;
        });
    };
    SettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-settings',
            template: __webpack_require__(/*! ./settings.component.html */ "./src/app/Settings-Views/settings/settings.component.html"),
            styles: [__webpack_require__(/*! ./settings.component.scss */ "./src/app/Settings-Views/settings/settings.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/Shared/footer/footer.component.css":
/*!****************************************************!*\
  !*** ./src/app/Shared/footer/footer.component.css ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a {\r\n    color: #0E425F !important;\r\n    font-size: 1rem;\r\n    font-weight: 500;\r\n}\r\na:hover{\r\n    text-decoration: underline;\r\n}\r\nspan{\r\n    font-size: 1rem;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvU2hhcmVkL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLHlCQUF5QjtJQUN6QixlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSwwQkFBMEI7QUFDOUI7QUFFQTtJQUNJLGVBQWU7QUFDbkIiLCJmaWxlIjoic3JjL2FwcC9TaGFyZWQvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYSB7XHJcbiAgICBjb2xvcjogIzBFNDI1RiAhaW1wb3J0YW50O1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5hOmhvdmVye1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbn1cclxuXHJcbnNwYW57XHJcbiAgICBmb250LXNpemU6IDFyZW07XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/Shared/footer/footer.component.html":
/*!*****************************************************!*\
  !*** ./src/app/Shared/footer/footer.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-light footer-nav justify-content-center mb-3\" style=\"background-color: inherit !important\">\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/EULA\">EULA</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/\">TERMS</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/\">PRIVACY</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/about\">ABOUT</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/contact\">CONTACT</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/faq\">FAQ</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/\">SUPPORT</a>\r\n    <a class=\"navbar-brand\" href=\"https://chatversityapp.com/pricing\">PRICING</a>\r\n    <span class=\"navbar-brand pl-4 text-light text-light-weight\">COPYRIGHT &copy; 2019 CHATVERSITY</span>\r\n</nav>"

/***/ }),

/***/ "./src/app/Shared/footer/footer.component.ts":
/*!***************************************************!*\
  !*** ./src/app/Shared/footer/footer.component.ts ***!
  \***************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! ./footer.component.html */ "./src/app/Shared/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.css */ "./src/app/Shared/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/Shared/navbar/navbar.component.html":
/*!*****************************************************!*\
  !*** ./src/app/Shared/navbar/navbar.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<a routerLink=\"home\" id=\"top-logo\"><img src=\"/assets/icons/icon-72x72.png\" height=\"48\" width=\"42\" class=\"m-3\"></a>\r\n<ul class=\"nav nav-pills nav-justified flex-column align-self-center m-auto\">\r\n  <li class=\"nav-item\">\r\n    <a class=\"nav-link mt-1 mb-1 pt-3 pb-3\" ngbTooltip=\"Home\" placement=\"right\" triggers=\"hover\" [autoClose]=\"true\" routerLinkActive=\"active\" routerLink=\"home\"><i class=\"fa fa-home fa-lg\"></i></a>\r\n  </li>\r\n  <li class=\"nav-item\">\r\n    <a class=\"nav-link mt-1 mb-1 pt-3 pb-3\" ngbTooltip=\"Rooms\" placement=\"right\" triggers=\"hover\" [autoClose]=\"true\" routerLinkActive=\"active\" routerLink=\"rooms\"><i class=\"fa fa-door-closed fa-lg\"></i></a>\r\n  </li>\r\n  <li class=\"nav-item\">\r\n    <a class=\"nav-link mt-1 mb-1 pt-3 pb-3\" ngbTooltip=\"Messages\" placement=\"right\" triggers=\"hover\" [autoClose]=\"true\" routerLinkActive=\"active\" routerLink=\"messages\"><i class=\"far fa-envelope fa-lg\"></i></a>\r\n  </li>\r\n  <li class=\"nav-item\">\r\n    <a class=\"nav-link mt-1 mb-1 pt-3 pb-3\" ngbTooltip=\"Settings\" placement=\"right\" triggers=\"hover\" [autoClose]=\"true\" routerLinkActive=\"active\" routerLink=\"settings\"><i class=\"fa fa-cogs fa-lg\"></i></a>\r\n  </li>\r\n  <li class=\"nav-item\">\r\n    <a class=\"nav-link mt-1 mb-1 pt-3 pb-3\" routerLink=\"messages\">\r\n      <span>{{ notificationCount }}</span>\r\n    </a>\r\n  </li>\r\n</ul>"

/***/ }),

/***/ "./src/app/Shared/navbar/navbar.component.scss":
/*!*****************************************************!*\
  !*** ./src/app/Shared/navbar/navbar.component.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a {\n  color: #96B7C9 !important;\n  border-radius: 0px;\n  border: 1px solid white; }\n\n.active {\n  color: #24B6FF !important;\n  background-color: #F3F6F8 !important;\n  border: 1px solid #dce8ef; }\n\na:hover {\n  background-color: #F3F6F8;\n  border: 1px solid #F3F6F8; }\n\n#top-logo {\n  all: initial; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvU2hhcmVkL25hdmJhci9DOlxccnRhcmtvd3NraVxcTk1DXFxZZWFyIDJcXFNwcmluZyAyMDE5XFxDSVQgMjgwXFxDaGF0dmVyc2l0eVxcQ2hhdHZlcnNpdHlfQXBwL3NyY1xcYXBwXFxTaGFyZWRcXG5hdmJhclxcbmF2YmFyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0kseUJBQXlCO0VBQ3pCLGtCQUFrQjtFQUNsQix1QkFBdUIsRUFBQTs7QUFHM0I7RUFDSSx5QkFBeUI7RUFDekIsb0NBQW9DO0VBQ3BDLHlCQUF5QixFQUFBOztBQUc3QjtFQUNJLHlCQUF5QjtFQUN6Qix5QkFBeUIsRUFBQTs7QUFHN0I7RUFDSSxZQUFZLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9TaGFyZWQvbmF2YmFyL25hdmJhci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImEge1xyXG4gICAgY29sb3I6ICM5NkI3QzkgIWltcG9ydGFudDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xyXG59XHJcblxyXG4uYWN0aXZlIHtcclxuICAgIGNvbG9yOiAjMjRCNkZGICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjNGNkY4ICFpbXBvcnRhbnQ7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGNlOGVmO1xyXG59XHJcblxyXG5hOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNGM0Y2Rjg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjRjNGNkY4O1xyXG59XHJcblxyXG4jdG9wLWxvZ297XHJcbiAgICBhbGw6IGluaXRpYWw7XHJcbn1cclxuXHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/Shared/navbar/navbar.component.ts":
/*!***************************************************!*\
  !*** ./src/app/Shared/navbar/navbar.component.ts ***!
  \***************************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Core/_services/messaging.service */ "./src/app/Core/_services/messaging.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(msgService) {
        this.msgService = msgService;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.msgService.notificationCount.subscribe(function (notification) { return _this.notificationCount = notification; });
    };
    NavbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__(/*! ./navbar.component.html */ "./src/app/Shared/navbar/navbar.component.html"),
            styles: [__webpack_require__(/*! ./navbar.component.scss */ "./src/app/Shared/navbar/navbar.component.scss")]
        }),
        __metadata("design:paramtypes", [_Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_1__["MessagingService"]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/Shared/top-bar/top-bar.component.css":
/*!******************************************************!*\
  !*** ./src/app/Shared/top-bar/top-bar.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#messages_header {\r\n    background-color:#FFF;\r\n    z-index: 2;\r\n    font-family: 'Poppins', sans-serif;\r\n    font-weight: bold;\r\n    color: #94B0C0;\r\n    top:0;\r\n    position: -webkit-sticky;\r\n    position: sticky;\r\n}\r\n\r\n#header-text{\r\n    display: none;\r\n}\r\n\r\n#mobile-header-text{\r\n    display: inline-block;\r\n}\r\n\r\n@media (min-width: 768px){ /*Medium*/\r\n    #header-text{\r\n        display: inline-block;\r\n    }\r\n    #mobile-header-text{\r\n        display: none;\r\n    }\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvU2hhcmVkL3RvcC1iYXIvdG9wLWJhci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0kscUJBQXFCO0lBQ3JCLFVBQVU7SUFDVixrQ0FBa0M7SUFDbEMsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCxLQUFLO0lBQ0wsd0JBQWdCO0lBQWhCLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLGFBQWE7QUFDakI7O0FBQ0E7SUFDSSxxQkFBcUI7QUFDekI7O0FBRUEsMkJBQTJCLFNBQVM7SUFDaEM7UUFDSSxxQkFBcUI7SUFDekI7SUFDQTtRQUNJLGFBQWE7SUFDakI7QUFDSiIsImZpbGUiOiJzcmMvYXBwL1NoYXJlZC90b3AtYmFyL3RvcC1iYXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNtZXNzYWdlc19oZWFkZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjojRkZGO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIGZvbnQtZmFtaWx5OiAnUG9wcGlucycsIHNhbnMtc2VyaWY7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiAjOTRCMEMwO1xyXG4gICAgdG9wOjA7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG59XHJcblxyXG4jaGVhZGVyLXRleHR7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcbiNtb2JpbGUtaGVhZGVyLXRleHR7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCl7IC8qTWVkaXVtKi9cclxuICAgICNoZWFkZXItdGV4dHtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9XHJcbiAgICAjbW9iaWxlLWhlYWRlci10ZXh0e1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/Shared/top-bar/top-bar.component.html":
/*!*******************************************************!*\
  !*** ./src/app/Shared/top-bar/top-bar.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row shadow-sm\" id=\"messages_header\">\r\n  <div class=\"col 12 col-md-3 py-3\">\r\n      <div class=\"d-flex align-items-center\">\r\n        <span class=\"text-uppercase text-secondary text-light-weight pl-3\">{{ viewName }} <span id=\"mobile-header-text\">&nbsp;|&nbsp; {{ headerText }}</span></span>\r\n      </div>\r\n  </div>\r\n  <div class=\"col-md-9 py-3\" style=\"border-left:1px solid #DAE6ED;\" id=\"header-text\">\r\n    <div class=\"d-flex align-items-center\">\r\n        <span class=\"text-uppercase text-secondary text-light-weight pl-3\">{{ headerText }}</span>\r\n      </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/Shared/top-bar/top-bar.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/Shared/top-bar/top-bar.component.ts ***!
  \*****************************************************/
/*! exports provided: TopBarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopBarComponent", function() { return TopBarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TopBarComponent = /** @class */ (function () {
    function TopBarComponent() {
    }
    TopBarComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], TopBarComponent.prototype, "viewName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], TopBarComponent.prototype, "headerText", void 0);
    TopBarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-top-bar',
            template: __webpack_require__(/*! ./top-bar.component.html */ "./src/app/Shared/top-bar/top-bar.component.html"),
            styles: [__webpack_require__(/*! ./top-bar.component.css */ "./src/app/Shared/top-bar/top-bar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TopBarComponent);
    return TopBarComponent;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.routes */ "./src/app/app.routes.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(_app_routes__WEBPACK_IMPORTED_MODULE_2__["routes"])],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"update\" class=\"alert alert-warning alert-dismissible fade show\" role=\"alert\">\r\n    <strong>Holy guacamole!</strong> There is an update for Chatversity!\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n</div>\r\n<div [class.app-mount]=\"(currentUser && RemoveNavbarForTesting())\">\r\n    <div *ngIf=\"(currentUser && RemoveNavbarForTesting())\" class=\"nav-wrapper\">\r\n        <div id=\"primary_navigation\">\r\n            <app-navbar *ngIf=\"(currentUser && RemoveNavbarForTesting())\" class=\"h-100 d-flex align-items-center flex-column shadow-sm\"></app-navbar>\r\n        </div>\r\n    </div>\r\n    <section [class.app-main]=\"(currentUser && RemoveNavbarForTesting())\">\r\n        <router-outlet></router-outlet> \r\n    </section>\r\n</div>\r\n\r\n<!-- Router Outlet -->"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".app-mount {\n  flex-direction: row;\n  display: flex;\n  height: 100vh;\n  position: absolute;\n  width: 100vw; }\n\n.nav-wrapper {\n  width: 88px;\n  position: relative; }\n\n#primary_navigation {\n  width: 88px;\n  background-color: white;\n  z-index: 10;\n  height: 100vh;\n  position: fixed;\n  top: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvQzpcXHJ0YXJrb3dza2lcXE5NQ1xcWWVhciAyXFxTcHJpbmcgMjAxOVxcQ0lUIDI4MFxcQ2hhdHZlcnNpdHlcXENoYXR2ZXJzaXR5X0FwcC9zcmNcXGFwcFxcYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksbUJBQW1CO0VBR25CLGFBQWE7RUFDYixhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLFlBQVksRUFBQTs7QUFHaEI7RUFDSSxXQUFXO0VBQ1gsa0JBQWtCLEVBQUE7O0FBR3RCO0VBQ0ksV0FBVTtFQUNWLHVCQUFzQjtFQUN0QixXQUFXO0VBQ1gsYUFBYTtFQUNiLGVBQWU7RUFDZixNQUFNLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYXBwLW1vdW50IHtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbn1cclxuXHJcbi5uYXYtd3JhcHBlcntcclxuICAgIHdpZHRoOiA4OHB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4jcHJpbWFyeV9uYXZpZ2F0aW9uIHtcclxuICAgIHdpZHRoOjg4cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOndoaXRlO1xyXG4gICAgei1pbmRleDogMTA7XHJcbiAgICBoZWlnaHQ6IDEwMHZoO1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgdG9wOiAwO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Core/_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/service-worker */ "./node_modules/@angular/service-worker/fesm5/service-worker.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(router, authenticationService, updates) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.title = 'Chatversity';
        // tslint:disable-next-line:no-inferrable-types
        this.update = false;
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
        updates.available.subscribe(function (event) {
            _this.update = true;
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log(this.currentUser);
    };
    // Logout user
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    };
    // For testing only, use this function to remove the navbar on pages that do not need it
    AppComponent.prototype.RemoveNavbarForTesting = function () {
        if (this.router.url == '/login' || this.router.url == '/signup' || this.router.url == '/forgot' || this.router.url == '/new-user' || this.router.url == '/404') {
            return false;
        }
        return true;
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"],
            _angular_service_worker__WEBPACK_IMPORTED_MODULE_3__["SwUpdate"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Core/_services/auth.service */ "./src/app/Core/_services/auth.service.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _Error_Views_error_error_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Error-Views/error/error.component */ "./src/app/Error-Views/error/error.component.ts");
/* harmony import */ var _Error_Views_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Error-Views/page-not-found/page-not-found.component */ "./src/app/Error-Views/page-not-found/page-not-found.component.ts");
/* harmony import */ var _Home_view_latest_news_view_latest_news_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Home/view-latest-news/view-latest-news.component */ "./src/app/Home/view-latest-news/view-latest-news.component.ts");
/* harmony import */ var _Home_view_navigation_home_view_navigation_home_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Home/view-navigation-home/view-navigation-home.component */ "./src/app/Home/view-navigation-home/view-navigation-home.component.ts");
/* harmony import */ var _Home_view_friends_home_view_friends_home_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Home/view-friends-home/view-friends-home.component */ "./src/app/Home/view-friends-home/view-friends-home.component.ts");
/* harmony import */ var _messages_messages_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./messages/messages.component */ "./src/app/messages/messages.component.ts");
/* harmony import */ var _Onboarding_login_login_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Onboarding/login/login.component */ "./src/app/Onboarding/login/login.component.ts");
/* harmony import */ var _Onboarding_signup_signup_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Onboarding/signup/signup.component */ "./src/app/Onboarding/signup/signup.component.ts");
/* harmony import */ var _Onboarding_forgot_forgot_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Onboarding/forgot/forgot.component */ "./src/app/Onboarding/forgot/forgot.component.ts");
/* harmony import */ var _Onboarding_new_user_new_user_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Onboarding/new-user/new-user.component */ "./src/app/Onboarding/new-user/new-user.component.ts");
/* harmony import */ var _Profile_Views_profile_profile_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./Profile-Views/profile/profile.component */ "./src/app/Profile-Views/profile/profile.component.ts");
/* harmony import */ var _Profile_Views_small_small_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./Profile-Views/small/small.component */ "./src/app/Profile-Views/small/small.component.ts");
/* harmony import */ var _Profile_Views_settings_profile_settings_profile_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./Profile-Views/settings-profile/settings-profile.component */ "./src/app/Profile-Views/settings-profile/settings-profile.component.ts");
/* harmony import */ var _Settings_Views_settings_settings_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./Settings-Views/settings/settings.component */ "./src/app/Settings-Views/settings/settings.component.ts");
/* harmony import */ var _Shared_footer_footer_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./Shared/footer/footer.component */ "./src/app/Shared/footer/footer.component.ts");
/* harmony import */ var _Shared_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./Shared/navbar/navbar.component */ "./src/app/Shared/navbar/navbar.component.ts");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @okta/okta-angular */ "./node_modules/@okta/okta-angular/dist/index.js");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(_okta_okta_angular__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./app.service */ "./src/app/app.service.ts");
/* harmony import */ var _Core_callback_callback_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./Core/callback/callback.component */ "./src/app/Core/callback/callback.component.ts");
/* harmony import */ var _Core_protected_protected_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./Core/protected/protected.component */ "./src/app/Core/protected/protected.component.ts");
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./app.routes */ "./src/app/app.routes.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/service-worker */ "./node_modules/@angular/service-worker/fesm5/service-worker.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _rooms_rooms_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./rooms/rooms.component */ "./src/app/rooms/rooms.component.ts");
/* harmony import */ var _scroll_to_top_directive__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./scroll-to-top.directive */ "./src/app/scroll-to-top.directive.ts");
/* harmony import */ var _Settings_Views_privacy_settings_privacy_settings_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./Settings-Views/privacy-settings/privacy-settings.component */ "./src/app/Settings-Views/privacy-settings/privacy-settings.component.ts");
/* harmony import */ var _Settings_Views_security_settings_security_settings_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./Settings-Views/security-settings/security-settings.component */ "./src/app/Settings-Views/security-settings/security-settings.component.ts");
/* harmony import */ var _Settings_Views_connection_settings_connection_settings_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./Settings-Views/connection-settings/connection-settings.component */ "./src/app/Settings-Views/connection-settings/connection-settings.component.ts");
/* harmony import */ var _Shared_top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./Shared/top-bar/top-bar.component */ "./src/app/Shared/top-bar/top-bar.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Angular Component Imports





// Angular Bootstrap

// Component Import


// Dashboard Component Imports

// Error Component Imports


// Home Component Imports



// Messages Component Imports

// Onboarding Component Imports




// Profile Component Imports



// Settings Component Imports

// Shared Component Imports


// Okta Guard and Service















var config = {
    issuer: 'https://dev-117825.okta.com',
    redirectUri: 'http://localhost:4200/implicit/callback',
    clientId: '0oadacumlPWmV9j5a356'
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
                _Error_Views_error_error_component__WEBPACK_IMPORTED_MODULE_9__["ErrorComponent"],
                _Onboarding_login_login_component__WEBPACK_IMPORTED_MODULE_15__["LoginComponent"],
                _Onboarding_signup_signup_component__WEBPACK_IMPORTED_MODULE_16__["SignupComponent"],
                _Profile_Views_profile_profile_component__WEBPACK_IMPORTED_MODULE_19__["ProfileComponent"],
                _Settings_Views_settings_settings_component__WEBPACK_IMPORTED_MODULE_22__["SettingsComponent"],
                _Onboarding_forgot_forgot_component__WEBPACK_IMPORTED_MODULE_17__["ForgotComponent"],
                _Profile_Views_small_small_component__WEBPACK_IMPORTED_MODULE_20__["SmallComponent"],
                _Core_callback_callback_component__WEBPACK_IMPORTED_MODULE_27__["CallbackComponent"],
                _Core_protected_protected_component__WEBPACK_IMPORTED_MODULE_28__["ProtectedComponent"],
                _Error_Views_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_10__["PageNotFoundComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_8__["DashboardComponent"],
                _Core_callback_callback_component__WEBPACK_IMPORTED_MODULE_27__["CallbackComponent"],
                _Shared_footer_footer_component__WEBPACK_IMPORTED_MODULE_23__["FooterComponent"],
                _Shared_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_24__["NavbarComponent"],
                _messages_messages_component__WEBPACK_IMPORTED_MODULE_14__["MessagesComponent"],
                _Profile_Views_settings_profile_settings_profile_component__WEBPACK_IMPORTED_MODULE_21__["SettingsProfileComponent"],
                _Onboarding_new_user_new_user_component__WEBPACK_IMPORTED_MODULE_18__["NewUserComponent"],
                _Home_view_latest_news_view_latest_news_component__WEBPACK_IMPORTED_MODULE_11__["ViewLatestNewsComponent"],
                _Home_view_navigation_home_view_navigation_home_component__WEBPACK_IMPORTED_MODULE_12__["ViewNavigationHomeComponent"],
                _Home_view_friends_home_view_friends_home_component__WEBPACK_IMPORTED_MODULE_13__["ViewFriendsHomeComponent"],
                _rooms_rooms_component__WEBPACK_IMPORTED_MODULE_33__["RoomsComponent"],
                _scroll_to_top_directive__WEBPACK_IMPORTED_MODULE_34__["ScrollToTopDirective"],
                _Settings_Views_privacy_settings_privacy_settings_component__WEBPACK_IMPORTED_MODULE_35__["PrivacySettingsComponent"],
                _Settings_Views_security_settings_security_settings_component__WEBPACK_IMPORTED_MODULE_36__["SecuritySettingsComponent"],
                _Settings_Views_connection_settings_connection_settings_component__WEBPACK_IMPORTED_MODULE_37__["ConnectionSettingsComponent"],
                _Shared_top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_38__["TopBarComponent"]
            ],
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(_app_routes__WEBPACK_IMPORTED_MODULE_29__["routes"]),
                _okta_okta_angular__WEBPACK_IMPORTED_MODULE_25__["OktaAuthModule"].initAuth(config),
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_6__["AppRoutingModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__["NgbModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_30__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_30__["ReactiveFormsModule"],
                _angular_service_worker__WEBPACK_IMPORTED_MODULE_31__["ServiceWorkerModule"].register('ngsw-worker.js', { enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_32__["environment"].production })
            ],
            providers: [
                _okta_okta_angular__WEBPACK_IMPORTED_MODULE_25__["OktaAuthGuard"],
                _app_service__WEBPACK_IMPORTED_MODULE_26__["OktaAuthService"],
                _Core_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routes.ts":
/*!*******************************!*\
  !*** ./src/app/app.routes.ts ***!
  \*******************************/
/*! exports provided: routes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony import */ var _Onboarding_login_login_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Onboarding/login/login.component */ "./src/app/Onboarding/login/login.component.ts");
/* harmony import */ var _Onboarding_forgot_forgot_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Onboarding/forgot/forgot.component */ "./src/app/Onboarding/forgot/forgot.component.ts");
/* harmony import */ var _Onboarding_signup_signup_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Onboarding/signup/signup.component */ "./src/app/Onboarding/signup/signup.component.ts");
/* harmony import */ var _Error_Views_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Error-Views/page-not-found/page-not-found.component */ "./src/app/Error-Views/page-not-found/page-not-found.component.ts");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @okta/okta-angular */ "./node_modules/@okta/okta-angular/dist/index.js");
/* harmony import */ var _okta_okta_angular__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_okta_okta_angular__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Core/_guards/auth.guard */ "./src/app/Core/_guards/auth.guard.ts");
/* harmony import */ var _Settings_Views_settings_settings_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Settings-Views/settings/settings.component */ "./src/app/Settings-Views/settings/settings.component.ts");
/* harmony import */ var _messages_messages_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./messages/messages.component */ "./src/app/messages/messages.component.ts");
/* harmony import */ var _Profile_Views_settings_profile_settings_profile_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Profile-Views/settings-profile/settings-profile.component */ "./src/app/Profile-Views/settings-profile/settings-profile.component.ts");
/* harmony import */ var _Onboarding_new_user_new_user_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Onboarding/new-user/new-user.component */ "./src/app/Onboarding/new-user/new-user.component.ts");
/* harmony import */ var _Home_view_navigation_home_view_navigation_home_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Home/view-navigation-home/view-navigation-home.component */ "./src/app/Home/view-navigation-home/view-navigation-home.component.ts");
/* harmony import */ var _rooms_rooms_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./rooms/rooms.component */ "./src/app/rooms/rooms.component.ts");












var routes = [
    /* Must be logged out to access these components */
    { path: 'forgot', component: _Onboarding_forgot_forgot_component__WEBPACK_IMPORTED_MODULE_1__["ForgotComponent"] /*, canActivate: [RouteGuard]*/ },
    { path: 'signup', component: _Onboarding_signup_signup_component__WEBPACK_IMPORTED_MODULE_2__["SignupComponent"] /*, canActivate: [RouteGuard]*/ },
    { path: 'login', component: _Onboarding_login_login_component__WEBPACK_IMPORTED_MODULE_0__["LoginComponent"] /*, canActivate: [RouteGuard]*/ },
    /* Must be logged in to access these components */
    { path: '', component: _Home_view_navigation_home_view_navigation_home_component__WEBPACK_IMPORTED_MODULE_10__["ViewNavigationHomeComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'settings', component: _Settings_Views_settings_settings_component__WEBPACK_IMPORTED_MODULE_6__["SettingsComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'rooms', component: _rooms_rooms_component__WEBPACK_IMPORTED_MODULE_11__["RoomsComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'messages', component: _messages_messages_component__WEBPACK_IMPORTED_MODULE_7__["MessagesComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'settings-profile', component: _Profile_Views_settings_profile_settings_profile_component__WEBPACK_IMPORTED_MODULE_8__["SettingsProfileComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'home', component: _Home_view_navigation_home_view_navigation_home_component__WEBPACK_IMPORTED_MODULE_10__["ViewNavigationHomeComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    { path: 'new-user', component: _Onboarding_new_user_new_user_component__WEBPACK_IMPORTED_MODULE_9__["NewUserComponent"], canActivate: [_Core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]] },
    /* Can be logged in or logged out to access these components */
    { path: '404', component: _Error_Views_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_3__["PageNotFoundComponent"] },
    { path: '**', redirectTo: '/404' },
    { path: 'implicit/callback', component: _okta_okta_angular__WEBPACK_IMPORTED_MODULE_4__["OktaCallbackComponent"] },
];


/***/ }),

/***/ "./src/app/app.service.ts":
/*!********************************!*\
  !*** ./src/app/app.service.ts ***!
  \********************************/
/*! exports provided: OktaAuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OktaAuthService", function() { return OktaAuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
// app.service.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* Whenever a user attempts to access a route that
is protected by OktaAuthGuard, it first checks to
see if the user has been authenticated.
If isAuthenticated() returns false, start the login flow. */

var OktaAuthService = /** @class */ (function () {
    function OktaAuthService() {
    }
    OktaAuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], OktaAuthService);
    return OktaAuthService;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n  <div class=\"row\">\r\n    <div class=\"col-1\"></div>\r\n    <div class=\"col-11\">\r\n      <div class=\"container\">\r\n        <div class=\"row\">\r\n          <p>dashboard works!</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.scss":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".test-scss {\n  color: red; }\n  .test-scss:hover {\n    color: blue; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZGFzaGJvYXJkL0M6XFxydGFya293c2tpXFxOTUNcXFllYXIgMlxcU3ByaW5nIDIwMTlcXENJVCAyODBcXENoYXR2ZXJzaXR5XFxDaGF0dmVyc2l0eV9BcHAvc3JjXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksVUFBUyxFQUFBO0VBRGI7SUFHUSxXQUFVLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRlc3Qtc2NzcyB7IFxyXG4gICAgY29sb3I6cmVkOyBcclxuICAgICY6aG92ZXIge1xyXG4gICAgICAgIGNvbG9yOmJsdWU7XHJcbiAgICB9XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DashboardComponent = /** @class */ (function () {
    function DashboardComponent() {
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.scss */ "./src/app/dashboard/dashboard.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/messages/messages.component.html":
/*!**************************************************!*\
  !*** ./src/app/messages/messages.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\" style=\"height:100vh;\">\r\n\r\n  <app-top-bar [viewName]=\"'Messages'\" [headerText]=\"'Name'\"></app-top-bar>\r\n\r\n  <!--<button type=\"button\" class=\"ml-auto btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#addRoomModal\" (click)=\"roomCreated = false\" placement=\"left\" ngbTooltip=\"Create Room\" triggers=\"hover\" [autoClose]=\"true\">\r\n    <i class=\"fa fa-plus\"></i>\r\n  </button>-->\r\n\r\n  <!--<button type=\"button\" class=\"ml-auto btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#addRoomModal\" placement=\"left\" ngbTooltip=\"Edit Room\" triggers=\"hover\" [autoClose]=\"true\">\r\n    <i class=\"fa fa-cog\"></i>\r\n  </button>-->\r\n\r\n  <div class=\"row page-content\">\r\n    <div class=\"col-4 h-100 overflow-auto\">\r\n        \r\n          <!-- Begin Messages outlet -->\r\n          <div id=\"messages\" class=\"row\">\r\n            <ng-container *ngFor=\"let room of rooms\">\r\n              <div class=\"col-12\">\r\n                <button class=\"btn btn-block custom-btn text-left mr-4 my-2 p-3\" (click)=\"joinRoom(room.id)\">\r\n                    <div class=\"room d-flex align-items-center justify-content-between\">\r\n                        <ng-container *ngIf=\"room?.custom_data !== undefined\">\r\n                            <!-- <img src=\"{{ room.custom_data.roomAvatar }}\" alt=\"\"> -->\r\n                        </ng-container>\r\n                        <span class=\"text-secondary\">{{ room.name }}</span>\r\n                        <span *ngIf=\"roomNotifications[room.id]\" class=\"badge badge-secondary\">New</span>\r\n                      </div>\r\n                  </button>\r\n              </div>\r\n            </ng-container>\r\n            <div *ngIf=\"(currentUser)\" class=\"col-12\">\r\n                <div class=\"message-wrap\">\r\n                  <img src=\"{{currentUser.avatarURL}}\" alt=\"\">\r\n                  <span>{{ currentUser.name }}</span>\r\n                </div>\r\n            </div>\r\n          </div>\r\n    </div>\r\n    <div class=\"col-8 h-100 overflow-auto\" style=\"background:#FAFDFF;\">\r\n      <div class=\"chat-window h-100 overflow-auto\">\r\n        <ng-container *ngIf=\"room_messages\">\r\n          <div class=\"row\">\r\n            <div *ngFor=\"let message of room_messages\">\r\n            {{ message.parts[0].payload.content }}\r\n            <!-- Messages -->\r\n              <div class=\"col-12\">\r\n                {{ message.user_id }}\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </ng-container>\r\n      </div>\r\n      <div class=\"chat-footer\" style=\"position: absolute; bottom: 0; left: 0; width: 100%;\">\r\n        <form (ngSubmit)='sendMessage()'>\r\n          <input placeholder=\"Type a message. Hit Enter to send\" type=\"text\" name=\"message\" [(ngModel)]=\"message\">\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <!-- Messages Header -->\r\n</div>\r\n\r\n<!-- Create room modal -->\r\n<div class=\"modal fade\" id=\"addRoomModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addRoomModal\" aria-hidden=\"true\">\r\n\r\n  <!-- Show success alert on room created -->\r\n  <div *ngIf=\"roomCreated\" class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\r\n        <strong>Success!</strong> Created room\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>  <!-- End success modal dialog -->\r\n\r\n  <div *ngIf=\"!roomCreated\" class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <!-- Modal Header -->\r\n      <div class=\"modal-header\">\r\n        <!-- Modal Title -->\r\n        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Create Room</h5>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <!-- Add room form -->\r\n        <form (ngSubmit)='createRoom()' [formGroup]=\"formImport\" enctype=\"multipart/form-data\">\r\n          <!-- Room Name -->\r\n          <div class=\"form-group\" formGroupName=\"roomNameGroup\">\r\n            <label for=\"room_name\">Room name</label>\r\n            <input id=\"room_name\" formControlName=\"roomName\" placeholder=\"Enter a room name\" type=\"text\" class=\"form-control\" required>\r\n            <small id=\"roomNameHelp\" class=\"form-text text-muted\">A room name must be no longer than 60 characters.</small>\r\n          </div>\r\n          <!-- Private? -->\r\n          <div class=\"form-group\" formGroupName=\"privateRoomGroup\">\r\n            <div class=\"custom-control custom-switch\">\r\n              <input type=\"checkbox\" formControlName=\"privateRoom\" class=\"custom-control-input\" id=\"private_room\">\r\n              <label class=\"custom-control-label\" for=\"private_room\">Private room?</label>\r\n            </div>\r\n          </div>\r\n          <!-- Room Avatar -->\r\n          <div class=\"form-group\" formGroupName=\"importFileGroup\">\r\n            <div class=\"form-control-file\">\r\n              <div class=\"custom-file\">\r\n                <img src={{imagePath}} width=\"150\" alt=\"Thumb preview...\">\r\n                <input formControlName=\"importFile\" name=\"avatar\" (change)=\"onFileChange($event)\" type=\"file\" accept=\".png, .jpg, .jpeg\" class=\"custom-file-input\" id=\"customFile\" #avatar>\r\n                <label class=\"custom-file-label\" #labelImport for=\"customFile\">Choose file</label>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Submit -->\r\n          <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!formImport.valid\">Submit</button>\r\n        </form>\r\n      </div>\r\n      <!-- Modal Footer -->\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n        <button type=\"button\" class=\"btn btn-primary\">Save changes</button>\r\n      </div>\r\n    </div> <!-- End modal content -->\r\n  </div> <!-- End modal dialog -->\r\n</div> <!-- End modal -->\r\n"

/***/ }),

/***/ "./src/app/messages/messages.component.scss":
/*!**************************************************!*\
  !*** ./src/app/messages/messages.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#messages_header {\n  background-color: #FFF;\n  z-index: 2;\n  font-family: 'Poppins', sans-serif;\n  font-weight: bold;\n  color: #94B0C0;\n  top: 0;\n  position: -webkit-sticky;\n  position: sticky; }\n\n#messages {\n  position: relative; }\n\n.message-wrap {\n  background: #F3F6F8;\n  padding: 16px 16px;\n  margin-top: 3px;\n  border-radius: 3px;\n  transition: 0.2s ease box-shadow;\n  position: relative; }\n\n.message-wrap:hover:after {\n    content: \"\";\n    position: absolute;\n    top: 0px;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    right: 0;\n    z-index: 1;\n    box-shadow: 0px 4px 12px rgba(21, 157, 246, 0.5); }\n\n.message-wrap #status {\n    font-size: 8px;\n    margin-left: 40px;\n    line-height: .005 !important; }\n\n.chat-footer form {\n  width: 100%;\n  display: flex;\n  padding-bottom: 40px;\n  padding-top: 20px; }\n\n.chat-footer {\n  background-color: #FFFFFF;\n  padding: inherit; }\n\n.chat-footer input {\n  width: 100%;\n  background: #FFFFFF;\n  /* Primary 25 */\n  border: 1px solid #C9EBFF;\n  box-sizing: border-box;\n  box-shadow: inset 0px 1px 3px rgba(21, 157, 246, 0.5);\n  border-radius: 3px;\n  font-style: normal;\n  font-weight: 600;\n  font-size: 14px;\n  line-height: normal;\n  letter-spacing: 0.75px;\n  padding: 10px;\n  color: #94B0C0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWVzc2FnZXMvQzpcXHJ0YXJrb3dza2lcXE5NQ1xcWWVhciAyXFxTcHJpbmcgMjAxOVxcQ0lUIDI4MFxcQ2hhdHZlcnNpdHlcXENoYXR2ZXJzaXR5X0FwcC9zcmNcXGFwcFxcbWVzc2FnZXNcXG1lc3NhZ2VzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0JBQXFCO0VBQ3JCLFVBQVU7RUFDVixrQ0FBa0M7RUFDbEMsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCxNQUFLO0VBQ0wsd0JBQWdCO0VBQWhCLGdCQUFnQixFQUFBOztBQUdwQjtFQUNJLGtCQUFrQixFQUFBOztBQUd0QjtFQUVJLG1CQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixnQ0FBZ0M7RUFDaEMsa0JBQWlCLEVBQUE7O0FBUHJCO0lBV1EsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsU0FBUztJQUNULE9BQU87SUFDUCxXQUFXO0lBQ1gsUUFBUTtJQUNSLFVBQVU7SUFDVixnREFBZ0QsRUFBQTs7QUFuQnhEO0lBdUJRLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsNEJBQTRCLEVBQUE7O0FBS3BDO0VBQ0ksV0FBVztFQUNYLGFBQWE7RUFDYixvQkFBb0I7RUFDcEIsaUJBQWlCLEVBQUE7O0FBRXJCO0VBQ0kseUJBQXdCO0VBQ3hCLGdCQUFnQixFQUFBOztBQUVwQjtFQUNJLFdBQVU7RUFDVixtQkFBbUI7RUFDbkIsZUFBQTtFQUNBLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIscURBQXFEO0VBQ3JELGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLGFBQVk7RUFDWixjQUFjLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIiNtZXNzYWdlc19oZWFkZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjojRkZGO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIGZvbnQtZmFtaWx5OiAnUG9wcGlucycsIHNhbnMtc2VyaWY7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiAjOTRCMEMwO1xyXG4gICAgdG9wOjA7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG59XHJcblxyXG4jbWVzc2FnZXMge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4ubWVzc2FnZS13cmFwIHtcclxuXHJcbiAgICBiYWNrZ3JvdW5kOiNGM0Y2Rjg7XHJcbiAgICBwYWRkaW5nOiAxNnB4IDE2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAzcHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgICB0cmFuc2l0aW9uOiAwLjJzIGVhc2UgYm94LXNoYWRvdztcclxuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xyXG5cclxuXHJcbiAgICAmOmhvdmVyOmFmdGVyIHtcclxuICAgICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0b3A6IDBweDtcclxuICAgICAgICBib3R0b206IDA7XHJcbiAgICAgICAgbGVmdDogMDtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICByaWdodDogMDtcclxuICAgICAgICB6LWluZGV4OiAxO1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDBweCA0cHggMTJweCByZ2JhKDIxLCAxNTcsIDI0NiwgMC41KTsgICAgXHJcbiAgICB9XHJcblxyXG4gICAgI3N0YXR1cyB7XHJcbiAgICAgICAgZm9udC1zaXplOiA4cHg7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDQwcHg7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IC4wMDUgIWltcG9ydGFudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi5jaGF0LWZvb3RlciBmb3JtIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHBhZGRpbmctYm90dG9tOiA0MHB4O1xyXG4gICAgcGFkZGluZy10b3A6IDIwcHg7XHJcbn1cclxuLmNoYXQtZm9vdGVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6I0ZGRkZGRjsgXHJcbiAgICBwYWRkaW5nOiBpbmhlcml0O1xyXG59XHJcbi5jaGF0LWZvb3RlciBpbnB1dCB7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogI0ZGRkZGRjtcclxuICAgIC8qIFByaW1hcnkgMjUgKi9cclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNDOUVCRkY7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMHB4IDFweCAzcHggcmdiYSgyMSwgMTU3LCAyNDYsIDAuNSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAwLjc1cHg7XHJcbiAgICBwYWRkaW5nOjEwcHg7XHJcbiAgICBjb2xvcjogIzk0QjBDMDtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/messages/messages.component.ts":
/*!************************************************!*\
  !*** ./src/app/messages/messages.component.ts ***!
  \************************************************/
/*! exports provided: MessagesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessagesComponent", function() { return MessagesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/_services/messaging.service */ "./src/app/Core/_services/messaging.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MessagesComponent = /** @class */ (function () {
    function MessagesComponent(http, msgService) {
        this.http = http;
        this.msgService = msgService;
        this.room_messages = [];
        this._message = '';
        this.roomNotifications = [];
        // _roomName = '';
        // get roomName(): string {
        //   return this._roomName;
        // }
        // set roomName(value: string) {
        //   this._roomName = value;
        // }
        // TODO: Can probably remove these props
        this._roomPrivate = '';
        this.formImport = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
            importFileGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                importFile: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](''),
            }),
            roomNameGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                roomName: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(60)
                ])
            }),
            privateRoomGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                privateRoom: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('')
            })
        });
    }
    Object.defineProperty(MessagesComponent.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesComponent.prototype, "roomPrivate", {
        get: function () {
            return this._roomPrivate;
        },
        set: function (value) {
            this._roomPrivate = value;
        },
        enumerable: true,
        configurable: true
    });
    MessagesComponent.prototype.onFileChange = function (event) {
        var _this = this;
        if (!(event.target.files && event.target.files[0])) {
            return;
        }
        var file = event.target.files[0];
        this.fileToUpload = file;
        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url
        reader.onload = function (_event) {
            console.log(reader.result); // log base64 string
            _this.imagePath = reader.result;
        };
    };
    // Send a message
    MessagesComponent.prototype.sendMessage = function () {
        var _a = this, message = _a.message, currentUser = _a.currentUser;
        this.chatkitUser.sendMessage({
            text: message,
            roomId: this.current_room.id,
        }).then(function (res) {
            console.log(res);
        });
        this.message = '';
    };
    // Join a room
    MessagesComponent.prototype.joinRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.joinRoom({ roomId: roomID }).then(function (room) {
            _this.current_room = room;
            // After joining room, fetch messages
            _this.chatkitUser.fetchMultipartMessages({ roomId: roomID }).then(function (messages) {
                // Check if messages
                if (messages === undefined || messages.length === 0) {
                    return;
                }
                // Set read cursor
                _this.chatkitUser.setReadCursor({
                    roomId: _this.current_room.id,
                    position: messages[messages.length - 1].id
                })
                    .then(function () {
                    _this.roomNotifications[room.id] = false;
                }); // Remove marker from notifications array
                // .then(() => {
                //     console.log('Set cursor');
                //   })
                //   .catch(err => {
                //     console.log(`Error setting cursor: ${err}`);
                //   });
                messages.forEach(function (message) {
                    // console.log(message.parts[0].payload.content);
                });
                _this.room_messages = messages;
            });
        });
    };
    // end Join room
    // Function => check if user has unread messages in a room
    MessagesComponent.prototype.hasUnread = function (roomID) {
        var hasUnread = false; // Track return status
        // First, check if cursor exists
        var cursor = this.chatkitUser.readCursor({
            roomId: roomID
        });
        // if read cursor ID !== latest message ID...
        this.chatkitUser.fetchMultipartMessages({
            roomId: roomID,
            limit: 1,
        })
            .then(function (messages) {
            if (cursor) { // Has cursor so check cursor pos vs latest message id
                hasUnread = (cursor.position !== messages[0].initialId) ? true : false;
            }
            else {
                // No cursor => set
            }
        })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
        });
        return hasUnread;
    };
    // Get Chatkit user
    MessagesComponent.prototype.getUser = function (user_id) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/chatkit/getuser", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            return res;
            console.log(res);
        })
            .catch(function (error) { return console.log(error); });
    };
    // Get Chatkit user's rooms
    MessagesComponent.prototype.getUserRooms = function (user_id) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/chatkit/getuserrooms", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            // this.rooms = res;
            console.log(res);
            return res;
        })
            .catch(function (error) { return console.log(error); });
    };
    MessagesComponent.prototype.subscribeToRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    // When a message is received...
                    // Push to messages array and update view
                    _this.room_messages.push(message);
                    // Get the users last cursor position from the room
                    var cursor = _this.chatkitUser.readCursor({
                        roomId: message.roomId
                    });
                    if ((cursor.position !== message.id) && (message.roomId !== _this.current_room.id)) {
                        // If the current user has not seen the message, AND the message was received in a different room,
                        // add marker to notification array
                        _this.roomNotifications[message.room.id] = true;
                    }
                    else {
                        // Otherwise, message was sent in current room, so all we must do is update the
                        // read cursor for the current user's room
                        _this.chatkitUser.setReadCursor({
                            roomId: message.roomId,
                            position: message.id,
                        });
                    }
                    // Count rooms with unread notifucations
                    var roomsWithNotifications = 0;
                    _this.roomNotifications.forEach(function (room) {
                        roomsWithNotifications += room === true ? 1 : 0;
                    });
                    // Add to global notification counter
                    _this.msgService.setRoomsWithNotifications(roomsWithNotifications);
                },
                onAddedToRoom: function (room) {
                    console.log("Added to room " + room.name);
                }
            },
            messageLimit: 1
        });
    };
    // Create room
    MessagesComponent.prototype.createRoom = function () {
        var _this = this;
        this.roomCreated = true;
        return;
        // this.isLoading = true; // Display loading icon
        var roomName = this.formImport.value.roomNameGroup.roomName;
        var privateRoom = this.formImport.value.privateRoomGroup.privateRoom;
        var roomAvatar = this.formImport.value.importFileGroup.importFile;
        console.log(this.formImport.value.roomNameGroup.roomName);
        console.log(this.formImport.value.privateRoomGroup.privateRoom);
        console.log(this.formImport.value.importFileGroup.importFile);
        console.log(this.fileToUpload);
        console.log(this.formImport.value);
        var formData = new FormData();
        var b64string = JSON.stringify(this.imagePath);
        formData.append('file', b64string);
        formData.append('testvar', 'my test var value');
        console.log(formData);
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');
        // Create room and insert room avatar into database
        this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/asdf", formData)
            .toPromise()
            .then(function (res) {
            console.log(res);
            console.log('Image uploaded');
            _this.chatkitUser.createRoom({
                name: roomName,
                private: true,
                customData: { roomAvatar: res['_id'] },
            }).then(function (room) {
                // this.isLoading = false;
                _this.roomCreated = true;
                console.log("Created room called " + room.name);
            })
                .catch(function (err) {
                console.log("Error creating room " + err);
            });
        })
            .catch(function (err) {
            console.log('Error uploading room image');
        });
    };
    MessagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to new notifications
        this.msgService.notificationCount
            .subscribe(function (notification) { return _this.notificationCount = notification; });
        // TODO: Add this to an addUser function - only call when necessary
        this.msgService.chatManager
            .connect()
            .then(function (user) {
            console.log('Connected as user ', user);
            _this.chatkitUser = user;
            _this.rooms = user.rooms;
            // Iterate through rooms and subscribe to each
            _this.rooms.forEach(function (room) {
                _this.subscribeToRoom(room.id);
                // TODO: Check if room has read cursor and add `new` badge if not
            });
            // Join first room in array
            // TODO: refactor this implementation
            _this.chatkitUser.joinRoom({ roomId: _this.rooms[0].id }).then(function (room) {
                _this.current_room = room;
                // Fetch all messages for joined room
                _this.chatkitUser.fetchMultipartMessages({
                    roomId: _this.rooms[0].id,
                    limit: 10,
                }).then(function (messages) {
                    messages.forEach(function (message) {
                        console.log(message.parts[0].payload.content);
                    });
                    _this.room_messages = messages;
                });
            });
        })
            .catch(function (error) {
            console.error('error:', error);
        });
        // Get user id from local storage
        var user_id = JSON.parse(localStorage.getItem('currentUser'))._embedded.user.id;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('avatar'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], MessagesComponent.prototype, "avatar", void 0);
    MessagesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-messages',
            template: __webpack_require__(/*! ./messages.component.html */ "./src/app/messages/messages.component.html"),
            styles: [__webpack_require__(/*! ./messages.component.scss */ "./src/app/messages/messages.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_3__["MessagingService"]])
    ], MessagesComponent);
    return MessagesComponent;
}());



/***/ }),

/***/ "./src/app/rooms/rooms.component.html":
/*!********************************************!*\
  !*** ./src/app/rooms/rooms.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\" style=\"height:100vh;\">\r\n\r\n  <ng-container *ngIf=\"current_room\">\r\n    <app-top-bar [viewName]=\"'Rooms'\" [headerText]=\"current_room.name\"></app-top-bar>\r\n  </ng-container>\r\n\r\n  <ng-container *ngIf=\"!current_room\">\r\n    <app-top-bar [viewName]=\"'Rooms'\"></app-top-bar>\r\n  </ng-container>\r\n\r\n\r\n  <!--<button type=\"button\" class=\"ml-auto btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#addRoomModal\" (click)=\"roomCreated = false\" placement=\"left\" ngbTooltip=\"Create Room\" triggers=\"hover\" [autoClose]=\"true\">\r\n    <i class=\"fa fa-plus\"></i>\r\n  </button>-->\r\n\r\n  <!--<button type=\"button\" class=\"ml-auto btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#addRoomModal\" placement=\"left\" ngbTooltip=\"Edit Room\" triggers=\"hover\" [autoClose]=\"true\">\r\n    <i class=\"fa fa-cog\"></i>\r\n  </button>-->\r\n\r\n  <div class=\"row page-content\">\r\n    <div class=\"col-4 h-100 overflow-auto\">\r\n        \r\n          <!-- Begin rooms list -->\r\n          <div id=\"messages\" class=\"row\">\r\n            <ng-container *ngFor=\"let room of rooms\">\r\n                <div class=\"col-12\">\r\n                    <button class=\"btn btn-block custom-btn text-left mr-4 my-2 p-3\" (click)=\"joinRoom(room.id)\">\r\n                        <div class=\"room d-flex align-items-center justify-content-between\">\r\n                            <ng-container *ngIf=\"room?.custom_data !== undefined\">\r\n                                <div class=\"\" [ngStyle]=\"{ 'background-image': 'url(assets/avatars/' + room.customData.roomAvatar + ')', 'height':'50px', 'width':'50px', 'background-size':'cover', 'background-position':'center, center' }\">\r\n                                </div>\r\n                            </ng-container>\r\n                            <span class=\"text-secondary\">{{ room.name }}</span>\r\n                            <span *ngIf=\"roomNotifications[room.id]\" class=\"badge badge-secondary\">New</span>\r\n                          </div>\r\n                      </button>\r\n                  </div>\r\n            </ng-container>\r\n            <div *ngIf=\"(currentUser)\" class=\"col-12\">\r\n                <div class=\"message-wrap\">\r\n                  <img src=\"{{currentUser.avatarURL}}\" alt=\"\">\r\n                  <span>{{ currentUser.name }}</span>\r\n                </div>\r\n            </div>\r\n          </div>\r\n    </div>\r\n    <div class=\"col-8 h-100 overflow-auto\" style=\"background:#FAFDFF;\">\r\n      <div class=\"chat-window overflow-auto\" style=\"height: calc(100vh - 157px);\">\r\n        <ng-container *ngIf=\"room_messages\">\r\n          <div class=\"container\" appScrollToTop>\r\n            <div *ngFor=\"let message of room_messages\">\r\n              <div class=\"row\">\r\n                <!-- Messages -->\r\n                <div class=\"col-12\">\r\n                  <span>{{ current_room.userStore.users[message.senderId].name }}</span>\r\n                  <p style=\"color:#626e7a; font-size:15px;\">{{ message.parts[0].payload.content }}</p>\r\n                  <hr>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </ng-container>\r\n      </div>\r\n      <div class=\"chat-footer\" style=\"position: absolute; bottom: 0; left: 0; width: 100%;\">\r\n        <form (ngSubmit)='sendMessage()'>\r\n          <input placeholder=\"Type a message. Hit Enter to send\" type=\"text\" name=\"message\" [(ngModel)]=\"message\">\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <!-- Messages Header -->\r\n</div>\r\n\r\n<!-- Create room modal -->\r\n<div class=\"modal fade\" id=\"addRoomModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addRoomModal\" aria-hidden=\"true\">\r\n\r\n  <!-- Show success alert on room created -->\r\n  <div *ngIf=\"roomCreated\" class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\r\n        <strong>Success!</strong> Created room\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>  <!-- End success modal dialog -->\r\n\r\n  <div *ngIf=\"!roomCreated\" class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <!-- Modal Header -->\r\n      <div class=\"modal-header\">\r\n        <!-- Modal Title -->\r\n        <h5 class=\"modal-title\" id=\"exampleModalLabel\">Create Room</h5>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <!-- Add room form -->\r\n        <form (ngSubmit)='createRoom()' [formGroup]=\"formImport\" enctype=\"multipart/form-data\">\r\n          <!-- Room Name -->\r\n          <div class=\"form-group\" formGroupName=\"roomNameGroup\">\r\n            <label for=\"room_name\">Room name</label>\r\n            <input id=\"room_name\" formControlName=\"roomName\" placeholder=\"Enter a room name\" type=\"text\" class=\"form-control\" required>\r\n            <small id=\"roomNameHelp\" class=\"form-text text-muted\">A room name must be no longer than 60 characters.</small>\r\n          </div>\r\n          <!-- Private? -->\r\n          <div class=\"form-group\" formGroupName=\"privateRoomGroup\">\r\n            <div class=\"custom-control custom-switch\">\r\n              <input type=\"checkbox\" formControlName=\"privateRoom\" class=\"custom-control-input\" id=\"private_room\">\r\n              <label class=\"custom-control-label\" for=\"private_room\">Private room?</label>\r\n            </div>\r\n          </div>\r\n          <!-- Room Avatar -->\r\n          <div class=\"form-group\" formGroupName=\"userAvatarFileGroup\">\r\n            <div class=\"form-control-file\">\r\n              <div class=\"custom-file\">\r\n                <img src={{imagePath}} width=\"150\" alt=\"Thumb preview...\">\r\n                <input formControlName=\"avatar\" (change)=\"onFileChange($event)\" type=\"file\" accept=\".png, .jpg, .jpeg\" class=\"custom-file-input\" id=\"avatar\" #avatar>\r\n                <label class=\"custom-file-label\" for=\"avatar\">Choose file</label>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Submit -->\r\n          <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!formImport.valid\">Submit</button>\r\n        </form>\r\n      </div>\r\n      <!-- Modal Footer -->\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n        <button type=\"button\" class=\"btn btn-primary\">Save changes</button>\r\n      </div>\r\n    </div> <!-- End modal content -->\r\n  </div> <!-- End modal dialog -->\r\n</div> <!-- End modal -->\r\n"

/***/ }),

/***/ "./src/app/rooms/rooms.component.scss":
/*!********************************************!*\
  !*** ./src/app/rooms/rooms.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#messages_header {\n  background-color: #FFF;\n  z-index: 2;\n  font-family: 'Poppins', sans-serif;\n  font-weight: bold;\n  color: #94B0C0;\n  top: 0;\n  position: -webkit-sticky;\n  position: sticky; }\n\n#messages {\n  position: relative; }\n\n.message-wrap {\n  background: #F3F6F8;\n  padding: 16px 16px;\n  margin-top: 3px;\n  border-radius: 3px;\n  transition: 0.2s ease box-shadow;\n  position: relative; }\n\n.message-wrap:hover:after {\n    content: \"\";\n    position: absolute;\n    top: 0px;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    right: 0;\n    z-index: 1;\n    box-shadow: 0px 4px 12px rgba(21, 157, 246, 0.5); }\n\n.message-wrap #status {\n    font-size: 8px;\n    margin-left: 40px;\n    line-height: .005 !important; }\n\n.chat-footer form {\n  width: 100%;\n  display: flex;\n  padding-bottom: 40px;\n  padding-top: 20px; }\n\n.chat-footer {\n  background-color: #FFFFFF;\n  padding: inherit; }\n\n.chat-footer input {\n  width: 100%;\n  background: #FFFFFF;\n  /* Primary 25 */\n  border: 1px solid #C9EBFF;\n  box-sizing: border-box;\n  box-shadow: inset 0px 1px 3px rgba(21, 157, 246, 0.5);\n  border-radius: 3px;\n  font-style: normal;\n  font-weight: 600;\n  font-size: 14px;\n  line-height: normal;\n  letter-spacing: 0.75px;\n  padding: 10px;\n  color: #94B0C0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcm9vbXMvQzpcXHJ0YXJrb3dza2lcXE5NQ1xcWWVhciAyXFxTcHJpbmcgMjAxOVxcQ0lUIDI4MFxcQ2hhdHZlcnNpdHlcXENoYXR2ZXJzaXR5X0FwcC9zcmNcXGFwcFxccm9vbXNcXHJvb21zLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0JBQXFCO0VBQ3JCLFVBQVU7RUFDVixrQ0FBa0M7RUFDbEMsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCxNQUFLO0VBQ0wsd0JBQWdCO0VBQWhCLGdCQUFnQixFQUFBOztBQUdwQjtFQUNJLGtCQUFrQixFQUFBOztBQUl0QjtFQUVJLG1CQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixnQ0FBZ0M7RUFDaEMsa0JBQWlCLEVBQUE7O0FBUHJCO0lBV1EsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsU0FBUztJQUNULE9BQU87SUFDUCxXQUFXO0lBQ1gsUUFBUTtJQUNSLFVBQVU7SUFDVixnREFBZ0QsRUFBQTs7QUFuQnhEO0lBdUJRLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsNEJBQTRCLEVBQUE7O0FBS3BDO0VBQ0ksV0FBVztFQUNYLGFBQWE7RUFDYixvQkFBb0I7RUFDcEIsaUJBQWlCLEVBQUE7O0FBRXJCO0VBQ0kseUJBQXdCO0VBQ3hCLGdCQUFnQixFQUFBOztBQUVwQjtFQUNJLFdBQVU7RUFDVixtQkFBbUI7RUFDbkIsZUFBQTtFQUNBLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIscURBQXFEO0VBQ3JELGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLGFBQVk7RUFDWixjQUFjLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9yb29tcy9yb29tcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIiNtZXNzYWdlc19oZWFkZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjojRkZGO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIGZvbnQtZmFtaWx5OiAnUG9wcGlucycsIHNhbnMtc2VyaWY7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiAjOTRCMEMwO1xyXG4gICAgdG9wOjA7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG59XHJcblxyXG4jbWVzc2FnZXMge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG5cclxuLm1lc3NhZ2Utd3JhcCB7XHJcblxyXG4gICAgYmFja2dyb3VuZDojRjNGNkY4O1xyXG4gICAgcGFkZGluZzogMTZweCAxNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogM3B4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gICAgdHJhbnNpdGlvbjogMC4ycyBlYXNlIGJveC1zaGFkb3c7XHJcbiAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcclxuXHJcblxyXG4gICAgJjpob3ZlcjphZnRlciB7XHJcbiAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgYm90dG9tOiAwO1xyXG4gICAgICAgIGxlZnQ6IDA7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgcmlnaHQ6IDA7XHJcbiAgICAgICAgei1pbmRleDogMTtcclxuICAgICAgICBib3gtc2hhZG93OiAwcHggNHB4IDEycHggcmdiYSgyMSwgMTU3LCAyNDYsIDAuNSk7ICAgIFxyXG4gICAgfVxyXG5cclxuICAgICNzdGF0dXMge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogOHB4O1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiA0MHB4O1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAuMDA1ICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4uY2hhdC1mb290ZXIgZm9ybSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogNDBweDtcclxuICAgIHBhZGRpbmctdG9wOiAyMHB4O1xyXG59XHJcbi5jaGF0LWZvb3RlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiNGRkZGRkY7IFxyXG4gICAgcGFkZGluZzogaW5oZXJpdDtcclxufVxyXG4uY2hhdC1mb290ZXIgaW5wdXQge1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIGJhY2tncm91bmQ6ICNGRkZGRkY7XHJcbiAgICAvKiBQcmltYXJ5IDI1ICovXHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjQzlFQkZGO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIGJveC1zaGFkb3c6IGluc2V0IDBweCAxcHggM3B4IHJnYmEoMjEsIDE1NywgMjQ2LCAwLjUpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgICBsZXR0ZXItc3BhY2luZzogMC43NXB4O1xyXG4gICAgcGFkZGluZzoxMHB4O1xyXG4gICAgY29sb3I6ICM5NEIwQzA7XHJcbn1cclxuIl19 */"

/***/ }),

/***/ "./src/app/rooms/rooms.component.ts":
/*!******************************************!*\
  !*** ./src/app/rooms/rooms.component.ts ***!
  \******************************************/
/*! exports provided: RoomsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoomsComponent", function() { return RoomsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/_services/messaging.service */ "./src/app/Core/_services/messaging.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var RoomsComponent = /** @class */ (function () {
    //
    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
    //
    function RoomsComponent(http, msgService) {
        this.http = http;
        this.msgService = msgService;
        this.selectedFile = null;
        this.fd = new FormData();
        this.rooms = [];
        this.room_messages = [];
        this._message = '';
        this.roomNotifications = [];
        // _roomName = '';
        // get roomName(): string {
        //   return this._roomName;
        // }
        // set roomName(value: string) {
        //   this._roomName = value;
        // }
        // TODO: Can probably remove these props
        this._roomPrivate = '';
        this.formImport = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
            userAvatarFileGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                avatar: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](''),
            }),
            roomNameGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                roomName: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(60)
                ])
            }),
            privateRoomGroup: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
                privateRoom: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('')
            })
        });
    }
    Object.defineProperty(RoomsComponent.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoomsComponent.prototype, "roomPrivate", {
        get: function () {
            return this._roomPrivate;
        },
        set: function (value) {
            this._roomPrivate = value;
        },
        enumerable: true,
        configurable: true
    });
    RoomsComponent.prototype.onFileChange = function (event) {
        if (!(event.target.files && event.target.files[0])) {
            return;
        }
        this.selectedFile = event.target.files[0];
        this.fd.append('avatar', this.selectedFile, this.selectedFile.name);
        // this.fileToUpload = file;
        // const reader = new FileReader();
        // reader.readAsDataURL(file); // read file as data url
        // reader.onload = (_event) => {
        //   console.log(reader.result); // log base64 string
        //   this.imagePath = reader.result;
        // };
    };
    //
    // ─── SEND A MESSAGE ─────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.sendMessage = function () {
        var _a = this, message = _a.message, currentUser = _a.currentUser;
        this.chatkitUser.sendMessage({
            text: message,
            roomId: this.current_room.id,
        }).then(function (res) {
            console.log(res);
        });
        this.message = '';
    };
    // ─────────────────────────────────────────────────────────────────
    // Join a room
    RoomsComponent.prototype.joinRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.joinRoom({ roomId: roomID }).then(function (room) {
            _this.current_room = room;
            console.log(_this.current_room);
            // After joining room, fetch messages
            _this.chatkitUser.fetchMultipartMessages({ roomId: roomID }).then(function (messages) {
                // Check if messages
                if (messages === undefined || messages.length === 0) {
                    return;
                }
                // Set read cursor
                _this.chatkitUser.setReadCursor({
                    roomId: _this.current_room.id,
                    position: messages[messages.length - 1].id
                })
                    .then(function () {
                    _this.roomNotifications[room.id] = false;
                }); // Remove marker from notifications array
                // .then(() => {
                //     console.log('Set cursor');
                //   })
                //   .catch(err => {
                //     console.log(`Error setting cursor: ${err}`);
                //   });
                messages.forEach(function (message) {
                    // console.log(message.parts[0].payload.content);
                    // console.log(message);
                });
                _this.room_messages = messages;
            });
        });
    };
    // end Join room
    // Function => check if user has unread messages in a room
    RoomsComponent.prototype.hasUnread = function (roomID) {
        var hasUnread = false; // Track return status
        // First, check if cursor exists
        var cursor = this.chatkitUser.readCursor({
            roomId: roomID
        });
        // if read cursor ID !== latest message ID...
        this.chatkitUser.fetchMultipartMessages({
            roomId: roomID,
            limit: 1,
        })
            .then(function (messages) {
            if (cursor) { // Has cursor so check cursor pos vs latest message id
                hasUnread = (cursor.position !== messages[0].initialId) ? true : false;
            }
            else {
                // No cursor => set
            }
        })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
        });
        return hasUnread;
    };
    //
    // ─── GET CHATKIT USER ───────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.getUser = function (user_id) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/chatkit/getuser", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            return res;
            console.log(res);
        })
            .catch(function (error) { return console.log(error); });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── GET CHATKIT USERS ROOMS ────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.getUserRooms = function (user_id) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/chatkit/getuserrooms", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            // this.rooms = res;
            console.log(res);
            return res;
        })
            .catch(function (error) { return console.log(error); });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── SUBSCRIBE TO ROOM ──────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.subscribeToRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    // When a message is received...
                    // Push to messages array and update view
                    _this.room_messages.push(message);
                    // Scroll chat window to reveal latest message
                    // Get the users last cursor position from the room
                    var cursor = _this.chatkitUser.readCursor({
                        roomId: message.roomId
                    });
                    if ((cursor.position !== message.id) && (message.roomId !== _this.current_room.id)) {
                        // If the current user has not seen the message, AND the message was received in a different room,
                        // add marker to notification array
                        _this.roomNotifications[message.room.id] = true;
                    }
                    else {
                        // Otherwise, message was sent in current room, so all we must do is update the
                        // read cursor for the current user's room
                        _this.chatkitUser.setReadCursor({
                            roomId: message.roomId,
                            position: message.id,
                        });
                    }
                    // Count rooms with unread notifucations
                    var roomsWithNotifications = 0;
                    _this.roomNotifications.forEach(function (room) {
                        roomsWithNotifications += room === true ? 1 : 0;
                    });
                    // Add to global notification counter
                    _this.msgService.setRoomsWithNotifications(roomsWithNotifications);
                },
                onAddedToRoom: function (room) {
                    console.log("Added to room " + room.name);
                }
            },
            messageLimit: 1
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── CREATE ROOM ────────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.createRoom = function () {
        var _this = this;
        var roomName = this.formImport.value.roomNameGroup.roomName;
        var roomAvatar = '';
        // TODO: Add this to upload service
        // Upload image
        this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + "/rooms/avatar", this.fd)
            .toPromise()
            .then(function (avatar) {
            roomAvatar = avatar['filename']; // Store path
            console.log(roomAvatar);
            // Create the room
            _this.chatkitUser.createRoom({
                name: roomName,
                private: false,
                customData: { roomAvatar: roomAvatar },
            }).then(function (room) {
                _this.rooms.push(room); // Add the new room to the list
                _this.roomCreated = true;
                console.log(room);
                console.log("Created room called " + room.name);
            })
                .catch(function (err) {
                console.log("Error creating room " + err);
            });
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    RoomsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to new notifications
        this.msgService.notificationCount
            .subscribe(function (notification) { return _this.notificationCount = notification; });
        // TODO: Add this to an addUser function - only call when necessary
        this.msgService.chatManager
            .connect()
            .then(function (user) {
            console.log('Connected as user ', user);
            _this.chatkitUser = user;
            _this.rooms = user.rooms;
            // Iterate through rooms and subscribe to each
            _this.rooms.forEach(function (room) {
                _this.subscribeToRoom(room.id);
                // TODO: Check if room has read cursor and add `new` badge if not
            });
            // Join first room in array
            // TODO: refactor this implementation
            _this.chatkitUser.joinRoom({ roomId: _this.rooms[0].id }).then(function (room) {
                _this.current_room = room;
                // Fetch all messages for joined room
                _this.chatkitUser.fetchMultipartMessages({
                    roomId: _this.rooms[0].id,
                    limit: 10,
                }).then(function (messages) {
                    messages.forEach(function (message) {
                        console.log(message.parts[0].payload.content);
                    });
                    _this.room_messages = messages;
                });
            });
        })
            .catch(function (error) {
            console.error('error:', error);
        });
        // Get user id from local storage
        var user_id = JSON.parse(localStorage.getItem('currentUser'))._embedded.user.id;
    };
    RoomsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-rooms',
            template: __webpack_require__(/*! ./rooms.component.html */ "./src/app/rooms/rooms.component.html"),
            styles: [__webpack_require__(/*! ./rooms.component.scss */ "./src/app/rooms/rooms.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _Core_services_messaging_service__WEBPACK_IMPORTED_MODULE_3__["MessagingService"]])
    ], RoomsComponent);
    return RoomsComponent;
}());



/***/ }),

/***/ "./src/app/scroll-to-top.directive.ts":
/*!********************************************!*\
  !*** ./src/app/scroll-to-top.directive.ts ***!
  \********************************************/
/*! exports provided: ScrollToTopDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScrollToTopDirective", function() { return ScrollToTopDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ScrollToTopDirective = /** @class */ (function () {
    function ScrollToTopDirective(el) {
        el.nativeElement.style.backgroundColor = 'yellow';
        console.log(el.nativeElement.offsetHeight);
    }
    ScrollToTopDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appScrollToTop]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], ScrollToTopDirective);
    return ScrollToTopDirective;
}());



/***/ }),

/***/ "./src/environments/environment.prod.ts":
/*!**********************************************!*\
  !*** ./src/environments/environment.prod.ts ***!
  \**********************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    apiUrl: 'http://localhost:3200',
    chatkitTestTokenEndpoint: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5',
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    apiUrl: 'http://localhost:3200',
    chatkitTestTokenEndpoint: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5',
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\rtarkowski\NMC\Year 2\Spring 2019\CIT 280\Chatversity\Chatversity_App\src\main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!**********************!*\
  !*** xhr2 (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map