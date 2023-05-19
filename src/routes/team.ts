import { Router } from "express";
import TeamController from "../controllers/TeamController";

const routes = Router();

routes.get('/', TeamController.getAllTeam);
routes.get('/:termo', TeamController.getTermo);
routes.post('/create', TeamController.postTeam);
routes.put('/update/:uuid', TeamController.putTeam);
routes.delete('/:uuid', TeamController.deleteTeam);

export default routes;