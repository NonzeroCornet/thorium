import {camelCase} from "change-case";
import uuid from "uuid";
import {
  Appearance,
  Behavior,
  Identity,
  Location,
  Stage,
  StageChild,
  Glow,
  Light,
  Template,
} from "./components";
import {componentRegistry} from "./component";
import {immerable} from "immer";

// An entity is an object that exists within the
// sandbox space. It's properties will correspond
// to the components that are asssigned to it
export class Entity {
  [immerable] = true;
  id?: string;
  flightId: string;

  // Possible components
  appearance?: Appearance;
  behavior?: Behavior;
  identity?: Identity;
  location?: Location;
  stage?: Stage;
  stageChild?: StageChild;
  glow?: Glow;
  light?: Light;
  template?: Template;

  static class = "Entity";
  class = "Entity";
  constructor({id = uuid.v4(), flightId, ...components}) {
    this.id = id;
    this.flightId = flightId || null;

    // Apply the components
    Object.entries(components).forEach(([key, component]) => {
      if (["class", "id", "flightId"].includes(key)) return;
      const Comp = componentRegistry[camelCase(component.class)];
      this[key] = new Comp(component);
    });
  }
}