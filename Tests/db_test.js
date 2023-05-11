//  © Drury University 2023

const dbMan = require("../db_manager")

db = new dbMan("test-db");
//db.save("Key1","val1")
//db.save("Key1", "value")
console.log(db.get("Key1"));
