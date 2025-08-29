
// #region HTML Form Elements
const searchElement = document.getElementById('search');
const domainElement = document.getElementById('domain');
const zone = document.getElementById('zone');
const banTemplateElement = document.getElementById("ban-template")
const domainRegistryContainer = document.getElementById("domain-registry-container")
// #endregion
const RDAP_URL = "http://localhost:3000/api/rdap/domain"

// #region Menu Elements
const menuToggleElements = document.querySelectorAll('.dropdown-menu');
const menuBarElement = document.getElementById('bar');
const menuElement = document.getElementById('menu');
const closeDomainRegistryElement = document.getElementById('close-domain-registry')
// #endregion

// #region Handle Search

const showBanMessage = (errorMsg) => {
    const banContainerExist = document.getElementById("ban-container")
    if(!banContainerExist){ // --> Element does not exist in the DOM
        // Create Element
        const searchContainerElement = document.querySelector(".search-container")
        const banElement = banTemplateElement.content.cloneNode(true)

        // Insert Error message
        const banMgsElement = banElement.querySelector(".ban-msg")
        banMgsElement.textContent = errorMsg
        // Insert ban template into DOM
        searchContainerElement.prepend(banElement)
    }else{ // --> Element exists in the DOM
        const banMgsElement = banContainerExist.querySelector(".ban-msg")
        banMgsElement.textContent = errorMsg
    }
}

const showDomainNameState = (domainName, state) => { // type state: "success" | "error"
    
}

closeDomainRegistryElement.addEventListener('click', (e) => {
    domainRegistryContainer.classList.add("hidde")
})

searchElement.addEventListener('click', async(e) => {
    let response;
    let responseJson;
    e.preventDefault()
    console.log(`Fetching to: ${RDAP_URL}/${domainElement.value}${zone.value}`);
    try{
        response = await fetch(`${RDAP_URL}/${domainElement.value}${zone.value}`);
        responseJson = await response.json();
    }catch(e){
        console.error('Error fetching RDAP data: ', e);
    }

    const HTTPStatus = response.status;
    console.log(response)

    if(!response.ok){
        switch (HTTPStatus) {
            case 400: // --> BAD REQUEST. THE DOMAIN NAME FORMAT IS NOT VALID.  
                showBanMessage("El nombre de dominio que ingresaste no es válido")
                break
            case 404: // --> NOT FOUND. THE DOMAIN IS AVAILABLE FOR REGISTRATION ✅
                
                break;
            case 500: // --> SERVER ERROR.
                showBanMessage("Ha ocurrido un error al buscar el dominio")
                break;
            default:
                showBanMessage(`ERROR. STATUS: ${HTTPStatus} - STATUS TEXT: ${response.statusText}`)
                break;
        }
        
    }else if(HTTPStatus == 200){ // --> OK. THE DOMAIN IS REGISTERED ❌


    }

    console.log("Ok")

})
// #endregion

// #region Handle Menu Toggle

menuBarElement.addEventListener('click', () => {
    menuElement.classList.toggle('hidde');
})

const hideAllSubmenus = () => {
    menuToggleElements.forEach(element => {
        if(!element.nextElementSibling.classList.contains('hidde')){
            element.nextElementSibling.classList.add('hidde')
        }
    })
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.submenu')) {
        hideAllSubmenus();
    }
    if(!e.target.closest('#bar') && !e.target.closest('#menu')){
        if(!menuElement.classList.contains('hidde')){
            menuElement.classList.add('hidde')
        }
    }
    if(!e.target.closest('.domain-registry-content')){
        domainRegistryContainer.classList.add("hidde")
    }
})

menuToggleElements.forEach(element => {
    element.addEventListener('click', (e) => {

        if(!e.currentTarget.nextElementSibling.classList.contains('hidde')){
            return hideAllSubmenus()
        }

        hideAllSubmenus()
        e.currentTarget.nextElementSibling.classList.toggle('hidde');
        console.log(e.target.nextElementSibling)

    })
})


// #endregion