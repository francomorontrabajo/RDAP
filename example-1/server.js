import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: "*" // Cambiar según necesidad
}))

app.use(express.static(path.join('public')))

app.get('/api/rdap/domain', (req, res) => {
    return res.status(400).json({
        message: `Bad Request. El nombre de dominio no puede ser vacío`,
        status: 400
    }) 
})

app.get('/api/rdap/domain/:domain', async (req, res) => {
    const domainName = req.params.domain.trim().toLowerCase()

    // #region Validate Domain Name
    const domainContainOneDotAr = domainName.split(".ar").length === 2
    const dotArIsAtTheEnd = domainName.endsWith(".ar")

    if (!dotArIsAtTheEnd || !domainContainOneDotAr) {
        return res.status(400).json({
            message: `Bad Request. El dominio debe estar en la zona .ar`,
            status: 400
        })
    }

    const domainWithOutArZone = domainName.split(".ar")[0]
    const domainParts = domainWithOutArZone.split(".")
    const domainWithoutZoneLen = domainParts.length
    const isDotArZone = domainWithoutZoneLen === 1
    const isValidSubDomainLen = domainWithoutZoneLen === 2

    // Regex de validación de nombres de dominio
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/

    if (isDotArZone) {
        const domainToValidate = domainParts[0]

        if (!domainRegex.test(domainToValidate)) {
            return res.status(400).json({
                message: `Bad Request. El nombre de dominio es inválido (.ar). Solo se permiten [a-z0-9] y guiones en medio, con hasta 63 caracteres.`,
                status: 400
            })
        }

    } else if (isValidSubDomainLen) {
        const [domainToValidate, subDomain] = domainParts

        const validZones = [
            "com", "net", "gob", "int", "mil", "musica", "org",
            "tur", "seg", "senasa", "coop", "mutual", "bet"
        ]

        if (!validZones.includes(subDomain)) {
            return res.status(400).json({
                message: `Bad Request. El dominio debe pertenecer a una zona válida (1)`,
                status: 400
            })
        }

        if (!domainRegex.test(domainToValidate)) {
            return res.status(400).json({
                message: `Bad Request. El nombre de dominio es inválido (.${subDomain}.ar). Solo se permiten [a-z0-9] y guiones en medio, con hasta 63 caracteres.`,
                status: 400
            })
        }

    } else {
        return res.status(400).json({
            message: `Bad Request. El dominio debe pertenecer a una zona válida (2)`,
            status: 400
        })
    }
    // #endregion

    console.log('Domain requested: ', domainName)
    let response
    let responseJson

    // RDAP Request
    try {
        response = await fetch(`https://rdap.nic.ar/domain/${domainName}`)

        if (response.ok) {
            responseJson = await response.json()
            console.log(`${domainName} Found !`)
            return res.json(responseJson)
        }
        console.log(`${domainName} Not Found ! :(`)
        return res.status(404).json({
            message: `${domainName} Not Found`,
            status: 404
        })
    } catch (e) {
        console.error('Error fetching RDAP Service :(', e)
        return res.status(500).json({
            message: "Error fetching RDAP data",
            status: 500
        })
    }
})

app.get('/api/rdap/entity/:id', async(req, res) => {
    const id = req.params.id
    console.log('Id Requested: ', id)
    let response
    let responseJson
    // RDAP Request
    try{
        response = await fetch(`https://rdap.nic.ar/entity/${id}`)

        if(response.ok){
            responseJson = await response.json()
            console.log(`${id} Found !`)
            return res.json(responseJson)
        }
        console.log(`${id} Not Found ! :(`)
        return res.status(404).json({message: `${id} Not Found`, status: 404})
    }catch(e){
        console.error(`Error fetching RDAP Service :(`, e)
        return res.status(500).json({message: "Error fetching RDAP data", status: 500})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
