//import { getActiveTabURL } from "./utils.js";

// console.log("Mfer... This is a popup!")

//when the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url?.startsWith(LinkedIn))
        prevState = await chrome.action.getBadgeText({tab});
    }
)

const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = () => {};

const onDelete = () => {};

const setBookmarkAttributes = () => {};

document.addEventListener("DOMContentLoaded", () => {});
