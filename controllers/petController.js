const Pet = require("../models/Pet");
const User = require("../models/User");
const petSchema = require("../schemas/petSchema");

exports.createPet = async (req, res) => {
  try {
    const { error } = petSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });

    const pet = await Pet.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.findAll({ where: { UserId: req.user.id } });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { error } = petSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });

    const pet = await Pet.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    await pet.update(req.body);
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    await pet.destroy();
    res.json({ message: "Pet deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
