const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createPet, getPets, getPetById, updatePet, deletePet } = require('../controllers/petController');

router.use(auth);


router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
