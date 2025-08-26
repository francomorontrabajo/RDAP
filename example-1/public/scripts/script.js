const searchElement = document.getElementById('search');
const domainElement = document.getElementById('domain');
const zone = document.getElementById('zone');

const RDAP_URL = "http://localhost:3000/api/rdap/domain"

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