angular.module('tabApp', [])
    .controller('TabController', ['$scope', '$document', function ($scope, $document) {
        $scope.tab = 1;

        $scope.name = {info: ""};
        $scope.age = {info: ""};
        $scope.gender = {info: ""};
        $scope.information = {info: ""};
        $scope.responsible = {info: ""};
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        /*         $scope.callNameMethod = function(){
         console.log($scope.name);
         console.log("ActiveEleement : " +$document[0].activeElement);

         };
         $scope.callAgeMethod = function(){

         //$document[0].activeElement.value = "TEST";
         console.log($scope.age);
         }; */

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

            for (var i = event.resultIndex; i < event.results.length; ++i)
                /* when u speak 'next', it should focus to next field
                 below if loop is trying to do that, but this is setting focus to next to or next to next element*/
                if (event.results[i][0].transcript.includes("next") || event.results[i][0].transcript.includes("Next")) {
                    $document[0].activeElement.parentElement.nextElementSibling.childNodes[1].focus();
                    recognizing = false;
                    break;
                    //recognition.start();
                } else if (event.results[i].isFinal) {
                    test = "";
                    final_transcript = "";
                    final_transcript = event.results[i][0].transcript;
                    //test = final_transcript;
                    $document[0].activeElement.value = final_transcript;
                    var scopeElement = angular.element($document[0].activeElement).scope();
                    var attr = $document[0].activeElement.getAttribute("name");
                    $document[0].activeElement.value = final_transcript;
                    if (scopeElement) {
                        scopeElement[attr].info = final_transcript;
                    }

					$scope.$apply(function () {
					if(scopeElement){
						scopeElement[attr].info = final_transcript;
					}
				});
				} else {
						test = "";
						interim_transcript = "";
						interim_transcript = event.results[i][0].transcript;
						//test = interim_transcript;
				}
			
			if(final_transcript.includes("click on tab")) {
				var idValue = final_transcript.split("tab ")[1];
				if(final_transcript.split(" click")[0] != "") {
					final_transcript = final_transcript.split(" click")[0];				
				}
				$document[0].getElementById(idValue).click();
			}
			
			            final_transcript = capitalize(final_transcript);
            test = final_transcript;
            $scope.testinterim = final_transcript;

            //final_transcript = capitalize(final_transcript);
            /*final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);*/
            //$scope.testinterim = final_transcript;
        }

        var first_char = /\S/;
        function capitalize(s) {
            return s.replace(first_char, function(m) { return m.toUpperCase(); });
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
    /*final_span.innerHTML = '';
     interim_span.innerHTML = '';
     start_timestamp = event.timeStamp;*/
    final_transcript = '';
}
}])
;