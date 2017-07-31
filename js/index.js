angular.module('tabApp', [])
    .controller('TabController', ['$scope', '$document', function ($scope, $document) {
        $scope.tab = 1;

        $scope.name = {info: ""};
        $scope.age = {info: ""};

        $scope.gender = {info: ""};
        $scope.information = {info: ""};
        $scope.responsible = {info: ""};
        $scope.insurance = {info: ""};
        $scope.history = {info: ""};
		
		$scope.datalist=[];

        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        /*$scope.callNameMethod = function () {
            console.log($scope.name);
            console.log("ActiveEleement : " + $document[0].activeElement);

        };
        $scope.callAgeMethod = function () {

            //$document[0].activeElement.value = "TEST";
            console.log($scope.age);
        };*/

        $scope.$watch('name', function (newValue, oldValue, scope) {
            console.log("old value" + oldValue);
            console.log("new value" + newValue);
        });


        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        var recognizing = false;
        var final_transcript = '';
        var final_span = '';
        var interim_span = '';

        recognition.onstart = function () {
            recognizing = true;
            //showInfo('info_speak_now');
        };

        /*recognition.onerror = function(event) {
         if (event.error == 'no-speech') {
         showInfo('info_no_speech');
         ignore_onend = true;
         }
         if (event.error == 'audio-capture') {
         showInfo('info_no_microphone');
         ignore_onend = true;
         }
         if (event.error == 'not-allowed') {
         if (event.timeStamp - start_timestamp < 100) {
         showInfo('info_blocked');
         } else {
         showInfo('info_denied');
         }
         ignore_onend = true;
         }
         };*/

        recognition.onend = function () {
            recognizing = false;
            recognition.start();
            /*if (ignore_onend) {
             return;
             }*/
        }

        recognition.onresult = function (event) {
            var interim_transcript = '';
            if (typeof(event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                upgrade();
                return;
            }

            var test = '';
            var flag = 0;

            for (var i = event.resultIndex; i < event.results.length; ++i) 
                if (event.results[i].isFinal) {
                    test = "";
                    final_transcript = "";
                    final_transcript = event.results[i][0].transcript;
                    test = final_transcript;
                } else {
                    test = "";
                    interim_transcript = "";
                    interim_transcript = event.results[i][0].transcript;
                    test = interim_transcript;
                }


            final_transcript = capitalize(final_transcript);
            test = final_transcript;
            $scope.testinterim = final_transcript;

            if (final_transcript.toUpperCase().includes("TAB")) {
                //$document[0].activeElement.parentElement.nextElementSibling.childNodes[1].focus();

                if($document[0].getElementById($document[0].activeElement.getAttribute("next"))){
                    var nextElement = $document[0].getElementById($document[0].activeElement.getAttribute("next"));
                    nextElement.focus();

                    recognizing = false;
                }

                //recognition.start();
            }/*  else if(final_transcript.toUpperCase().includes("NEXT") && flag > 0){

                console.log("TAB NUMBER : " + $scope.tab);
                var tabNumber = "tab"+ ($scope.tab +1);
                if(tabNumber === "tab4"){
                    tabNumber = "tab1";
                }
                $document[0].getElementById(tabNumber).click();
                flag = 0;
            } */ else if(final_transcript.toUpperCase().includes("CLICK")) {
                var idValue = final_transcript.split("Click ")[1];
                if(final_transcript.split(" Click")[0] != "") {
                    final_transcript = final_transcript.split(" Click")[0];

                }
                $document[0].getElementById(idValue).click();
            }
			else {
                var scopeElement = angular.element($document[0].activeElement).scope();
                var attr = $document[0].activeElement.getAttribute("name");

                $scope.$apply(function () {
                    if (scopeElement) {
                        if (final_transcript.toUpperCase().includes("CLEAR")) {
                            scopeElement[attr].info = "";
                        } else {
                            scopeElement[attr].info = final_transcript;
                        }

                    }
                });
            }
        };
		
		
		$scope.save = function() {
  var attribs={};
  attribs.name= $scope.name.info;
    attribs.age= $scope.age.info;
    attribs.gender= $scope.gender.info;

    $scope.datalist.push(attribs);
    $scope.name.info = "";
    $scope.age.info = "";
    $scope.gender.info = "";

};



        var first_char = /\S/;

        function capitalize(s) {
            return s.replace(first_char, function (m) {
                return m.toUpperCase();
            });
        }

        var two_line = /\n\n/g;
        var one_line = /\n/g;

        function linebreak(s) {
            return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }

        $scope.startButton = function (event) {
            if (recognizing) {
                recognition.stop();
                return;
            }
            final_transcript = '';
            //recognition.lang = en;
            recognition.start();
			$document[0].getElementById("name").focus();
            /*final_span.innerHTML = '';
             interim_span.innerHTML = '';
             start_timestamp = event.timeStamp;*/
        }
    }]);