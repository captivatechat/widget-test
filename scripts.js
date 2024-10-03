function openModal() {
    document.getElementById("modal").style.display = "block";
    modal.classList.add("show");
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    modal.classList.remove("show");
}

function toggleInput() {
    const webInput = document.getElementById("webInput");
    const imageInput = document.getElementById("imageInput");
    const webRadio = document.getElementById("web");

    if (webRadio.checked) {
        webInput.classList.add("flex");
        imageInput.classList.remove("flex");
    } else {
        imageInput.classList.add("flex");
        webInput.classList.remove("flex");
    }
}

function displayImage(event) {
    const file = event.target.files[0]; 
    const previewImage = document.getElementById('previewImage'); 
    const filenameDisplay = document.getElementById('filenameDisplay'); 
    const removeImageButton = document.getElementById('removeImageButton'); 

    if (file) {
        const reader = new FileReader(); 

        reader.onload = function (e) {
            previewImage.src = e.target.result; 
            previewImage.classList.remove('hidden'); 
        };

        reader.readAsDataURL(file); 

        filenameDisplay.textContent = file.name; 
        filenameDisplay.classList.remove('hidden');
        removeImageButton.classList.remove('hidden');
    } else {
        previewImage.src = '';
        previewImage.classList.add('hidden'); 
        filenameDisplay.textContent = ''; 
        filenameDisplay.classList.add('hidden');
        removeImageButton.classList.add('hidden');
    }
}

function removeImage() {
    const previewImage = document.getElementById('previewImage'); 
    const filenameDisplay = document.getElementById('filenameDisplay');
    const removeImageButton = document.getElementById('removeImageButton'); 
    const imageFileInput = document.getElementById('imageFile'); 

    previewImage.src = ''; 
    previewImage.classList.add('hidden');
    filenameDisplay.textContent = ''; 
    filenameDisplay.classList.add('hidden');
    removeImageButton.classList.add('hidden'); 
    imageFileInput.value = '';
}

function copyURL() {
    var copyText = document.getElementById("shareURL");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.getElementById("copyButton").innerHTML = "Copied!";
}

async function applyBackground() {
    document.getElementById("status").innerHTML = `Please wait while we process your request... <img src="img/loading.gif" alt="loading" width="10px" height="10px">`;

    const webRadio = document.getElementById("web");
    const imageRadio = document.getElementById("image");
    const replaceUrl = new URL(window.location.href);

    if (document.getElementById("welcomeBanner").checked) {
       
        replaceUrl.searchParams.set("hwb", true);
        document.getElementById("banner").style.display = "none";
    } else {
        document.getElementById("banner").style.display = "block";
        replaceUrl.searchParams.set("hwb", false);
    }

    if (webRadio.checked) {
        const webURL = document.getElementById("webURL").value;
        if (!webURL) {
            document.getElementById("status").innerHTML = 'Please enter a valid URL';
            return;
        }
        const response = await fetch('https://widget-preview-server.do.captivatechat.ai/screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: webURL }),
        });
        const data = await response.json();

        const url = DOMPurify.sanitize(data.imageURL);
        const filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        replaceUrl.searchParams.set("asset", filename);
        document.getElementById("bgAsset").value = filename;
        document.body.style.backgroundImage = `url(${url})`;        
    }

    if (imageRadio.checked) {
        const imageFile = document.getElementById("imageFile").files[0];
        if (!imageFile) {
            document.getElementById("status").innerHTML = 'Please upload an image';
            return;
        }
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            const response = await fetch('https://widget-preview-server.do.captivatechat.ai/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            const url = DOMPurify.sanitize(data.imageURL);
            const filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            replaceUrl.searchParams.set("asset", filename);
            document.getElementById("bgAsset").value = filename;
            document.body.style.backgroundImage = `url(${url})`;
        }
    }   

    window.location.href = replaceUrl.href;
    document.getElementById("shareURL").value = replaceUrl.href;
    document.getElementById("status").innerHTML = 'Process completed!';
    // closeModal();
}

function runWidget(){
    var captivate_id = DOMPurify.sanitize(document.getElementById("apikey").innerHTML);

    if (document.contains(document.getElementById("captivate-widget"))) {
        document.getElementById("captivate-widget").remove();
    }
    Captivate.init({   
        apiKey: captivate_id,
     });
    Captivate.onConnect(() => {
        console.log("test", Captivate.isConnected);
    });
}


function init() {
    var url = new URL(window.location.href);
    document.getElementById("shareURL").value = url.href;
    if (url.searchParams.get("api")) {
        var apiValue = url.searchParams.get("api");
        document.getElementById("apikey").innerHTML = DOMPurify.sanitize(apiValue);
        
    }
    if (url.searchParams.get("asset")) {
        var assetValue=url.searchParams.get("asset");
        document.getElementById("bgAsset").value = DOMPurify.sanitize(assetValue);
        document.body.style.backgroundImage = `url("https://widget-preview-assets.do.captivatechat.ai/img/${assetValue}.jpg")`;
    }
    if (url.searchParams.get("hwb")) {
        var hwbValue = url.searchParams.get("hwb");
        if (hwbValue === "true") {
            document.getElementById("welcomeBanner").checked = true;
            document.getElementById("banner").style.display = "none";
        } else {
            document.getElementById("welcomeBanner").checked = false;
            document.getElementById("banner").style.display = "block";
        }
    }


    runWidget();
}

init();
