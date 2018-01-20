import redchain, { store } from 'redchain';
import Plusnew from 'index';
import component from 'interfaces/component';


describe('rendering the elements', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;
  let local: store<string, string>;
  beforeEach(() => {

    local = redchain('foo', (previousState: string, newValue: string) => newValue);

    plusnew = new Plusnew();
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('does a value change with store', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => <div className={local.state}>{local.state}</div>,
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch('bar');

    expect(target.className).toBe('bar');
    expect(target.innerHTML).toBe('bar');
    expect(textElement).toBe(textElement);
  });

  it('with the same values, all objects should be the same', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => <div className={local.state}>{local.state}</div>,
        dependencies: { local },
      };
    };

    plusnew.render(component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(textElement.textContent).toBe('foo');

    local.dispatch('foo');

    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');
    expect(textElement).toBe(textElement);
  });

  it('does a value change with store with JSX.Element to string', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => local.state === 'foo' ? <div>{local.state}</div> : local.state,
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('foo');

    local.dispatch('bar');

    expect(container.innerHTML).toBe('bar');
  });


  it('does a value change with store with string to JSX.Element', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => local.state === 'foo' ? local.state : <div>{local.state}</div>,
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    expect(container.innerHTML).toBe('foo');

    local.dispatch('bar');

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('bar');
  });

  it('does a value change with store with string to JSX.Element[]', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => local.state === 'foo' ? local.state : [<div>{local.state}</div>, <span>{local.state}</span>],
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    expect(container.innerHTML).toBe('foo');

    local.dispatch('bar');

    expect(container.childNodes.length).toBe(2);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('bar');

    const targetSecond = container.childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe('SPAN');
    expect(targetSecond.innerHTML).toBe('bar');
  });

  it('does a value change with store with JSX.Element[] to string', () => {
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => local.state === 'foo' ? [<div>{local.state}</div>, <span>{local.state}</span>] : local.state,
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    expect(container.childNodes.length).toBe(2);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('foo');

    const targetSecond = container.childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe('SPAN');
    expect(targetSecond.innerHTML).toBe('foo');

    local.dispatch('bar');

    expect(container.innerHTML).toBe('bar');
  });


  it('nested text-elements creation of not previously existing element', () => {
    const local = redchain(true, (previousState, action: boolean) => action);
    const component: component<{}, { local: typeof local }> = () => {
      return {
        render: () => local.state === true ? <div /> : <div>foo</div>,
        dependencies: { local },
      };
    };
    plusnew.render(component, container);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.innerHTML).toBe('');

    local.dispatch(false);

    const targetSecond = container.childNodes[0] as HTMLElement;
    expect(targetSecond.nodeName).toBe('DIV');
    expect(targetSecond.innerHTML).toBe('foo');
  });
});
