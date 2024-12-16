import { Router } from "express";
import { peopleControllers } from "../controllers/people.controllers";

const peopleRouters = Router();

peopleRouters.get("/", peopleControllers.getPeoples);

export default peopleRouters;
