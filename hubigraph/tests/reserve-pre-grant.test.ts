import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GrantUpdated } from "../generated/schema"
import { GrantUpdated as GrantUpdatedEvent } from "../generated/ReservePreGrant/ReservePreGrant"
import { handleGrantUpdated } from "../src/reserve-pre-grant"
import { createGrantUpdatedEvent } from "./reserve-pre-grant-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let grant = Address.fromString("0x0000000000000000000000000000000000000001")
    let newGrantUpdatedEvent = createGrantUpdatedEvent(grant)
    handleGrantUpdated(newGrantUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GrantUpdated created and stored", () => {
    assert.entityCount("GrantUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GrantUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "grant",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
