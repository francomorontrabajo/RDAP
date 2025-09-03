// #region HTML Form Elements
const searchdomainform = document.getElementById('search-domain-form')
const domainElement = document.getElementById('domain');
const zone = document.getElementById('zone');
const banTemplateElement = document.getElementById("ban-template")
const domainRegistryTemplate = document.getElementById("domain-registry-template")
const domainRegistryBodyTemplateSuccess = document.getElementById("domain-registry-body-template-success")
const domainRegistryBodyTemplateFailure = document.getElementById("domain-registry-body-template-failure")

// #endregion
const RDAP_URL = "http://localhost:3000/api/rdap"

// #region Menu Elements
const menuToggleElements = document.querySelectorAll('.dropdown-menu');
const menuBarElement = document.getElementById('bar');
const menuElement = document.getElementById('menu');
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

const showDomainNameState = (domainName, state, url, extra) => { // type state: "no-register" | "register"
    const domainRegistryContainerExist = document.getElementById("domain-registry-container")
    if(!domainRegistryContainerExist){
        // Create element
        const searchContainerElement = document.querySelector(".search-container")
        const domainRegistryContainer = domainRegistryTemplate.content.cloneNode(true)

        // Insert Domain Name
        const domainRegistryName = domainRegistryContainer.querySelector(".domain-registry-name")
        domainRegistryName.textContent = domainName

        searchContainerElement.prepend(domainRegistryContainer)

        // #region Events

        document.getElementById("domain-registry-container").addEventListener("click", (e) => {
            if(!e.target.closest('.domain-registry-content')){
                document.querySelector("#domain").value = "" // Clear Domain Name
                // I do not clear the zone because the user will probably want to search for a new domain name in the same zone.
                e.currentTarget.classList.add("hidde")
            }
        })

        document.getElementById("close-domain-registry").addEventListener("click", (e) => {
            document.getElementById("domain-registry-container").classList.add("hidde")
            document.querySelector("#domain").value = "" // Clear Domain Name
        })

        // #endregion

    }else{
        domainRegistryContainerExist.classList.remove("hidde")
        const domainRegistryName = domainRegistryContainerExist.querySelector(".domain-registry-name")
        domainRegistryName.textContent = domainName
    }

    if(state == "register"){
        console.log(extra)
        const domainBodyExist = document.querySelector(".domain-body-content")
        if(domainBodyExist){
            if(domainBodyExist.classList.contains("no-register")){
                const disputeLink = domainBodyExist.querySelector("#dispute-link")
                disputeLink.setAttribute("href", url)

                const nameAndLastNameDataElement = domainBodyExist.querySelector("#name-and-lastname-domain-data")
                const idDataElement = domainBodyExist.querySelector("#id-domain-data")
                const registrationDataElement = domainBodyExist.querySelector("#registration-domain-data")
                const expirationDataElement = domainBodyExist.querySelector("#expiration-domain-data")

                nameAndLastNameDataElement.textContent = extra.nameAndLastName
                idDataElement.textContent = extra.id
                registrationDataElement.textContent = extra.registrationDate
                expirationDataElement.textContent = extra.expirationDate

            }else if(domainBodyExist.classList.contains("register")){
                const domainBodyChild = domainRegistryBodyTemplateFailure.content.cloneNode(true)
                const disputeLink = domainBodyChild.querySelector("#dispute-link")
                disputeLink.setAttribute("href", url)

                const nameAndLastNameDataElement = domainBodyChild.querySelector("#name-and-lastname-domain-data")
                const idDataElement = domainBodyChild.querySelector("#id-domain-data")
                const registrationDataElement = domainBodyChild.querySelector("#registration-domain-data")
                const expirationDataElement = domainBodyChild.querySelector("#expiration-domain-data")

                nameAndLastNameDataElement.textContent = extra.nameAndLastName
                idDataElement.textContent = extra.id
                registrationDataElement.textContent = extra.registrationDate
                expirationDataElement.textContent = extra.expirationDate
                
                domainBodyExist.replaceWith(domainBodyChild)


            }
        }else{
            const domainBodyChild = domainRegistryBodyTemplateFailure.content.cloneNode(true)
            const domainBody = document.querySelector(".domain-registry-body")
            const disputeLink = domainBodyChild.querySelector("#dispute-link")
            disputeLink.setAttribute("href", url)

            const nameAndLastNameDataElement = domainBodyChild.querySelector("#name-and-lastname-domain-data")
            const idDataElement = domainBodyChild.querySelector("#id-domain-data")
            const registrationDataElement = domainBodyChild.querySelector("#registration-domain-data")
            const expirationDataElement = domainBodyChild.querySelector("#expiration-domain-data")

            nameAndLastNameDataElement.textContent = extra.nameAndLastName
            idDataElement.textContent = extra.id
            registrationDataElement.textContent = extra.registrationDate
            expirationDataElement.textContent = extra.expirationDate

            domainBody.append(domainBodyChild)
        }
    }else if(state == "no-register"){
        const domainBodyExist = document.querySelector(".domain-body-content")
        if(domainBodyExist){
            if(domainBodyExist.classList.contains("register")){
                const registerLink = domainBodyExist.querySelector("#register-link")
                registerLink.setAttribute("href", url)
            }else if(domainBodyExist.classList.contains("no-register")){
                const domainBodyChild = domainRegistryBodyTemplateSuccess.content.cloneNode(true)
                const registerLink = domainBodyChild.querySelector("#register-link")
                registerLink.setAttribute("href", url)
                //domainBodyExist.textContent = "" // Clear Body
                domainBodyExist.replaceWith(domainBodyChild)

                //domainBodyExist.appendChild(domainBodyChild)
            }
        }else{
            const domainBodyChild = domainRegistryBodyTemplateSuccess.content.cloneNode(true)
            const domainBody = document.querySelector(".domain-registry-body")
            const registerLink = domainBodyChild.querySelector("#register-link")
            registerLink.setAttribute("href", url)
            domainBody.append(domainBodyChild)
        }
    }
}

