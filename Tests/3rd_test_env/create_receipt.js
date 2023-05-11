// © Drury University 2023
window.addEventListener('DOMContentLoaded', () => {

    document.getElementById('autofill_review').addEventListener('click', () => {
        autofill_review()
    })

    document.getElementById('autofill_rating').addEventListener('click', () => {
        autofill_rating()
    })

    document.getElementById('rdm').addEventListener('click', () => {
        let test = create_random()
        console.log(test)
    })

    document.getElementById('submit').addEventListener('click', () => {
        let test = compose_review()
        console.log(test)
    })

    document.getElementById('submit_rating').addEventListener('click', () => {
        let test = compose_rating()
        console.log(test)
    })

    function compose_review() {
        let form = document.getElementById('create_review').elements
        let list = []
        for(var i = 0; i < form.length - 2; i++) {
            let temp = form[i].id
            list.push(document.getElementById(temp).value)
            document.getElementById(temp).value = ""
        }

        let receipt = {
            "source": {
                "id": list[0]
            },
            "target": {
                "id": list[1]
            },
            "claim": {
                "id": uuid4(),
                "type": "Creation",
                "category": "Review",
                "content": list[2]
            }
        }

        return(receipt)
    }

    function compose_rating() {
        let form = document.getElementById('create_rating').elements
        let list = []
        for(var i = 0; i < form.length - 2; i++) {
            let temp = form[i].id
            list.push(document.getElementById(temp).value)
            document.getElementById(temp).value = ""
        }

        let receipt = {
            "source": {
                "id": list[0]
            },
            "target": {
                "id": list[1]
            },
            "claim": {
                "id": uuid4(),
                "type": "Creation",
                "category": "Rating",
                "content": list[2]
            }
        }

        return(receipt)
    }

    function autofill_review() {
        let form = document.getElementById('create_review').elements

        for(var i = 0; i < form.length - 2; i++) {
            let temp = form[i].id
            document.getElementById(temp).value = ""

            if(i < form.length - 3) {
                document.getElementById(temp).value = uuid4()
            }
            else {
                document.getElementById(temp).value = 'test'
            } 
            
        }
    }

    function autofill_rating() {
        let form = document.getElementById('create_rating').elements
        let content = Math.floor(Math.random() * 5) + 1

        for(var i = 0; i < form.length - 2; i++) {
            let temp = form[i].id
            document.getElementById(temp).value = ""

            if(i < form.length - 3) {
                document.getElementById(temp).value = uuid4()
            }
            else {
                document.getElementById(temp).value = content
            } 
        }
    }
    
    function create_random() {

        let source_id = uuid4()
        let target_id = uuid4()
        let claim_id = uuid4()

        temp = {
            "source": {
                "id": source_id
            },
            "target": {
                "id": target_id
            },
            "claim": random_claim(claim_id)
        }

        return(temp)
    }

    function random_claim(claim_id) {
        let types = ['Creation', 'Modification', 'Deletion']
        let content_types = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus felis quis dapibus pretium. Donec eget augue id leo mattis facilisis. Duis ut lacus ac orci mattis consectetur ac id tellus.', 'Vivamus leo velit, condimentum eu nunc eget, lacinia ultricies urna. Integer semper, libero eu dignissim luctus, turpis lacus fringilla sapien, et porttitor diam nunc vitae nunc.', 'Morbi aliquam elit eu urna accumsan ultricies. Phasellus non tellus eget magna pharetra vestibulum commodo eget est.']
        var type = types[Math.floor(Math.random()*types.length)]
        var choice = Math.floor(Math.random() * 2) + 1

        if(type === 'Deletion') {
            temp = {
                "id": claim_id,
                "type": type,
                "category": null,
                "content": null
            }
        }
        else {
            if(choice === 1) {
                var category = "Review"
                var content = content_types[Math.floor(Math.random()*content_types.length)]
            }
            else {
                var category = "Rating"
                var content = Math.floor(Math.random() * 5) + 1
            }
            temp = {
                "id": claim_id,
                "type": type,
                "category": category,
                "content": content
            }
        }

        return(temp)
    }
    
    function uuid4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
})