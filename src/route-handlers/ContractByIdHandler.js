const BasicRouteHandler = require('./BasicRouteHandler');

class ContractByIdHandler  extends BasicRouteHandler {
    async handleRequest(req,res){
        const {Contract} = req.app.get('models');
        const {id} = req.params;
        const contract = await Contract.findOne({
            where: {id}});
        if(!contract) return res.status(404).end();
        if(contract.ContractorId !== req.profile.id) return res.status(403).end();
        res.json(contract);
    }
}

// Singleton
const contractByIdHandler = new ContractByIdHandler();
module.exports = contractByIdHandler;