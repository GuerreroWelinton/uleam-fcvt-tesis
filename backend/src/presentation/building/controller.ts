import { Request, Response } from "express";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterBuildingDto,
  UpdateBuildingDto,
} from "../../domain/dtos";
import { BuildingRepository } from "../../domain/repositories";
import {
  DeleteBuilding,
  FindByIdBuilding,
  FindOneByCodeBuilding,
  ListBuilding,
  RegisterBuilding,
  UpdateBuilding,
} from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class BuildingController {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  list = (req: Request, res: Response) => {
    new ListBuilding(this.buildingRepository)
      .execute()
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findById = (req: Request, res: Response) => {
    const [error, buildingId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindByIdBuilding(this.buildingRepository)
      .execute(buildingId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findOneByCode = (req: Request, res: Response) => {
    const [error, buildingCode] = CodeBaseDto.create(req.query);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindOneByCodeBuilding(this.buildingRepository)
      .execute(buildingCode!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerBuildingDto] = RegisterBuildingDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterBuilding(this.buildingRepository)
      .execute(registerBuildingDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, buildingId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeleteBuilding(this.buildingRepository)
      .execute(buildingId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, buildingId] = IdBaseDto.create(req.params);
    const [error2, updateBuildingDto] = UpdateBuildingDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateBuilding(this.buildingRepository)
      .execute(buildingId!, updateBuildingDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
