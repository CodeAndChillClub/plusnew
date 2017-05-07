import ContainerClass from './ContainerClass';
import Config from '../Core/Config';
import TemplateInterface from '../Interface/Template';
import ComponentInterface from '../Interface/Component';

class Handler {
  _uid: number
  _config: Config

  constructor(config: Config) {
    this._uid = 0;
    this._config = config;
  }

  create(path: string, args: any): ContainerClass {
    let componentContainer = this._createComponentContainer(path);
    var ComponentClass = this._getComponentClass(path);
    new ComponentClass(componentContainer);
    return componentContainer;
  }

  _createComponentContainer(path: string): ContainerClass {
    const uid = this._incrementUid();
    return new ContainerClass(uid, path, this);
  }

  _incrementUid(): number {
    this._uid++;
    return this._uid;
  }

  _getComponentClass(path: string): typeof ComponentInterface {
    return this._config.getComponentClass(path);
  }

  _getTemplate(path: string): typeof TemplateInterface {
    return this._config.getTemplateClass(path);
  }
}

export default Handler;