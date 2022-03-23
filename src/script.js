var sdk = apigClientFactory.newClient({apiKey:'ZwEjIsMQNG18h2QXr2H3c3XIOVlwSmaT7jNyYCAA'});


function searchPhotos() {
    // q = $("#query").val();
    q = document.getElementById('query').value
    console.log(q);
    sdk.searchGet({'query':q}, {}, {}).then((response) => {
        console.log(response);
        var images = response.data.body;

        var images = response.data.body;

        var images_div = document.getElementById('search_result');
        while (images_div.firstChild){
            images_div.removeChild(images_div.firstChild);
        }
        if(images.length == 0){
            
            var text = document.createElement('h3');
            text.textContent = 'No images!!';
            console.log('here!');
            document.getElementById('search_result').appendChild(text);
        }
        else{
            for(var image in images){
                var image_element = document.createElement('img');
                image_element.src = images[image];
                image_element.width = '250';
                image_element.height = '250';
                image_element.className = 'thumbnail';
                
                document.getElementById('search_result').appendChild(image_element);
            }
        }
    })
    .catch((error) => {
        console.log('an error occurred', error);
    });
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
    var image = document.getElementById('picture').files[0];
    // var label = $("#label").val()
    var label=document.getElementById('label').value
    var params = {"item" : image.name, "bucket" : "ccbd-photos-bucket", "x-amz-meta-customLabels": label, "Content-Type": "image/jpeg"};
    var encoded_image = getBase64(image).then(
        data => {
        sdk.uploadBucketItemPut(params, data , {}).then(function(res){
           window.alert("Uploaded " + image.name);
        //    $("#label").val("")
        //    $("#picture").val("")
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
        }
    });
    xhr.withCredentials = false;
    let urlcreate="https://lwf6skoai1.execute-api.us-east-1.amazonaws.com/delta/upload/"+bucketname+"/"+data.name;
    //let urlcreate="https://n4dvgpnjd7.execute-api.us-east-1.amazonaws.com/gamma/upload/"+bucketname+"/"+data.name;

    xhr.open("PUT",urlcreate);
    xhr.setRequestHeader("Content-Type", data.type);
    xhr.setRequestHeader("x-amz-meta-customlabel", labels );
    xhr.setRequestHeader("x-api-key", 'ZwEjIsMQNG18h2QXr2H3c3XIOVlwSmaT7jNyYCAA' );
    xhr.send(data);
    console.log("success")
}