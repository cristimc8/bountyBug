import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { Bug } from "@/api/models/bug";
import { IBugCreateRequest, IBugResponse, IBugUpdateRequest } from "@/interfaces/IBug";
import { AvailabilityStatusEnum } from "@/interfaces/IStatus";
import { Employee } from "@/api/models/employee";
import { AppDataSource } from "@/data-source";

@Service()
export default class BugsHandler {
  private bugsRepo: Repository<Bug>;
  private employeeRepo: Repository<Employee>;

  constructor(
      @Inject('logger') private logger
  ) {
    this.employeeRepo = AppDataSource.getRepository(Employee);
    this.bugsRepo = AppDataSource.getRepository(Bug);
  }

  public async list(): Promise<IBugResponse[]> {
    this.logger.silly('Listing bugs');
    return (await this.bugsRepo.find()).map(BugsHandler.mapToBugResponse);
  }

  public async create(bugRequest: IBugCreateRequest): Promise<IBugResponse> {
    this.logger.silly('Creating bug');
    const filedBug: Bug = new Bug();
    filedBug.status = AvailabilityStatusEnum.Available;
    filedBug.creator = await this.employeeRepo
        .findOneBy({ username: bugRequest.creatorUsername });
    /*if(filedBug.creator.role.name !== RoleEnum.Tester) {
      throw new Error('Only testers can file new bugs!')
    }*/
    filedBug.name = bugRequest.name;
    filedBug.importance = bugRequest.importance;
    filedBug.description = bugRequest.description;

    const bug = await this.bugsRepo.save(filedBug);
    return BugsHandler.mapToBugResponse(bug);
  }

  public async update(bugRequest: IBugUpdateRequest): Promise<IBugResponse> {
    this.logger.silly('Updating bug');
    const updatingBug: Bug = await this.bugsRepo
        .findOneBy({ id: bugRequest.id });
    if (bugRequest.importance) {
      updatingBug.importance = bugRequest.importance;
    }
    if (bugRequest.name) {
      updatingBug.name = bugRequest.name;
    }
    if(bugRequest.description) {
      updatingBug.description = bugRequest.description;
    }
    await this.bugsRepo.update(
        updatingBug.id,
        updatingBug
    )
    return BugsHandler.mapToBugResponse(updatingBug);
  }

  public async assign(
      { assigneeUsername, bugId }: { assigneeUsername: string, bugId: number }
  ): Promise<void> {
    this.logger.silly('Assigning bug');
    const bug: Bug = await this.bugsRepo.findOneBy({ id: bugId });
    if (bug.status !== AvailabilityStatusEnum.Available) {
      throw new Error('This bug is not available for assignment!');
    }
    if (!bug.assignee) {
      await this.bugsRepo.update(
          bug.id,
          {
            assignee: await this.employeeRepo.findOneBy({ username: assigneeUsername }),
            status: AvailabilityStatusEnum.Assigned
          }
      );
    } else {
      throw new Error('This bug is already assigned!');
    }
  }

  public async deAssign(
      { assigneeUsername, bugId }: { assigneeUsername: string, bugId: number }
  ): Promise<void> {
    this.logger.silly('DeAssigning bug');
    const bug: Bug = await this.bugsRepo.findOneBy({ id: bugId });
    if (bug.assignee.username !== assigneeUsername) {
      throw new Error('You are not assigned to this bug to be able to do that!');
    }
    if (bug.status !== AvailabilityStatusEnum.Assigned) {
      throw new Error('You can only deassign your currently assigned and active bugs!');
    } else {
      await this.bugsRepo.update(
          bug.id,
          {
            assignee: null,
            status: AvailabilityStatusEnum.Available
          }
      );
    }
  }

  public async markCompleted(
      { assigneeUsername, bugId }: { assigneeUsername: string, bugId: number }
  ): Promise<void> {
    this.logger.silly('Marking bug as completed');
    const bug: Bug = await this.bugsRepo.findOneBy({ id: bugId });
    if (bug.assignee?.username !== assigneeUsername) {
      throw new Error('You are not assigned to this bug to be able to do that!');
    }
    if (bug.status !== AvailabilityStatusEnum.Assigned) {
      throw new Error('You can only do this operation on your assigned bugs!');
    } else {
      await this.bugsRepo.update(
          bug.id,
          {
            status: AvailabilityStatusEnum.Completed
          }
      );
    }
  }

  private static mapToBugResponse(bug: Bug): IBugResponse {
    return {
      id: bug.id,
      importance: bug.importance,
      name: bug.name,
      description: bug.description,
      status: bug.status,
      creator: {
        id: bug.creator.id,
        role: bug.creator.role.name,
        username: bug.creator.username
      },
      assignedBy: bug.assignee ? {
        id: bug.assignee.id,
        role: bug.assignee.role.name,
        username: bug.assignee.username
      } : undefined
    };
  }
}
