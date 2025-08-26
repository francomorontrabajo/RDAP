import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*" // Cambiar según necesidad
}));

app.use(express.static(path.join('public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/rdap/domain/:domain', async(req, res) => {
    // TO DO: CHECK DOMAIN FORMAT
    const domainName = req.params.domain;
    console.log('Domain requested: ', domainName);
    let response
    let responseJson
    try{
        response = await fetch(`https://rdap.nic.ar/domain/${domainName}`);
        responseJson = await response.json();
    }catch(e){
        console.error('Error fetching RDAP');
        return res.status(500).json({error: "Error fetching RDAP data"});
    }

    if(!response.ok){
        console.error('RESPONSE NOT OK');
        return res.status(response.status).json(responseJson);
    }
    console.log('RDAP Data: ', responseJson);
    res.json(responseJson);
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

