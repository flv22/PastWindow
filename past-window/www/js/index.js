/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

            var onSuccess = function(position) {
                document.getElementById("position").innerHTML = position.coords.latitude + " - " + position.coords.longitude;
                // alert('Latitude: '          + position.coords.latitude          + '\n' +
                //       'Longitude: '         + position.coords.longitude         + '\n' +
                //       'Altitude: '          + position.coords.altitude          + '\n' +
                //       'Accuracy: '          + position.coords.accuracy          + '\n' +
                //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                //       'Heading: '           + position.coords.heading           + '\n' +
                //       'Speed: '             + position.coords.speed             + '\n' +
                //       'Timestamp: '         + position.timestamp                + '\n');
            };

            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }

            setInterval(function(){
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
            }, 3000);

            document.getElementById("openCamera").addEventListener ("click", openCamera); 
            document.getElementById("openGallery").addEventListener("click", openGallery);

            function onCameraSuccess() {
                console.log("Camera cleanup success.")
            }
            
            function onCameraFail(message) {
                alert('Failed because: ' + message);
            }

            function openCamera() {
                navigator.camera.getPicture(onCameraSuccess, onCameraFail, {  
                    quality: 100, 
                    destinationType: Camera.DestinationType.DATA_URL
                });
            }
            
            function indexOption(buttonIndex) {
                if (buttonIndex == 1) {
                    //TODO get coords here and call saveImage(imageData)
                } else {
                    //TODO manually insert the coords in a popup
                }
            }

            function onImageSelectSuccess(imageData) {
                
                navigator.notification.confirm(
                    'Select the coordinates for this memory',
                    indexOption,
                    'Set coordinates',
                    ['Current', 'Manual']
                );
                
            }

            function saveImage(imageData) {
                var imageDataString = window.localStorage.getItem("message");

                //If there are no images stored in localStorage
                if (imageDataString == null || imageDataString == undefined) {
                    var imageDataJson = [];
                    imageDataJson.push({
                        "image": imageData,
                        "longitude": 100,
                        "latitude": 100
                    });

                    window.localStorage.setItem("message", JSON.stringify(imageDataJson));
                } else {
                    var imageDataJson = JSON.parse(imageDataString);
                    imageDataJson.push({
                        "image": imageData,
                        "longitude": 100,
                        "latitude": 100
                    });

                    window.localStorage.setItem("message", JSON.stringify(imageDataJson));
                }
            }

            function openGallery() {
                navigator.camera.getPicture(onImageSelectSuccess, onCameraFail, {
                    //allowEdit: true,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.FILE_URI
                });
            }

            function goToGallery() {
                window.location.href = "gallery.html";
            }
            document.getElementById("goToGallery").addEventListener("click", goToGallery);
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();