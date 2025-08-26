
// #region HTML Form Elements
const searchElement = document.getElementById('search');
const domainElement = document.getElementById('domain');
const zone = document.getElementById('zone');
// #endregion
const RDAP_URL = "http://localhost:3000/api/rdap/domain"

// #region Menu Elements
const menuToggleElements = document.querySelectorAll('.dropdown-menu');
// #endregion

// #region Handle Search
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
    if(response.ok){
        console.log('RDAP Data: ', responseJson);
    }
})
// #endregion

// #region Handle Menu Toggle

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
});

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