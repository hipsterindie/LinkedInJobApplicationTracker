###############################TO-DO###################################:

- Clean up code in contentScript.js.
	I like having functions defined at the bottom of the program, so for contentScript.js, I propose moving "newJobLoaded" & "addNewJobEventHandler" to the bottom of the program, and rewritten as functions instead of these so-called arrow functions.

- Clean up code in background.js.
	This can involve creating functions for certain code blocks. For example, after line 28 "if (message.triggerGoogleSheet)...", we can turn the query for a google sheets tab into a function. Maybe also after line 45 as well. I'm not sure if making it an async function allows the ".then(...).catch(...)" events, but this would look cleaner in my opinion.
	
- Modify background.js logic. 
	One issue I see however is that if we don't find any google sheets tab open, we just send an error response to the DOM... not the user. 
	Another issue is that if we find any one google sheet tab open, we just choose the first one to modify. This could be problematic, unless we tell the user this, or perhaps show them that that tab is the one chosen to paste to by making it the active tab after clicking the "Spreadsheet" button on the DOM. Also we can mention via Message Box to user(?) if it doesn't have the specific Sheet name, it will reject pasting into the Spreadsheet until the title is change, via Chrome Extension settings, or the Google Spreadsheet itself.

-idk.