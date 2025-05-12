//TO-DO: Get the sheet name that we want to paste into. (EZ) DONE
//       Find the first empty row (use column A... SHEETNAME!A1:A) NOT NEEDED WITH SPREADSHEET.VALUES.APPEND 
//       Paste into each cell in that empty row (name => A, Company => B, etc.) Done
//          
//       later ideas:
//       maybe for authorization, we can prompt the user at the start? like when they turn on the extension, first download it, etc.
//       then, maybe we can ask the user from the extension.html what the name of the google sheet they want to paste in?
//       else the default should just be the first one.
//       maybe every press of the "spreadsheet button", we ask "you sure you wanna paste in 'google spreadsheet name' and in the first available row in 'google sheet name'?" with a yes or no message box?

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>{
    if (tab.url && tab.url.includes("https://www.linkedin.com/jobs/")) {
        const queryParameters = tab.url.split("?")[1];  //the  url is split into two elements... that's why we select the second element.
        const jobParameters = new URLSearchParams(queryParameters);
        //send message to content script only
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            jobId: jobParameters.get("currentJobId"),
        });
    }    
});

//parsed from the Google Sheets url
let spreadsheetId;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //first press of button: checks for google sheets.
    if (message.triggerGoogleSheet){
        chrome.tabs.query({url: "https://docs.google.com/spreadsheets/*"}, (tabs) =>{
            if(tabs.length === 0){
                console.error("No Google Sheets tab is currently open");

                sendResponse({success: false, error: "No Google Sheets tab is currently open"});
            }
            else{
                //just choose the first open Google Sheets tab
                spreadsheetId = tabs[0].url.split("/")[5];        
                // console.log("spreadsheetId: ", spreadsheetId);
        
                sendResponse({success: true, tabID: tabs[0].id, spreadsheetId: spreadsheetId, GoogleSheet:"GoogleSheet"}); 
            };
        });
    };
    
    if (message.action === "append_row"){
        
        authenticate()
        .then(data => {
            
            // console.log(message.values);    //parsed LinkedIn Text
            // console.log("furthest point i see: ", data);
            const finalResult = appendRowToGoogleSheet({
                parsedInfo: message,
                sheetData: data
            });    
            sendResponse({data: data, success: true});
        })
        .catch(error =>{
            sendResponse({error: error.message});
        });
    
    }

    //was this all I was missing? allows async call from response function (in contentScript)
    return true; //<--- keeps sendResponse 'alive' after async call
});

async function appendRowToGoogleSheet({parsedInfo,sheetData}){
    for (const sheet of sheetData.sheets){
        // console.log("response(sheets):", sheet.properties.title);
        if (sheet.properties.title === "Applications Winter 2025"){

            const sheetName = sheet.properties.title
            const token = await getOAuthToken();

            //array of arrays (multiple arrays paste as multiple rows)
            const values = [
                [
                    parsedInfo.values[0] || "", //A, Job Title
                    parsedInfo.values[1] || "", //B, Company
                    parsedInfo.values[2] || "", //C, Industry
                    parsedInfo.values[3] || "", //D, Role
                    parsedInfo.values[4] || "", //E, Location
                    parsedInfo.values[6] || "", //F, Date Posted
                    parsedInfo.values[5] || "", //G, Date Applied
                    "",                         //H, Connections (skip)
                    "",                         //I, Cover Letter (skip)
                    "",                         //J, Resume Uploaded (skip)
                    "",                         //K, Resume Form (skip)
                    parsedInfo.values[7] || "", //L, Salary Range
                    "",                         //M, Comment(skip)
                    "pending"                   //N, Status
                ]
            ]

            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`,{
                method: "POST",
                headers:{
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({values})
            });

            const result = await response.json();

            // console.log("append result: ", result);

            if (response.ok){
                return {success: true, updatedRange: result.updates.updatedRange};
            }else{
                throw new Error(result.error.message);
            }
            
        }
    }
}

async function authenticate(){
    const token = await getOAuthToken();   
    //use fetch to call sheets api   
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,{
        headers:{
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data;

}

function getOAuthToken(){
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ 'interactive': true}, function (token){
            //use the token
            if(chrome.runtime.lastError || !token)
            {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(token);
        });
    });
}