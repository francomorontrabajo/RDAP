import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*" // Cambiar según necesidad
}));

app.use(express.static(path.join('public')));

app.get('/api/rdap/domain/:domain', async(req, res) => {
    // TO DO: CHECK DOMAIN FORMAT
    const domainName = req.params.domain;
    console.log('Domain requested', domainName);
    let response
    let responseJson
    // RDAP Request
    try{
        response = await fetch(`https://rdap.nic.ar/domain/${domainName}`);

        if(response.ok){
            responseJson = await response.json();
            console.log(`${domainName} Found !`);
            return res.json(responseJson)
        }
        console.log(`${domainName} Not found ! :(`);
        return res.status(404).json({message: `${domainName} Not Found`, status: 404});
    }catch(e){
        console.error('Error fetching RDAP Service :( ');
        return res.status(500).json({message: "Error fetching RDAP data", status: 500});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
