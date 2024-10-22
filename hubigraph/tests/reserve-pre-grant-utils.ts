import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GrantUpdated,
  MaxReservationsPerGrantUpdated,
  OwnershipRenouncePrevented,
  OwnershipTransferred,
  ReservationLimitReachedEvent,
  TokensReserved
} from "../generated/ReservePreGrant/ReservePreGrant"

export function createGrantUpdatedEvent(grant: Address): GrantUpdated {
  let grantUpdatedEvent = changetype<GrantUpdated>(newMockEvent())

  grantUpdatedEvent.parameters = new Array()

  grantUpdatedEvent.parameters.push(
    new ethereum.EventParam("grant", ethereum.Value.fromAddress(grant))
  )

  return grantUpdatedEvent
}

export function createMaxReservationsPerGrantUpdatedEvent(
  newMaxReservations: BigInt
): MaxReservationsPerGrantUpdated {
  let maxReservationsPerGrantUpdatedEvent =
    changetype<MaxReservationsPerGrantUpdated>(newMockEvent())

  maxReservationsPerGrantUpdatedEvent.parameters = new Array()

  maxReservationsPerGrantUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxReservations",
      ethereum.Value.fromUnsignedBigInt(newMaxReservations)
    )
  )

  return maxReservationsPerGrantUpdatedEvent
}

export function createOwnershipRenouncePreventedEvent(): OwnershipRenouncePrevented {
  let ownershipRenouncePreventedEvent = changetype<OwnershipRenouncePrevented>(
    newMockEvent()
  )

  ownershipRenouncePreventedEvent.parameters = new Array()

  return ownershipRenouncePreventedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createReservationLimitReachedEventEvent(
  grantId: BigInt
): ReservationLimitReachedEvent {
  let reservationLimitReachedEventEvent =
    changetype<ReservationLimitReachedEvent>(newMockEvent())

  reservationLimitReachedEventEvent.parameters = new Array()

  reservationLimitReachedEventEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )

  return reservationLimitReachedEventEvent
}

export function createTokensReservedEvent(
  user: Address,
  grantId: BigInt,
  amount: BigInt
): TokensReserved {
  let tokensReservedEvent = changetype<TokensReserved>(newMockEvent())

  tokensReservedEvent.parameters = new Array()

  tokensReservedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokensReservedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  tokensReservedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensReservedEvent
}
