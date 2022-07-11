// NAVBAR
const ham = document.querySelector(".hamburger-menu");
const menu = document.querySelector(".menu-container");
ham.addEventListener("click", ()=>{
    ham.classList.toggle("active");
    menu.classList.toggle("active");
})



// LINK SHORTENING
const url = document.querySelector(".link-input");
const submitBtn = document.querySelector(".shorten-it-btn");
const shortenLinks = document.querySelector(".shorten-links");
const linkContainer = document.querySelector(".link-container");

// HANDLING ERRORS IF ANY
const errMsg = document.createElement('p');
const handleError = (err)=>{
    errMsg.classList.add("err-msg");
    errMsg.textContent = err;
    linkContainer.appendChild(errMsg);
    url.value = '';
}

// FETCHING THE SHORTENED LINK
const fetchLink = async(url)=>{
    const urlVal = url.value;
    try{
        const api = await fetch(`https://api.shrtco.de/v2/shorten?url=${urlVal}`);
        const data = await api.json();
        if(!data.ok){
            let {error_code} = data;
            switch(error_code){
                case 2:
                    handleError("Invalid URL submitted");
                    break;
                case 8:
                    handleError("Invalid code submitted");
                    break;
                case 10:
                    handleError("Trying to shorten a disallowed Link");
                    break;
                default:
                    handleError("Something went wrong, please try again");
                    break;
            }
        }else{
            errMsg.classList.remove("err-msg");
            errMsg.textContent = '';
            const {short_link, code} = data.result;
            url.value = '';

            // CREATING A DIV 
            const urlWrapper = document.createElement('div');
            urlWrapper.classList.add("url-wrapper");

            const baseURL = document.createElement('p');
            baseURL.textContent = urlVal;
            baseURL.classList.add("base-url");
            urlWrapper.appendChild(baseURL);
            const close = document.createElement('i');
            close.className += "fa-solid fa-xmark close";
            urlWrapper.appendChild(close);
            close.addEventListener('click', (e)=>{
                shortenLinks.removeChild(urlWrapper);
            })

            // CREATING A DIV FOR SHORT LINK AND COPY BUTTON
            const shortUrlWrapper = document.createElement('div');
            shortUrlWrapper.classList.add('short-url-wrapper');
            urlWrapper.appendChild(shortUrlWrapper);

            const shortUrl = document.createElement('a');
            shortUrl.textContent = short_link;
            shortUrl.href = short_link;
            shortUrl.classList.add('short-link');
            shortUrlWrapper.appendChild(shortUrl);

            const copyBtn = document.createElement('button');
            copyBtn.className += "btn copy-btn";
            copyBtn.textContent = "Copy";
            copyBtn.addEventListener('click', ()=>{
                copyBtn.textContent = "Copied!";
                copyBtn.classList.add("copied-btn");
                navigator.clipboard.writeText(short_link);
            })
            shortUrlWrapper.appendChild(copyBtn);
            shortenLinks.appendChild(urlWrapper);
        }
    } catch(e){
        console.log(e);
    }
}

// ONCLICK OF SUBMIT BUTTON
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    fetchLink(url);
})

