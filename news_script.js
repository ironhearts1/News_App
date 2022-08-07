// defining variables and components as well as eventlisteners

const searchForm = document.querySelector("#news-search-form");
const keywordInput = document.querySelector("#keyword");
const authorInput = document.querySelector("#author");
const startTimeIn = document.querySelector("#date-start");
const endTimeIn = document.querySelector("#date-end");
const sourceInput = document.querySelector("#source");
const searchResults = document.querySelector(".search-results-box");
const resetBtn = document.querySelector("#reset-btn");
let returnedArticles = [];
searchForm.addEventListener("submit", retrieve);
resetBtn.addEventListener("click", reset);

//sorts news based on whether or not author input is present and sends sorted to displayNews()
function sortNewsWithAuthor() {
    // first start with a blank array to sort into from returnedAritcles[]
    // declaring variables of input values and for date comparison values

    let sortedArticles = [];
    let authorIn = authorInput.value;
    let authRegex = new RegExp(authorIn, "gi");
    console.log(returnedArticles);

    if (authorIn != "") {
        for (let art of returnedArticles) {
            let tempA = art.author;
            let aCheck = authRegex.test(tempA);
            if (aCheck == true) {
                sortedArticles.push(art);
            }
        }
    }

    if (authorIn == "") {
        sortedArticles = returnedArticles;
    }
    console.log(sortedArticles);
    displayNews(sortedArticles);

    sortedArticles = [];
}

//formats the results boxes and adds to the HTML
function displayNews(arr) {
    for (let i = 0; i < arr.length; i++) {
        let t = arr[i].title;
        let des = arr[i].description;
        let a = arr[i].author;
        let s = arr[i].source.name;
        let date = arr[i].publishedAt;
        let l = arr[i].url;
        if (a == null) {
            a = "Author not listed";
        } else if (a.length > 42) {
            a = a.slice(0, 40) + "...";
        }
        des = des.replace(/\s+/g, " ").trim().replace(/<ol>/g, "").replace(/<ul>/g, "").replace(/<li>/g, "");
        date = date.slice(0, 10);
        let searchReturnContents = `
        <p class="title-return return">Article ${i + 1}: ${t}</p>
        <p class="description-return return">${des}</p>
        <p class="author-return return">${a}</p>
        <p class="source-return return">${s}</p>
        <p class="date-return return">${date}</p>
        <a href="${l}" target="_blank" class="link-return return">View Article Here!</a>`;
        let searchReturn = document.createElement("div");
        searchReturn.classList.add("search-result");
        searchReturn.innerHTML = searchReturnContents;
        searchResults.append(searchReturn);
    }
    clearSearch();
}

// resets the search results box on "reset result" button press
function reset(e) {
    searchResults.innerHTML = "";
    returnedArticles = [];
}

// fetches from the API on "search the news" button press and pull needed material
// and calls the display news function
function retrieve(e) {
    // resets the current returned articles to prepare for new search
    e.preventDefault();
    reset();
    // declares all the inputs to variables for the URL template
    let startTime = startTimeIn.value;
    let endTime = endTimeIn.value;
    const apiKey = "278c4b3f642b4497a8edee2613de4b6c";
    let keywordIn = keywordInput.value;
    let sourceIn = sourceInput.value;
    let fromDate = `from=${startTime}`;
    let toDate = `to=${endTime}`;

    //declares the URL template and runs the fetch request... doesn't need all inputs to work properly
    let everyInputUrl = `https://newsapi.org/v2/everything?q=${keywordIn}&${fromDate}&${toDate}&domains=${sourceIn}&searchIn=title,description&sortBy=popularity&pageSize=100&language=en&apiKey=${apiKey}`;
    console.log(everyInputUrl);
    fetch(everyInputUrl)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            data.articles.forEach((article) => {
                returnedArticles.push(article);
            });
            sortNewsWithAuthor();
        });
}

//eventually add a reset search terms
function clearSearch() {
    keywordInput.value = "";
    authorInput.value = "";
    startTimeIn.value = "";
    endTimeIn.value = "";
    sourceInput.value = "";
}