searchdomainform.addEventListener('submit', async(e) => {
    e.preventDefault()

    let response;
    let responseJson;

    const domainNameValue = domainElement.value 
    const zoneValue = zone.value

    console.log(`Fetching to: ${RDAP_URL}/${domainNameValue}${zoneValue}`);
    try{
        const rdapDomainEncode = encodeURI(`${RDAP_URL}/domain/${domainNameValue}${zoneValue}`)
        response = await fetch(rdapDomainEncode);
        responseJson = await response.json();
    }catch(e){
        console.error('Error fetching RDAP data: ', e);
    }

    const HTTPStatus = response.status;

    if(!response.ok){
        switch (HTTPStatus) {
            case 400: // --> BAD REQUEST. THE DOMAIN NAME FORMAT IS NOT VALID.  
                console.log(responseJson.message)
                showBanMessage("El nombre de dominio que ingresaste no es válido")
                break
            case 404: // --> NOT FOUND. THE DOMAIN IS AVAILABLE FOR REGISTRATION ✅
                const NIC_URL = `https://nic.ar/elegi-como-ingresar?idTramite=0&dominio=${domainNameValue}&zona=${zoneValue}&accion=ALTA`
                showDomainNameState(`${domainNameValue}${zoneValue}`, "no-register", NIC_URL)
                break;
            case 500: // --> SERVER ERROR.
                showBanMessage("Ha ocurrido un error al buscar el dominio")
                break;
            default:
                showBanMessage(`ERROR. STATUS: ${HTTPStatus} - STATUS TEXT: ${response.statusText}`)
                break;
        }
    }else if(HTTPStatus == 200){ // --> OK. THE DOMAIN IS REGISTERED ❌

        // #region Entity Data

        const entityData = responseJson.entities[0]
        const entityEvents = responseJson.events
        
        const entityId = entityData.handle
        const rdapEntityEncode = encodeURI(`${RDAP_URL}/entity/${entityId}`)

        const entityRegistrationDate = entityEvents[0].eventDate
        const entityExpirationDate = entityEvents[1].eventDate

        let response2 
        let responseJson2

        try{
            response2 = await fetch(rdapEntityEncode);
            responseJson2 = await response2.json();
        }catch(e){
            console.error('Error fetching RDAP data: ', e);
        }

        const entityData2 = responseJson2.vcardArray
        const entityNameAndLastName = entityData2[1][1][3]

        const domainData = {
            nameAndLastName: entityNameAndLastName, 
            id: entityId,
            registrationDate: entityRegistrationDate,
            expirationDate:  entityExpirationDate,
        }

        // #endregion

        const NIC_URL = encodeURI(`https://nic.ar/elegi-como-ingresar?idTramite=0&dominio=${domainNameValue}&zona=${zoneValue}&accion=DISPUTA`)
        showDomainNameState(`${domainNameValue}${zoneValue}`, "register", NIC_URL, domainData)
    }

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
})

menuToggleElements.forEach(element => {
    element.addEventListener('click', (e) => {

        if(!e.currentTarget.nextElementSibling.classList.contains('hidde')){
            return hideAllSubmenus()
        }

        hideAllSubmenus()
        e.currentTarget.nextElementSibling.classList.toggle('hidde');
    })
})


// #endregion