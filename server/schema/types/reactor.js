export default `
type Reactor {
  id: ID
  simulatorId: ID
  type: String
  name: String
  heat: Float
  coolant: Coolant
  damage: Damage
  #One of 'reactor' or 'battery'
  model: String
  ejected: Boolean
  powerOutput: Int
  efficiency: Float
  batteryChargeLevel: Float
  batteryChargeRate: Float
}
`;