function Cut(){return function(t,e,i,n){if(!t)return"";var o=parseInt(i,10);if(t.length<=o)return t;var s=t.substr(0,o);if(e){var r=s.lastIndexOf(" ");-1!==r&&(s=s.substr(0,r))}return s+(n||" ?")}}angular.module("crucioApp",["ngRoute","ngCookies","ngMessages","ngTagsInput","ui.bootstrap","angular-loading-bar","angularFileUpload","angularSpinner","textAngular","chart.js","rzModule","duScroll"]).config(["$routeProvider","$locationProvider","$provide",function(t,e,i){t.when("/learn",{template:"<learnComponent></learnComponent>"}).when("/author",{template:"<authorComponent></authorComponent>"}).when("/admin",{template:"<adminComponent></adminComponent>"}).when("/global-statistic",{template:"<globalStatisticComponent></globalStatisticComponent>"}).when("/account",{template:"<accountComponent></accountComponent>"}).when("/settings",{template:"<settingsComponent></settingsComponent>"}).when("/edit-exam",{template:"<editExamComponent></editExamComponent>"}).when("/question",{template:"<questionComponent></questionComponent>"}).when("/exam",{template:"<examComponent></examComponent>"}).when("/statistic",{template:"<statisticComponent></statisticComponent>"}).when("/analysis",{template:"<analysisComponent></analysisComponent>"}).when("/help",{template:"<helpComponent></helpComponent>"}).when("/403",{template:"<error403Component></error403Component>"}).when("/404",{template:"<error404Component></error404Component>"}).when("/500",{template:"<error500Component></error500Component>"}).otherwise({redirectTo:"/404"}),e.html5Mode(!0),i.decorator("taOptions",["taRegisterTool","$delegate",function(t,e){return t("times",{buttontext:"&times;",tooltiptext:"times",action:function(){return this.$editor().wrapSelection("inserthtml","&times;")}}),t("arrow-left",{buttontext:"&larr;",tooltiptext:"arrow-left",action:function(){return this.$editor().wrapSelection("inserthtml","&larr;")}}),t("arrow-right",{buttontext:"&rarr;",tooltiptext:"arrow-right",action:function(){return this.$editor().wrapSelection("inserthtml","&rarr;")}}),t("arrow-left-right",{buttontext:"&harr;",tooltiptext:"arrow-left-right",action:function(){return this.$editor().wrapSelection("inserthtml","&harr;")}}),t("sdot",{buttontext:"&sdot;",tooltiptext:"sdot",action:function(){return this.$editor().wrapSelection("inserthtml","&sdot;")}}),t("asymp",{buttontext:"&asymp;",tooltiptext:"asymp",action:function(){return this.$editor().wrapSelection("inserthtml","&asymp;")}}),t("radic",{buttontext:"&radic;",tooltiptext:"radic",action:function(){return this.$editor().wrapSelection("inserthtml","&radic;")}}),t("prop",{buttontext:"&prop;",tooltiptext:"prop",action:function(){return this.$editor().wrapSelection("inserthtml","&prop;")}}),t("alpha",{buttontext:"&alpha;",tooltiptext:"alpha",action:function(){return this.$editor().wrapSelection("inserthtml","&alpha;")}}),t("beta",{buttontext:"&beta;",tooltiptext:"beta",action:function(){return this.$editor().wrapSelection("inserthtml","&beta;")}}),t("gamma",{buttontext:"&gamma;",tooltiptext:"gamma",action:function(){return this.$editor().wrapSelection("inserthtml","&gamma;")}}),t("delta",{buttontext:"&delta;",tooltiptext:"delta",action:function(){return this.$editor().wrapSelection("inserthtml","&delta;")}}),t("lambda",{buttontext:"&lambda;",tooltiptext:"lambda",action:function(){return this.$editor().wrapSelection("inserthtml","&lambda;")}}),t("mu",{buttontext:"&mu;",tooltiptext:"mu",action:function(){return this.$editor().wrapSelection("inserthtml","&mu;")}}),t("pi",{buttontext:"&pi;",tooltiptext:"pi",action:function(){return this.$editor().wrapSelection("inserthtml","&pi;")}}),t("rho",{buttontext:"&rho;",tooltiptext:"rho",action:function(){return this.$editor().wrapSelection("inserthtml","&rho;")}}),t("omega",{buttontext:"&omega;",tooltiptext:"omega",action:function(){return this.$editor().wrapSelection("inserthtml","&omega;")}}),t("Omega",{buttontext:"&Omega;",tooltiptext:"Omega",action:function(){return this.$editor().wrapSelection("inserthtml","&Omega;")}}),t("subscript",{iconclass:"fa fa-subscript",tooltiptext:"Subscript",action:function(){return this.$editor().wrapSelection("subscript",null)},activeState:function(){return this.$editor().queryCommandState("subscript")}}),t("superscript",{iconclass:"fa fa-superscript",tooltiptext:"Superscript",action:function(){return this.$editor().wrapSelection("superscript",null)},activeState:function(){return this.$editor().queryCommandState("superscript")}}),e}])}]).run(["Auth","$location","$window",function(t,e,i){var n=["/","/register","/forgot-password"],o=["/author","/edit-exam"],s=["/admin","/global-statistic"],r=t.tryGetUser(),a=!1,u=!1,c=!1;r&&(a=Boolean(r.group_id),u=Boolean(2===r.group_id),c=Boolean(3===r.group_id));var l=e.path();n.indexOf(l)>-1&&a&&r.remember_user&&i.location.replace("/learn"),o.indexOf(l)>-1&&!c&&!u&&i.location.replace("/403"),s.indexOf(l)>-1&&!u&&i.location.replace("/403")}]);var AdminController=function(){function t(t,e,i,n){var o=this;this.API=i,this.$uibModal=n,t.setTitleAndNav("Verwaltung | Crucio","Admin"),this.activeTab="users",this.user=e.getUser(),this.userSearch={},this.commentSearch={},this.API.get("whitelist").then(function(t){o.whitelist=t.data.whitelist}),this.API.get("stats/summary").then(function(t){o.stats=t.data.stats}),this.API.get("users/distinct").then(function(t){o.distinctGroups=t.data.groups,o.distinctSemesters=t.data.semesters}),this.loadUsers(),this.loadComments()}return t.$inject=["Page","Auth","API","$uibModal"],t.prototype.loadUsers=function(){var t=this,e={semester:this.userSearch.semester,group_id:this.userSearch.group,query:this.userSearch.query,limit:100};this.API.get("users",e).then(function(e){t.users=e.data.users})},t.prototype.loadComments=function(){var t=this,e={query:this.commentSearch.query,limit:50};this.API.get("comments",e).then(function(e){t.comments=e.data.comments,t.questionsByComment=[];for(var i=0,n=t.comments;i<n.length;i++){for(var o=n[i],s=-1,r=0;r<t.questionsByComment.length;r++)if(t.questionsByComment[r][0].question===o.question){s=r;break}s>-1?t.questionsByComment[s].push(o):t.questionsByComment.push([o])}})},t.prototype.addMail=function(){var t=this.newWhitelistEmail;if(t){this.whitelist.push({mail_address:t,username:""});var e={email:t};this.API.post("whitelist",e)}},t.prototype.removeMail=function(t){var e=this.whitelist[t].mail_address;e&&(this.whitelist.splice(t,1),this.API["delete"]("whitelist/"+e))},t.prototype.changeGroup=function(t){var e=this.users[t].user_id,i=this.users[t].group_id;i=i%this.distinctGroups.length+1,this.users[t].group_id=i;for(var n=0,o=this.distinctGroups;n<o.length;n++){var s=o[n];if(s.group_id===i){this.users[t].group_name=s.name;break}}var r={group_id:i};this.API.put("users/"+e+"/group",r,!0)},t.prototype.isToday=function(t,e){void 0===e&&(e=0);var i=new Date,n=i-36e5*e,o=new Date(n),s=new Date(1e3*t);return o.toDateString()===s.toDateString()},t.prototype.changeSemester=function(t){var e={difference:t};this.API.put("users/change-semester",e).then(function(t){alert(t.data.status)})},t.prototype.removeTestAccount=function(){this.API["delete"]("users/test-account").then(function(t){alert(t.data.status)})},t}();angular.module("crucioApp").component("admincomponent",{templateUrl:"app/admin/admin.html",controller:AdminController});var GlobalStatisticController=function(){function t(t,e,i,n){var o=this;this.API=i,t.setTitleAndNav("Statistik | Crucio","Admin"),this.activeTab="stats",this.user=e.getUser(),this.updateActivity=!1,this.showActivity={result:!1,login:!1,register:!1,comment:!1,examNew:!1,examUpdate:!1},n(function(){o.updateActivity&&o.loadActivity()},2500),this.loadData(),this.loadActivity()}return t.$inject=["Page","Auth","API","$interval"],t.prototype.loadData=function(){var t=this;this.API.get("stats/general").then(function(e){t.stats=e.data.stats,t.chart_time_result_today={labels:t.stats.result_dep_time_today_label,data:[t.stats.result_dep_time_today]}})},t.prototype.loadActivity=function(){var t=this;this.API.get("stats/activities",this.showActivity,!0).then(function(e){t.activities=e.data.activities})},t}();angular.module("crucioApp").component("globalstatisticcomponent",{templateUrl:"app/admin/global-statistic.html",controller:GlobalStatisticController});var AuthorController=function(){function t(t,e,i,n){var o=this;this.API=i,this.$location=n,t.setTitleAndNav("Autor | Crucio","Autor"),this.activeTab="exams",this.user=e.getUser(),this.examSearch={author:this.user},this.commentSearch={author:this.user},this.API.get("exams/distinct").then(function(t){o.distinctSemesters=t.data.semesters,o.distinctAuthors=t.data.authors,o.distinctSubjects=t.data.subjects}),this.API.get("subjects").then(function(t){o.subjectList=t.data.subjects}),this.loadExams(),this.loadComments()}return t.$inject=["Page","Auth","API","$location"],t.prototype.loadExams=function(){var t=this,e={subject_id:this.examSearch.subject&&this.examSearch.subject.subject_id,author_id:this.examSearch.author&&this.examSearch.author.user_id,semester:this.examSearch.semester,query:this.examSearch.query,limit:200};this.API.get("exams",e).then(function(e){t.exams=e.data.exams})},t.prototype.loadComments=function(){var t=this,e={author_id:this.commentSearch.author&&this.commentSearch.author.user_id,query:this.commentSearch.query,limit:100};this.API.get("comments/author",e).then(function(e){t.comments=e.data.comments,t.questionsByComment=[];for(var i=0,n=t.comments;i<n.length;i++){for(var o=n[i],s=-1,r=0;r<t.questionsByComment.length;r++)if(t.questionsByComment[r][0].question===o.question){s=r;break}s>0?t.questionsByComment[s].push(o):t.questionsByComment.push([o])}t.questionsByComment.sort(function(t,e){return e[0].date-t[0].date})})},t.prototype.newExam=function(){var t=this,e={subject_id:1,user_id_added:this.user.user_id};this.API.post("exams",e).then(function(e){t.$location.path("/edit-exam").search("id",e.data.exam_id)})},t}();angular.module("crucioApp").component("authorcomponent",{templateUrl:"app/author/author.html",controller:AuthorController});var EditExamController=function(){function t(t,e,i,n,o,s,r){var a=this;this.API=i,this.FileUploader=n,this.$location=s,t.setTitleAndNav("Klausur | Crucio","Autor"),this.user=e.getUser(),this.examId=r.id,this.openQuestionId=r.question_id,this.openQuestionIndex=-1,this.numberChanged=0,this.uploader=new n({url:"/api/v1/file/upload"}),this.uploader.onSuccessItem=function(t,e){a.exam.file_name=e.upload_name},this.uploaderArray=[],o.$watch(function(){return a.exam},function(){a.hasChanged=a.numberChanged>1,a.numberChanged+=1},!0),o.$on("$locationChangeStart",function(t){if(a.hasChanged){var e=confirm("Die Änderungen an der Klausur bleiben dann ungespeichert. Wirklich verlassen?");e||t.preventDefault()}}),this.API.get("subjects").then(function(t){a.subjectList=t.data.subjects}),this.loadExam()}return t.$inject=["Page","Auth","API","FileUploader","$scope","$location","$routeParams"],t.prototype.loadExam=function(){var t=this;this.API.get("exams/"+this.examId).then(function(e){t.exam=e.data.exam,t.questions=e.data.questions;for(var i=0;i<t.questions.length;i++)t.questions[i].question_id===t.openQuestionId&&(t.openQuestionIndex=i);t.remakeUploaderArray(),0===t.questions.length&&t.addQuestion(!1),t.ready=!0})},t.prototype.getCategories=function(t){for(var e=0,i=this.subjectList;e<i.length;e++){var n=i[e];if(n.subject_id===t)return n.categories}return-1},t.prototype.remakeUploaderArray=function(){var t=this;this.uploaderArray=[];for(var e=0;e<this.questions.length;e++){var i=new this.FileUploader({url:"/api/v1/file/upload",formData:e});i.onSuccessItem=function(e,i){var n=e.formData;t.questions[n].question_image_url=i.upload_name},this.uploaderArray.push(i)}},t.prototype.addQuestion=function(t){var e={category_id:0,question:"",type:5,correct_answer:0,answers:["","","","","",""]};this.questions.push(e),t&&(this.openQuestionIndex=this.questions.length-1),this.remakeUploaderArray()},t.prototype.deleteQuestion=function(t){var e=this.questions[t].question_id;e&&this.API["delete"]("questions/"+e),this.questions.splice(t,1),this.openQuestionIndex=Math.min(this.openQuestionIndex,this.questions.length-1),this.remakeUploaderArray(),this.questions||this.addQuestion(!0)},t.prototype.saveExam=function(){var t=this.exam.subject_id&&this.exam.semester>0&&this.exam.semester<=50&&this.exam.date;if(t){this.isSaving=!0,this.API.put("exams/"+this.examId,this.exam);for(var e=function(t){var e=t.question||t.question_id;if(e){t.explanation=t.explanation||"",t.question_image_url=t.question_image_url||"";var n={exam_id:i.exam.exam_id,user_id_added:i.user.user_id,category_id:t.category_id,question:t.question,type:t.type,answers:t.answers,correct_answer:t.correct_answer,explanation:t.explanation,question_image_url:t.question_image_url};t.question_id?i.API.put("questions/"+t.question_id,n):i.API.post("questions",n).then(function(e){t.question_id=e.data.question_id})}},i=this,n=0,o=this.questions;n<o.length;n++){var s=o[n];e(s)}this.hasChanged=!1,this.isSaving=!1}else alert("Es fehlen noch allgemeine Infos zur Klausur.")},t.prototype.deleteExam=function(){var t=this;this.API["delete"]("exams/"+this.exam.exam_id).then(function(){t.$location.url("/author")})},t}();angular.module("crucioApp").component("editexamcomponent",{templateUrl:"app/author/edit-exam.html",controller:EditExamController});var ModalInstanceController=function(){function t(t,e){this.data=t,this.$modalInstance=e}return t.$inject=["data","$modalInstance"],t}();angular.module("crucioApp").controller("ModalInstanceController",ModalInstanceController);var NavbarController=function(){function t(t,e){this.Page=e,this.Auth=t,this.user=t.getUser()}return t.$inject=["Auth","Page"],t.prototype.logout=function(){this.Auth.logout()},t}();angular.module("crucioApp").component("navbar",{templateUrl:"app/components/navbar.html",controller:NavbarController});var TimeagoController=function(){function t(){function t(t,e){var n=i.numbers&&i.numbers[e]||e;return t.replace(/%d/i,n)}function e(t){return t.replace(/^\s+|\s+$/g,"")}var i={prefixAgo:"vor",prefixFromNow:"in",suffixAgo:"",suffixFromNow:"",seconds:"wenigen Sekunden",minute:"etwa einer Minute",minutes:"%d Minuten",hour:"etwa einer Stunde",hours:"%d Stunden",day:"etwa einem Tag",days:"%d Tagen",month:"etwa einem Monat",months:"%d Monaten",year:"etwa einem Jahr",years:"%d Jahren",wordSeparator:" ",numbers:[]},n=parseInt(this.datetime,0),o=(new Date).getTime(),s=Math.abs(o-n),r=s/1e3,a=r/60,u=a/60,c=u/24,l=c/365,h=i.prefixAgo,m=i.suffixAgo,p=45>r&&t(i.seconds,Math.round(r))||90>r&&t(i.minute,1)||45>a&&t(i.minutes,Math.round(a))||90>a&&t(i.hour,1)||24>u&&t(i.hours,Math.round(u))||42>u&&t(i.day,1)||30>c&&t(i.days,Math.round(c))||45>c&&t(i.month,1)||365>c&&t(i.months,Math.round(c/30))||1.5>l&&t(i.year,1)||t(i.years,Math.round(l));this.result=e([h,p,m].join(i.wordSeparator))}return t}();angular.module("crucioApp").component("timeago",{template:"<span>{{ $ctrl.result }}</span>",controller:TimeagoController,bindings:{datetime:"="}});var ErrorController=function(){function t(t){t.setTitleAndNav("Fehler | Crucio","")}return t.$inject=["Page"],t}();angular.module("crucioApp").component("error403component",{templateUrl:"app/error/403.html",controller:ErrorController}),angular.module("crucioApp").component("error404component",{templateUrl:"app/error/404.html",controller:ErrorController}),angular.module("crucioApp").component("error500component",{templateUrl:"app/error/500.html",controller:ErrorController}),angular.module("crucioApp").filter("cut",Cut);var HelpController=function(){function t(t,e,i,n){var o=this;this.API=i,e.setTitleAndNav("Hilfe | Crucio",""),this.user=t.getUser(),this.question_id=n.search().question_id,this.subject=n.search().s,this.question_id&&this.API.get("questions/"+this.question_id).then(function(t){o.question=t.data.question})}return t.$inject=["Auth","Page","API","$location"],t.prototype.sendMail=function(){var t=this,e=this.text;if(e)if(this.isWorking=!0,this.question_id){var i={text:this.text,name:this.user.username,email:this.user.email,question_id:this.question_id,author:this.question.username,question:this.question.question,exam_id:this.question.exam_id,subject:this.question.subject,date:this.question.date,author_email:this.question.email,mail_subject:this.subject};this.API.post("contact/send-mail-question",i).then(function(){t.isWorking=!1,t.emailSend=!0})}else{var i={text:this.text,name:this.user.username,email:this.user.email};this.API.post("contact/send-mail",i).then(function(){t.isWorking=!1,t.emailSend=!0})}},t}();angular.module("crucioApp").component("helpcomponent",{templateUrl:"app/help/help.html",controller:HelpController});var AnalysisController=function(){function t(t,e,i,n){function o(t,e){return Math.floor(Math.random()*(e-t+1))+t}var s=this;this.API=i,t.setTitleAndNav("Analyse | Crucio","Lernen"),this.user=e.getUser();for(var r=0,a=n.get().list;r<a.length;r++){var u=a[r];if(!u.mark_answer&&u.type>1&&u.given_result>0){var c=u.correct_answer===u.given_result?1:0;0!==u.correct_answer&&1!==u.question.type||(c=-1);var l={correct:c,given_result:u.given_result,question_id:u.question_id,user_id:this.user.user_id};this.API.post("results",l)}}this.random=o(0,1e3),this.examId=n.get().exam_id,this.workedCollection=n.getWorked(),this.count=n.analyseCount(),this.examId&&this.API.get("exams/"+this.examId).then(function(t){s.exam=t.data.exam})}return t.$inject=["Page","Auth","API","Collection"],t.prototype.showCorrectAnswerClicked=function(t){this.workedCollection[t].show_correct_answer=1},t}();angular.module("crucioApp").component("analysiscomponent",{templateUrl:"app/learn/analysis.html",controller:AnalysisController});var ExamController=function(){function t(t,e,i,n,o,s,r,a,u,c){var l=this;this.API=i,this.Collection=n,this.$location=o,this.$document=u,this.$uibModal=s,t.setTitleAndNav("Klausur | Crucio","Lernen"),this.user=e.getUser(),this.examId=r.id,this.currentIndex=0,u.on("scroll",function(){for(var t=u.scrollTop(),e=function(e){var i=angular.element(c.document.getElementById("id"+e));return i.prop("offsetTop")>t?(a(function(){l.currentIndex=Math.max(e-1,0)},0),!0):!1},i=0;i<l.Collection.get().list.length&&!e(i);i++);}),this.loadExam()}return t.$inject=["Page","Auth","API","Collection","$location","$uibModal","$routeParams","$timeout","$document","$window"],t.prototype.loadExam=function(){var t=this;this.API.get("exams/"+this.examId).then(function(e){t.exam=e.data.exam,t.length=e.data.questions.length,t.Collection.set({type:"exam",exam_id:t.examId,list:e.data.questions})})},t.prototype.isHalftime=function(t){return Math.abs(t+1-this.questions.length/2)<1&&t>3},t.prototype.handExam=function(){this.$location.path("/analysis").search("id",null)},t.prototype.openImageModal=function(t){this.$uibModal.open({templateUrl:"imageModalContent.html",controller:"ModalInstanceController",controllerAs:"ctrl",resolve:{data:function(){return t}}})},t}();angular.module("crucioApp").component("examcomponent",{templateUrl:"app/learn/exam.html",controller:ExamController});var LearnController=function(){function t(t,e,i,n,o,s,r){var a=this;this.API=i,this.Collection=n,this.$location=s,e.setTitleAndNav("Lernen | Crucio","Lernen"),this.activeTab="abstract",this.user=t.getUser(),this.examSearch={semester:this.user.semester},this.commentSearch={},this.questionSearch={},this.selection={},this.selectedQuestionNumber=0,this.numberQuestionsInSelection=0,this.sliderOptions={floor:0,ceil:this.numberQuestionsInSelection},r(function(){o.$broadcast("rzSliderForceRender")}),this.API.get("exams/distinct").then(function(t){a.distinctSemesters=t.data.semesters,a.distinctSubjects=t.data.subjects}),this.API.get("subjects").then(function(t){a.subjectList=t.data.subjects}),this.loadAbstract(),this.loadExams(),this.loadTags(),this.loadComments()}return t.$inject=["Auth","Page","API","Collection","$scope","$location","$timeout"],t.prototype.loadAbstract=function(){var t=this,e={limit:12};this.API.get("exams/abstract/"+this.user.user_id,e).then(function(e){t.abstractExams=e.data.exams,t.ready=1})},t.prototype.loadExams=function(){var t=this,e={user_id:this.user.user_id,semester:this.examSearch.semester,subject_id:this.examSearch.subject&&this.examSearch.subject.subject_id,query:this.examSearch.query,visibility:1};this.API.get("exams",e).then(function(e){t.exams=e.data.exams})},t.prototype.loadTags=function(){var t=this,e={user_id:this.user.user_id};this.API.get("tags",e).then(function(e){t.tags=e.data.tags,t.distinctTags=[];for(var i=0,n=t.tags;i<n.length;i++)for(var o=n[i],s=0,r=o.tags.split(",");s<r.length;s++){var a=r[s];t.distinctTags.includes(a)||t.distinctTags.push(a)}t.questionsByTag={};for(var u=0,c=t.distinctTags;u<c.length;u++){var l=c[u];t.questionsByTag[l]=[];for(var h=0,m=t.tags;h<m.length;h++)for(var o=m[h],p=0,d=o.tags.split(",");p<d.length;p++){var a=d[p];l===a&&t.questionsByTag[l].push(o)}}})},t.prototype.loadComments=function(){var t=this,e={query:this.commentSearch.query,user_id:this.user.user_id};this.API.get("comments",e).then(function(e){t.comments=e.data.comments,t.questionsByComment={};for(var i=0,n=t.comments;i<n.length;i++){var o=n[i];t.questionsByComment[o.question]=t.questionsByComment[o.question]||[],t.questionsByComment[o.question].push(o)}})},t.prototype.loadNumberQuestions=function(){var t=this,e={selection:this.selection};this.API.get("questions/count",e,!0).then(function(e){t.numberQuestionsInSelection=e.data.count;var i=Math.min(t.numberQuestionsInSelection,500);t.sliderOptions={floor:0,ceil:i},t.selectedQuestionNumber||(t.selectedQuestionNumber=50),t.selectedQuestionNumber=Math.min(t.selectedQuestionNumber,t.numberQuestionsInSelection)})},t.prototype.searchQuestion=function(){var t=this;if(this.searchResults=[],this.hasSearched=!1,this.questionSearch.query){this.showSpinner=!0;var e={query:this.questionSearch.query,subject_id:this.questionSearch.subject&&this.questionSearch.subject.subject_id,semester:this.questionSearch.semester,visibility:1,limit:100};this.API.get("questions",e,!0).then(function(e){t.searchResults=e.data.result,t.showSpinner=!1,t.hasSearched=!0})}},t.prototype.learnExam=function(t){var e=this,i={random:!0};this.Collection.prepareExam(t,i).then(function(t){e.$location.path("/question").search("id",t.list[0].question_id)})},t.prototype.learnSubjects=function(){var t=this,e={selection:this.selection,limit:this.selectedQuestionNumber};this.Collection.prepareSubjects(e).then(function(e){t.$location.path("/question").search("id",e.list[0].question_id)})},t.prototype.resetExam=function(t){t.answered_questions=0,this.API["delete"]("results/"+this.user.user_id+"/"+t.exam_id,!0)},t}();angular.module("crucioApp").component("learncomponent",{templateUrl:"app/learn/learn.html",controller:LearnController});var QuestionController=function(){function t(t,e,i,n,o,s,r){if(this.Auth=t,this.API=i,this.Collection=n,this.$uibModal=r,e.setTitleAndNav("Frage | Crucio","Lernen"),this.user=t.getUser(),this.questionId=Number(o.id),this.resetSession=Boolean(o.reset_session),this.commentsCollapsed=Boolean(this.user.showComments),this.questionId||this.$window.location.replace("/questions"),this.noAnswer=!0,this.showExplanation=!1,this.collection=this.Collection.get(),this.resetSession&&(delete this.collection,n.remove()),this.index=this.Collection.getIndexOfQuestion(this.questionId),-1!==this.index){var a=this.collection.list;this.questionData=this.Collection.getQuestionData(this.index),this.length=a.length,this.preQuestionId=this.index>0?a[this.index-1].question_id:-1,this.postQuestionId=this.index<this.length?a[this.index+1].question_id:-1}this.loadQuestion()}return t.$inject=["Auth","Page","API","Collection","$routeParams","$window","$uibModal"],t.prototype.loadQuestion=function(){var t=this;this.API.get("questions/"+this.questionId+"/user/"+this.user.user_id).then(function(e){t.question=e.data.question,t.comments=e.data.comments,t.tags=[],e.data.tags&&(t.tags=e.tags.split(",").map(function(t){return{text:t}})),t.checkedAnswer=t.questionData.givenAnswer,t.questionData.showAnswer&&t.markAnswer(t.questionData.givenAnswer)})},t.prototype.updateTags=function(){var t=this.tags.map(function(t){return t.text}).join(","),e={tags:t,question_id:this.questionId,user_id:this.user.user_id};this.API.post("tags",e,!0)},t.prototype.showSolution=function(){var t=this.question.correct_answer;this.checkedAnswer=t;var e=t===this.questionData.givenAnswer?1:0;0!==t&&1!==this.question.type||(e=-1);var i={correct:e,question_id:this.questionId,user_id:this.user.user_id,given_result:this.questionData.givenAnswer};this.API.post("results",i,!0),this.Collection.saveMarkAnswer(this.index),this.markAnswer(this.questionData.givenAnswer)},t.prototype.saveAnswer=function(t){this.questionData.givenAnswer=t,this.Collection.saveAnswer(this.index,this.questionData.givenAnswer)},t.prototype.markAnswer=function(t){this.isAnswerGiven=!0;var e=this.question.type;e>1&&(this.correctAnswer=this.question.correct_answer,this.checkedAnswer=t>0?t:this.correctAnswer,this.isAnswerRight=t===this.correctAnswer,this.isAnswerWrong=t!==this.correctAnswer,t!==this.correctAnswer&&(this.wrongAnswer=t))},t.prototype.addComment=function(){var t=this,e=+new Date/1e3,i={comment:this.commentText,question_id:this.questionId,reply_to:0,username:this.user.username,date:e};this.API.post("comments/"+this.user.user_id,i).then(function(e){i.voting=0,i.user_voting=0,i.comment_id=e.data.comment_id,t.comments.push(i),t.commentText=""})},t.prototype.deleteComment=function(t){var e=this.comments[t].comment_id;this.API["delete"]("comments/"+e),this.comments.splice(t,1)},t.prototype.changeUserVoting=function(t,e){t.user_voting=Math.min(Math.max(t.user_voting+e,-1),1);var i={user_voting:t.user_voting};this.API.post("comments/"+t.comment_id+"/user/"+this.user.user_id,i,!0)},t.prototype.openImageModal=function(){var t=this;this.$uibModal.open({templateUrl:"imageModalContent.html",controller:"ModalInstanceController",controllerAs:"ctrl",resolve:{data:function(){return t.question.question_image_url}}})},t}();angular.module("crucioApp").component("questioncomponent",{templateUrl:"app/learn/question.html",controller:QuestionController});var StatisticController=function(){function t(t,e){e.setTitleAndNav("Statistik | Crucio","Lernen"),this.user=t.getUser()}return t.$inject=["Auth","Page"],t}();angular.module("crucioApp").component("statisticcomponent",{templateUrl:"app/learn/statistic.html",controller:StatisticController});var API=function(){function t(t){this.$http=t,this.base="api/v1/"}return t.$inject=["$http"],t.prototype.sanitize=function(t){return t.email=t.email&&t.email.replace("@","(@)"),t},t.prototype.get=function(t,e,i){return void 0===e&&(e={}),void 0===i&&(i=!1),this.$http.get(this.base+t,{ignoreLoadingBar:i,params:this.sanitize(e)})},t.prototype.post=function(t,e,i){return void 0===i&&(i=!1),this.$http.post(this.base+t,this.sanitize(e),{ignoreLoadingBar:i})},t.prototype.put=function(t,e,i){return void 0===i&&(i=!1),this.$http.put(this.base+t,this.sanitize(e),{ignoreLoadingBar:i})},t.prototype["delete"]=function(t,e,i){return void 0===e&&(e={}),void 0===i&&(i=!1),this.$http["delete"](this.base+t,{ignoreLoadingBar:i,params:this.sanitize(e)})},t}();angular.module("crucioApp").service("API",API);var Auth=function(){function t(t,e){this.$window=e,this.$cookies=t}return t.$inject=["$cookies","$window"],t.prototype.getUser=function(){return this.tryGetUser(),this.user||this.$window.location.replace("/"),this.user},t.prototype.tryGetUser=function(){return angular.isUndefined(this.user)&&angular.isDefined(this.$cookies.getObject("CrucioUser"))&&this.setUser(this.$cookies.getObject("CrucioUser")),this.user},t.prototype.login=function(t,e){t.remember_user=e,this.setUser(t,!0),this.$window.location.assign("/learn")},t.prototype.logout=function(){this.$cookies.remove("CrucioUser"),this.$window.location.assign(this.$window.location.origin)},t.prototype.setUser=function(t,e){if(void 0===e&&(e=!1),this.user=t,e||angular.isDefined(this.$cookies.getObject("CrucioUser"))){var i=new Date;i.setDate(i.getDate()+21),this.$cookies.putObject("CrucioUser",this.user,{expires:i})}},t}();angular.module("crucioApp").service("Auth",Auth);var Collection=function(){function t(t){this.API=t}return t.$inject=["API"],t.prototype.get=function(){return angular.isUndefined(this.collection)&&angular.isDefined(sessionStorage.crucioCollection)&&this.set(angular.fromJson(sessionStorage.crucioCollection)),this.collection},t.prototype.set=function(t){this.collection=t,sessionStorage.crucioCollection=angular.toJson(t)},t.prototype.remove=function(){delete this.collection,sessionStorage.removeItem("crucioCollection")},t.prototype.getWorked=function(){return this.get(),this.collection.list.filter(function(t){return t.given_result})},t.prototype.analyseCount=function(){for(var t=this.getWorked(),e={correct:0,wrong:0,seen:0,solved:0,free:0,no_answer:0,all:this.collection.list.length,worked:t.length},i=0,n=t;i<n.length;i++){var o=n[i];o.correct_answer===o.given_result&&o.given_result>0&&o.correct_answer>0&&e.correct++,o.correct_answer!==o.given_result&&o.given_result>0&&o.correct_answer>0&&e.wrong++,o.given_result>0&&e.solved++,o.given_result>-2&&e.seen++,1===o.type&&e.free++,0===o.correct_answer&&1!==o.type&&e.no_answer++}return e},t.prototype.saveAnswer=function(t,e){this.collection&&Object.keys(this.collection).length&&(this.collection.list[t].given_result=e,this.set(this.collection))},t.prototype.saveStrike=function(t,e){this.collection&&Object.keys(this.collection).length&&(this.collection.list[t].strike=e,this.set(this.collection))},t.prototype.saveMarkAnswer=function(t){this.collection&&Object.keys(this.collection).length&&(this.collection.list[t].mark_answer=1,this.set(this.collection))},t.prototype.prepareExam=function(t,e){var i=this;return this.API.get("exams/action/prepare/"+t,e).then(function(e){var n={list:e.data.list,exam_id:t};return i.set(n),n})},t.prototype.prepareSubjects=function(t){var e=this;return this.API.get("questions/prepare-subjects",t).then(function(i){var n={list:i.data.list,selection:t.selection};return e.set(n),n})},t.prototype.getIndexOfQuestion=function(t){for(var e=0;e<this.collection.list.length;e++)if(this.collection.list[e].question_id===t)return e;return-1},t.prototype.getQuestionData=function(t){return this.collection.list[t]},t}();angular.module("crucioApp").service("Collection",Collection);var Page=function(){function t(t){this.$window=t}return t.$inject=["$window"],t.prototype.setTitle=function(t){this.title=t},t.prototype.setNav=function(t){this.nav=t},t.prototype.setTitleAndNav=function(t,e){void 0===e&&(e=""),this.title=t,this.nav=e,this.$window.document.title=this.title},t}();angular.module("crucioApp").service("Page",Page);var AccountController=function(){function t(t,e,i,n){this.API=i,this.Auth=e,this.$scope=n,t.setTitleAndNav("Account | Crucio","Name"),this.user=this.Auth.getUser()}return t.$inject=["Page","Auth","API","$scope"],t.prototype.formChanged=function(){this.$scope.form.passwordc.$setValidity("confirm",this.newPassword===this.newPasswordC)},t.prototype.saveUser=function(){var t=this;this.isSaved=!1,this.hasError=!1,this.isWorking=!0;var e={email:this.user.email,course_id:this.user.course_id,semester:this.user.semester,current_password:this.oldPassword,password:this.newPassword};this.API.put("users/"+this.user.user_id+"/account",e,!0).then(function(e){console.log(e),e.data.status?t.Auth.setUser(t.user):(t.user=t.Auth.getUser(),t.hasError=!0),t.isSaved=e.data.status,t.wrongPassword="error_incorrect_password"===e.data.error,t.isWorking=!1})},t}();angular.module("crucioApp").component("accountcomponent",{templateUrl:"app/user/account.html",controller:AccountController});var SettingsController=function(){function t(t,e,i){this.API=i,this.Auth=e,t.setTitleAndNav("Einstellungen | Crucio","Name"),this.user=this.Auth.getUser()}return t.$inject=["Page","Auth","API"],t.prototype.formChanged=function(){this.isSaved=!1,this.hasError=!1},t.prototype.updateUser=function(){
var t=this;this.formChanged(),this.isWorking=!0;var e={highlightExams:this.user.highlightExams,showComments:this.user.showComments,repetitionValue:50,useAnswers:this.user.useAnswers,useTags:this.user.useTags};this.API.put("users/"+this.user.user_id+"/settings",e,!0).then(function(e){e.data.status?t.Auth.setUser(t.user):(t.user=t.Auth.getUser(),t.hasError=!0),t.isSaved=e.data.status,t.isWorking=!1})},t.prototype.removeAllResults=function(){this.API["delete"]("results/"+this.user.user_id)},t}();angular.module("crucioApp").component("settingscomponent",{templateUrl:"app/user/settings.html",controller:SettingsController});