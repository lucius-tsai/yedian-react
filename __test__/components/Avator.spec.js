import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import Avator from '../../src/components/Avator'
import style from '../../src/components/Avator/avator.scss'

describe('<Avator />', () => {
  it('should render the Avator with class \'Avator\'', () => {
    const wrapper = mount(<Avator />)
    expect(wrapper.find('div')).to.have.className(style.avatorBox)
  })
})