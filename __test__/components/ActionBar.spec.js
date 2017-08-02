import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import ActionBar from '../../src/components/ActionBar'
import style from '../../src/components/ActionBar/actionBar.scss'

describe('<ActionBar />', () => {
  it('should render the ActionBar with class \'actionBar\'', () => {
    const wrapper = mount(<ActionBar />)
    expect(wrapper.find('div')).to.have.className(style.actionBar)
  })
})