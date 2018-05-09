
angular.module('starter.controllers', [])

.controller('welcomeCtrl', function($scope,$state,$cordovaSQLite,$ionicPlatform,$ionicHistory) {

  $ionicPlatform.on('deviceready', function(){
     var query_login = "SELECT * FROM user";
     $cordovaSQLite.execute(db,query_login,[]).then(function(result){
      if(result.rows.length > 0){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.browse');
      }
      else{
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');

      }
     }, function(error){
        var alertPopup = $ionicPopup.alert({
         title: 'Error',
         template: 'Error :' + error.message
       });

     });
     
    });

  
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$http,$cordovaSQLite,$ionicPlatform,$ionicPopup, $state, $cordovaSQLite) {

  $scope.loginData = {};


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

     
          $http({
          method: 'post',
          data : $scope.loginData,
          url: 'http://192.168.43.46:8084/WebApplication2/MySQLConnect',
          headers: {
            'Content-Type': undefined,
            'origin' : '*'
            }
            }).then(function successCallback(response) {
             console.log(response.data.Status);
             if(response.data.Status==1){
              
                var query = "INSERT INTO user (username,password,first_name,last_name,middle_name,branch_id,age,gender,mobile,email,address,type,photo,date_of_birth,allow) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                console.log(query);
                $cordovaSQLite.execute(db,query,[response.data.username,response.data.password,response.data.first_name,response.data.last_name,response.data.middle_name,response.data.branch_id,response.data.age,response.data.gender,response.data.mobile,response.data.email,response.data.address,response.data.type,response.data.photo,response.data.date_of_birth,response.data.allow]);
              
              console.log(response.data.username);
              $state.go('app.browse');
            }
            else{
               var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            })
               $state.go('login');
            }
          })

  }


})

.controller('LogoutCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup) {

  $scope.alert = function(){
                var alertPopup = $ionicPopup.alert({
                title: 'Require',
                template: 'If you Logout than You must Require Internet Connection to Login Again!'
                })
  }
  $scope.logout = function(){

        query_logout = "delete from user";
        $cordovaSQLite.execute(db,query_logout,[]);
        $state.go('login');
     }
  
  $scope.cancel = function(){
    $state.go('app.browse');
  }
})

.controller('dataCtrl', function($scope,$state,$cordovaSQLite) {

  
})

