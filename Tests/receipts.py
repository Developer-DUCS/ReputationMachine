import json
import uuid
import random

#Create random json receipt
def create_receipt():

    source_id = uuid.uuid4() #temp, will be a signed public key in the end
    target_id = uuid.uuid4() #temp, will be a public key in the end (optionally signed)
    claim_id = uuid.uuid4()

    temp = {
        "source": str(source_id),
        "target": str(target_id),
        "claim": random_claim(claim_id)
    }

    json_receipt = json.dumps(temp) #print this for unformatted json receipt
    loaded_receipt = json.loads(json_receipt)
    pretty_receipt = json.dumps(loaded_receipt, indent=2)

    print(pretty_receipt)

def random_claim(claim_id):
    type = random.choice(["Creation", "Modification", "Deletion"])
    choice = random.choice([1, 2])
    if type == "Deletion":
        temp = {
            "id": str(claim_id),
            "type": str(type),
            "category": None,
            "content": None
        }
    else:
        if choice == 1:
            category = "Review"
            content = random.choice(["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus felis quis dapibus pretium. Donec eget augue id leo mattis facilisis. Duis ut lacus ac orci mattis consectetur ac id tellus.", "Vivamus leo velit, condimentum eu nunc eget, lacinia ultricies urna. Integer semper, libero eu dignissim luctus, turpis lacus fringilla sapien, et porttitor diam nunc vitae nunc.", "Morbi aliquam elit eu urna accumsan ultricies. Phasellus non tellus eget magna pharetra vestibulum commodo eget est."])
        else:
            category = "Rating"
            content = random.choice([1, 2, 3, 4, 5])

        temp = {
            "id": str(claim_id),
            "type": str(type),
            "category": str(category),
            "content": str(content)
        }   

    return temp

create_receipt()