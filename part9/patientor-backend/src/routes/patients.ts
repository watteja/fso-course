import express, { Request, Response, NextFunction } from "express";
import patientsService from "../services/patientsService";
import { z } from "zod";
import {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";
import { NewPatientSchema, NewEntrySchema } from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientsService.getNonSensitivePatients());
});

// get a patient by id
router.get("/:id", (req: Request, res: Response<Patient>) => {
  const patient = patientsService.getPatient(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  }
);

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const addedEntry = patientsService.addEntry(req.params.id, req.body);
    res.json(addedEntry);
  }
);

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;
