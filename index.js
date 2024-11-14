
const express= require('express');
const bodyParser = require('body-parser');
const { OrderProcess } = require('./order-process');
app= new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//consumer
OrderProcess.getInstance().OrderConsumer();

app.post('/order',async(req,res)=>{
    try{
        //order json exemple  : { "id": "1", "product": "flex-code", "quantity": 1 } 
        const order= req.body;
        //producer
        let orders=[order];
        for(let i=0;i<100;i++){
          orders=[...orders,{...order,id:i,product: order.product+'-'+order.id}];
        }
        await OrderProcess.getInstance().OrderProducer(orders);
        return res.status(200).json({succes: 'sucess'})
    }catch(error){
       return res.status(500).json({error: error.message})
    }
})
app.listen(3000,()=>{console.log("on listing 3000 :)")})

