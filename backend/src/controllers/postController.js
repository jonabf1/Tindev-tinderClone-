const api = require('../services/api'); //github
const DevSchema = require('../models/dev');

module.exports = {
    async store(req, res) {
        try {
            const { username } = req.body;

            const userExists = await DevSchema.findOne({ user: username });
            const idExistsinReact = await DevSchema.findById(req.params.id);

            if (userExists)
                return res.json(userExists);

            else if (idExistsinReact)
                return res.json(idExistsinReact)


            const response = await api.get(`/${username}`);
            const { name, bio, avatar_url: avatar } = response.data;

            const dev = await DevSchema.create({
                name,
                user: username,
                bio,
                avatar
            });

            return res.json(dev)
        } catch (err) {
            res.status(400).send({ error: 'Error to create user:POST' });
        }
    },

}