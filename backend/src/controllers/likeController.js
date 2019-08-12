const Dev = require('../models/dev');

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not found' });
        };

        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];
            //Se true, eles estao conectados, pois toda a aplicacao possui
            //sua definicao nas rotas, e isso inclui o routes com seus controllers
            // assim facilmente se cria um protocolo do front, para o back
            // para manipular quando um usuario está online

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev)
    }
}