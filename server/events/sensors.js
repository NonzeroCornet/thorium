import App from '../../app';
import { pubsub } from '../helpers/subscriptionManager.js';
import * as Classes from '../classes';

// id always represents the ID of the sensor system

App.on('addSensorsArray', ({ simulatorId, domain }) => {
  const system = new Classes.Sensors({ simulatorId, domain });
  App.systems.push(system);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('removedSensorsArray', ({ id }) => {

});
App.on('sensorScanRequest', ({ id, request }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.scanRequested(request);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('sensorScanResult', ({ id, result }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.scanResulted(result);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('processedData', ({ id, data }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.processedDatad(data);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('sensorScanCancel', ({ id }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.scanCanceled();
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});

// Contacts
App.on('createSensorContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.createContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('moveSensorContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.moveContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('updateSensorContactLocation', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.updateContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('removeSensorContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.removeContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('removeAllSensorContacts', ({ id }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.contacts.concat().forEach(contact => {
    system.removeContact(contact);
  });
  pubsub.publish('sensorContactUpdate', system.contacts);
})
App.on('stopAllSensorContacts', ({ id }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.contacts.concat().forEach(contact => {
    system.stopContact(contact);
  });
  pubsub.publish('sensorContactUpdate', system.contacts);
})
App.on('destroySensorContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.destroyContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('updateSensorContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.updateContact(contact);
  pubsub.publish('sensorContactUpdate', system.contacts);
});
App.on('createSensorArmyContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.createArmyContact(contact);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('removeSensorArmyContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.removeArmyContact(contact);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
App.on('updateSensorArmyContact', ({ id, contact }) => {
  const system = App.systems.find((sys) => sys.id === id);
  system.updateArmyContact(contact);
  pubsub.publish('sensorsUpdate', App.systems.filter(s => s.type === 'Sensors'));
});