.controller('viewCtrl', function($scope,$ionicHistory,$state,$stateParams,$cordovaSQLite,$ionicPopup) {

  $scope.datafetch = function(){
  $scope.datalist =[];
   
        var query = "select college_name,branch_name,branch_id,university_name from (select college_name,c.college_id,branch_name,branch_id,university_id from college c join branch b on c.college_id=b.college_id) as x,university as u where x.university_id=u.university_id";
        $cordovaSQLite.execute(db,query,[])
        .then(function(response) {
          console.log(response.rows.length);
          if(response.rows.length==0){
            var alertPopup = $ionicPopup.alert({
                title: 'Empty Record',
                template: 'You don\'t have any record!'
            
            })
             $ionicHistory.nextViewOptions({
            disableBack: true
            });
          
            $state.go('app.data');


          }else{

          for(var i = 0; i < response.rows.length;i++){
                        $scope.datalist.push({
                          college_name: response.rows.item(i).college_name,
                          branch_name: response.rows.item(i).branch_name,
                          branch_id: response.rows.item(i).branch_id,
                          university_name: response.rows.item(i).university_name
                        });
          }
        }

    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
}

$scope.delete = function(branchId){
  console.log(branchId);

        var query = "delete from student where branch_id=?";
        $cordovaSQLite.execute(db,query,[branchId])
        .then(function(response) {
          console.log(response);
          var query = "delete from branch where branch_id=?";
          $cordovaSQLite.execute(db,query,[branchId])
          .then(function(response) {
            var alertPopup = $ionicPopup.alert({
                title: 'Delete',
                template: 'Successful Delete!'
            })
            $ionicHistory.nextViewOptions({
            disableBack: true
            });
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
          
          $state.go('app.data');
          $scope.datafetch();
            
          },function(err) {
                var alertPopup = $ionicPopup.alert({
                title: 'error1',
                template: 'Error1!'
            
    })
})


    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
}

  
}
)

.controller('syncCtrl', function($scope,$state,$cordovaSQLite,$http,$ionicPopup,$ionicHistory) {
$scope.sync_list=[];
$scope.parent_sync={};

  $scope.alert = function(){
                var alertPopup = $ionicPopup.alert({
                title: 'Require',
                template: 'For Sync You must Require Internet Connection!'
                })
  }
  $scope.sync = function(){

        query_sync = "SELECT * FROM attendance";
        $cordovaSQLite.execute(db,query_sync,[])

       .then(function(response) {
        if(response.rows.length==0){
          var alertPopup = $ionicPopup.alert({
                title: 'No Sync Needed',
                template: 'There is no any data to Sync!'
                })
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.browse');

        }
        else{
          for(var i = 0; i < response.rows.length;i++){
                                            
                        $scope.sync_list.push({
                          attendance_date: response.rows.item(i).attendance_date,
                          present_students: response.rows.item(i).present_students,
                          submited_by: response.rows.item(i).submited_by,
                          submited_on: response.rows.item(i).submited_on,
                          SubjectName: response.rows.item(i).SubjectName,
                          ChapterNo: response.rows.item(i).ChapterNo,
                          TopicTitle: response.rows.item(i).TopicTitle,
                          Batch: response.rows.item(i).Batch,
                          bat_absent: response.rows.item(i).bat_absent,
                          bat_unassign: response.rows.item(i).bat_unassign

                        })
                        $scope.parent_sync = $scope.sync_list[i];

                          $http({
                          method : 'post',
                          data: $scope.parent_sync,
                          headers: {
                          'Content-Type': undefined,
                          'origin' : '*'
                          },
                          url : 'http://192.168.43.46:8084/WebApplication2/Insert'
                  }).success(function(response) {
                    query_delete = "delete from attendance";
                    $cordovaSQLite.execute(db,query_delete,[]);

                    var alertPopup = $ionicPopup.alert({
                    title: 'Successful',
                    template: 'Sync Complete!'
                    })

                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    


                    $state.go('app.browse');

                    })
                         
                  .error(function() {

                    var alertPopup = $ionicPopup.alert({
                    title: 'Unsuccessful',
                    template: 'Sync Failed!'
                    })
                          
                  });
          }
        }
    })
     
     }
  
  $scope.cancel = function(){
    $state.go('app.browse');
  }
})

.controller('searchCtrl', function($scope, $ionicModal, $ionicPopup ,$state, $http,$stateParams,$cordovaSQLite,$ionicHistory) {

 

  $scope.doUniversity = function(){
  $scope.list =[];
   
        var query = "select college_name,branch_name,branch_id,university_name from (select college_name,c.college_id,branch_name,branch_id,university_id from college c join branch b on c.college_id=b.college_id) as x,university as u where x.university_id=u.university_id";
        console.log(query);
        $cordovaSQLite.execute(db,query,[])
        .then(function(response) {
          if(response.rows.length==0){
             var alertPopup = $ionicPopup.alert({
                title: 'Nothing to Display',
                template: 'You don\'t add any class Data! Please go to Manage Data!'
              })
              $ionicHistory.nextViewOptions({
              disableBack: true
              });
             $state.go('app.browse');
          }
          else{

          for(var i = 0; i < response.rows.length;i++){
                        $scope.list.push({
                          college_name: response.rows.item(i).college_name,
                          branch_name: response.rows.item(i).branch_name,
                          branch_id: response.rows.item(i).branch_id,
                          university_name: response.rows.item(i).university_name
                        });
          }
        }

    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
}

  $scope.doSub = function(){
    $scope.subjectlist = [];

        query = "SELECT * FROM subject  WHERE branch_id=? and semester=?";
        $cordovaSQLite.execute(db,query,[$scope.fetchData.branch,$scope.fetchData.sem])
        .then(function(response) {
          if(response.rows.length==0){
            var alertPopup = $ionicPopup.alert({
                title: 'Data Error',
                template: 'You don\'t have Selected Semester Data'
            
            })
            $state.go('app.search');

          }
          else{

          for(var i = 0; i < response.rows.length;i++){
                        $scope.subjectlist.push({
                          sub_id: response.rows.item(i).sub_id,
                          sub_name: response.rows.item(i).sub_name,
                          sub_short: response.rows.item(i).sub_short,
                          sub_type: response.rows.item(i).sub_type
                        });
          }
        }

    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
}

  $scope.fetchData = [];
   $scope.doFetch = function() {
    $scope.fetchData.date = document.getElementById('getDate').value;
    if($scope.fetchData.date==null || $scope.fetchData.branch==null || $scope.fetchData.sem==null || $scope.fetchData.type==null || $scope.fetchData.subject==null || $scope.fetchData.chap_num==null){
      var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'You must Enter All the Require Field'
    })
    }
    else{
 
    if($scope.fetchData.type == "all"){
    $state.go('app.display',{date : $scope.fetchData.date, branch : $scope.fetchData.branch, sem: $scope.fetchData.sem,subject : $scope.fetchData.subject,chap_num : $scope.fetchData.chap_num,topic_title: $scope.fetchData.topic_title,batch:$scope.fetchData.type});
    }
    else{
    $state.go('app.batch_display',{date : $scope.fetchData.date, branch : $scope.fetchData.branch, sem: $scope.fetchData.sem,subject : $scope.fetchData.subject,chap_num : $scope.fetchData.chap_num,topic_title: $scope.fetchData.topic_title,batch:$scope.fetchData.type});
    }
  }
  }
})

.controller('displayCtrl', function($scope, $stateParams,$state,$http,$ionicHistory,$cordovaSQLite,$ionicPopup) {

  $scope.list = [];
  $scope.doDisplay = function(){
        query = "SELECT sub_type FROM subject WHERE sub_id=?";
        $cordovaSQLite.execute(db,query,[$stateParams.subject])
        .then(function(response) {
          if(response.rows.item(0).sub_type == "Compulsory"){
            query = "SELECT * FROM student WHERE branch_id=? AND semester=?";
            $cordovaSQLite.execute(db,query,[$stateParams.branch,$stateParams.sem])

            .then(function(response) {
            for(var i = 0; i < response.rows.length;i++){
                        $scope.list.push({
                          student_id: response.rows.item(i).student_id,
                          student_name: response.rows.item(i).student_name
                        });
            }
            },function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
             })
            })
          }
          else{
            query = "SELECT s.student_id,s.student_name FROM student s join student_elective e on s.student_id=e.student_id WHERE e.branch_id=? AND e.semester=? AND e.sub_id=?";
            $cordovaSQLite.execute(db,query,[$stateParams.branch,$stateParams.sem,$stateParams.subject])

            .then(function(response) {
            for(var i = 0; i < response.rows.length;i++){

              $scope.list.push({
                  student_id: response.rows.item(i).student_id,
                  student_name: response.rows.item(i).student_name
              });

            }
            },function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'hi',
                template: 'Hi!'
            
             })
            })

          }

          
        },function(err) {
        var alertPopup = $ionicPopup.alert({
                title: 'hiee',
                template: 'HIee!'
            
        })
        })

        

     }
    var user;
     $scope.check= function(data) { 
    var arr = [];
    for(var i in data){
       if(data[i].SELECTED==true){
           arr.push(data[i].student_id);
       }
    }
    
   
    var query = "SELECT * FROM user";
    
        $cordovaSQLite.execute(db,query,[])
        .then(function(response) {
          user = response.rows.item(0).username;
          var query_attend = "INSERT INTO attendance (attendance_date,present_students,submited_by,submited_on,SubjectName,ChapterNo,TopicTitle,Batch,bat_absent,bat_unassign) VALUES (?,?,?,?,?,?,?,?,?,?);";
          $cordovaSQLite.execute(db,query_attend,[$stateParams.date,arr.join(),user,$stateParams.date,$stateParams.subject,$stateParams.chap_num,$stateParams.topic_title,$stateParams.batch,"",""]);
    
          var alertPopup = $ionicPopup.alert({
                title: 'Successful',
                template: 'Success!'
            
          })
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          
          $state.go('app.browse');
         
        },function(err) {
          var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
   
}
     
})

.controller('batch_displayCtrl', function($scope, $stateParams,$state,$http,$ionicHistory,$cordovaSQLite,$ionicPopup) {

  $scope.list = [];
  $scope.unassign_list = [];
  
  $scope.doDisplay = function(){
        query = "SELECT * FROM student WHERE branch_id=? AND semester=? AND batch_id=?";
        $cordovaSQLite.execute(db,query,[$stateParams.branch,$stateParams.sem,$stateParams.batch])

       .then(function(response) {
          for(var i = 0; i < response.rows.length;i++){
                        $scope.list.push({
                          student_id: response.rows.item(i).student_id,
                          student_name: response.rows.item(i).student_name
                        });
          }
    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
         query = "SELECT * FROM student WHERE branch_id=? AND semester=? AND batch_id != ?";
        $cordovaSQLite.execute(db,query,[$stateParams.branch,$stateParams.sem,$stateParams.batch])

       .then(function(response) {
          for(var i = 0; i < response.rows.length;i++){
                        $scope.unassign_list.push({
                          student_id: response.rows.item(i).student_id,
                          student_name: response.rows.item(i).student_name
                        });
          }
    },function(err) {
      var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})

     }
    var user;
     $scope.check= function(data,u_data) { 
    var arr = [];
    var arr_ab = [];
    var arr_un = [];
    for(var i in data){
       if(data[i].SELECTED==true){
           arr.push(data[i].student_id);
       }
       else{
        arr_ab.push(data[i].student_id);
       }
    }

    for(var i in u_data){
        console.log(u_data[i].unassign);
       if(u_data[i].unassign =="P"){
           arr.push(u_data[i].student_id);
       }
       else if(u_data[i].unassign =="A"){
        arr_ab.push(u_data[i].student_id);
       }
       else{
        arr_un.push(u_data[i].student_id);
       }
    }
    
    var query = "SELECT * FROM user";
    
        $cordovaSQLite.execute(db,query,[])
        .then(function(response) {
          user = response.rows.item(0).username;
          var query_attend = "INSERT INTO attendance (attendance_date,present_students,submited_by,submited_on,SubjectName,ChapterNo,TopicTitle,Batch,bat_absent,bat_unassign) VALUES (?,?,?,?,?,?,?,?,?,?);";
          $cordovaSQLite.execute(db,query_attend,[$stateParams.date,arr.join(),user,$stateParams.date,$stateParams.subject,$stateParams.chap_num,$stateParams.topic_title,"bat",arr_ab.join(),arr_un.join()]);
    
          var alertPopup = $ionicPopup.alert({
                title: 'Successful',
                template: 'Success!'
            
          })
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          
          $state.go('app.browse');
         
        },function(err) {
          var alertPopup = $ionicPopup.alert({
                title: 'error',
                template: 'Error!'
            
    })
})
   
}
     
})


.controller('browseCtrl', function($scope, $ionicModal,$ionicHistory, $ionicPopup,$state, $http,$stateParams,$cordovaSQLite) {
  
})

.controller('addCtrl', function($scope, $ionicModal, $ionicPopup,$state, $http,$stateParams,$cordovaSQLite) {
  
 

  $scope.doUni = function(){

    $http({
            method : 'post',
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/University'
    }).success(function(response) {
            
            $scope.list = response;
            
    }).error(function() {
      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of University'
            })
            
    });
}


  $scope.doCol = function(){
 
  $scope.university={
         "university_id" : $scope.fetchData.university 
  };
    
   
    $http({
            method : 'post',
            data: $scope.university,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/College'
    }).success(function(response) {

            $scope.collist = response;

    }).error(function() {

      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of College'
            })
            
    });
}


  $scope.doBranch = function(){
 
  $scope.college={
         "college_id" : $scope.fetchData.college 
  };
    
    $http({
            method : 'post',
            data: $scope.college,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/Branch'
    }).success(function(response) {

            $scope.branchlist = response;
            
    }).error(function() {
      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of Branch'
            })
            
    });
}

  $scope.doSub = function(){
    console.log($scope.fetchData.sem);
 
  $scope.branch={
         "branch_id" : $scope.fetchData.branch,
         "semester" : $scope.fetchData.sem
  };
  console.log($scope.fetchData.sem);
    

    $http({
            method : 'post',
            data: $scope.branch,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/Subject'
    }).success(function(response) {

            $scope.subjectlist = response;
            for (var i=0; i<response.length; i++){
            var query = "INSERT INTO subject (sub_id,sub_name,sub_short,branch_id,semester,sub_type) VALUES (?,?,?,?,?,?);";
            $cordovaSQLite.execute(db,query,[response[i].sub_id,response[i].sub_name,response[i].sub_short,response[i].branch_id,response[i].semester,response[i].sub_type]);
            }
            
    }).error(function() {
      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of Subject'
            })
            
    });
}



  $scope.fetchData = {};
   $scope.doAdd = function() {
    console.log($scope.fetchData.sem);
    console.log($scope.fetchData.college);
    console.log($scope.fetchData.university);
    console.log($scope.fetchData.branch);
    if($scope.fetchData.sem==null||$scope.fetchData.branch==null||$scope.fetchData.university==null||$scope.fetchData.college==null){
      var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: 'You have to select all the Field'
            })
    }
    else{

    

    $scope.fetchData={
    data : 
      { 
        branch_id : $scope.fetchData.branch, 
        sem : $scope.fetchData.sem,
        university_id : $scope.fetchData.university,
        college_id : $scope.fetchData.college
        
      }
      };

    $http({
            method : 'post',
            data: $scope.fetchData.data,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/University_ADD'
    }).success(function(response) {

            for (var i=0; i<response.length; i++){
            var query = "INSERT INTO university (university_id,university_name,established_in,contact_phone,contact_email) VALUES (?,?,?,?,?);";
            $cordovaSQLite.execute(db,query,[response[i].university_id,response[i].university_name,response[i].established_in,response[i].contact_phone,response[i].contact_email]);
            
            }
            
    }).error(function() {

      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of College'
            })
            
    });

     $http({
            method : 'post',
            data: $scope.fetchData.data,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/College_ADD'
    }).success(function(response) {

            for (var i=0; i<response.length; i++){
            var query = "INSERT INTO college (college_id,college_name,college_address,contact_phone,contact_email,university_id) VALUES (?,?,?,?,?,?);";
            $cordovaSQLite.execute(db,query,[response[i].college_id,response[i].college_name,response[i].college_address,response[i].contact_phone,response[i].contact_email,response[i].university_id]);
            
            }
            
    }).error(function() {

      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of College'
            })
            
    });

    $http({
            method : 'post',
            data: $scope.fetchData.data,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/Branch_ADD'
    }).success(function(response) {

            for (var i=0; i<response.length; i++){
            var query = "INSERT INTO branch (branch_id,branch_name,hod_id,college_id,no_of_semesters) VALUES (?,?,?,?,?);";
            $cordovaSQLite.execute(db,query,[response[i].branch_id,response[i].branch_name,response[i].hod_id,response[i].college_id,response[i].no_of_semesters]);
          
            }
            
    }).error(function() {

      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Error in Insrtion of College'
            })
            
    });

      
    $http({
            method : 'post',
            data: $scope.fetchData.data,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/Add'
    }).success(function(response) {

            for (var i=0; i<response.length; i++){

              var query = "INSERT INTO student (student_id,student_roll,student_name,branch_id,semester,batch_id,email,gender,phone_no,photo,date_of_birth) VALUES (?,?,?,?,?,?,?,?,?,?,?);";
              
              $cordovaSQLite.execute(db,query,[response[i].student_id,response[i].student_roll,response[i].student_name,response[i].branch_id,response[i].semester,response[i].batch_id,response[i].email,response[i].gender,response[i].phone_no,response[i].photo,response[i].date_of_birth]);
        
            }

         
    }).error(function() {
      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Erro in Insrtion of Data'
            })
    });

    $http({
            method : 'post',
            data: $scope.fetchData.data,
            headers: {
            'Content-Type': undefined,
            'origin' : '*'
            },
            url : 'http://192.168.43.46:8084/WebApplication2/Add_Elective'
    }).success(function(response) {

            for (var i=0; i<response.length; i++){

              var query = "INSERT INTO student_elective (seid,student_id,sub_id,elective_no,semester,branch_id) VALUES (?,?,?,?,?,?);";
              
              $cordovaSQLite.execute(db,query,[response[i].seid,response[i].student_id,response[i].sub_id,response[i].elective_no,response[i].semester,response[i].branch_id]);
              
              

            }

            var alertPopup = $ionicPopup.alert({
            title: 'Successful!',
            template: 'Data Added'
            })

            $state.go('app.browse');

    }).error(function() {
      var alertPopup = $ionicPopup.alert({
            title: 'Unsccessful!',
            template: 'Erro in Insrtion of Data'
            })
    });

  }
  }
})


