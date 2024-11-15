
const express= require('express');
const bodyParser = require('body-parser');
const { Process } = require('./process');
app= new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/order',async(req,res)=>{
    try{
        //order json exemple  : { "id": "1", "product": "flex-code", "quantity": 1 } 
        const body= req.body;
        //producer
        let data=[body];
        for(let i=0;i<100;i++){
          data=[...data,{...body,id:i,product: body.product+'-'+body.id}];
        }
        await Process.getInstance().runProducer(data);
        return res.status(200).json({succes: 'sucess'})
    }catch(error){
       return res.status(500).json({error: error.message})
    }
})
app.listen(3000,()=>{console.log("on listing 3000 :)")})

