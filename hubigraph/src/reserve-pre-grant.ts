import {
  GrantUpdated as GrantUpdatedEvent,
  MaxReservationsPerGrantUpdated as MaxReservationsPerGrantUpdatedEvent,
  OwnershipRenouncePrevented as OwnershipRenouncePreventedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ReservationLimitReachedEvent as ReservationLimitReachedEventEvent,
  TokensReserved as TokensReservedEvent
} from "../generated/ReservePreGrant/ReservePreGrant"
import {
  GrantUpdated,
  MaxReservationsPerGrantUpdated,
  OwnershipRenouncePrevented,
  OwnershipTransferred,
  ReservationLimitReachedEvent,
  TokensReserved
} from "../generated/schema"

export function handleGrantUpdated(event: GrantUpdatedEvent): void {
  let entity = new GrantUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.grant = event.params.grant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaxReservationsPerGrantUpdated(
  event: MaxReservationsPerGrantUpdatedEvent
): void {
  let entity = new MaxReservationsPerGrantUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newMaxReservations = event.params.newMaxReservations

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipRenouncePrevented(
  event: OwnershipRenouncePreventedEvent
): void {
  let entity = new OwnershipRenouncePrevented(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReservationLimitReachedEvent(
  event: ReservationLimitReachedEventEvent
): void {
  let entity = new ReservationLimitReachedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.grantId = event.params.grantId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensReserved(event: TokensReservedEvent): void {
  let entity = new TokensReserved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.grantId = event.params.grantId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
