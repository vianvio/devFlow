// 'use strict'

// /**
//  * IDA
//  *
//  * Description
//  */
// angular.module('devCooperation')
//   .config(['$provide', function($provide) {
//     $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
//   }])
//   .run(function($httpBackend) {
//     var clients = [{
//       clientId: 1,
//       clientName: 'ABC ChemicalsABC Chemicalabc defGasdfasdfh',
//       detailSuperscript: 1,
//       arrSessions: [{
//         name: 'Director of Manufacturing',
//         businessUnit: 'Manufacturing',
//         owner: 'Jane Smith',
//         createdOn: '08/06/2015',
//         numConsultant: 4,
//         numQuestion: 5
//       }, {
//         name: 'Director of Test',
//         businessUnit: 'Test',
//         owner: 'Green Smith',
//         createdOn: '08/20/2015',
//         numConsultant: 2000,
//         numQuestion: 1000
//       }, {
//         name: 'Director of Manufacturing',
//         businessUnit: 'Manufacturing',
//         owner: 'Jane Smith',
//         createdOn: '08/06/2015',
//         numConsultant: 4,
//         numQuestion: 5
//       }, {
//         name: 'Director of Test',
//         businessUnit: 'Test',
//         owner: 'Green Smith',
//         createdOn: '08/20/2015',
//         numConsultant: 2000,
//         numQuestion: 1000
//       }, {
//         name: 'Director of Test',
//         businessUnit: 'Test',
//         owner: 'Green Smith',
//         createdOn: '08/20/2015',
//         numConsultant: 2000,
//         numQuestion: 1000
//       }],
//       arrDecisions: []
//     }, {
//       clientId: 2,
//       clientName: 'CDEFGHIJ Chemicals'
//     }];

//     var sessionTree = [{
//       "categoryId": 1,
//       "categoryName": "Strategy",
//       "childrenAreas": [{
//         "areaId": 1,
//         "areaName": "Strategy Priorities",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 7,
//         "areaName": "Competitors",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 11,
//         "areaName": "Channels",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 15,
//         "areaName": "Risks",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }]
//     }, {
//       "categoryId": 2,
//       "categoryName": "Functional",
//       "childrenAreas": [{
//         "areaId": 18,
//         "areaName": "Materies",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 20,
//         "areaName": "Products",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 24,
//         "areaName": "Logistics",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 26,
//         "areaName": "Markets-Channels",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }, {
//         "areaId": 29,
//         "areaName": "Customers",
//         "level": 1,
//         "levelNum": 0,
//         "parentAreaId": 0
//       }]
//     }];

//     var users = [{
//       'id': 1,
//       'guid': "am1",
//       'password': "am1"
//     }, {
//       'id': 2,
//       'guid': "am2",
//       'password': "am2"
//     }];

//     var areaAndQuestions = [{
//       "areaId": 2,
//       "categoryId": 1,
//       "level": 2,
//       "levelNum": 1,
//       "parentId": 1,
//       "areaName": "Priorities",
//       "questionList": [{
//         "questionId": 1,
//         "questionText": "What are the companies logistics strategy priorities in the next 5 years ?",
//         "questionType": 1
//       }, {
//         "questionId": 2,
//         "questionText": "......",
//         "questionType": 2
//       }]
//     }, {
//       "areaId": 3,
//       "categoryId": 1,
//       "level": 2,
//       "levelNum": 1,
//       "parentId": 1,
//       "areaName": "Order Management", //"Profitability",
//       "questionList": [{
//         "questionId": 3,
//         "questionText": "......",
//         "questionType": 2
//       }, {
//         "questionId": 4,
//         "questionText": "......",
//         "questionType": 2
//       }]
//     }];

//     $httpBackend.whenPOST('/login/').respond(function(method, url, data) {
//       var loginUser = angular.fromJson(data);
//       var validUsers = users.filter(function(user) {
//         if (loginUser.username === user.username && loginUser.password === user.password) {
//           user.token = "123456";
//           return user;
//         } else {
//           return null;
//         }
//       });

//       if (validUsers.length != 0) {
//         return [200, validUsers[0], {}];
//       } else {
//         return [401, "login failed", {}];
//       }
//     });

//     $httpBackend.whenGET(/\.html/).passThrough();
//     $httpBackend.whenGET('/getClientList/').respond(clients);
//     $httpBackend.whenGET('/session/').respond(sessionTree);
//     $httpBackend.whenGET('/question/').respond(areaAndQuestions);
//   });
