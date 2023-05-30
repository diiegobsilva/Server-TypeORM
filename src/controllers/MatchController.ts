import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Match } from '../entities/Match';
import { Team } from "../entities/Teams";


class MatchController {
  public async postMatch(req: Request, res: Response): Promise<Response> {
    const createMatch = req.body;
    const matchRepository = AppDataSource.getRepository(Match);
    const insertMatch = new Match();
    insertMatch.host = createMatch.idhost;
    insertMatch.visitor = createMatch.idvisitor;
    insertMatch.date = createMatch.date;
    await matchRepository.save(insertMatch);
  
    const find = await matchRepository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.host", "host")
      .leftJoinAndSelect("match.visitor", "visitor")
      .where("match.id = :id", { id: insertMatch.id }) 
      .getOne();
  
    return res.json(find);
  }
    
    public async getAllMatch (req: Request, res: Response) : Promise<Response> {
        const {limit, offset} = req.body
        const teamsRepository = AppDataSource.getRepository(Match)
        .createQueryBuilder("match")
        .leftJoinAndSelect("match.host", "host")
        .leftJoinAndSelect("match.visitor", "visitor")
        .orderBy("match.date", "DESC")
        .limit(limit)
        .offset(offset)
        .getMany()
        return res.json(await teamsRepository)
    }

    public async getUuid (req: Request, res: Response) : Promise<Response> {
      try{
          const termo:any = req.params.uuid
          const matchRepository = AppDataSource.getRepository(Match)
              .createQueryBuilder("match")
              .leftJoinAndSelect("match.host", "host")
              .leftJoinAndSelect("match.visitor", "visitor")
              .where("match.host = :host", { host:termo })
              .orWhere("match.visitor = :visitor", { visitor:termo })
              .orderBy("match.date", "DESC")
              .getMany()
          return res.json((await matchRepository))
      }catch(err){
          return res.json({erro: "Não foi possivel pegar os teams"})
      }
  }
    
    public async deleteMatch(req: Request, res: Response): Promise<Response> {
      try{
        const createMatch = req.body
        const matchRepository = AppDataSource.getRepository(Match)
        const findMatch = await matchRepository.findOneBy({ id: createMatch.id })
        await matchRepository.remove(findMatch)
        return res.json({ "raw": [], "affected": 1 })
    
      }catch{
        return res.json({ "raw": [], "affected": 0 })
      }
    }


    public async putMatch(req: Request, res: Response): Promise<Response> {
      const { id, idhost, idvisitor, date } = req.body
      const host = await AppDataSource.getRepository(Team).findOneBy({ id: idhost })
      console.log(host)
      if (!host) {
          return res.json({ error: "Mandante desconhecido" })
      }
      const visitor = await AppDataSource.getRepository(Team).findOneBy({ id: idvisitor })
      if (!visitor) {
          return res.json({ error: "Visitante desconhecido" })
      }
      var match = await AppDataSource.getRepository(Match).findOneBy({ id: id })
      match.host = host
      match.visitor = visitor
      match.date = date
      const updatedMatch = await AppDataSource.getRepository(Match).save(match)
      return res.json(updatedMatch)
  }

}

export default new MatchController();