import store from 'redchain';
import Plusnew from 'index';
import component from 'interfaces/component';

const list = [
  { key: 0, value: 'first' },
  { key: 1, value: 'second' },
  { key: 2, value: 'third' },
];
const local =  () => store(list, (state, newValue: {key: number, value: string}) => [newValue, ...state]);

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;

  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('does a initial list work, with pushing values', () => {
    const dependencies = {
      local: local(),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index].value);
    });
  });


  it('does a initial list work, appended li', () => {
    const list = ['first', 'second', 'third'];
    const dependencies = {
      local: local(),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}<li>foo</li></ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length + 1);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      if (index === 3) {
        expect((li as HTMLElement).innerHTML).toBe('foo');
      } else {
        expect((li as HTMLElement).innerHTML).toBe(list[index]);
      }
    });
  });

  it('does a initial empty list work, and updating it', () => {
    const dependencies = {
      local: store([] as typeof list, (store, action: typeof list) => action),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(0);

    dependencies.local.dispatch(list);
    expect(ul.childNodes.length).toBe(list.length);

    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      if (index === 3) {
        expect((li as HTMLElement).innerHTML).toBe('foo');
      } else {
        expect((li as HTMLElement).innerHTML).toBe(list[index].value);
      }
    });
  });


  it('rerendering with different order and inserted elements', () => {
    const dependencies = {
      local: store(list, (previousStore, action: typeof list) => action),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length);
    const initialList: Node[] = [];
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index].value);
      initialList.push(li);
    });

    const newList = [
      { key: 1, value: 'previously second' },
      { key: 4, value: 'zero' },
      { key: 2, value: 'previously third' },
      { key: 0, value: 'previously first' },
    ];

    dependencies.local.dispatch(newList);

    expect(ul.childNodes.length).toBe(newList.length);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(ul.childNodes[newListIndex]).toBe(initialList[i]);
        }
      }
      expect((ul.childNodes[newListIndex] as HTMLElement).tagName).toBe('LI');
      expect((ul.childNodes[newListIndex] as HTMLElement).innerHTML).toBe(newListItem.value);
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const dependencies = {
      local: store(list, (previousStore, action: typeof list) => action),
    };

    const PartialComponent:component<{value: string}> = () => {
      return {
        dependencies: {},
        render: props => props.value,
      };
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <span>{local.state.map(item => <PartialComponent key={item.key} value={item.value}/>)}</span>,
      };
    };

    plusnew.render(MainComponent, container);

    const span = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(span.tagName).toBe('SPAN');
    expect(span.childNodes.length).toBe(list.length);
    const initialList: Node[] = [];
    span.childNodes.forEach((li: Node, index) => {
      expect((li as Text).textContent).toBe(list[index].value);
      initialList.push(li);
    });


    const newList = [
      { key: 2, value: 'previously third' },
      { key: 1, value: 'previously second' },
      { key: 4, value: 'zero' },
    ];

    dependencies.local.dispatch(newList);

    expect(span.childNodes.length).toBe(3);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(span.childNodes[newListIndex]).toBe(initialList[i]);
        }
      }
      expect((span.childNodes[newListIndex] as Text).textContent).toBe(newListItem.value);
    });
  });
});
