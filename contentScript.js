(() => {
    let linkedInApplicationControls;
    let currentJob = "";
    let currentJobs = [];
        
    const newJobLoaded = async () => {
        const spreadsheetButtonExists = document.getElementsByClassName("Job-btn")[0];
        
        //currentJobs = await fetchJobs();
        
        
        if(!spreadsheetButtonExists) {
            const spreadsheetButton = document.createElement("img");
            
            spreadsheetButton.src = chrome.runtime.getURL("images/spreadsheetButton.png");
            spreadsheetButton.className = "ytp-button " + "Job-btn";
            spreadsheetButton.title = "Click to track job position on spreadsheet";
                        
            linkedInApplicationControls = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.mt4 > div"); //LOOOOOL THIS WORKED. It put a big ugly green button on the LinkedIn page
            
            //console.log(linkedInApplicationControls);
            
            linkedInApplicationControls.appendChild(spreadsheetButton);
            
            //this adds an Event listener to the Button... which we need to add when a spreadsheetButton doesn't exist
            spreadsheetButton.addEventListener("click", addNewJobEventHandler); //this should parse the page... then add to cells.
        }
    };
    
    const addNewJobEventHandler = async () => {
        
        //Job Title
        const JobTitle = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.justify-space-between.flex-wrap.mt2 > div > h1 > a"); //These two lines get the job title text
        //console.log(JobTitle.text);
        let JobTitleParsed = JobTitle.textContent.trim();
        
        //Company Name
        const CompanyName = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.align-items-center > div.display-flex.align-items-center.flex-1 > div > a");
        //console.log(CompanyName.text);
        let CompanyNameParsed = CompanyName.textContent.trim();

        //Industry
        const Industry = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > section > section > div.jobs-company__box > div.t-14.mt5");
        //console.log(Industry.childNodes[1].data);   //had to go into website's elements to figure this out
        let IndustryParsed = Industry.childNodes[1].textContent.trim();
        
        //Role (same at the Job Title tbh)
        const Role = JobTitleParsed;
        //console.log(JobTitle.text);
        let RoleParsed = Role;
        
        //Location
        const Location = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.job-details-jobs-unified-top-card__primary-description-container > div > span > span:nth-child(1)");
        //console.log(Location.textContent);
        let LocationParsed = Location.textContent;
        
        //Date Applied
        const date = new Date(); 
        //console.log(date.toLocaleDateString());
        let dateParsed = date.toLocaleDateString();
        
        
        //TO-DO: Make sure all cases of Date Posted are handled.
        
        //Date Posted (need to do math?)
        const DatePosted = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.job-details-jobs-unified-top-card__primary-description-container > div > span > span:nth-child(3)");
        //console.log(DatePosted.textContent.split(" ")[0]);
        let DatePostedParsed = "";
        let tempDate = new Date();
        
        if(DatePosted.textContent.split(" ")[0] === "Reposted" && (DatePosted.textContent.split(" ")[2] === "day" || DatePosted.textContent.split(" ")[2] === "days")){
            //console.log(date.toLocaleDateString(date.setDate(date.getDate() - DatePosted.textContent.split(" ")[1])));
            tempDate.setDate(date.getDate() - parseInt(DatePosted.textContent.split(" ")[1]));
            DatePostedParsed = tempDate.toLocaleDateString(); 
        }
        else if(DatePosted.textContent.split(" ")[0] === "Reposted" && (DatePosted.textContent.split(" ")[2] === "hour" || DatePosted.textContent.split(" ")[2] === "hours") && date.getHours() - DatePosted.textContent.split(" ")[1] < 0){
            //console.log(date.toLocaleDateString(date.setDate(date.getDate() - 1)));
            DatePostedParsed = date.toLocaleDateString(date.setDate(date.getDate() - 1));
        }
        else if(DatePosted.textContent.split(" ")[0] === "Reposted"){
            //console.log(date.toLocaleDateString());
            DatePostedParsed = date.toLocaleDateString();
        }
        else if(DatePosted.textContent.split(" ")[0] !== "Reposted" && (DatePosted.textContent.split(" ")[1] === "day" || DatePosted.textContent.split(" ")[1] === "days")){
            //console.log(date.toLocaleDateString(date.setDate(date.getDate() - DatePosted.textContent.split(" ")[0])));
            tempDate.setDate(date.getDate()-parseInt(DatePosted.textContent.split(" ")[0]));
            DatePostedParsed = tempDate.toLocaleDateString();
        }
        else if(DatePosted.textContent.split(" ")[0] !== "Reposted" && (DatePosted.textContent.split(" ")[1] === "hour" || DatePosted.textContent.split(" ")[1] === "hours") && date.getHours() - DatePosted.textContent.split(" ")[0] < 0){
            //console.log(date.toLocaleDateString(date.setDate(date.getDate() - 1)));
            tempDate.setDate(date.getDate()-1)
            DatePostedParsed = tempDate.toLocaleDateString();
        }
        else if(DatePosted.textContent.split(" ")[0] !== "Reposted"){
            //console.log(date.toLocaleDateString());
            DatePostedParsed = date.toLocaleDateString();
        };
        
        if(DatePosted.textContent.split(" ")[1] === "day" || DatePosted.textContent.split(" ")[1] === "days")
        {
            
        };
        
        //console.log(DatePosted.textContent.split(" ")[1]);
        
        //Salary Range
        const SalaryRange = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > button > div:nth-child(1) > span");
        let SalaryRangeParsed = "";
        if (SalaryRange.innerText.includes("$"))
        {
            console.log(SalaryRange.innerText.split('\n')[0]);
            SalaryRangeParsed = SalaryRange.innerText.split('\n')[0];
        };
        
        //we're gonna use OAuth2.
        
        //after parsing, first check if google sheet is open in browser 
        //               then authenticate + get google sheet info
        //               finally append the parsed data to the correct google sheet

        chrome.runtime.sendMessage({triggerGoogleSheet: true},(response)=>{
            // console.log("received a response: ", response);

            if(response.GoogleSheet === "GoogleSheet"){
                
                const parsedLinkedInInfo = [JobTitleParsed, CompanyNameParsed, IndustryParsed, RoleParsed, LocationParsed, dateParsed, DatePostedParsed, SalaryRangeParsed];
                
                //console.log("it worked, google sheet woot");

                //send message to append row
                chrome.runtime.sendMessage({
                    action: "append_row",
                    values: parsedLinkedInInfo 
                    }, (responseAgain)=>{

                    //console.log("made it here");

                    console.log("(furthest point in content script) responseAgain:", responseAgain);

                    if (responseAgain.success) {
                        console.log("it worked dude, authenticated!");  //LETS GOO!!!
                    }
                    else{
                        console.error("rip bro:", responseAgain.error); //<= could not authenticate
                    };
                });

            }
            else{
                console.error("error brother: ", response.error);
            };

            return true;
        
        });       
        
    };
    
    
    waitForJobContainer();
    
    
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, GoogleSheet, jobId } = obj;
        
        // console.log(obj);
        
        if (type === "NEW") {
            currentJob = jobId;
            newJobLoaded();
        }
        
    });    
    
})();


function waitForJobContainer(){
    const observer = new MutationObserver((mutations, observer)=>{
        const jobContainer = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.mt4 > div");
        
        //once the jobContainer fully loads, add the spreadsheet button.
        if (jobContainer){
            observer.disconnect();
            newJobLoaded();
        }
        
    });
    
    observer.observe(document.body, {childList: true, subtree: true});
    
}