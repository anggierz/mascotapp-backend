const PetController = require("../controllers/petController");
const Pet = require("../models/Pet");
const petSchema = require("../schemas/petSchema");

jest.mock("../models/Pet");
jest.mock("../schemas/petSchema");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

describe("petController.createPet", () => {
  it("should return 400 if validation fails", async () => {
    petSchema.validate.mockReturnValue({
      error: { details: [{ message: "Name is required" }] },
    });

    const req = { body: {}, user: { id: 1 } };
    const res = mockRes();

    await PetController.createPet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ["Name is required"],
    });
  });

  it("should create pet and return 201", async () => {
    const petData = {
      id: 1,
      type: "dog",
      name: "Kratos",
      birthdate: "2020-05-15",
      age: 4,
      weight: 22.5,
      breed: "German Shepherd",
      picture: "http://example.com/kratos.png",
      UserId: 1,
    };

    petSchema.validate.mockReturnValue({ error: null });
    Pet.create.mockResolvedValue(petData);

    const req = {
      body: {
        type: "dog",
        name: "Kratos",
        birthdate: "2020-05-15",
        age: 4,
        weight: 22.5,
        breed: "German Shepherd",
        picture: "http://example.com/kratos.png",
      },
      user: { id: 1 },
    };

    const res = mockRes();

    await PetController.createPet(req, res);

    expect(Pet.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(petData);
  });

  it("should handle server error", async () => {
    petSchema.validate.mockReturnValue({ error: null });
    Pet.create.mockRejectedValue(new Error("Database error"));
    const req = { body: {}, user: { id: 1 } };
    const res = mockRes();
    await PetController.createPet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("PetController.getPets", () => {
  it("should return pets for user", async () => {
    const pets = [
      { id: 1, type: "dog", name: "Kratos", UserId: 1 },
      { id: 2, type: "cat", name: "Luna", UserId: 1 },
    ];
    Pet.findAll.mockResolvedValue(pets);

    const req = { user: { id: 1 } };
    const res = mockRes();

    await PetController.getPets(req, res);

    expect(Pet.findAll).toHaveBeenCalledWith({ where: { UserId: 1 } });
    expect(res.json).toHaveBeenCalledWith(pets);
  });

  it("should handle server error", async () => {
    Pet.findAll.mockRejectedValue(new Error("Database error"));
    const req = { user: { id: 1 } };
    const res = mockRes();
    await PetController.getPets(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("PetController.getPetById", () => {
  it("should return pet by ID", async () => {
    const pet = { id: 1, type: "dog", name: "Kratos", UserId: 1 };
    Pet.findByPk.mockResolvedValue(pet);

    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.getPetById(req, res);

    expect(Pet.findByPk).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(pet);
  });

  it("should return 404 if pet not found", async () => {
    Pet.findByPk.mockResolvedValue(null);
    const req = { params: { id: 999 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.getPetById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Pet not found" });
  });

  it("should handle server error", async () => {
    Pet.findByPk.mockRejectedValue(new Error("Database error"));
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.getPetById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("PetController.updatePet", () => {
  it("should return 404 if task not found", async () => {
    petSchema.validate.mockReturnValue({ error: null });
    Pet.findOne.mockResolvedValue(null);

    const req = {
      params: { id: 999 },
      body: { name: "Updated Name" },
      user: { id: 1 },
    };
    const res = mockRes();

    await PetController.updatePet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Pet not found" });
  });

  it("should return 400 if validation fails", async () => {
    petSchema.validate.mockReturnValue({
      error: { details: [{ message: "Name is required" }] },
    });

    const req = { params: { id: 1 }, body: {}, user: { id: 1 } };
    const res = mockRes();

    await PetController.updatePet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ["Name is required"] });
  });

  it("should update pet and return updated pet", async () => {
    const petData = {
      id: 1,
      type: "dog",
      name: "Kratos",
      UserId: 1,
      update: jest.fn().mockResolvedValue(),
    };
    petSchema.validate.mockReturnValue({ error: null });
    Pet.findOne.mockResolvedValue(petData);

    const req = {
      params: { id: 1 },
      body: { name: "Updated Name" },
      user: { id: 1 },
    };
    const res = mockRes();

    await PetController.updatePet(req, res);

    expect(petData.update).toHaveBeenCalledWith({ name: "Updated Name" });
    expect(res.json).toHaveBeenCalledWith(petData);
  });

  it("should handle server error", async () => {
    petSchema.validate.mockReturnValue({ error: null });
    Pet.findOne.mockRejectedValue(new Error("Database error"));

    const req = { params: { id: 1 }, body: {}, user: { id: 1 } };
    const res = mockRes();

    await PetController.updatePet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("PetController.deletePet", () => {
  it("should return 404 if pet not found", async () => {
    Pet.findOne.mockResolvedValue(null);
    const req = { params: { id: 999 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.deletePet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Pet not found" });
  });

  it("should delete pet and return message", async () => {
    const destroy = jest.fn();
    Pet.findOne.mockResolvedValue({ destroy });

    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.deletePet(req, res);

    expect(destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Pet deleted successfully.",
    });
  });

    it("should handle server error", async () => {
    Pet.findOne.mockRejectedValue(new Error("Database error"));
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = mockRes();

    await PetController.deletePet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
});
