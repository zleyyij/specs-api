//loading misc modules
const express = require('express');
const fs = require('fs');
const axios = require('axios');
//defining variables
let app = express();

const config = JSON.parse(fs.readFileSync('config.json',
{encoding:'utf8'}));

const exampleData = JSON.parse(fs.readFileSync('TechSupport_Specs.json',
{encoding:'utf8'}));

// {
//     url:,
//     hw:{
//         cpu:,
//         gpu:,
//         ram,
//         mobo,
//     },
//     sw:{
//         winver,
//         uptime,
//         uacLevel,

//     }
// }


// {
//     url,
//     hw,
//     sw,
//     drives,
//     notes
// }
let embed = {
    
    color: 2273535,
    timestamp: new Date(),
        fields: [
      {
        name: "__Hardware:__",
        inline: true
      },
      {
        name: "__Software:__",
        inline: true
      },
        {
        name: "__Drives:__",
        inline: true
      },
      
       {
        name: "__Notes:__",
         inline: true
      }
    ]

}
//   embed: {
//     description: "https://tech.support/selif/foo",
//     url: "https://paste.rtech.support/selif/foobar",
    // color: 2273535,
//     timestamp: new Date(),
    // fields: [

    //   {
    //     name: "__Hardware:__",
    //     value: "CPU: Intel Core i9 12900k (69C)\nGPU: Nvidia Geforce RTX 4020 (81C)\nRAM: 16GB DDR4 3200Mhz (XMP on)\nMobo: Asus Z690 Godlike",
    //     inline: true
    //   },
    //   {
    //     name: "__Software:__",
    //     value: "Version: Windows 11; 21h2\nUptime: 420 Hours, 69 Min\nUAC: 0\nMcdonalds Premium Pro\nWindows Defender(Disabled)",
    //     inline: true
    //   },
    //     {
    //     name: "__Drives:__",
    //     value: "Samsung 980 Pro (500G)\nwdx2t4313 (4000 GB)",
    //     inline: true
    //   },
      
    //    {
    //     name: "__Notes:__",
    //     value: "CCleaner\n312 Reallocated Sectors on wdx2t4313 (4000 GB)\nMSConfig Static Core Count",
    //      inline: true
    //   }
    // ]
//   }


app.get('/parse', async (req, res) => {
    console.log(req.query.url)
    //TODO, when seals gets the jsony bit going add the get request
    let response = exampleData;
    let strippedData = {};
    strippedData.hw = {};
    strippedData.sw = {};
    let formattedData = {};
        
            strippedData.sw.smartIssues = response.Notes.SmartIssues;
            strippedData.sw.staticCore = response.Notes.StaticCore;
            strippedData.sw.Dumps  = response.Notes.Dumps;
            strippedData.sw.winver = response.BasicInfo.Build;
            strippedData.hw.cpu = response.Hardware.find(part => part.Part == 'CPU').Product;
            strippedData.hw.gpu = response.Hardware.find(part => part.Part == 'GPU').Product;
            strippedData.hw.ramCap = response.Hardware.Ram.Total;
            strippedData.hw.ramSpeed = response.Hardware
            console.log(strippedData);

    await res.send("{'foo':'bar'}");
});

app.use(express.json());
app.listen(config.port, () => console.log(`API listening on port ${config.port}`));