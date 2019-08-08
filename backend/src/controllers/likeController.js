const devSchema = require('../models/dev');

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await devSchema.findById(user);
        const targetDev = await devSchema.findById(devId); //receber o like

        console.log(loggedDev.likes)
        if (loggedDev.likes.includes(targetDev._id)) {
            console.log('DEU MATCH');
        };

        loggedDev.likes.push(targetDev._id);
        await loggedDev.save();

        return res.json(loggedDev)
    },
}