
var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])


.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    
   
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB({ name : "myData.db"});
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS user ( username TEXT NOT NULL PRIMARY KEY, password TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, middle_name TEXT NOT NULL, branch_id INTEGER NOT NULL, age INTEGER NOT NULL, gender TEXT NOT NULL, mobile TEXT NOT NULL, email TEXT NOT NULL, address TEXT NOT NULL, type TEXT NOT NULL, photo TEXT, date_of_birth TEXT NOT NULL, allow INTEGER NOT NULL DEFAULT 0)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS student ( student_id TEXT NOT NULL PRIMARY KEY, student_roll TEXT NOT NULL, student_name TEXT NOT NULL, branch_id TEXT NOT NULL, semester TEXT NOT NULL, batch_id TEXT NOT NULL, email TEXT NOT NULL, gender TEXT NOT NULL, phone_no TEXT NOT NULL, photo TEXT NOT NULL, date_of_birth TEXT NOT NULL, academic_id TEXT, current_academic_id TEXT, email2 TEXT, parent_name TEXT, parent_contact TEXT, parent_email TEXT)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS university (university_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, university_name TEXT NOT NULL,established_in TEXT NOT NULL,contact_phone TEXT NOT NULL, contact_email TEXT NOT NULL)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS branch (branch_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, branch_name TEXT NOT NULL, hod_id TEXT NOT NULL, college_id TEXT NOT NULL, no_of_semesters TEXT NOT NULL)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS college (college_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, college_name TEXT NOT NULL, college_address TEXT NOT NULL,contact_phone INTEGER NOT NULL,contact_email TEXT NOT NULL,university_id INTEGER NOT NULL)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS subject (sub_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, sub_name TEXT NOT NULL, sub_short TEXT NOT NULL, branch_id TEXT NOT NULL, semester TEXT NOT NULL, sub_type TEXT NOT NULL DEFAULT Compulsory)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS attendance (attendance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, timetable_id TEXT, attendance_date DATE NOT NULL, present_students TEXT, submited_by TEXT NOT NULL, submited_on DATE NOT NULL, SubjectName TEXT NOT NULL, ChapterNo TEXT NOT NULL, TopicTitle TEXT, Time_Slot TEXT, Batch TEXT, bat_absent TEXT, bat_unassign TEXT, remarks TEXT)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS student_elective (seid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, student_id TEXT NOT NULL, sub_id INTEGER NOT NULL, elective_no TEXT NOT NULL, semester INTEGER NOT NULL, branch_id INTEGER NOT NULL)');
    
    });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
       controller: 'welcomeCtrl'
        
      }
    )


  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
       controller: 'AppCtrl'
        
      }
    )

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

   .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller:'searchCtrl'
      }
    }
  })

   .state('app.display', {
    url: '/display/:branch & :subject &:sem & :chap_num & :topic_title & :date & :batch',
    views: {
      'menuContent': {
        templateUrl: 'templates/display.html',
        controller:'displayCtrl'
        
      }
    }
  })

   .state('app.batch_display', {
    url: '/batch_display/:branch & :subject &:sem & :chap_num & :topic_title & :date & :batch',
    views: {
      'menuContent': {
        templateUrl: 'templates/batch_display.html',
        controller:'batch_displayCtrl'
        
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller:'browseCtrl'
        }
      }
    })
  .state('app.data', {
      url: '/data',
      views: {
        'menuContent': {
          templateUrl: 'templates/data.html',  
          controller:'dataCtrl'
        }
      }
    })

  .state('app.view', {
      url: '/view',
      views: {
        'menuContent': {
          templateUrl: 'templates/view.html',  
          controller:'viewCtrl'
        }
      }
    })

  .state('app.add', {
      url: '/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/add.html',  
          controller:'addCtrl'
        }
      }
    })

  .state('app.sync', {
      url: '/sync',
      views: {
          'menuContent': {
          templateUrl: 'templates/sync.html',
          controller:'syncCtrl'
          
        }
      }
    })

  .state('app.aboutus', {
      url: '/aboutus',
      views: {
          'menuContent': {
          templateUrl: 'templates/aboutus.html'
        }
      }
    })
    .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: 'templates/logout.html',
          controller: 'LogoutCtrl'
        }
      }
    });
    
  $urlRouterProvider.otherwise('/welcome');
});
