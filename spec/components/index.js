// 'use strict';

import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Menu from '../../app/components/Menu';


// var React = require('react');
// import Menu from '../../app/components/Menu'
// import { expect } from 'chai';
// import { shallow, mount, render } from 'enzyme';


// import jsdom from 'jsdom'
// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
// global.document = doc
// global.window = doc.defaultView

describe('<Menu />', () => {

  it('Menu component should exist', () => {
    let component = shallow(<Menu props='stuff'/>);
    //const wrapper = mount(<Menu />);
    expect(component).to.exist;

  });


  it('It should render contents ', () => {
    let component = shallow(<Menu swag='stuff'/>);
    // const wrapper = mount(<Menu />);

    let namePar = component.childAt(0);
    //console.log(namePar.node)
    expect(namePar.node.props.style.fontSize).to.equal(24);
    expect(namePar.node.props.children).to.equal('Welcome to the Menu Page!');
  });
});