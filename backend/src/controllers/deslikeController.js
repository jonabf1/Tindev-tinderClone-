const devSchema = require('../models/dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedUser = await devSchema.findById(user);

        const users = await devSchema.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedUser.likes } },
                { _id: { $nin: loggedUser.deslikes } },
            ]
        })

        return res.json(users);
    },

    async delete(req,res){
      const del = await devSchema.deleteMany();
      
      return res.send(del);
    },
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await devSchema.findById(user);
        const targetDev = await devSchema.findById(devId); //receber o like

        loggedDev.deslikes.push(targetDev._id);
        await loggedDev.save();

        return res.json(loggedDev)
    },
}