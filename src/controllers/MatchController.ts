import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Match } from '../entities/Match';


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

    public async getId(req: Request, res: Response){
        let idMatch = req.params.uuid
        const matchRepository = AppDataSource.getRepository(Match)
         .createQueryBuilder("match")
         .leftJoinAndSelect("match.host", "host")
         .leftJoinAndSelect("match.visitor", "visitor")
         .where("match.host.id like :id", { id:`%${idMatch}%` })
         .orWhere("match.visitor.id like :id", { id: `%${idMatch}%` })
         .getMany()
        return res.json(await matchRepository)
      }
    
    public async deleteMatch(req: Request, res: Response): Promise<Response> {
      try{
        const idMatch: any = req.params.uuid
        const matchRepository = AppDataSource.getRepository(Match)
        const findMatch = await matchRepository.findOneBy({ id: idMatch })
        await matchRepository.remove(findMatch)
        return res.json({ "raw": [], "affected": 1 })
    
      }catch{
        return res.json({ "raw": [], "affected": 0 })
      }
    }


    public async putMatch(req: Request, res: Response): Promise<Response> {
      const createMatch = req.body
      const idMatch: any = req.params.uuid
      const matchRepository = AppDataSource.getRepository(Match)
      if(await matchRepository.findOneBy({id: createMatch.idhost}) == null){ return res.json({error: "Mandante desconhecido"}) }
      if(await matchRepository.findOneBy({id: createMatch.idvisitor}) == null ){ return res.json({error: "Visitante desconhecido"}) }
      
      const findMatch = await matchRepository.findOneBy({ id: idMatch })
      findMatch.host = createMatch.idhost
      findMatch.visitor = createMatch.idvisitor
      findMatch.date = createMatch.date
      await matchRepository.save(findMatch)
      
      const find = AppDataSource.getRepository(Match)
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.host", "host")
      .leftJoinAndSelect("match.visitor", "visitor")
      .where("match.id = :id", { id: idMatch })
      .getOne();

      return res.json(await find)
    }

}

export default new MatchController();