// © Drury University 2023

window.addEventListener('DOMContentLoaded', () => {

    document.getElementById('review').addEventListener('click', () => {

        var review, rating, random
    
        review = document.getElementById('create_review')
        rating = document.getElementById('create_rating')
        random = document.getElementById('create_random')
        
        review.style.display = "block"
        rating.style.display = "none"
        random.style.display = "none"
    })
    
    document.getElementById('rating').addEventListener('click', () => {

        var review, rating, random
    
        review = document.getElementById('create_review')
        rating = document.getElementById('create_rating')
        random = document.getElementById('create_random')
        
        review.style.display = "none"
        rating.style.display = "block"
        random.style.display = "none"
    })
    
    document.getElementById('random').addEventListener('click', () => {

        var review, rating, random
    
        review = document.getElementById('create_review')
        rating = document.getElementById('create_rating')
        random = document.getElementById('create_random')
        
        review.style.display = "none"
        rating.style.display = "none"
        random.style.display = "block"
    })
})