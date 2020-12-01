const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi-oid');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  res.send(token);

  });

  const validate= (req) => {
    // Joi.object and schema.validate is new way to write
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(req);
}

module.exports = router;