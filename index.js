const pokemonSetsAPI = "https://api.pokemontcg.io/v2/sets"
const pokemonCardsAPI = "https://api.pokemontcg.io/v2/cards"

document.addEventListener("DOMContentLoaded", () => {
    fillSets()
    fillCards()
    document.getElementById('selSet').addEventListener("change", fillCards)
    document.getElementById('selCard').addEventListener("change", displayCardImage)
    document.getElementById('selCard').addEventListener("change", displayCardPrice)
})

// Fetch Pokémon sets and populate the "Set" dropdown
async function fillSets() 
{
    try {
        const response = await fetch(pokemonSetsAPI)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        populateSetsDropdown(data.data)
    } catch (error) {
        console.error("Error fetching Pokémon sets:", error)
    }
}

// Fetch Pokémon cards based on the selected set
async function fillCards() 
{
    const selectedSetId = document.getElementById('selSet').value
    const cardContainer = document.getElementById('cardContainer')

    if (!selectedSetId) 
    {
        populateCardsDropdown([]) // Clear cards dropdown if no set is selected
        cardContainer.style.display = 'none'
        return
    }

    try {
        const response = await fetch(`${pokemonCardsAPI}?q=set.id:${selectedSetId}`) // Filter cards by set
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        populateCardsDropdown(data.data)
        cardContainer.style.display = "block"
    } catch (error) {
        console.error("Error fetching Pokémon cards:", error)
    }
}

// Populate the "Set" dropdown
function populateSetsDropdown(pokemonSets) 
{
    const selectElement = document.getElementById('selSet')
    selectElement.innerHTML = "" // Clear existing options
    // Default option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Select a Pokémon Set"
    selectElement.appendChild(defaultOption)

    // Add fetched sets as options
    pokemonSets.forEach(set => {
        const option = document.createElement("option")
        option.value = set.id
        option.textContent = set.name
        selectElement.appendChild(option)
    })
}

// Populate the "Card" dropdown
function populateCardsDropdown(pokemonCards) 
{
    const selectElement = document.getElementById('selCard')
    selectElement.innerHTML = "" // Clear existing options

    // Default option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Select a Pokémon Card"
    selectElement.appendChild(defaultOption)

    // Add fetched cards as options
    pokemonCards.forEach(card => {
        const option = document.createElement("option")
        option.value = card.id
        option.textContent = card.name
        option.dataset.image = card.images.small
        option.dataset.prices = JSON.stringify(card.tcgplayer?.prices)
        selectElement.appendChild(option)
    })
}

function displayCardImage() 
{
    const selectedCard = document.getElementById('selCard').selectedOptions[0]
    const cardImageContainer = document.getElementById('cardImageContainer')
    
    if (selectedCard.value) 
    {
        const imageUrl = selectedCard.dataset.image
        cardImageContainer.innerHTML = `<img src="${imageUrl}" alt="Pokemon Card" class="mt-4 mx-auto rounded-lg shadow-lg w-64">`;
    } 
    else 
    {
        cardImageContainer.innerHTML = ""
    }
}

function displayCardPrice()
{
    const selectedCard = document.getElementById('selCard').selectedOptions[0]
    const cardPriceContainer = document.getElementById('priceContainer')

    if (selectedCard.value)
    {
        const price = JSON.parse(selectedCard.dataset.prices)
        cardPriceContainer.innerHTML = `
            <p class='text-lg font-semibold'>Prices:</p>
            <p>USD: $${price.normal?.market || "N/A"}</p>
            <p>USD (Foil): $${price.holofoil?.market || "N/A"}</p>
            <p>EUR: €${price.reverseHolofoil?.market || "N/A"}</p>
            <p>GBP: £${price.firstEditionHolofoil?.market || "N/A"}</p>
        `
    }
    else
    {
        cardPriceContainer.innerHTML = ""
    }
}