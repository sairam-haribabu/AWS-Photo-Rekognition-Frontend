var sdk = apigClientFactory.newClient({apiKey:'ZwEjIsMQNG18h2QXr2H3c3XIOVlwSmaT7jNyYCAA'});


function searchPhotos() {
    document.getElementById('resultsID').innerHTML="";
    q = document.getElementById('query').value
    console.log(q)
    sdk.searchGet({'query':q}, {}, {}).then((response) => {
        var images = response.data.body;
        var images_div = document.getElementById('resultsID');
        while (images_div.firstChild){
            images_div.removeChild(images_div.firstChild);
        }
        if(images.length == 0){
            var text = document.createElement('h2');
            text.textContent = 'No Images found';
            document.getElementById('resultsID').appendChild(text);
        }
        else{
            var text = document.createElement('h2');
            text.textContent = 'Here are your results!';
            document.getElementById('resultsID').appendChild(text);
            for(var image in images){
                var image_element = document.createElement('img');
                image_element.src = images[image];
                image_element.width = '200';
                image_element.height = '200';
                image_element.className = 'thumbnail';
                document.getElementById('resultsID').appendChild(image_element);
            }
        }
        document.getElementById('query').value='';
    })

    .catch((error) => {
        console.log('an error occurred', error);
    });
}

function record(){    
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new window.SpeechRecognition();

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        document.getElementById('query').value = speechToText;
        searchPhotos();
        }

    recognition.stop();
    recognition.start();
}


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
        };
        reader.onerror = error => reject(error);
    });
}


function uploadPhotos() {
    var image = document.getElementById('inputFile').files[0];
    var label=document.getElementById('label').value
    var params = {"item" : image.name, "bucket" : "ccbd-photos-bucket", "x-amz-meta-customLabels": label, "Content-Type": "image/jpeg"};
    var encoded_image = getBase64(image).then(
        data => {
        sdk.uploadBucketItemPut(params, data , {}).then(function(res){
           window.alert("Uploaded " + image.name);
            console.log(res)
        })
        .catch((error) => {
            console.log('an error occurred', error);
        })
    });
}

function uploadPhoto(){

    let data = document.getElementById('inputFile').files[0];
    let labels = document.getElementById('labels').value;

    let xhr = new XMLHttpRequest();
    let bucketname="ccbd-photos-bucket";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            console.log(this.status)
        }
    });
    xhr.withCredentials = false;
    let urlcreate="https://lwf6skoai1.execute-api.us-east-1.amazonaws.com/delta/upload/"+bucketname+"/"+data.name;
    xhr.open("PUT",urlcreate);
    xhr.setRequestHeader("Content-Type", data.type);
    xhr.setRequestHeader("x-amz-meta-customlabel", labels );
    xhr.setRequestHeader("x-api-key", 'ZwEjIsMQNG18h2QXr2H3c3XIOVlwSmaT7jNyYCAA' );
    xhr.send(data);
    console.log("success")
    alert("Success uploading")
}