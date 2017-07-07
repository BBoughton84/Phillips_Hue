const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 3000
var requestify = require('requestify');
var mainHolder = []

app.use(bodyParser.json())

app.listen(PORT, function() {
  console.log(`listening on port ${PORT} for Josh.ai`)
})

requestify.get('http://localhost:8080/api/newdeveloper')
  .then(response => {
      var holder = JSON.parse(response.body)
      for (var x in holder.lights){
        var showObject = {
              "name": holder.lights[x]["name"],
              "id": x,
              "on": holder.lights[x]["state"]["on"],
              "brightness": (((holder.lights[x]["state"]["bri"])/254)*100).toFixed(2)
            }
        mainHolder.push(showObject)
      }
      console.log(mainHolder)

})


var getUpdatedStats = function(){
  requestify.get('http://localhost:8080/api/newdeveloper')
    .then(checkingForUpdate => {
       var newObject = JSON.parse(checkingForUpdate.body)
       for (var i in newObject.lights){
           if (mainHolder[i - 1]["on"] != newObject.lights[i]["state"]["on"]){
             console.log({"id": i, "on": newObject.lights[i]["state"]["on"]})
             mainHolder[i - 1]["on"] = newObject.lights[i]["state"]["on"]
           }
           if (mainHolder[i - 1]["brightness"] != (((newObject.lights[i]["state"]["bri"])/254)*100).toFixed(2)){
             console.log({"id": i, "brightness": (((newObject.lights[i]["state"]["bri"])/254)*100).toFixed(2)});
             mainHolder[i - 1]["brightness"] =  (((newObject.lights[i]["state"]["bri"])/254)*100).toFixed(2)
           }
       }

    })
}

 setInterval(function(){
        getUpdatedStats()
   },3000);
