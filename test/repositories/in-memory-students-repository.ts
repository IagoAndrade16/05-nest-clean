import { DomainEvents } from "@/core/events/domain-events";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []
  
  async create(student: Student) {
    this.items.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }

  async save(student: Student) {
    this.items.push(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.items.find(student => student.email === email) ?? null
  }
}