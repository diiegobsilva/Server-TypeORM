import { Router } from "express";
import TeamController from "../controllers/TeamController";

const routes = Router();

routes.get('/', TeamController.getAllTeam);
routes.get('/:termo', TeamController.getTermo);
routes.post('/', TeamController.postTeam);
routes.put('/', TeamController.putTeam);
routes.delete('/', TeamController.deleteTeam);

export default routes;