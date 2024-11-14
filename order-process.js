const { Kafka } = require('kafkajs');

class OrderProcess{
    brokers=['localhost:9092'];
    consumer = null;
    producer = null;

    constructor(clientIdProducer='order-service',clientIdConsumer='processing-service'){
       this.clientIdProducer= clientIdProducer;
       this.clientIdConsumer= clientIdConsumer;
        this.consumer =new Kafka({
            clientId: this.clientIdConsumer,
            brokers:this.brokers,
         }).consumer({ groupId: 'order-group' });
         this.producer =new Kafka({
            clientId: this.clientIdProducer,
            brokers: this.brokers,
         }).producer();
    }

    setClientIdProducer(value){
       this.clientIdProducer=value;
       return this;
    }

    setClientIdConsumer(value){
      this.clientIdConsumer=value;
      return this;
    }

    static getInstance(){
       return new OrderProcess();
    }

    OrderProducer = async (order) => {
        await this.producer.connect();
        try {
            if(Array.isArray(order)){
              for(let item of order ){
                  await this.producer.send({
                      topic: 'orders',
                      messages: [
                        { value: JSON.stringify(item) },
                      ],
                    });
                console.log('Commande envoyée:', item);
              }
            }else{
                await this.producer.send({
                    topic: 'orders',
                    messages: [
                      { value: JSON.stringify(order) },
                    ],
                  });
              console.log('Commande envoyée:', order);
            }
            await this.producer.disconnect();
        } catch (error) {
           await this.producer.disconnect();
           console.error('Erreur lors de l\'envoi de la commande:', error);
        }
    }

    OrderConsumer = async () => {
        try{
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: 'orders', fromBeginning: true });
      
            await this.consumer.run({
              eachMessage: async ({ topic, partition, message }) => {
                const order = JSON.parse(message.value.toString());
                console.log('Commande reçue pour traitement:', order);
                console.log(`Traitement de la commande ${order.id} pour ${order.product}`);
             },
            });
        }catch(error){
          console.log(error);
        }
    };
}

module.exports={
   OrderProcess:OrderProcess,
}