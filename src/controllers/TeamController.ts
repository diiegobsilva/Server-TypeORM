import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Team } from '../entities/Teams';

class TeamController {
  public async getAllTeam(req: Request, res: Response): Promise<Response> {
    const teamRepository = AppDataSource.getRepository(Team)
    const allTeam = await teamRepository.find({ order: {name: "ASC"} })
    return res.json(allTeam)
  }

  public async getTermo(req: Request, res: Response){
    let termoTeam = req.params.termo
    const teamRepository = AppDataSource.getRepository(Team)
     .createQueryBuilder("team")
     .where("team.name like :name", { name:`%${termoTeam}%` })
     .getMany()
    return res.json(await teamRepository)
  }

  public async postTeam(req: Request, res: Response): Promise<Response> {
    try{
      const createTeam = req.body
      const teamRepository = AppDataSource.getRepository(Team)
      const insertTeam = new Team();
      insertTeam.name = createTeam.name;
      const allTeam = await teamRepository.save(insertTeam)
      return res.json(allTeam)

    }catch{
      return res.json({error: "O nome já existe"})
    }
  }
  
  public async deleteTeam(req: Request, res: Response): Promise<Response> {
    try{
      const idTeam: any = req.params.uuid
      const teamRepository = AppDataSource.getRepository(Team)
      const findTeam = await teamRepository.findOneBy({ id: idTeam })
      await teamRepository.remove(findTeam)
      return res.json({ "raw": [], "affected": 1 })

    }catch{
      return res.json({ "raw": [], "affected": 0 })
    }
  }

  public async putTeam(req: Request, res: Response): Promise<Response> {
    const createTeam = req.body
    const idTeam: any = req.params.uuid
    const teamRepository = AppDataSource.getRepository(Team)
    const findTeam = await teamRepository.findOneBy({ id: idTeam })
    findTeam.name = createTeam.name
    const allTeam = await teamRepository.save(findTeam)
    return res.json(allTeam)
  }

}

export default new TeamController();