import { Router } from "express";
import MatchController from "../controllers/MatchController";

const routes = Router();

routes.get('/', MatchController.getAllMatch);
routes.get('/:uuid', MatchController.getId);
routes.post('/create', MatchController.postMatch);
routes.put('/:uuid', MatchController.putMatch);
routes.delete('/:uuid', MatchController.deleteMatch);

export default routes;