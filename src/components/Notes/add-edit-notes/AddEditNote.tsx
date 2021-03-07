import React, { Component } from 'react';
import { Navigation } from '../../common/hoc/Navigation';
import TreeNode from './TreeNode';
class AddEditNote extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      nodes: [],
    };

    this.changeTitle = this.changeTitle.bind(this);
    this.addRootElement = this.addRootElement.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  componentDidMount() {
    this.addRootElement();
  }

  initializedNodes(nodes: any, location?: any): any {
    const nodesCopy = [];
    console.log('initializedNodes', nodes);
    for (let i = 0; i < nodes.length; i++) {
      const { children, title } = nodes[i];
      const hasChildren = children !== undefined;
      const id = location ? `${location}.${i + 1}` : `${i + 1}`;
      nodesCopy[i] = {
        children: hasChildren ? this.initializedNodes(children, id) : undefined,
        changeTitle: this.changeTitle(id),
        removeNode: this.removeNode(id),
        addChild: this.addChild(id),
        id,
        title,
      };
    }
    console.log('nodesCopy', nodesCopy);
    return nodesCopy;
  }
  changeTitle(id: any) {
    return (newTitle: any) => {
      const { nodes }: any = this.state;
      id = id.split('.').map((str: any) => parseInt(str));
      const allNodes = this.initializedNodes(nodes);
      let changingNode = allNodes[id[0] - 1];

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1];
        }
      }

      changingNode.title = newTitle;

      this.setState({ nodes: allNodes });
    };
  }

  addRootElement() {
    const { nodes }: any = this.state;
    const id = nodes.length ? `${nodes.length + 1}` : '1';
    const newNode = {
      children: undefined,
      changeTitle: this.changeTitle(id),
      removeNode: this.removeNode(id),
      addChild: this.addChild(id),
      id,
      title: '',
    };

    this.setState({ nodes: [newNode] });
  }

  addChild(id: any) {
    return () => {
      const { nodes }: any = this.state;
      console.log('add child called', id);
      console.log('addChild nodes initial state', nodes);
      id = id.split('.').map((str: any) => parseInt(str));
      const allNodes = this.initializedNodes(nodes);
      let changingNode = allNodes && allNodes[id[0] - 1];

      console.log('changingNode', changingNode);
      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode && changingNode.children[id[i] - 1];
        }
      }

      if (changingNode && changingNode.children === undefined) {
        changingNode.children = [];
      }

      id = `${id.join('.')}.${changingNode?.children?.length + 1}`;

      if (changingNode) {
        changingNode.children = [
          ...changingNode.children,
          {
            children: undefined,
            changeTitle: this.changeTitle(id),
            removeNode: this.removeNode(id),
            addChild: this.addChild(id),
            id,
            title: '',
          },
        ];
        this.setState({ nodes: allNodes });
      }
    };
  }

  removeNode(id: any) {
    return () => {
      const { nodes }: any = this.state;
      console.log(id);
      id = id.split('.').map((str: any) => parseInt(str));
      console.log(id);

      const allNodes = this.initializedNodes(nodes);

      console.log(nodes);

      if (id.length === 1) {
        const newNodes = [
          ...nodes.slice(0, id[0] - 1), // ...nodes.slice(0, [id[0] - 1]),
          ...nodes.slice(id[0]),
        ];

        this.setState({ nodes: this.initializedNodes(newNodes) });
      } else {
        let changingNode: any = nodes[id[0] - 1];

        console.log('changingNode');
        console.log(changingNode);
        for (let i = 2; i < id.length; i++) {
          changingNode = changingNode.children[id[i - 1] - 1];
          console.log('changingNode loop');
          console.log(changingNode);
        }

        const index = id[id.length - 1] - 1;

        const newChildren = [
          ...changingNode.children.slice(0, index),
          ...changingNode.children.slice(index + 1),
        ];
        console.log('newChildren');
        console.log(newChildren);
        changingNode.children = newChildren;
        this.setState({ nodes: this.initializedNodes(nodes) });
      }
    };
  }

  simplify(nodes: any): any {
    const nodesCopy = [];
    for (let i = 0; i < nodes.length; i++) {
      const { children, title } = nodes[i];
      const hasChildren = children !== undefined && children.length > 0;
      nodesCopy[i] = {
        title,
        children: hasChildren ? this.simplify(children) : undefined,
      };
    }
    console.log('nodesCopynodesCopy', nodesCopy);
    return nodesCopy;
  }

  render() {
    const { nodes }: any = this.state;
    return (
      <div className={'container h-100 d-flex justify-content-center'}>
        <ul className="Nodes d-flex justify-content-center align-items-center flex-column">
          {nodes?.map((nodeProps: any) => {
            const { id, ...others } = nodeProps;
            return <TreeNode addNew={true} key={id} id={id} {...others} />;
          })}
        </ul>
      </div>
    );
  }
}

export default Navigation(AddEditNote);
