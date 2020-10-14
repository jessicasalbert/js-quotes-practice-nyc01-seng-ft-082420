document.addEventListener("DOMContentLoaded", () => {
    fetchQuotes()
    submitHander()
    buttonHandler()
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
        <button class='btn-success' data-id=${quote.id}>Likes: <span>${likeCount}</span></button>
        <button class='btn-danger' data-id=${quote.id}>Delete</button>
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

function buttonHandler() {
    document.addEventListener("click", e => {
        if (e.target.matches(".btn-danger")) {
            console.log(e.target.dataset.id)
            fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {method:"DELETE"})
            .then(res => res.json())
            .then(e.target.parentElement.parentElement.remove())
        } else if (e.target.matches(".btn-success")) {
            //console.log(e.target.dataset.id)
            const options = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept":"application/json"
                },
                body: JSON.stringify({
                    quoteId: parseInt(e.target.dataset.id),
                    createdAt: Math.round((new Date()).getTime() / 1000)
                })
            }
            fetch(`http://localhost:3000/likes`, options)
            .then( res => res.json())
            .then( res => {
                console.log(e.target.textContent)
                let likes = parseInt(e.target.textContent.split(":")[1])
                console.log(likes)
                e.target.textContent = `Likes: ${likes + 1}`
            })
        }
    })
}