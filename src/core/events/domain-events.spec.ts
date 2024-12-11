/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()
    // subscriber cadastrado (ouvindo o evento de resposta criada)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // criar uma resposta porem SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // assegurando que o evento foi criado porém não foi disparado
    expect(aggregate.domainEvents.length).toBe(1)

    // salvando a resposta n oDB e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o sub ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents.length).toBe(0)
  })
})
