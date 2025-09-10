const Diet = require('../models/Diet');
const dietSchema = require('../schemas/dietSchema');

exports.createDiet = async (req, res) => {
  try {
    const { error } = dietSchema.validate(req.body, { returnEarly: false });
    if (error)
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });

    const diet = await Diet.create({ ...req.body });
    res.status(201).json(diet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getDietsByPetId = async (req, res) => {
  try {
    const diets = await Diet.findAll({ where: { PetId: req.params.id } });
    res.json(diets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const { error } = dietSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });

    const diet = await Diet.findOne({
      where: { id: req.params.id, PetId: req.body.PetId },
    });

    if (!diet) return res.status(404).json({ message: "Diet not found" });

    await diet.update(req.body);
    res.json(diet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const diet = await Diet.findOne({
      where: { id: req.params.id },
    });

    if (!diet) return res.status(404).json({ message: "Diet not found" });

    await diet.destroy();
    res.json({ message: "Diet deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
