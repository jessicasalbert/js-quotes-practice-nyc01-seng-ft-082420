document.addEventListener("DOMContentLoaded", () => {
    fetchQuotes()
    submitHander()
})

function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then( res => res.json())
    .then( quotes => renderQuotes(quotes))
}

function renderQuotes(array) {
    for (quote of array) {
        renderQuote(quote)
    }
}

function renderQuote(quote) {
    const quotesUl = document.querySelector("#quote-list")
    const quoteLi = document.createElement("li")
    quoteLi.classList.add("quote-card")
    let likeCount
    if (quote.likes) {
        likeCount = quote.likes.length
    } else {
        likeCount = 0
    }
    quoteLi.innerHTML =    `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likeCount}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>`
    quotesUl.append(quoteLi)
}

function submitHander() {
    const form = document.querySelector("form")
    form.addEventListener("submit", e => {
        e.preventDefault()
        const quoteBody = {
            quote : form.quote.value,
            author : form.author.value,
        }
        console.log(quoteBody)
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json"
            },
            body : JSON.stringify(quoteBody)
        }

        fetch('http://localhost:3000/quotes', options)
        .then( res => res.json())
        .then( quote => renderQuote(quote))
    })
}