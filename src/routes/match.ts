import { Router } from "express";
import MatchController from "../controllers/MatchController";

const routes = Router();

routes.get('/', MatchController.getAllMatch);
routes.get('/:uuid', MatchController.getUuid);
routes.post('/', MatchController.postMatch);
routes.put('/', MatchController.putMatch);
routes.delete('/', MatchController.deleteMatch);

export default routes;