//loading misc modules
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const { stripVTControlCharacters } = require('util');
const { format } = require('path');
//defining variables
let app = express();

const config = JSON.parse(fs.readFileSync('config.json',
{encoding:'utf8'}));

const exampleData = JSON.parse(fs.readFileSync('TechSupport_Specs.json',
{encoding:'utf8'}));

app.get('/parse', async (req, res) => {
    console.log(req.query.url)
    //TODO, when seals gets the jsony bit going add the get request
    let response = exampleData;
    let strippedData = {};
    strippedData.hw = {};
    strippedData.sw = {};
    strippedData.notes = {};
    let formattedData = {};
            //stealing stripped data from the json
            strippedData.notes.smartIssues = response.Notes.SmartIssues;
            strippedData.notes.staticCore = response.Notes.StaticCore;
            strippedData.notes.vpn = response.Notes.vpn;
            strippedData.notes.dumps  = response.Notes.Dumps;
            strippedData.sw.edition = response.BasicInfo.Edition;
            strippedData.sw.winver = response.BasicInfo.Build;
            strippedData.sw.uptime = response.BasicInfo.Uptime.Days;
            strippedData.sw.uac =  response.SecureInfo.Uac;
            strippedData.sw.av = response.SecureInfo.Antiviruses;

            strippedData.hw.cpu = response.Hardware.find(part => part.Part == 'CPU').Product;
            strippedData.hw.gpu = response.Hardware.find(part => part.Part == 'GPU').Product;

            //Clumsy handling of temp if temp fail but whatever
            if(response.Hardware.find(part => part.Part == 'CPU').Temperature){
              strippedData.hw.cpuTemp = "(" + response.Hardware.find(part => part.Part == 'CPU').Temperature; + "c)"
            } else{
              strippedData.hw.cpuTemp = "";
            }

            if(response.Hardware.find(part => part.Part == 'GPU').Temperature){
              
            strippedData.hw.gpuTemp = "(" + response.Hardware.find(part => part.Part == 'GPU').Temperature + "c)";


            } else{
              strippedData.hw.gpuTemp = "";
            }


            strippedData.hw.mobo = response.Hardware.find(part => part.Part == 'Motherboard').Product;
            strippedData.hw.ramCap = response.Ram.Total;
            strippedData.hw.ramSpeed = response.Ram.Sticks[0].Configuredclockspeed;
            // console.log(strippedData);
            // console.log(strippedData.sw.smartIssues)

            //formatting the data
            formattedData.hw = `CPU: ${strippedData.hw.cpu } ${strippedData.hw.cpuTemp}\nGPU: ${strippedData.hw.gpu} ${strippedData.hw.gpuTemp}\nRAM: ${strippedData.hw.ramCap}GB ${strippedData.hw.ramSpeed}Mhz\nMobo: ${strippedData.hw.mobo}`;
            
            formattedData.sw = `Edition: ${strippedData.sw.edition}\nVersion: ${strippedData.sw.winver}\nUptime: ${strippedData.sw.uptime} Days\nUAC Level: ${strippedData.sw.uac}\n${strippedData.sw.av}`

            formattedData.notesArray = [];
            //Adding smart issues to the notes array with multiple issue functionality
            for(var i = 0; i < strippedData.notes.smartIssues.length; i++){
            
            formattedData.notesArray.push(strippedData.notes.smartIssues[i].Value +  " of " + strippedData.notes.smartIssues[i].Type + " on " + strippedData.notes.smartIssues[i].DriveLetter + " " + strippedData.notes.smartIssues[i].Model);
            }
            //Adding message if static core count is configured
            if(strippedData.notes.staticCore){
              formattedData.notesArray.push("MSConfig Static Core Count set");
            }
            if(strippedData.notes.Dumps){
              formattedData.push(strippedData.notes.dumps) + " dumps detected";

            }
            const discordEmbed = {
    
    color: 2273535,
    timestamp: new Date(),
        fields: [
      {
        name: "__Hardware:__",
        value:`${formattedData.hw}`,
        inline: true
      },
      {
        name: "__Software:__",
        value: `${formattedData.sw}`,
        inline: true
      },
       {
        name: "__Notes:__",
         value:`${formattedData.notesArray.join("\n")}`
      }
    ]

}
  const resObj = {
      embed: discordEmbed,

  };
  console.log(formattedData);
  console.log(discordEmbed);
    await res.send(JSON.stringify(resObj));
});

app.use(express.json());
app.listen(config.port, () => console.log(`API listening on port ${config.port}`));